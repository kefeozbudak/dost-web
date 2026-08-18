import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.state.error?.message?.includes("Database is closing/hidden") || this.state.error?.message?.includes("Database is closed")) {
        // Return children directly if it's the known harmless dev environment error
        return this.props.children;
      }
      return (
        <div className="p-8 text-red-500 bg-red-50 rounded-lg m-8">
          <h2 className="text-xl font-bold mb-4">Bir hata oluştu</h2>
          <pre className="whitespace-pre-wrap text-sm">{this.state.error?.message}</pre>
          <pre className="whitespace-pre-wrap text-xs mt-4">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
