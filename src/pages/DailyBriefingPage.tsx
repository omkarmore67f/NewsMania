import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, ChevronDown, ChevronUp, Cpu, Terminal, ShieldAlert, Cloud, Rocket, CheckCircle } from 'lucide-react';

export const DailyBriefingPage: React.FC = () => {
  const { showToast } = useToast();
  const [briefing, setBriefing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('AI & Machine Learning');

  useEffect(() => {
    fetchBriefing();
  }, []);

  const fetchBriefing = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/news/briefing');
      setBriefing(response.data.briefing);
    } catch (e) {
      showToast('Error generating AI Daily Briefing.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getSectionIcon = (section: string) => {
    if (section.startsWith('AI')) return <Cpu className="w-5 h-5 text-purple-500" />;
    if (section.startsWith('Programming')) return <Terminal className="w-5 h-5 text-blue-500" />;
    if (section.startsWith('Cloud')) return <Cloud className="w-5 h-5 text-indigo-500" />;
    if (section.startsWith('Cyber')) return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    return <Rocket className="w-5 h-5 text-amber-500" />;
  };

  const getSectionGradient = (section: string) => {
    if (section.startsWith('AI')) return 'from-purple-500/10 to-transparent border-purple-500/20';
    if (section.startsWith('Programming')) return 'from-blue-500/10 to-transparent border-blue-500/20';
    if (section.startsWith('Cloud')) return 'from-indigo-500/10 to-transparent border-indigo-500/20';
    if (section.startsWith('Cyber')) return 'from-rose-500/10 to-transparent border-rose-500/20';
    return 'from-amber-500/10 to-transparent border-amber-500/20';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header briefing description card */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-950/40 bg-blue-50/50 dark:bg-blue-950/20 text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono uppercase tracking-wider">
          <Sparkles className="w-4 h-4 animate-pulse fill-current" /> Auto-Compiled Tech Briefing
        </div>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          NewsMania AI Daily Briefing
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 font-mono">
          <Calendar className="w-4 h-4" /> {formattedDate}
        </p>
      </div>

      {loading ? (
        // Beautiful pulsing loader skeletons
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : !briefing ? (
        <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
          <h3 className="text-lg font-bold text-slate-800">No briefings found today.</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(briefing).map(([section, data]: [string, any]) => {
            const isExpanded = expandedSection === section;
            return (
              <div
                key={section}
                className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Header Toggle */}
                <button
                  onClick={() => toggleSection(section)}
                  className={`w-full flex items-center justify-between p-5 text-left font-sans font-bold text-base text-slate-800 dark:text-slate-100 transition-all cursor-pointer bg-gradient-to-r ${
                    isExpanded ? getSectionGradient(section) : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getSectionIcon(section)}
                    <span>{section}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Section Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-6">
                        {/* Highlights list */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono">
                            Top Headlines Today
                          </h4>
                          <ul className="space-y-2.5">
                            {data.headlines.map((headline: string, hIdx: number) => (
                              <li key={hIdx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                                <span>{headline}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Compiled AI summary text block */}
                        <div className="space-y-2 pt-4 border-t border-slate-50 dark:border-slate-800/60">
                          <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1 font-mono">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-current animate-pulse" /> AI Daily Trend Synthesis
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            {data.summary}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
