import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBackgroundTheme } from '../../context/BackgroundThemeContext';
import { campusStore } from '../../lib/store';
import { Institution } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CollegeBackgroundProps {
  institutionId?: string;
  images?: string[];
  variant?: 'fullscreen' | 'hero' | 'subtle-dash' | 'platform';
  overlayOpacity?: 'light' | 'medium' | 'dark' | 'glass' | 'deep-navy' | 'platform';
  showControls?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CollegeBackground: React.FC<CollegeBackgroundProps> = ({
  institutionId,
  images: customImages,
  variant = 'fullscreen',
  overlayOpacity = 'medium',
  showControls = false,
  className = '',
  children,
}) => {
  const { user, role } = useAuth();
  const theme = useBackgroundTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const isPlatformAdmin = role === 'platform_admin' || variant === 'platform';

  // Target institution resolution
  const targetInstitution: Institution | undefined = useMemo(() => {
    if (institutionId) {
      return campusStore.getInstitutions().find((i) => i.id === institutionId);
    }
    return theme.activeInstitution || undefined;
  }, [institutionId, theme.activeInstitution]);

  // Resolve slides
  const resolvedImages = useMemo(() => {
    // 1. Explicitly provided custom images
    if (customImages && customImages.length > 0) {
      return customImages;
    }
    // 2. Superadmin / Platform view
    if (isPlatformAdmin) {
      return [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
      ];
    }
    // 3. Institution configured background
    if (targetInstitution?.background_images && targetInstitution.background_images.length > 0) {
      return targetInstitution.background_images;
    }
    // 4. Default for Khalsa College
    if (targetInstitution?.code === 'KC-ASR') {
      return ['/assets/khalsa-college-bg.jpg'];
    }
    // 5. Global fallback
    return ['/assets/khalsa-college-bg.jpg'];
  }, [customImages, isPlatformAdmin, targetInstitution]);

  // Slideshow interval timer
  useEffect(() => {
    if (resolvedImages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % resolvedImages.length);
    }, 7000);

    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resolvedImages.length, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? resolvedImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % resolvedImages.length);
  };

  const handleImageError = (imgSrc: string) => {
    setFailedImages((prev) => ({ ...prev, [imgSrc]: true }));
  };

  // Overlay classes
  const overlayClasses = {
    light: 'bg-gradient-to-b from-[#142B4A]/50 via-[#142B4A]/35 to-[#0E1F35]/60 backdrop-blur-[1px]',
    medium: 'bg-gradient-to-b from-[#0E1F35]/85 via-[#142B4A]/65 to-[#091424]/90 backdrop-blur-[2px]',
    dark: 'bg-gradient-to-b from-[#0A1128]/95 via-[#0E1F35]/85 to-[#050B14]/98 backdrop-blur-[2px]',
    glass: 'bg-[#0E1F35]/75 backdrop-blur-md',
    'deep-navy': 'bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/60 backdrop-blur-[2px]',
    platform: 'bg-gradient-to-b from-[#080E1A]/95 via-[#0F172A]/85 to-[#020617]/98 backdrop-blur-[2px]',
  };

  // Fallback safe source if an image fails
  const getSafeImageSrc = (src: string) => {
    if (failedImages[src]) {
      return '/assets/khalsa-college-bg.jpg';
    }
    return src;
  };

  // 1. FULLSCREEN MODE (e.g. Login Page, Landing Full Hero)
  if (variant === 'fullscreen') {
    return (
      <div className={`relative min-h-screen w-full overflow-hidden flex flex-col justify-between ${className}`}>
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          {resolvedImages.map((imgSrc, idx) => {
            const isVisible = idx === currentSlide;
            return (
              <div
                key={imgSrc}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={getSafeImageSrc(imgSrc)}
                  alt={`${targetInstitution?.name || 'Campus'} Background`}
                  onError={() => handleImageError(imgSrc)}
                  className="w-full h-full object-cover object-center animate-cinematic-bg transform scale-105"
                  loading="eager"
                />
              </div>
            );
          })}

          {/* Cinematic Navy Overlay */}
          <div className={`absolute inset-0 ${overlayClasses[overlayOpacity]}`} />

          {/* Vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/70 pointer-events-none" />
        </div>

        {/* Slide Controls */}
        {showControls && resolvedImages.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {resolvedImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? 'w-5 bg-cyan-400' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="relative z-10 w-full flex-1 flex flex-col">{children}</div>
      </div>
    );
  }

  // 2. HERO BANNER MODE (e.g. Dashboard Hero Cards)
  if (variant === 'hero' || variant === 'platform') {
    return (
      <div className={`relative overflow-hidden rounded-2xl shadow-2xl text-white border border-white/15 ${className}`}>
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          {resolvedImages.map((imgSrc, idx) => {
            const isVisible = idx === currentSlide;
            return (
              <div
                key={imgSrc}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={getSafeImageSrc(imgSrc)}
                  alt={`${targetInstitution?.name || 'Platform'} Hero`}
                  onError={() => handleImageError(imgSrc)}
                  className="w-full h-full object-cover object-center animate-cinematic-bg transform scale-105"
                  loading="lazy"
                />
              </div>
            );
          })}
          <div className={`absolute inset-0 ${overlayClasses[variant === 'platform' ? 'platform' : overlayOpacity]}`} />
        </div>

        <div className="relative z-10 p-6 sm:p-8">{children}</div>
      </div>
    );
  }

  // 3. SUBTLE DASHBOARD BACKDROP MODE
  return (
    <div className={`relative min-h-full w-full ${className}`}>
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        <img
          src={getSafeImageSrc(resolvedImages[0])}
          alt=""
          aria-hidden="true"
          onError={() => handleImageError(resolvedImages[0])}
          className="w-full h-full object-cover object-center opacity-15 filter blur-[3px] animate-cinematic-bg"
        />
        <div className="absolute inset-0 bg-[var(--overlay-color)] backdrop-blur-[1px] transition-colors duration-300" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Export alias for CinematicBackground
export const CinematicBackground = CollegeBackground;
