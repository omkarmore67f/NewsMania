import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Settings, Bookmark, History, Check, Sparkles, LogOut } from 'lucide-react';

const INTERESTS_OPTIONS = [
  'AI', 'Machine Learning', 'Java', 'Spring Boot', 'React', 'Node.js',
  'Cloud', 'AWS', 'Azure', 'Google Cloud', 'Cyber Security',
  'Programming', 'Open Source', 'Startups', 'Space', 'Business', 'Current Affairs'
];

export const ProfilePage: React.FC = () => {
  const { user, bookmarks, updatePreferences, logout } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [historyArticles, setHistoryArticles] = useState<IArticle[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSelectedInterests(user.interests);
      fetchReadingHistory();
    }
  }, [user]);

  const fetchReadingHistory = async () => {
    setLoadingHistory(true);
    try {
      // In a real application, we retrieve full details of the history article ids.
      // We can query `/api/news` or a history list endpoint. Let's fetch all articles and filter by user history!
      const response = await axios.get('/api/news?limit=100');
      const allArticles: IArticle[] = response.data.articles || [];
      const historyList = allArticles.filter((art) => user?.history?.includes(art.id));
      setHistoryArticles(historyList);
    } catch (e) {
      console.error('Error fetching reading history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'warning');
      return;
    }

    setSaving(true);
    try {
      await updatePreferences(selectedInterests, selectedInterests); // Update categories same as interests for simple routing
      showToast('Account preferences saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save preferences.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <User className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Authentication Required</h2>
        <p className="text-sm text-slate-500">Please login to view your personalized profile settings.</p>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Overview Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold font-mono">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <h1 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white leading-none">
            {user.name}
          </h1>
          <p className="text-xs text-slate-500 font-mono flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
          <p className="text-xs text-slate-500 font-mono flex items-center justify-center sm:justify-start gap-1">
            <Calendar className="w-3.5 h-3.5" /> Premium Member since {joinDate}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
          <Sparkles className="w-3.5 h-3.5" /> {user.role === 'admin' ? 'SYSTEM ADMIN' : 'PREMIUM'}
        </span>
      </div>

      {/* Primary configuration layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Settings panel */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Settings className="w-4.5 h-4.5" /> Preference Configurations
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                My Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                My Tech Interests
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto p-2 border border-slate-200/80 dark:border-slate-800/80 rounded-xl bg-slate-50/30 dark:bg-slate-950/20 custom-scrollbar">
                {INTERESTS_OPTIONS.map((interest) => {
                  const selected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-blue-50 dark:bg-blue-950/15 border-blue-150 text-blue-600 dark:text-blue-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                        selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300'
                      }`}>
                        {selected && <Check className="w-2.5 h-2.5" />}
                      </span>
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Configurations'}
            </button>
          </form>
        </div>

        {/* Saved & History tab contents */}
        <div className="lg:col-span-2 space-y-8">
          {/* Saved Bookmarks */}
          <div className="space-y-4">
            <h3 className="font-sans font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
              <Bookmark className="w-5 h-5 text-blue-600" /> Saved bookmarks ({bookmarks.length})
            </h3>

            {bookmarks.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No bookmarks saved yet. Click the bookmark icon on any news card.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bookmarks.map((art) => (
                  <NewsCard key={art.id} article={art} />
                ))}
              </div>
            )}
          </div>

          {/* Reading history list */}
          <div className="space-y-4">
            <h3 className="font-sans font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
              <History className="w-5 h-5 text-indigo-500" /> Reading History ({historyArticles.length})
            </h3>

            {loadingHistory ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            ) : historyArticles.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No historical logs. Articles you click and open will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyArticles.map((art) => (
                  <Link
                    key={art.id}
                    to={`/articles/${art.id}`}
                    className="flex gap-4 items-center p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs"
                  >
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-bold uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-ellipsis overflow-hidden whitespace-nowrap flex-1 hover:text-blue-600 transition-colors">
                      {art.title}
                    </span>
                    <span className="text-slate-400 shrink-0 font-mono">
                      {art.readTime} min read
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
