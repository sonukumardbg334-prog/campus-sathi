// Privacy-conscious, PII-scrubbed Analytics Engine for CampusSaathi
import { getCookiePreferences } from '../components/common/CookieConsentBanner';

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'pageview' | 'cta_click' | 'form_submit' | 'theme_change' | 'role_switch';
  name: string;
  path: string;
  metadata?: Record<string, string | number | boolean>;
}

const ANALYTICS_STORAGE_KEY = 'cs_analytics_events';
const MAX_STORED_EVENTS = 100;

// Utility to scrub potential PII from event data
function scrubPII(value: string): string {
  // Scrub email addresses
  const scrubbedEmail = value.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  // Scrub phone numbers (10+ digits or formatted)
  const scrubbedPhone = scrubbedEmail.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[REDACTED_PHONE]');
  // Scrub tokens or bearer tokens
  const scrubbedToken = scrubbedPhone.replace(/bearer\s+[a-zA-Z0-9_.-]+/gi, '[REDACTED_TOKEN]');
  return scrubbedToken;
}

export const analytics = {
  /**
   * Track an event if analytics cookies are accepted
   */
  track(type: AnalyticsEvent['type'], name: string, metadata: Record<string, string | number | boolean> = {}): void {
    try {
      const prefs = getCookiePreferences();
      // If user hasn't explicitly allowed analytics or rejected it, respect privacy
      if (!prefs || !prefs.analytics) {
        return;
      }

      // Sanitize metadata
      const cleanMeta: Record<string, string | number | boolean> = {};
      for (const [key, val] of Object.entries(metadata)) {
        if (typeof val === 'string') {
          cleanMeta[key] = scrubPII(val);
        } else {
          cleanMeta[key] = val;
        }
      }

      const event: AnalyticsEvent = {
        id: 'EVT-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        type,
        name: scrubPII(name),
        path: window.location.pathname,
        metadata: cleanMeta
      };

      // Save to local ring buffer for inspection / diagnostics
      const existingRaw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const list: AnalyticsEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
      list.unshift(event);
      if (list.length > MAX_STORED_EVENTS) {
        list.splice(MAX_STORED_EVENTS);
      }
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(list));

      if (import.meta.env.DEV) {
        // Safe development log
        console.debug(`[Analytics: ${type}]`, event.name, cleanMeta);
      }
    } catch {
      // Fail silently to avoid interrupting app execution
    }
  },

  pageView(pageName: string): void {
    this.track('pageview', pageName);
  },

  ctaClick(ctaName: string, location?: string): void {
    this.track('cta_click', ctaName, location ? { location } : {});
  },

  formSubmit(formName: string, success: boolean): void {
    this.track('form_submit', formName, { success });
  },

  getRecentEvents(): AnalyticsEvent[] {
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  clearEvents(): void {
    try {
      localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
};

