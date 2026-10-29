import type { ErrorInfo } from "react";

/**
 * Logs every error caught by an error boundary (ours and React Router's).
 * The Enter preview only treats a console.error as a runtime error when its first
 * argument mentions an error boundary, so keep this prefix or caught errors stop
 * reaching the agent.
 */
export function reportCaughtError(error: unknown, errorInfo: ErrorInfo) {
  console.error(
    "ErrorBoundary caught a runtime error:",
    error,
    errorInfo.componentStack,
  );
}
