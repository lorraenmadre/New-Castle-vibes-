import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Unknown application error',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Newcastle render error:', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center p-8">
        <div className="max-w-2xl border border-rose-100 bg-rose-50 p-8 space-y-4">
          <p className="system-tag text-rose-500">Newcastle render error</p>
          <h1 className="text-4xl heading-large italic lowercase">The castle loaded sideways.</h1>
          <p className="font-display italic text-slate-600">
            The app is deployed, but one front-end piece failed while rendering.
          </p>
          <pre className="text-xs whitespace-pre-wrap bg-white border border-rose-100 p-4 overflow-auto">
            {this.state.message}
          </pre>
        </div>
      </div>
    );
  }
}
