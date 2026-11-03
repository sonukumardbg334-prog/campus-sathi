import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, Settings, Check, X } from 'lucide-react';
import { CookieConsentPreferences } from '../../types';

const COOKIE_CONSENT_KEY = 'cs_cookie_consent';

export function getCookiePreferences(): CookieConsentPreferences | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCookiePreferences(prefs: CookieConsentPreferences): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: prefs }));
  } catch {
    // Ignore storage errors
  }
}

export const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Customization modal state
  const [allowAnalytics, setAllowAnalytics] = useState(false);
  const [allowFunctional, setAllowFunctional] = useState(true);

  useEffect(() => {
    const existing = getCookiePreferences();
    if (!existing) {
      // Delay showing banner slightly to avoid layout shifts on initial paint
      const timer = setTimeout(() => setShowBanner(true), 600);
      return () => clearTimeout(timer);
    } else {
      setAllowAnalytics(existing.analytics);
      setAllowFunctional(existing.functional);
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs: CookieConsentPreferences = {
      necessary: true,
      essential: true,
      analytics: true,
      functional: true,
      timestamp: new Date().toISOString()
    };
    saveCookiePreferences(prefs);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleRejectOptional = () => {
    const prefs: CookieConsentPreferences = {
      necessary: true,
      essential: true,
      analytics: false,
      functional: false,
      timestamp: new Date().toISOString()
    };
    saveCookiePreferences(prefs);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSaveCustom = () => {
    const prefs: CookieConsentPreferences = {
      necessary: true,
      essential: true,
      analytics: allowAnalytics,
      functional: allowFunctional,
      timestamp: new Date().toISOString()
    };
    saveCookiePreferences(prefs);
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <>
      {/* Banner at bottom */}
      {showBanner && !showModal && (
        <div 
          role="region" 
          aria-label="Cookie Consent"
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/10 text-slate-800 dark:text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Privacy & Cookie Preferences
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                CampusSaathi uses essential cookies for secure login and theme preferences. We also use privacy-first anonymous analytics to optimize page load speeds. We never sell personal data or track across 3rd-party sites. Review our{' '}
                <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-700">
                  Privacy Policy
                </Link>.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Granular Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 id="cookie-settings-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  Cookie & Privacy Preferences
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Customize how CampusSaathi stores cookies and diagnostic preferences on your device. Essential security and authentication cookies cannot be disabled.
            </p>

            <div className="space-y-4">
              {/* Essential */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Strictly Necessary</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Required for student/teacher authentication, tenant selection, security CSRF tokens, and dark/light mode persistence.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 h-4 w-4 rounded text-blue-600 cursor-not-allowed opacity-75"
                />
              </div>

              {/* Functional */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Functional Preferences</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Remembers your active campus filters, table column widths, and form draft auto-save.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={allowFunctional}
                    onChange={(e) => setAllowFunctional(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Performance & Analytics</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Helps us discover broken links and optimize response times. No personal information or tracking across sites.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={allowAnalytics}
                    onChange={(e) => setAllowAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline"
              >
                Reject Optional
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
