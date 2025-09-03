import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log Google Translate related errors but don't crash the app
    if (error.message.includes('removeChild') || 
        error.message.includes('Node') ||
        error.message.includes('translate') ||
        error.stack?.includes('translate')) {
      console.warn('Google Translate DOM conflict detected:', error.message);
      
      // Try to recover from Google Translate conflicts
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 100);
      
      return;
    }

    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      // Check if it's a Google Translate related error
      const isGoogleTranslateError = 
        this.state.error.message.includes('removeChild') ||
        this.state.error.message.includes('Node') ||
        this.state.error.message.includes('translate') ||
        this.state.error.stack?.includes('translate');

      if (isGoogleTranslateError) {
        // For Google Translate errors, just render children normally
        // The error will auto-recover
        return this.props.children;
      }

      // For other errors, show fallback UI
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600 text-sm mt-1">
            Please refresh the page or try again later.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 