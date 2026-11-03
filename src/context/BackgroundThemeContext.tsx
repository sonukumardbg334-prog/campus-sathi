import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { campusStore } from '../lib/store';
import { Institution, InstitutionThemeConfig } from '../types';

interface BackgroundThemeContextType {
  activeInstitution: Institution | null;
  themeConfig: InstitutionThemeConfig;
  backgroundImages: string[];
  isPlatformAdmin: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cardStyle: 'glass_light' | 'glass_dark' | 'solid';
  customTagline?: string;
  updateTheme: (newTheme: Partial<InstitutionThemeConfig>) => void;
  refreshTheme: () => void;
}

const DEFAULT_THEME: InstitutionThemeConfig = {
  primary_color: '#142B4A',
  secondary_color: '#2563EB',
  accent_color: '#06B6D4',
  card_style: 'glass_dark',
  custom_tagline: 'One Campus. Every Connection.',
  glass_opacity: 0.85,
};

// Platform Super Admin dedicated technical background
const SUPERADMIN_BG = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
];

const BackgroundThemeContext = createContext<BackgroundThemeContextType | undefined>(undefined);

export const BackgroundThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>(campusStore.getInstitutions());
  const [customOverride, setCustomOverride] = useState<Partial<InstitutionThemeConfig> | null>(null);

  // Subscribe to store updates (e.g. when an admin updates branding)
  useEffect(() => {
    const update = () => {
      setInstitutions(campusStore.getInstitutions());
    };
    return campusStore.subscribe(update);
  }, []);

  const isPlatformAdmin = role === 'platform_admin';

  // Resolve institution strictly from verified user membership
  const activeInstitution = useMemo<Institution | null>(() => {
    if (isPlatformAdmin) return null;
    if (!user?.institution_id) return null;
    return institutions.find((i) => i.id === user.institution_id) || null;
  }, [user?.institution_id, institutions, isPlatformAdmin]);

  // Resolve background images
  const backgroundImages = useMemo<string[]>(() => {
    if (isPlatformAdmin) {
      return SUPERADMIN_BG;
    }
    if (activeInstitution?.background_images && activeInstitution.background_images.length > 0) {
      return activeInstitution.background_images;
    }
    // Campus architecture fallback
    return ['/assets/khalsa-college-bg.jpg'];
  }, [isPlatformAdmin, activeInstitution]);

  // Resolve theme configuration
  const themeConfig = useMemo<InstitutionThemeConfig>(() => {
    const base = activeInstitution?.theme_config || DEFAULT_THEME;
    return {
      ...base,
      ...customOverride,
    };
  }, [activeInstitution, customOverride]);

  const updateTheme = (newTheme: Partial<InstitutionThemeConfig>) => {
    setCustomOverride((prev) => ({ ...prev, ...newTheme }));
  };

  const refreshTheme = () => {
    setInstitutions(campusStore.getInstitutions());
    setCustomOverride(null);
  };

  // Dynamically set CSS variables on root element for institution theming
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--tenant-primary', themeConfig.primary_color || DEFAULT_THEME.primary_color!);
    root.style.setProperty('--tenant-secondary', themeConfig.secondary_color || DEFAULT_THEME.secondary_color!);
    root.style.setProperty('--tenant-accent', themeConfig.accent_color || DEFAULT_THEME.accent_color!);
  }, [themeConfig]);

  return (
    <BackgroundThemeContext.Provider
      value={{
        activeInstitution,
        themeConfig,
        backgroundImages,
        isPlatformAdmin,
        primaryColor: themeConfig.primary_color || '#142B4A',
        secondaryColor: themeConfig.secondary_color || '#2563EB',
        accentColor: themeConfig.accent_color || '#06B6D4',
        cardStyle: themeConfig.card_style || 'glass_dark',
        customTagline: themeConfig.custom_tagline || activeInstitution?.hero_tagline,
        updateTheme,
        refreshTheme,
      }}
    >
      {children}
    </BackgroundThemeContext.Provider>
  );
};

export const useBackgroundTheme = (): BackgroundThemeContextType => {
  const context = useContext(BackgroundThemeContext);
  if (!context) {
    throw new Error('useBackgroundTheme must be used within a BackgroundThemeProvider');
  }
  return context;
};

