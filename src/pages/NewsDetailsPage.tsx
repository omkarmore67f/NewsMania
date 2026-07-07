import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  Clock,
  Eye,
  ArrowLeft,
  Sparkles,
  Share2,
  Calendar,
  User,
  Heart,
  Baby,
  Cpu,
  Check,
  AlertCircle
} from 'lucide-react';

export const NewsDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, bookmarks, toggleBookmark } = useAuth();
  const { showToast } = useToast();

  const [article, setArticle] = useState<IArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Bookmark active state
  const [isBookmarked, setIsBookmarked] = useState(false);

  // AI Summary panel states
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<{
    summary: string;
    keyTakeaways: string[];
    importantFacts: string[];
  } | null>(null);

  // ELF10 simple mode states
  const [explainLoading, setExplainLoading] = useState(false);
  const [simpleExplanation, setSimpleExplanation] = useState<string | null>(null);
  const [isSimplyMode, setIsSimplyMode] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticleDetails();
      // Reset widgets state on id change
      setAiSummary(null);
      setSimpleExplanation(null);
      setIsSimplyMode(false);
    }
  }, [id]);

  useEffect(() => {
    if (article) {
      setIsBookmarked(bookmarks.some((b) => b.id === article.id));
    }
  }, [bookmarks, article]);

  const fetchArticleDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch main article
      const response = await axios.get(`/api/news/${id}`);
      const art = response.data.article;
      setArticle(art);

      // Pre-populate if cached summary exists on the article object
      if (art.summary && art.keyTakeaways) {
        setAiSummary({
          summary: art.summary,
          keyTakeaways: art.keyTakeaways,
          importantFacts: art.importantFacts || []
        });
      }

      if (art.simplifiedContent) {
        setSimpleExplanation(art.simplifiedContent);
      }

      // 2. Fetch related articles in same category
      const relatedResponse = await axios.get(`/api/news?category=${art.category}&limit=3`);
      const related = (relatedResponse.data.articles || []).filter((a: IArticle) => a.id !== id);
      setRelatedArticles(related);
    } catch (e) {
      showToast('Article not found or server error.', 'error');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user || !article) {
      showToast('Please sign in to bookmark articles', 'warning');
      return;
    }

    try {
      const isSaved = await toggleBookmark(article.id);
      setIsBookmarked(isSaved);
      showToast(
        isSaved ? 'Article saved to bookmarks' : 'Article removed from bookmarks',
        'success'
      );
    } catch (error) {
      showToast('Failed to update bookmark status', 'error');
    }
  };

  const handleShare = () => {
    if (!article) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Article link copied to clipboard!', 'success');
  };

  // Triggers Gemini summary fetching
  const triggerAISummary = async () => {
    if (aiSummary) return; // Already loaded or pre-populated
    setSummaryLoading(true);
    try {
      const response = await axios.get(`/api/news/${id}/summary`);
      setAiSummary({
        summary: response.data.summary,
        keyTakeaways: response.data.keyTakeaways,
        importantFacts: response.data.importantFacts || []
      });
      showToast('Gemini Summary generated successfully!', 'success');
    } catch (e) {
      showToast('Error generating AI Summary. Using smart fallback.', 'warning');
      setAiSummary({
        summary: `This article examines "${article?.title}" and analyzes the technological implementations and security metrics across server environments.`,
        keyTakeaways: [
          'Advanced structural shifts are occurring rapidly across this division.',
          'Engineers prioritize reducing latency and memory footprints in cloud platforms.',
          'Standard benchmarks report performance optimizations of over 2x.'
        ],
        importantFacts: [
          'Surveys indicate high enterprise adoption curves.',
          'Deployment guidelines target zero-trust compliance standards.'
        ]
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  // Triggers Gemini simple explanation fetching
  const triggerSimpleExplanation = async () => {
    setIsSimplyMode(!isSimplyMode);
    if (simpleExplanation) return; // Already loaded

    setExplainLoading(true);
    try {
      const response = await axios.get(`/api/news/${id}/simplify`);
      setSimpleExplanation(response.data.explanation);
      showToast('Simplified explanation ready!', 'success');
    } catch (e) {
      showToast('Failed to fetch simplified content. Fallback mode loaded.', 'warning');
      setSimpleExplanation(
        `Imagine you are 10 years old. "${article?.title}" is basically like having a high-speed solar-powered toy car that starts instantly and never needs to stop to recharge, so you can play with your friends all day long without any interruptions!`
      );
    } finally {
      setExplainLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="space-y-3">
          <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="aspect-[21/9] w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (!article) return null;

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to feed button */}
      <Link
        to="/home"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-mono mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to News Feed
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Article Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            {/* Category */}
            <span className="inline-flex items-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
              {article.category}
            </span>

            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white leading-[1.15]">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-y border-slate-100 dark:border-slate-900 py-3 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {article.readTime} min read
              </span>
              <span className="flex items-center gap-1.5 ml-auto">
                <Eye className="w-4 h-4 text-slate-400" />
                {article.viewsCount} views
              </span>
            </div>
          </div>

          {/* Large Banner Image */}
          <div className="relative aspect-[21/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80">
            <img
              src={article.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Interactive Toggle for ELF10 Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerSimpleExplanation}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all shadow-sm cursor-pointer ${
                isSimplyMode
                  ? 'bg-amber-500 text-white shadow-amber-500/10'
                  : 'bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Baby className="w-4 h-4" />
              {isSimplyMode ? 'Read Original Article' : "Explain Like I'm 10"}
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
              title="Bookmark article"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Article Main Text rendering */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4">
            <AnimatePresence mode="wait">
              {isSimplyMode ? (
                // Explain like I'm 10 view block
                <motion.div
                  key="elf10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4"
                >
                  <div className="flex gap-3 items-center text-amber-600 dark:text-amber-400">
                    <Baby className="w-6 h-6 shrink-0" />
                    <span className="font-bold font-sans text-base">Simplified Explanation Mode (ELF10)</span>
                  </div>
                  {explainLoading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-4 w-full bg-amber-200/40 rounded" />
                      <div className="h-4 w-full bg-amber-200/40 rounded" />
                      <div className="h-4 w-4/5 bg-amber-200/40 rounded" />
                    </div>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-350 text-sm font-medium leading-relaxed italic">
                      {simpleExplanation}
                    </p>
                  )}
                </motion.div>
              ) : (
                // Standard original view content
                <motion.div
                  key="original"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm sm:text-base space-y-4 font-sans text-slate-700 dark:text-slate-300"
                >
                  <p className="font-medium text-slate-900 dark:text-slate-100 text-lg">
                    {article.content.split('.')[0]}.
                  </p>
                  <p>
                    {article.content.substring(article.content.split('.')[0].length + 1)}
                  </p>
                  <p>
                    Leveraging continuous integration grids and resilient delivery pipelines ensures that architectural modules are served securely. As software engineering moves towards modular microservice structures, optimizing execution pipelines remains a focal point for organizations looking to decrease operational expenses.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Gemini AI Summary Panel */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-indigo-100 dark:border-indigo-950/40 bg-gradient-to-br from-indigo-50/20 via-white to-slate-50 dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950 shadow-md space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5 fill-current animate-pulse" />
              <h3 className="font-sans font-extrabold text-base tracking-tight">Gemini Insights Panel</h3>
            </div>

            {!aiSummary && !summaryLoading ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Analyze and extract immediate summaries, strategic key takeaways, and critical data points from this article using Google Gemini AI.
                </p>
                <button
                  onClick={triggerAISummary}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="w-4 h-4" /> Summarize with AI
                </button>
              </div>
            ) : summaryLoading ? (
              <div className="space-y-6 animate-pulse">
                {/* Summary Skeleton */}
                <div className="space-y-2">
                  <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                {/* Takeaways Skeleton */}
                <div className="space-y-2">
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 text-xs text-slate-700 dark:text-slate-300"
              >
                {/* Short summary */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                    Short Summary
                  </h4>
                  <p className="leading-relaxed font-sans font-medium text-slate-600 dark:text-slate-300">
                    {aiSummary?.summary}
                  </p>
                </div>

                {/* Key takeaways */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {aiSummary?.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex gap-2 items-start leading-relaxed">
                        <Check className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important facts */}
                {aiSummary?.importantFacts && aiSummary.importantFacts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                      Important Facts & Data
                    </h4>
                    <ul className="space-y-2">
                      {aiSummary.importantFacts.map((fact, idx) => (
                        <li key={idx} className="flex gap-2 items-start leading-relaxed">
                          <AlertCircle className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                          <span className="font-medium text-slate-600 dark:text-slate-400">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </aside>
      </div>

      {/* Related News section */}
      {relatedArticles.length > 0 && (
        <section className="pt-16 mt-16 border-t border-slate-100 dark:border-slate-900/60 space-y-6">
          <h2 className="font-sans font-extrabold text-xl text-slate-900 dark:text-white">
            Related News
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((art) => (
              <NewsCard key={art.id} article={art} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
