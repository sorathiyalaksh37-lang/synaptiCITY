import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { trackError } from '../lib/analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to analytics
    trackError('React Error Boundary', error.message);

    // Log to console
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Update state
    this.setState(prev => ({
      errorInfo,
      errorCount: prev.errorCount + 1
    }));

    // Send to error tracking service (Sentry, etc.)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Show custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Show error UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-icon">
              <AlertTriangle className="w-16 h-16 text-orange-400" />
            </div>

            <h1 className="error-title">Oops! Something went wrong</h1>

            <p className="error-message">
              We encountered an unexpected error. Don't worry, your network data is safe.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary className="error-summary">
                  Technical Details (Development Mode)
                </summary>
                <div className="error-stack">
                  <p className="error-name">{this.state.error.name}</p>
                  <p className="error-text">{this.state.error.message}</p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="error-component-stack">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                  {this.state.error.stack && (
                    <pre className="error-call-stack">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="error-actions">
              <button onClick={this.handleReset} className="error-button primary">
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button onClick={this.handleGoHome} className="error-button secondary">
                <Home className="w-5 h-5" />
                Go Home
              </button>

              <button onClick={this.handleReload} className="error-button tertiary">
                Reload Page
              </button>
            </div>

            {this.state.errorCount > 2 && (
              <div className="error-warning">
                <p>
                  Multiple errors detected. If the problem persists, try:
                </p>
                <ul>
                  <li>Clearing your browser cache</li>
                  <li>Updating your browser</li>
                  <li>Reporting the issue on GitHub</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier use
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};
