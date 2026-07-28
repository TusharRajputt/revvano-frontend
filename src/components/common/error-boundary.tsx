import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Application error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 text-center">
          <div>
            <h1 className="font-heading text-4xl font-light mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
