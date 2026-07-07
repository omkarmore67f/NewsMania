export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  interests: string[];
  preferredCategories: string[];
  history: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IArticle {
  id: string;
  title: string;
  content: string;
  summary?: string;
  keyTakeaways?: string[];
  importantFacts?: string[];
  simplifiedContent?: string;
  author: string;
  source: string;
  date: string;
  readTime: number;
  category: string;
  imageUrl: string;
  viewsCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  isAIPick: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
}

export interface IDashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalBookmarks: number;
  totalViews: number;
  mostViewedCategory: string;
  dailyActiveUsers: number;
  weeklyReads: { date: string; count: number }[];
  monthlyReads: { date: string; count: number }[];
  mostReadNews: {
    id: string;
    title: string;
    category: string;
    viewsCount: number;
    bookmarksCount: number;
  }[];
  mostBookmarked: {
    id: string;
    title: string;
    category: string;
    bookmarksCount: number;
    viewsCount: number;
  }[];
  trendingTech: {
    category: string;
    views: number;
    bookmarks: number;
    score: number;
  }[];
  categoryViews: { [key: string]: number };
}
