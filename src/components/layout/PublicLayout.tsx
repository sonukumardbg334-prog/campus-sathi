import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  GraduationCap,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  User,
  Phone,
  MessageSquare,
  Cookie,
  LifeBuoy
} from 'lucide-react';
import { Button } from '../ui/Button';
import { CookieConsentBanner } from '../common/CookieConsentBanner';
import { CampusAiAssistant } from '../common/CampusAiAssistant';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Institutions', path: '/institutions' },
    { label: 'Role Registration', path: '/register' },
    { label: 'Register Campus', path: '/register-institution' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-background)] text-[var(--page-foreground)] relative transition-colors duration-300">
      {/* ========================================================
          GLOBAL CINEMATIC COLLEGE BACKGROUND
          Spans the entire viewport across all public pages
          ======================================================== */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/assets/khalsa-college-bg.jpg"
          alt="Khalsa College Campus"
          className="w-full h-full object-cover object-center animate-cinematic-bg transform scale-105"
          style={{ willChange: 'transform' }}
        />
        {/* Subtle theme-aware overlay allowing college architecture to shine through */}
        <div className="absolute inset-0 bg-[var(--overlay-color)] backdrop-blur-[1px] transition-colors duration-300" />
      </div>

      {/* ========================================================
          FLOATING GLASSMORPHISM TOP NAVIGATION BAR
          ======================================================== */}
      <header className="fixed top-3.5 sm:top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto rounded-2xl bg-white/85 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/90 dark:border-white/20 px-5 sm:px-6 h-16 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] pointer-events-auto transition-all text-slate-900 dark:text-white">
          {/* Brand Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl bg-slate-950/80 border border-amber-400/40 p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/assets/campussaathi-logo.png"
                alt="CampusSaathi Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
                CampusSaathi
              </span>
              <span className="block text-[9px] font-semibold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase -mt-0.5">
                ONE CAMPUS. EVERY CONNECTION.
              </span>
            </div>
          </Link>

          {/* Center Navigation Links with Active Pill State */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-full text-xs transition duration-200 ${isActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 font-medium'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs: Theme Toggle + Portal Sign In + Live Demo Portal */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle (Light / Dark / System) */}
            <ThemeToggle variant="dropdown" />

            <Link
              to="/login"
              className="text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <span>Portal Sign In</span>
              <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </Link>
            <Link to="/app/student">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] flex items-center gap-1.5 transition transform hover:scale-[1.02]">
                <span>Live Demo Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle variant="dropdown" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/20 p-4 space-y-2 pointer-events-auto shadow-2xl text-slate-900 dark:text-white">
            <div className="pb-2 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Theme Preference</span>
              <ThemeToggle variant="segmented" />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${location.pathname === link.path
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Portal Sign In
                </Button>
              </Link>
              <Link to="/app/student" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center bg-blue-600 hover:bg-blue-500">
                  Live Demo Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className={`flex-1 relative z-10 ${isHome ? '' : 'pt-24 pb-16'}`}>
        <Outlet />
      </main>

      {/* Transparent Glassmorphism Footer */}
      <footer className="relative z-10 bg-[var(--surface-background)] backdrop-blur-2xl border-t border-[var(--card-border)] text-[var(--muted-foreground)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-amber-400/40 p-0.5 flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src="/assets/campussaathi-logo.png"
                    alt="CampusSaathi Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg font-bold text-[var(--page-foreground)]">CampusSaathi</span>
                  <span className="block text-[8px] font-semibold text-cyan-500 dark:text-cyan-400 tracking-wider uppercase -mt-0.5">
                    ONE CAMPUS. EVERY CONNECTION.
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Multi-institution campus operations & grievance management for colleges, hostels, students, faculty, and parents across India.
              </p>
              <div className="text-[11px] text-cyan-500 dark:text-cyan-400 font-medium">
                Tagline: "One Campus. Every Connection."
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--page-foreground)] mb-3">
                Portals & Modules
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/app/student" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Student Grievance Cell</Link></li>
                <li><Link to="/app/warden" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Hostel Warden Console</Link></li>
                <li><Link to="/app/parent" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Parent Guardian Portal</Link></li>
                <li><Link to="/app/teacher" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Faculty Attendance System</Link></li>
                <li><Link to="/app/mess" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Mess & Dining Management</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--page-foreground)] mb-3">
                Help, Support & Legal
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/support" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Help & Support Desk</Link></li>
                <li><Link to="/contact" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Contact Support</Link></li>
                <li><Link to="/feedback" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Submit Feedback</Link></li>
                <li><Link to="/report-bug" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Report a Bug</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--page-foreground)] mb-3">
                Official Support Desk
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-3">
                CampusSaathi verified central helpline for institutional admissions, attendance approvals, and tech assistance.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:18002004567"
                  className="p-2.5 rounded-xl bg-blue-500/10 dark:bg-white/[0.06] border border-[var(--card-border)] text-xs text-[var(--page-foreground)] flex items-center gap-2 hover:border-cyan-400 transition-all font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <span>Call: 1800 200 4567 (Toll-Free)</span>
                </a>
                <a
                  href="https://wa.me/917488330835"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-white/[0.06] border border-[var(--card-border)] text-xs text-[var(--page-foreground)] flex items-center gap-2 hover:border-emerald-400 transition-all font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>WhatsApp: +91 74883 30835</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted-foreground)] gap-2">
            <p>© 2026 CampusSaathi. Built for Smart Campus Operations.</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('cs_cookie_consent');
                  window.location.reload();
                }}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <Cookie className="w-3.5 h-3.5" />
                Cookie Preferences
              </button>
              <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                DPDP 2023 Compliant
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Floating AI Campus Assistant */}
      <CampusAiAssistant />
    </div>
  );
};
