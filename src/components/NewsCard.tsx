import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IArticle } from '../types';
import { Bookmark, Clock, Eye, Sparkles, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface NewsCardProps {
  article: IArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { user, bookmarks, toggleBookmark } = useAuth();
  const { showToast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(
    bookmarks.some((b) => b.id === article.id)
  );
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Sync state with bookmarks change
  React.useEffect(() => {
    setIsBookmarked(bookmarks.some((b) => b.id === article.id));
  }, [bookmarks, article.id]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Please sign in to bookmark articles', 'warning');
      return;
    }

    setBookmarkLoading(true);
    try {
      const isSaved = await toggleBookmark(article.id);
      setIsBookmarked(isSaved);
      showToast(
        isSaved ? 'Article saved to bookmarks' : 'Article removed from bookmarks',
        'success'
      );
    } catch (error) {
      showToast('Failed to update bookmark status', 'error');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/articles/${article.id}`;
    navigator.clipboard.writeText(url);
    showToast('Article link copied to clipboard!', 'success');
  };

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg dark:hover:shadow-indigo-950/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
    >
      {/* Article Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={article.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* Category Tag overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="inline-flex items-center rounded-lg bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white uppercase tracking-wider font-mono">
            {article.category}
          </span>
          {article.isAIPick && (
            <span className="inline-flex items-center gap-0.5 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-md shadow-blue-500/10">
              <Sparkles className="w-3 h-3 fill-white" />
              AI PICK
            </span>
          )}
        </div>

        {/* Floating actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-white/95 text-slate-700 hover:text-blue-600 shadow-md backdrop-blur-md hover:scale-110 transition-all cursor-pointer"
            title="Copy Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mb-2">
          <span>{article.source}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span>{formattedDate}</span>
        </div>

        <Link to={`/articles/${article.id}`} className="block flex-1 group">
          <h3 className="font-sans font-bold text-base leading-tight text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
            {article.content}
          </p>
        </Link>

        {/* Footer actions of card */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readTime} min
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {article.viewsCount}
            </span>
          </div>

          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`p-2 rounded-xl border border-slate-200/80 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
