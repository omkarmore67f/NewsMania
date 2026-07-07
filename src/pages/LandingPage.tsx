import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Search,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  Globe
} from 'lucide-react';

const CATEGORIES = [
  'AI', 'Machine Learning', 'Java', 'Spring Boot', 'React', 'Node.js',
  'Cloud', 'Cyber Security', 'Programming', 'Space', 'Business'
];

const TESTIMONIALS = [
  {
    quote: "NewsMania AI changed how I prepare for tech interviews. The 'Explain Like I'm 10' widget is incredibly effective at clarifying complex system designs.",
    author: "Rohan Sharma",
    role: "L4 Software Engineer @ Google",
    avatar: "R"
  },
  {
    quote: "The personalized feeds and daily briefing are unmatched. It digests and groups the exact news I care about, saving me hours of reading every single week.",
    author: "Jessica Carter",
    role: "Staff Architect @ Salesforce",
    avatar: "J"
  },
  {
    quote: "Highly structured. The custom dashboard with trending tech analytics gives us great foresight into what tools our dev team should master next.",
    author: "Kenji Sato",
    role: "VP of Engineering @ Mercari",
    avatar: "K"
  }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchLatestNews();
  }, [selectedCategory]);

  const fetchLatestNews = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'All'
        ? '/api/news?limit=6'
        : `/api/news?category=${selectedCategory}&limit=6`;
      const response = await axios.get(url);
      setArticles(response.data.articles || []);
    } catch (e) {
      console.error('Error fetching landing page news:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/home?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      {/* Dynamic Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-200/50 dark:border-slate-900/50 bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.05),transparent)] dark:bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Next-Gen Tech Intelligence Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Stay Ahead in Tech with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            News & Daily Briefings
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            NewsMania AI consolidates complex tech news, delivers automatic daily briefings grouped by topic, and uses Gemini AI to summarize articles and explain system designs simply.
          </motion.p>

          {/* Interactive Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto flex items-center p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300"
          >
            <div className="pl-3 text-slate-400 shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trending tech (e.g. LLMs, Spring Boot, AWS)..."
              className="w-full px-3 py-2.5 bg-transparent border-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Search
            </button>
          </motion.form>

          {/* Core CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <Link
              to="/login?tab=register"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/briefing"
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold text-sm shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-indigo-500" /> View Live Briefing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Popular Categories Horizontal Scroll */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 font-mono">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> Trending Topics:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar w-full">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All News
            </button>
            {CATEGORIES.map((cat) => {
              const selected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Headlines Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Latest Technology Headlines
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Freshly aggregated articles from verified tech channels. Click any card to access reader mode, bookmarks, and Gemini features.
            </p>
          </div>
          <Link
            to="/home"
            className="group flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            Explore Complete Library <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Headlines Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
            <Cpu className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Articles Found</h3>
            <p className="text-sm text-slate-500">There are currently no articles in category "{selectedCategory}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <NewsCard key={art.id} article={art} />
            ))}
          </div>
        )}
      </section>

      {/* Core SaaS Features section */}
      <section className="py-20 bg-slate-100 dark:bg-slate-950/60 border-y border-slate-200/50 dark:border-slate-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-sans font-extrabold text-3xl text-slate-900 dark:text-white">
              Why Recruiters Love NewsMania AI
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Demonstrating modern API pipelines, robust data caching systems, role-based controls, and dynamic full-stack architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">
                Personalized Tech Feed
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Sign up with your preferred sub-disciplines (like AI, AWS, React, etc.) and our engine constructs an optimized, weighted news feed prioritizing the subjects you care about.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">
                "Explain Like I'm 10" Mode
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Stuck on complex microservice deployments or state scaling algorithms? Toggle our ELF10 button to instruct Google Gemini AI to translate hard topics into easy-to-understand analogies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">
                Interactive Daily Briefings
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Receive beautiful categorized summaries of all technology divisions on a single screen, auto-compiled in real-time. Extremely useful for quick morning standup prep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-sans font-extrabold text-3xl text-slate-900 dark:text-white">
            Endorsed by Top Engineers
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            See what industry leaders are saying about the platform's utility and design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 flex flex-col justify-between"
            >
              <p className="text-sm text-slate-500 leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{t.author}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-center text-white shadow-xl shadow-indigo-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
          <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl">
              Elevate Your Tech Intellect Today
            </h2>
            <p className="text-sm sm:text-base text-indigo-100 max-w-lg mx-auto leading-relaxed">
              Create a free account, choose your programming preferences, and boot up your Gemini AI-powered tech briefing dashboard.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                to="/login?tab=register"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all"
              >
                Create Free Account
              </Link>
              <Link
                to="/briefing"
                className="px-6 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold text-sm hover:-translate-y-0.5 transition-all"
              >
                Read AI Briefings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
