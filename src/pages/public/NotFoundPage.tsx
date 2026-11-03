import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Home, LifeBuoy, ArrowRight, ShieldAlert, Bug } from 'lucide-react';
import { analytics } from '../../lib/analytics';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.track('pageview', '404_Not_Found', { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in duration-300">
        
        {/* Visual 404 Badge */}
        <div className="relative inline-block">
          <div className="text-8xl sm:text-9xl font-black text-slate-200 dark:text-slate-800/80 tracking-tighter select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-lg">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The requested destination <code className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400">{location.pathname}</code> does not exist or has been relocated to another academic portal.
          </p>
        </div>

        {/* Suggested Helpful Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            to="/"
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                Return to Homepage
              </h3>
              <p className="text-[11px] text-slate-500">Overview & Campus Registration</p>
            </div>
          </Link>

          <Link
            to="/auth"
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                Sign In to Portal
              </h3>
              <p className="text-[11px] text-slate-500">Student, Teacher, or Admin</p>
            </div>
          </Link>

          <Link
            to="/support"
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                Help & Support Center
              </h3>
              <p className="text-[11px] text-slate-500">Official Helpline & Inquiries</p>
            </div>
          </Link>

          <Link
            to="/report-bug"
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-red-500 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600">
                Report a Broken Link
              </h3>
              <p className="text-[11px] text-slate-500">Notify our engineering desk</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

