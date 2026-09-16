import React from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("INAVIST React ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "#090E17",
            color: "#FFFFFF",
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}
        >
          <div
            style={{
              maxWidth: "560px",
              width: "100%",
              background: "#1E293B",
              borderRadius: "20px",
              padding: "32px",
              border: "1.5px solid rgba(239, 68, 68, 0.4)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: "8px" }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: "0.90rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "20px" }}>
              {this.state.error?.message || "An unexpected rendering error occurred. Click below to recover."}
            </p>

            <button
              onClick={this.handleReset}
              style={{
                padding: "12px 28px",
                borderRadius: "12px",
                border: "none",
                background: "#2563EB",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <RotateCcw size={16} />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
