import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center shadow">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h1 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white">Page Not Found</h1>
        <p className="text-sm text-slate-500">The resources or directories you are looking for do not exist or have been relocated.</p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow font-semibold text-xs transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back to Home
      </Link>
    </div>
  );
};
