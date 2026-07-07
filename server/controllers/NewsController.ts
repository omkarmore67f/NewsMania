import { Response } from 'express';
import { ArticleModel } from '../models/Article';
import { BookmarkModel } from '../models/Bookmark';
import { UserModel } from '../models/User';
import { AuthenticatedRequest } from '../types';
import * as geminiService from '../services/gemini';

// Get paginated articles with search and filtering
export async function getArticles(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { category, search, dateRange, sortBy, page = '1', limit = '10' } = req.query;

    const query: any = {};

    // 1. Filter by category
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp('^' + category + '$', 'i') };
    }

    // 2. Search query (search in title, content, author, source)
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { author: searchRegex },
        { source: searchRegex }
      ];
    }

    // 3. Filter by date range (e.g. 'today', 'week', 'month')
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      const dateLimit = new Date();
      if (dateRange === 'today') {
        dateLimit.setDate(now.getDate() - 1);
      } else if (dateRange === 'week') {
        dateLimit.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        dateLimit.setDate(now.getDate() - 30);
      }
      const dateStr = dateLimit.toISOString().split('T')[0];
      query.date = { $gte: dateStr };
    }

    // 4. Sorting
    const sortOptions: any = {};
    if (sortBy === 'popular') {
      sortOptions.viewsCount = -1;
    } else if (sortBy === 'oldest') {
      sortOptions.date = 1;
    } else {
      // Default: 'newest'
      sortOptions.date = -1;
    }

    // 5. Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const total = await ArticleModel.countDocuments(query);
    const startIndex = (pageNum - 1) * limitNum;

    const articles = await ArticleModel.find(query)
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limitNum);

    res.status(200).json({
      articles,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'An error occurred fetching articles' });
  }
}

// Get single article details, increment views and track user history
export async function getArticleDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findById(id);

    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Increment view count
    article.viewsCount = (article.viewsCount || 0) + 1;
    await article.save();

    // Record reading history if authenticated
    if (req.user) {
      await UserModel.findByIdAndUpdate(req.user.id, {
        $addToSet: { history: id }
      });
    }

    res.status(200).json({ article });
  } catch (error) {
    console.error('Error fetching article details:', error);
    res.status(500).json({ error: 'An error occurred retrieving the article details' });
  }
}

// Toggle bookmark
export async function toggleBookmark(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { articleId } = req.body;
    if (!articleId) {
      res.status(400).json({ error: 'Article ID is required' });
      return;
    }

    const existing = await BookmarkModel.findOne({ userId: req.user.id, articleId });

    if (existing) {
      await BookmarkModel.findByIdAndDelete(existing.id);
      res.status(200).json({ bookmarked: false, message: 'Bookmark removed successfully' });
    } else {
      await BookmarkModel.create({
        userId: req.user.id,
        articleId
      });
      res.status(200).json({ bookmarked: true, message: 'Bookmark saved successfully' });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ error: 'An error occurred toggling the bookmark' });
  }
}

// Get bookmarks
export async function getBookmarks(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const bookmarks = await BookmarkModel.find({ userId: req.user.id });
    const articleIds = bookmarks.map((b) => b.articleId);

    const bookmarkedArticles = await ArticleModel.find({ _id: { $in: articleIds } });

    res.status(200).json({ bookmarks: bookmarkedArticles });
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    res.status(500).json({ error: 'An error occurred fetching bookmarks' });
  }
}

// Get personalized news feed based on interests
export async function getPersonalizedFeed(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const interests = user.interests || [];
    const articles = await ArticleModel.find();

    // Score and filter articles based on interests
    const personalized = articles
      .map((article) => {
        let score = 0;
        const categoryLower = article.category.toLowerCase();

        // High priority for matching exact category or related words in title
        interests.forEach((interest) => {
          const interestLower = interest.toLowerCase();
          if (categoryLower.includes(interestLower) || interestLower.includes(categoryLower)) {
            score += 10;
          }
          if (article.title.toLowerCase().includes(interestLower)) {
            score += 5;
          }
        });

        return { article, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.article.viewsCount - a.article.viewsCount)
      .map((item) => item.article);

    // If no articles match interests, fall back to featured/breaking and then latest news
    if (personalized.length === 0) {
      const fallback = await ArticleModel.find()
        .sort({ isFeatured: -1, isBreaking: -1, viewsCount: -1 })
        .limit(10);
      res.status(200).json({ feed: fallback });
      return;
    }

    res.status(200).json({ feed: personalized });
  } catch (error) {
    console.error('Error fetching personalized feed:', error);
    res.status(500).json({ error: 'An error occurred fetching personalized feed' });
  }
}

// Generate summary with AI (includes cache check)
export async function getAISummary(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findById(id);

    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Cache match check
    if (article.summary && article.keyTakeaways && article.keyTakeaways.length > 0) {
      res.status(200).json({
        summary: article.summary,
        keyTakeaways: article.keyTakeaways,
        importantFacts: article.importantFacts || []
      });
      return;
    }

    // Call Gemini to generate summary and takeaways
    const result = await geminiService.generateAISummary(article.title, article.content);

    // Cache the result in the article document
    article.summary = result.summary;
    article.keyTakeaways = result.keyTakeaways;
    article.importantFacts = result.importantFacts;
    await article.save();

    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating AI summary:', error);
    res.status(500).json({ error: 'An error occurred generating the AI summary' });
  }
}

// Explain simply with AI (Explain like I'm 10 - ELF10) (includes cache check)
export async function getExplainSimply(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findById(id);

    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Cache match check
    if (article.simplifiedContent) {
      res.status(200).json({ explanation: article.simplifiedContent });
      return;
    }

    // Call Gemini to simplify explanation
    const explanation = await geminiService.explainSimply(article.title, article.content);

    // Cache simplified content
    article.simplifiedContent = explanation;
    await article.save();

    res.status(200).json({ explanation });
  } catch (error) {
    console.error('Error in Explain Simply:', error);
    res.status(500).json({ error: 'An error occurred simplifying the article content' });
  }
}

// Generate the Daily AI Tech Briefing
export async function getDailyBriefing(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const articles = await ArticleModel.find();
    const briefing = await geminiService.generateDailyBriefing(articles);
    res.status(200).json({ briefing });
  } catch (error) {
    console.error('Error generating daily briefing:', error);
    res.status(500).json({ error: 'An error occurred generating the daily briefing' });
  }
}
