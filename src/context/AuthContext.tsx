import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Institution } from '../types';
import { DEMO_USERS } from '../lib/mockData';
import { campusStore } from '../lib/store';
import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  institution: Institution | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginAsDemoRole: (roleKey: string) => void;
  logout: () => void;
  isDemoMode: boolean;
  authError: string | null;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cs_active_user_v3';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Student (Sonu Kumar) for immediate accessibility, or restore from storage
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed parsing stored auth:', e);
    }
    return DEMO_USERS.student; // Default initial view
  });

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      if (user.institution_id) {
        const inst = campusStore.getInstitutions().find((i) => i.id === user.institution_id);
        setInstitution(inst || null);
      } else {
        setInstitution(null);
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setInstitution(null);
    }
  }, [user]);

  useEffect(() => {
    if (!isLiveSupabaseConfigured) return;

    // Listen to Supabase auth state change
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && !localStorage.getItem(AUTH_STORAGE_KEY)) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          role: (session.user.user_metadata?.role as UserRole) || 'student',
          institution_id: session.user.user_metadata?.institution_id || 'inst-1',
          institution_name: session.user.user_metadata?.institution_name || 'Apex Institute of Technology & Management',
          is_active: true,
          created_at: session.user.created_at,
        };
        setUser(profile);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    setIsLoadingAuth(true);

    try {
      const cleanEmail = email.trim();
      const cleanPass = pass.trim();

      if (!cleanEmail || !cleanPass) {
        setAuthError('Email and password are required.');
        setIsLoadingAuth(false);
        return false;
      }

      // 1. Authenticate with local campus store (demo personas and registered users)
      const storeAuth = campusStore.authenticateUser(cleanEmail, cleanPass);
      if (storeAuth.success && storeAuth.user) {
        setUser(storeAuth.user);
        setAuthError(null);
        setIsLoadingAuth(false);
        return true;
      }

      // 2. If password explicitly rejected by store auth
      if (!storeAuth.success && storeAuth.message && storeAuth.message.includes('password')) {
        setAuthError(storeAuth.message);
        setIsLoadingAuth(false);
        return false;
      }

      // 3. Authenticate with live Supabase Auth if configured
      if (isLiveSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (error) {
          setAuthError(error.message);
          setIsLoadingAuth(false);
          return false;
        }

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            role: (data.user.user_metadata?.role as UserRole) || 'student',
            institution_id: data.user.user_metadata?.institution_id || 'inst-1',
            institution_name: data.user.user_metadata?.institution_name || 'Apex Institute of Technology & Management',
            is_active: true,
            created_at: data.user.created_at,
          };
          setUser(profile);
          setAuthError(null);
          setIsLoadingAuth(false);
          return true;
        }
      }

      // 4. Default rejection if no matching credentials found
      setAuthError('Invalid credentials. Please verify your email and password, or choose a demo persona.');
      setIsLoadingAuth(false);
      return false;
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please check network.');
      setIsLoadingAuth(false);
      return false;
    }
  };

  const loginAsDemoRole = (roleKey: string) => {
    if (DEMO_USERS[roleKey]) {
      setUser(DEMO_USERS[roleKey]);
      setAuthError(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (isLiveSupabaseConfigured) {
      supabase.auth.signOut().catch((e) => console.warn('[Supabase Auth] Sign out error:', e));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        institution,
        isAuthenticated: !!user,
        login,
        loginAsDemoRole,
        logout,
        isDemoMode: true,
        authError,
        isLoadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

