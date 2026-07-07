import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { IDashboardStats } from '../types';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Users, BookOpen, Eye, Bookmark, Award, Zap, BarChart3, PieChartIcon, Activity
} from 'lucide-react';

const COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#ea580c', '#eab308', '#16a34a'];

export const DashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/analytics/dashboard');
      setStats(response.data);
    } catch (e) {
      showToast('Error loading analytics telemetry data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  // Pre-process category views for Pie chart
  const categoryChartData = Object.entries(stats.categoryViews).map(([name, value]) => ({
    name,
    value
  })).sort((a: any, b: any) => b.value - a.value).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-7 h-7 text-blue-600" /> Platform Insights Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Real-time user engagement telemetry, bookmark aggregation counts, category reading allocations, and historic growth indicators.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Daily Active Users</span>
            <span className="block text-2xl font-sans font-extrabold text-slate-800 dark:text-slate-100">{stats.dailyActiveUsers}</span>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Total Tech Streams</span>
            <span className="block text-2xl font-sans font-extrabold text-slate-800 dark:text-slate-100">{stats.totalArticles}</span>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Engagement Views</span>
            <span className="block text-2xl font-sans font-extrabold text-slate-800 dark:text-slate-100">{stats.totalViews}</span>
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Total Bookmarks</span>
            <span className="block text-2xl font-sans font-extrabold text-slate-800 dark:text-slate-100">{stats.totalBookmarks}</span>
          </div>
        </motion.div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Reads line progression chart */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> Weekly Reading Progressions
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weeklyReads}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution Pie chart */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <PieChartIcon className="w-4 h-4 text-indigo-500" /> Division Views Allocations
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Read Articles bar chart */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-500" /> Most Engaged News Stream Leadership
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.mostReadNews}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="title" stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => val.substring(0, 20) + '...'} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="viewsCount" name="Article Views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookmarksCount" name="Saved Bookmarks" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lists leaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Bookmarked Leaderboard */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-yellow-500" /> Saved leaderboards
          </h3>
          <div className="space-y-3">
            {stats.mostBookmarked.map((art, idx) => (
              <div key={art.id} className="flex gap-3 items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 text-xs">
                <span className="font-sans font-bold text-slate-400 font-mono">0{idx + 1}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-ellipsis overflow-hidden whitespace-nowrap flex-1">{art.title}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                  {art.bookmarksCount} bookmarks
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Technology Divisions */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-indigo-500 animate-bounce" /> Trending Divisions Scoreboards
          </h3>
          <div className="space-y-3">
            {stats.trendingTech.map((tech, idx) => (
              <div key={tech.category} className="flex gap-3 items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 text-xs">
                <span className="font-sans font-bold text-slate-400 font-mono">0{idx + 1}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide font-mono flex-1">{tech.category}</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-mono">
                  Score: {tech.score} ({tech.views} views)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
