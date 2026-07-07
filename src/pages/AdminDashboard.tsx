import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IArticle, IUser } from '../types';
import { motion } from 'motion/react';
import {
  ShieldAlert, Users, BookOpen, Plus, Trash2, Eye, Calendar, Tag, Sparkles, Check, Flame, Star, RefreshCw
} from 'lucide-react';

const CATEGORIES_OPTIONS = [
  'AI', 'Machine Learning', 'Java', 'Spring Boot', 'React', 'Node.js',
  'Cloud', 'AWS', 'Azure', 'Google Cloud', 'Cyber Security', 'Programming',
  'Open Source', 'Startups', 'Space', 'Business', 'Current Affairs'
];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [articlesList, setArticlesList] = useState<IArticle[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New Article Form States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('AI');
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [readTime, setReadTime] = useState('5');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isAIPick, setIsAIPick] = useState(false);
  const [creating, setCreating] = useState(false);

  // Gemini Batch Generation States
  const [batchCategory, setBatchCategory] = useState('AI');
  const [batchCount, setBatchCount] = useState(3);
  const [generatingBatch, setGeneratingBatch] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, articlesRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/news?limit=100') // fetch existing articles list
      ]);

      setAdminStats(statsRes.data);
      setUsersList(usersRes.data.users || []);
      setArticlesList(articlesRes.data.articles || []);
    } catch (e) {
      showToast('Error retrieving administrative metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this user? This action is irreversible.')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      showToast('User account successfully removed', 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to delete user account.', 'error');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await axios.delete(`/api/admin/articles/${id}`);
      showToast('Article deleted', 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to delete article.', 'error');
    }
  };

  const handleToggleFlags = async (id: string, flags: { isFeatured?: boolean; isBreaking?: boolean; isAIPick?: boolean }) => {
    try {
      await axios.put(`/api/admin/articles/${id}`, flags);
      showToast('Article modifiers updated successfully', 'success');
      fetchAdminData();
    } catch (e) {
      showToast('Failed to modify article flags.', 'error');
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      showToast('Title, category and content are required', 'warning');
      return;
    }

    setCreating(true);
    try {
      await axios.post('/api/admin/articles', {
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
      });

      showToast('New tech article launched successfully!', 'success');
      // Reset form fields
      setTitle('');
      setContent('');
      setCategory('AI');
      setAuthor('');
      setSource('');
      setImageUrl('');
      setReadTime('5');
      setIsFeatured(false);
      setIsBreaking(false);
      setIsAIPick(false);

      fetchAdminData();
    } catch (err) {
      showToast('Error deploying news article.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleBatchGenerate = async () => {
    setGeneratingBatch(true);
    try {
      const response = await axios.post('/api/admin/articles/batch', {
        category: batchCategory,
        count: batchCount
      });
      showToast(response.data.message || `Successfully generated batch articles for ${batchCategory}!`, 'success');
      fetchAdminData();
    } catch (e) {
      showToast('Error occurred while generating batch articles.', 'error');
    } finally {
      setGeneratingBatch(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-slate-800">Administrative Access Required</h2>
        <p className="text-sm text-slate-500">Only platform administrators can view this moderation board.</p>
      </div>
    );
  }

  if (loading || !adminStats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Moderation Headers */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-rose-600" /> Platform Moderation Panel
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Complete database metrics, user account moderation, direct article deployments, and live flag management.
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Total Users</span>
            <span className="block text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">{adminStats.totalUsers}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Total Streams</span>
            <span className="block text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">{adminStats.totalArticles}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Platform Views</span>
            <span className="block text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">{adminStats.totalViews}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/30 text-pink-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Admin Accounts</span>
            <span className="block text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">{adminStats.adminUsersCount}</span>
          </div>
        </div>
      </div>

      {/* Dual Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deploy New Article Form (left column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Batch News Generator Card */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 dark:from-indigo-950/10 dark:to-blue-950/10 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 fill-current animate-pulse" /> AI Batch Stream Generator
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instantly generate and seed a batch of distinct, high-quality, fully populated news articles for any target category using Gemini AI.
            </p>
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Target Category</label>
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  {CATEGORIES_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Volume</label>
                <select
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="3">3 Articles</option>
                  <option value="5">5 Articles</option>
                  <option value="10">10 Articles</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleBatchGenerate}
                disabled={generatingBatch}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {generatingBatch ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Streams...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white/20" />
                    Generate News Streams
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Deploy New Article Form (Manual entry) */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-blue-600" /> Deploy News Article
            </h3>

          <form onSubmit={handleCreateArticle} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 focus:outline-none"
                >
                  {CATEGORIES_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Read Time (Min)</label>
                <input
                  type="number"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Ken Thompson"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Source</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. AI Weekly"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Banner Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Unsplash / local path..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Content Text</label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type tech news details here..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 focus:outline-none resize-none"
              />
            </div>

            {/* Feature Checkboxes */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label htmlFor="feat" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Mark as Featured</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="break"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                />
                <label htmlFor="break" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Mark as Breaking Alert</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="aipick"
                  checked={isAIPick}
                  onChange={(e) => setIsAIPick(e.target.checked)}
                />
                <label htmlFor="aipick" className="text-xs font-semibold text-slate-600 dark:text-slate-400">AI Choice (AI Pick)</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow shadow-indigo-500/10 cursor-pointer disabled:opacity-50"
            >
              {creating ? 'Launching...' : 'Deploy to Live Feed'}
            </button>
          </form>
        </div>
      </div>

        {/* User Moderation & Streams listings (right side columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Registered Users moderations table */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Users className="w-5 h-5 text-indigo-600" /> Account Moderations ({usersList.length})
            </h3>
            <div className="max-h-60 overflow-y-auto custom-scrollbar border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/60 font-mono text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="p-3">User Details</th>
                    <th className="p-3">Status / Role</th>
                    <th className="p-3 text-right">Moderations</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 dark:border-slate-850/60 last:border-0">
                      <td className="p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          u.role === 'admin' ? 'bg-red-50 text-red-600 dark:bg-red-950/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== 'admin' ? (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg border border-slate-100 hover:border-red-100 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/15 transition-all cursor-pointer"
                            title="Delete user account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono font-bold">Unmodifiable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Article streams list (toggle flags, remove articles) */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-purple-600" /> Article Streams Management ({articlesList.length})
            </h3>
            <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-3 p-1">
              {articlesList.map((art) => (
                <div
                  key={art.id}
                  className="flex gap-4 items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/20 dark:bg-slate-950/10 text-xs"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex gap-2 items-center">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono font-bold uppercase text-[9px]">
                        {art.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Views: {art.viewsCount}</span>
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-ellipsis overflow-hidden whitespace-nowrap">
                      {art.title}
                    </div>
                  </div>

                  {/* Flag Toggles */}
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleFlags(art.id, { isFeatured: !art.isFeatured })}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        art.isFeatured
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200'
                          : 'text-slate-400 border-slate-200 hover:text-slate-700'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleFlags(art.id, { isBreaking: !art.isBreaking })}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        art.isBreaking
                          ? 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200'
                          : 'text-slate-400 border-slate-200 hover:text-slate-700'
                      }`}
                      title="Toggle Breaking Alert"
                    >
                      <Flame className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleFlags(art.id, { isAIPick: !art.isAIPick })}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        art.isAIPick
                          ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 border-blue-200'
                          : 'text-slate-400 border-slate-200 hover:text-slate-700'
                      }`}
                      title="Toggle AI Pick"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    </button>

                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-100 transition-all cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
