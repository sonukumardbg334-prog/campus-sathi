import React from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'light' | 'accent' | 'ghost';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: boolean;
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  variant = 'dark',
  blur = 'xl',
  hoverEffect = false,
  glow = false,
  className = '',
  children,
  ...props
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-xs',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const variantClasses = {
    dark: 'bg-slate-900/65 border-white/15 text-white shadow-2xl',
    light: 'bg-white/90 border-slate-200/80 text-slate-900 shadow-xl',
    accent: 'bg-slate-900/75 border-cyan-400/30 text-white shadow-2xl',
    ghost: 'bg-slate-900/35 border-white/10 text-white shadow-lg',
  };

  const hoverClasses = hoverEffect
    ? 'transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:-translate-y-0.5'
    : '';

  const glowClasses = glow
    ? 'ring-1 ring-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
    : '';

  return (
    <div
      className={`rounded-2xl border ${blurClasses[blur]} ${variantClasses[variant]} ${hoverClasses} ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

