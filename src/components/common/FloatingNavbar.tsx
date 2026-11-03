import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, ArrowRight, User, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface FloatingNavLink {
  label: string;
  path: string;
}

export interface FloatingNavbarProps {
  brandName?: string;
  tagline?: string;
  links?: FloatingNavLink[];
  className?: string;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  brandName = 'CampusSaathi',
  tagline = 'ONE CAMPUS. EVERY CONNECTION.',
  links = [
    { label: 'Overview', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Institutions', path: '/institutions' },
    { label: 'Register Campus', path: '/register-institution' },
    { label: 'Contact', path: '/contact' },
  ],
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className={`fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none ${className}`}>
      <div className="max-w-7xl mx-auto rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/15 px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xl pointer-events-auto transition-all">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center">
              {brandName}
            </span>
            <span className="block text-[9px] font-semibold text-cyan-400 tracking-wider uppercase -mt-0.5">
              {tagline}
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  isActive
                    ? 'font-semibold text-white bg-white/20 shadow-sm border border-white/10'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <span>Portal Sign In</span>
            <User className="w-4 h-4 text-cyan-400" />
          </Link>
          <Link to="/app/student">
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-1.5 transition transform hover:scale-[1.02]">
              <span>Live Demo Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 p-4 space-y-2 pointer-events-auto shadow-2xl">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center text-white border-white/20 hover:bg-white/10">
                Portal Sign In
              </Button>
            </Link>
            <Link to="/app/student" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                Live Demo Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

