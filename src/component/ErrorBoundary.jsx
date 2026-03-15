import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🔥 React Error:", error, errorInfo);

    // Optional: Send to backend
    // fetch("/api/log-error", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     error: error.toString(),
    //     stack: errorInfo.componentStack,
    //     url: window.location.href,
    //   }),
    // });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-red-600">
              Something went wrong 😔
            </h1>

            <pre className="mb-4 max-h-40 overflow-auto rounded bg-gray-100 p-3 text-left text-xs text-red-500">
              {this.state.error?.toString()}
            </pre>

            <button
              onClick={() => window.location.reload()}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;