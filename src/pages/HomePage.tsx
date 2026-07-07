import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Search, Flame, Sparkles, Filter, SlidersHorizontal, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES_ALL = [
  'All', 'AI', 'Machine Learning', 'Java', 'Spring Boot', 'React', 'Node.js',
  'Cloud', 'AWS', 'Azure', 'Google Cloud', 'Cyber Security', 'Programming',
  'Open Source', 'Startups', 'Space', 'Business', 'Current Affairs'
];

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // News feeds state
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [personalizedFeed, setPersonalizedFeed] = useState<IArticle[]>([]);
  const [breakingNews, setBreakingNews] = useState<IArticle | null>(null);

  // Filter/Search UI States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFeed, setActiveFeed] = useState<'all' | 'personalized'>('all');

  // Loading States
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingPersonalized, setLoadingPersonalized] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [infiniteScroll, setInfiniteScroll] = useState(true);

  const observerTarget = React.useRef<HTMLDivElement | null>(null);

  // Sync state changes with URL parameters
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    setSearchQuery(search);
    setCategoryFilter(category);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    fetchArticles(1, false);
  }, [categoryFilter, dateRangeFilter, sortBy]);

  useEffect(() => {
    if (user) {
      fetchPersonalizedNews();
    }
  }, [user]);

  const fetchArticles = async (targetPage = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoadingNews(true);
    }
    try {
      const params = new URLSearchParams({
        page: targetPage.toString(),
        limit: '6',
        sortBy,
      });

      if (categoryFilter && categoryFilter !== 'All') {
        params.append('category', categoryFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (dateRangeFilter !== 'all') {
        params.append('dateRange', dateRangeFilter);
      }

      const response = await axios.get(`/api/news?${params.toString()}`);
      const newArticles = response.data.articles || [];

      if (append) {
        setArticles((prev) => {
          const combined = [...prev, ...newArticles];
          // deduplicate by article.id
          return combined.filter((art, idx, self) => self.findIndex(t => t.id === art.id) === idx);
        });
        setPage(targetPage);
      } else {
        setArticles(newArticles);
        setPage(1);
      }
      setTotalPages(response.data.pagination?.pages || 1);

      // Find breaking news if any inside all articles, or pick first featured article
      const breaking = (response.data.articles || []).find((a: IArticle) => a.isBreaking) || null;
      if (breaking) {
        setBreakingNews(breaking);
      } else if (!append) {
        const featured = (response.data.articles || []).find((a: IArticle) => a.isFeatured) || null;
        setBreakingNews(featured);
      }
    } catch (e) {
      showToast('Error loading tech articles.', 'error');
    } finally {
      setLoadingNews(false);
      setLoadingMore(false);
    }
  };

  const fetchPersonalizedNews = async () => {
    setLoadingPersonalized(true);
    try {
      const response = await axios.get('/api/news/personalized');
      setPersonalizedFeed(response.data.feed || []);
    } catch (e) {
      console.error('Error fetching personalized feed:', e);
    } finally {
      setLoadingPersonalized(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: searchQuery, category: categoryFilter });
    setPage(1);
    fetchArticles(1, false);
  };

  const selectCategory = (cat: string) => {
    setCategoryFilter(cat);
    setSearchParams({ search: searchQuery, category: cat });
    setPage(1);
    fetchArticles(1, false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({ search: '', category: categoryFilter });
    setPage(1);
    fetchArticles(1, false);
  };

  // Infinite Scroll Intersection Observer (Req 5)
  useEffect(() => {
    if (!infiniteScroll || page >= totalPages || loadingNews || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          fetchArticles(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [infiniteScroll, page, totalPages, loadingNews, loadingMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dynamic Breaking News Alert Box */}
      {breakingNews && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden border border-red-200/60 dark:border-red-950/20 bg-gradient-to-r from-red-500/5 via-rose-500/10 to-transparent p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-center justify-between"
        >
          <div className="flex gap-4 items-start md:items-center">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/10 animate-pulse">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-950/40 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-widest font-mono">
                  Breaking Tech Alert
                </span>
                <span className="text-xs text-slate-400 font-mono">{breakingNews.source}</span>
              </div>
              <h2 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-base mt-1 line-clamp-1">
                {breakingNews.title}
              </h2>
            </div>
          </div>
          <Link
            to={`/articles/${breakingNews.id}`}
            className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Access Reader Mode
          </Link>
        </motion.div>
      )}

      {/* Main filter sidebar & News Feed layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Controls Sidebar (left side on desktop) */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Search form widget */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Filter Search
            </h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keywords..."
                className="w-full pl-3 pr-8 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </form>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Clear Keywords filter
              </button>
            )}
          </div>

          {/* SaaS View Selector (All News vs Personalized Feed) */}
          {user && (
            <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200/40 dark:border-slate-800/30 grid grid-cols-2">
              <button
                onClick={() => setActiveFeed('all')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFeed === 'all'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All News
              </button>
              <button
                onClick={() => setActiveFeed('personalized')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  activeFeed === 'personalized'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                For You
              </button>
            </div>
          )}

          {/* Categorized Filter selections */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="w-4 h-4" /> Divisions
            </h3>
            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible py-1 custom-scrollbar w-full">
              {CATEGORIES_ALL.map((cat) => {
                const active = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => selectCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left shrink-0 transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-950'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sorting / Advanced controls */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
              Advanced Sorting
            </h3>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                Time Horizon
              </label>
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All-Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Feed panel (right side on desktop) */}
        <main className="lg:col-span-3 space-y-8">
          {activeFeed === 'personalized' ? (
            // Recommended Personalized feed
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-sans font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500/15" /> Personal Gemini Feed
                  </h2>
                  <p className="text-xs text-slate-500">
                    Calculated and weighted based on your select tech preferences: {user?.interests.join(', ')}.
                  </p>
                </div>
                <button
                  onClick={fetchPersonalizedNews}
                  disabled={loadingPersonalized}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
                  title="Refresh recommendations"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingPersonalized ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loadingPersonalized ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <SkeletonCard key={n} />
                  ))}
                </div>
              ) : personalizedFeed.length === 0 ? (
                <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                  <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Custom Matches</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    Configure more tech tags inside your profile to instruct our system algorithm.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {personalizedFeed.map((art) => (
                    <NewsCard key={art.id} article={art} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Core standard headlines list
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-sans font-extrabold text-xl text-slate-900 dark:text-white">
                  {categoryFilter === 'All' ? 'Tech Ecosystem Feed' : `${categoryFilter} stream`}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    Showing {articles.length} articles
                  </span>
                  <span className="text-slate-200 dark:text-slate-800 text-xs">|</span>
                  <label className="flex items-center gap-1 text-xs text-slate-500 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={infiniteScroll}
                      onChange={(e) => setInfiniteScroll(e.target.checked)}
                      className="rounded border-slate-350 accent-blue-600 w-3.5 h-3.5"
                    />
                    Infinite Scroll
                  </label>
                </div>
              </div>

              {loadingNews ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <SkeletonCard key={n} />
                  ))}
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
                  <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Streams Found</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Try broadening your search keywords or choosing different categories.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    {articles.map((art) => (
                      <NewsCard key={art.id} article={art} />
                    ))}
                  </div>

                  {/* Infinite Scroll Loader Target */}
                  {infiniteScroll && page < totalPages && (
                    <div className="space-y-4 pt-4">
                      {loadingMore && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[1, 2].map((n) => (
                            <SkeletonCard key={n} />
                          ))}
                        </div>
                      )}
                      <div ref={observerTarget} className="h-10 w-full flex items-center justify-center text-xs text-slate-400 font-mono">
                        Loading more technology streams...
                      </div>
                    </div>
                  )}

                  {/* Manual Load More Button if Infinite Scroll is OFF */}
                  {!infiniteScroll && page < totalPages && (
                    <div className="pt-8 text-center border-t border-slate-100 dark:border-slate-900/60">
                      <button
                        onClick={() => fetchArticles(page + 1, true)}
                        disabled={loadingMore}
                        className="px-6 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-red-500 hover:scale-105 active:scale-95 transition-all text-white shadow-md shadow-blue-500/10 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                      >
                        {loadingMore ? 'Loading More Articles...' : 'Load More Articles'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
