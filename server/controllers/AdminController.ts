import { Response } from 'express';
import { ArticleModel } from '../models/Article';
import { BookmarkModel } from '../models/Bookmark';
import { UserModel } from '../models/User';
import { AuthenticatedRequest } from '../types';
import { generateArticlesBatch } from '../services/gemini';

// Admin: Get stats overview
export async function getAdminStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const totalUsers = await UserModel.countDocuments();
    const adminUsersCount = await UserModel.countDocuments({ role: 'admin' });
    const totalArticles = await ArticleModel.countDocuments();
    const totalBookmarks = await BookmarkModel.countDocuments();

    const viewsAggregation = await ArticleModel.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewsCount' } } }
    ]);
    const totalViews = viewsAggregation.length > 0 ? viewsAggregation[0].totalViews : 0;

    res.status(200).json({
      totalUsers,
      adminUsersCount,
      totalArticles,
      totalBookmarks,
      totalViews
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'An error occurred fetching admin statistics' });
  }
}

// Admin: Manage users list
export async function getUsersList(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const users = await UserModel.find({}, { passwordHash: 0 });
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error retrieving users list:', error);
    res.status(500).json({ error: 'An error occurred retrieving users list' });
  }
}

// Admin: Delete user
export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Prevent deleting oneself
    if (req.user && req.user.id === id) {
      res.status(400).json({ error: 'You cannot delete your own account' });
      return;
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Clean up user's bookmarks
    await BookmarkModel.deleteMany({ userId: id });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ error: 'An error occurred during user deletion' });
  }
}

// Admin: Create custom news article
export async function createNewsArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const {
      title,
      content,
      category,
      author,
      source,
      imageUrl,
      isFeatured,
      isBreaking,
      isAIPick,
      readTime
    } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({ error: 'Title, content, and category are required' });
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

    const newArticle = await ArticleModel.create({
      title,
      content,
      category,
      author: author || 'NewsMania Editorial',
      source: source || 'NewsMania AI',
      imageUrl: imageUrl || defaultImg,
      isFeatured: !!isFeatured,
      isBreaking: !!isBreaking,
      isAIPick: !!isAIPick,
      readTime: parseInt(readTime || '3', 10),
      viewsCount: 0,
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json({
      message: 'Article created successfully',
      article: newArticle
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'An error occurred creating the news article' });
  }
}

// Admin: Update article flags
export async function updateArticleFlags(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { isFeatured, isBreaking, isAIPick } = req.body;

    const article = await ArticleModel.findById(id);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const updates: any = {};
    if (isFeatured !== undefined) updates.isFeatured = !!isFeatured;
    if (isBreaking !== undefined) updates.isBreaking = !!isBreaking;
    if (isAIPick !== undefined) updates.isAIPick = !!isAIPick;

    const updated = await ArticleModel.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      message: 'Article updated successfully',
      article: updated
    });
  } catch (error) {
    console.error('Update article flags error:', error);
    res.status(500).json({ error: 'An error occurred updating article details' });
  }
}

// Admin: Delete article
export async function deleteArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const deletedArticle = await ArticleModel.findByIdAndDelete(id);

    if (!deletedArticle) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Clean up related bookmarks
    await BookmarkModel.deleteMany({ articleId: id });

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'An error occurred deleting the article' });
  }
}

// Admin: Batch generate and seed news articles for a specific category
export async function batchGenerateArticles(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { category, count = 3 } = req.body;

    if (!category) {
      res.status(400).json({ error: 'Category is required for batch generation' });
      return;
    }

    const numCount = parseInt(count as string, 10) || 3;
    const generatedArticles = await generateArticlesBatch(category, numCount);

    const createdList: any[] = [];
    for (const art of generatedArticles) {
      const created = await ArticleModel.create(art);
      createdList.push(created);
    }

    res.status(201).json({
      message: `Successfully generated and deployed ${createdList.length} articles in the ${category} category!`,
      articles: createdList
    });
  } catch (error) {
    console.error('Error batch generating articles:', error);
    res.status(500).json({ error: 'An error occurred during batch generation' });
  }
}
