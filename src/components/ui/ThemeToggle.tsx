import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { Sun, Moon, Laptop, Check, ChevronDown } from 'lucide-react';

export interface ThemeToggleProps {
  className?: string;
  variant?: 'segmented' | 'dropdown' | 'icon-only';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'dropdown',
  showLabel = true,
}) => {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: {
    mode: ThemeMode;
    label: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    iconColor: string;
  }[] = [
    {
      mode: 'light',
      label: 'Light Mode',
      description: 'Clean bright layout with dark text',
      icon: Sun,
      iconColor: 'text-amber-500',
    },
    {
      mode: 'dark',
      label: 'Dark Mode',
      description: 'Cinematic deep dark layout with light text',
      icon: Moon,
      iconColor: 'text-cyan-400',
    },
    {
      mode: 'system',
      label: 'System Default',
      description: "Follows your device's OS theme setting",
      icon: Laptop,
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
  ];

  // 1. SEGMENTED THREE-OPTION PILL VARIANT
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300 dark:border-white/15 backdrop-blur-md ${className}`}
        role="group"
        aria-label="Theme selection options"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = themeMode === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setThemeMode(opt.mode)}
              title={`${opt.label}: ${opt.description}`}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-300 dark:ring-white/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${opt.iconColor}`} />
              <span>{opt.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. DROPDOWN / COMPACT TOGGLE VARIANT
  const ActiveIcon =
    themeMode === 'system' ? Laptop : resolvedTheme === 'dark' ? Moon : Sun;
  const activeIconColor =
    themeMode === 'system'
      ? 'text-blue-500 dark:text-blue-400'
      : resolvedTheme === 'dark'
      ? 'text-cyan-400'
      : 'text-amber-500';

  const currentLabel =
    themeMode === 'system'
      ? 'System'
      : themeMode === 'dark'
      ? 'Dark'
      : 'Light';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title={`Current Theme: ${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} (Click to switch)`}
        aria-label="Toggle theme mode"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white backdrop-blur-md transition-all shadow-xs group"
      >
        <ActiveIcon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeIconColor}`} />
        {showLabel && (
          <span className="text-xs font-semibold">
            {currentLabel}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-300 transition-transform ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 backdrop-blur-2xl p-2 shadow-2xl z-50 animate-fade-in text-slate-900 dark:text-white space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/10">
            Theme Preference
          </div>

          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = themeMode === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => {
                  setThemeMode(opt.mode);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-600/30 text-blue-700 dark:text-cyan-300 font-semibold border border-blue-200 dark:border-blue-500/30'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 mt-0.5">
                    <Icon className={`w-4 h-4 ${opt.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {opt.description}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-cyan-300 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
