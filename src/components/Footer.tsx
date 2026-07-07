import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Heart, Github, Twitter, Linkedin, Rss } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-550 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Brand */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <Flame className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-sans font-bold text-base tracking-tight text-slate-900 dark:text-slate-50">
                NEWSMANIA <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
            <p className="text-xs font-sans text-slate-500 leading-relaxed max-w-xs mt-1">
              Recruiter-quality personalized technology news portal generating intelligent briefings, summaries, and structural simplifications driven by modern Google Gemini AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
              Features
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/briefing" className="hover:text-blue-600 transition-colors">
                  Daily AI Briefing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                  Trending Dashboard
                </Link>
              </li>
              <li>
                <Link to="/home" className="hover:text-blue-600 transition-colors">
                  Personalized Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
              Categories
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">
                  Artificial Intelligence
                </span>
              </li>
              <li>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">
                  Cloud Infrastructure
                </span>
              </li>
              <li>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">
                  Cyber Security
                </span>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
              Newsletter & Socials
            </h4>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Stay ahead in tech. Experience advanced content pipelines designed for industry placements and recruiters.
            </p>
            <div className="flex gap-3 mt-4">
              <span className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors cursor-pointer">
                <Github className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors cursor-pointer">
                <Rss className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans text-slate-400">
            &copy; {new Date().getFullYear()} NewsMania AI. All rights reserved. Created for tech portfolio showcasing.
          </p>
          <p className="text-xs flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> by senior developers.
          </p>
        </div>
      </div>
    </footer>
  );
};
