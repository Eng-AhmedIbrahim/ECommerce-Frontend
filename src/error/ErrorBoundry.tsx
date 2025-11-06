import React from "react";
import ErrorPage from "./errorPage/ErrorPage";

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

type ErrorBoundaryProps = {
  children?: React.ReactNode;
};

class ErrorBoundry extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.log(errorInfo.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorPage
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReload={this.handleReload}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundry;
