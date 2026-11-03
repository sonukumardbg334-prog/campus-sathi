import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, LifeBuoy } from 'lucide-react';
import { errorMonitor } from '../../lib/errorMonitor';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorId: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const recorded = errorMonitor.recordError(
      error.message,
      'ErrorBoundary',
      errorInfo.componentStack || error.stack
    );
    this.setState({ errorId: recorded.id });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="w-full max-w-lg p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5 animate-in fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Something didn't load quite right
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                A component error occurred while rendering this view. Our diagnostic system has recorded the incident to help us resolve it quickly.
              </p>
              {this.state.errorId && (
                <div className="pt-1">
                  <span className="inline-block text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Incident ID: {this.state.errorId}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm transition-all focus:ring-2 focus:ring-blue-500"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-all focus:ring-2 focus:ring-blue-500"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
              <a
                href="/report-bug"
                className="px-4 py-2 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <LifeBuoy className="w-4 h-4" />
                Report this Issue
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

