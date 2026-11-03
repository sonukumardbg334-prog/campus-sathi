import React from 'react';
import { GlassPanel, GlassPanelProps } from './GlassPanel';

export interface GlassCardProps extends Omit<GlassPanelProps, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  subtitle,
  icon,
  action,
  footer,
  padding = 'md',
  className = '',
  children,
  variant = 'dark',
  ...panelProps
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hasHeader = title || subtitle || icon || action;

  return (
    <GlassPanel variant={variant} className={`flex flex-col ${className}`} {...panelProps}>
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-bold text-white tracking-tight leading-snug">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-300 mt-0.5 leading-snug">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={`flex-1 ${paddingClasses[padding]}`}>{children}</div>

      {footer && (
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] rounded-b-2xl">
          {footer}
        </div>
      )}
    </GlassPanel>
  );
};
