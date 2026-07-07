import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-0 animate-pulse">
      {/* Aspect ratio video placeholder */}
      <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex gap-2 mb-3">
            <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          {/* Title */}
          <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-800 mb-2" />
          <div className="h-5 w-4/5 rounded bg-slate-200 dark:bg-slate-800 mb-4" />
          {/* Content paragraphs */}
          <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800 mb-2" />
          <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800 mb-2" />
          <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-3">
            <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};
