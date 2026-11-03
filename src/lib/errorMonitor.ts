// Robust Error Monitoring and Diagnostics for CampusSaathi

export interface DiagnosticError {
  id: string;
  timestamp: string;
  message: string;
  source?: string;
  stack?: string;
  url: string;
  userAgent: string;
}

const ERROR_STORAGE_KEY = 'cs_diagnostic_errors';
const MAX_STORED_ERRORS = 50;

function sanitizeString(str: string): string {
  // Strip token / auth header patterns
  return str.replace(/bearer\s+[a-zA-Z0-9_.-]+/gi, '[REDACTED_TOKEN]');
}

export const errorMonitor = {
  init(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.recordError(
        event.message || 'Unknown JavaScript Error',
        event.filename || 'window.onerror',
        event.error?.stack
      );
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const message = typeof reason === 'string' ? reason : reason?.message || 'Unhandled Promise Rejection';
      const stack = reason?.stack;
      this.recordError(message, 'unhandledrejection', stack);
    });
  },

  recordError(message: string, source?: string, stack?: string): DiagnosticError {
    const error: DiagnosticError = {
      id: 'ERR-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      message: sanitizeString(message),
      source: source ? sanitizeString(source) : undefined,
      stack: stack ? sanitizeString(stack.substring(0, 1000)) : undefined,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };

    try {
      const raw = localStorage.getItem(ERROR_STORAGE_KEY);
      const list: DiagnosticError[] = raw ? JSON.parse(raw) : [];
      list.unshift(error);
      if (list.length > MAX_STORED_ERRORS) {
        list.splice(MAX_STORED_ERRORS);
      }
      localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore localStorage errors
    }

    if (import.meta.env.DEV) {
      console.error('[ErrorMonitor Caught Error]', error);
    }

    return error;
  },

  getRecentErrors(): DiagnosticError[] {
    try {
      const raw = localStorage.getItem(ERROR_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  clearErrors(): void {
    try {
      localStorage.removeItem(ERROR_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
};

