import { getErrorMessage, type FallbackProps } from "react-error-boundary";

import { Button } from "@/components/ui/button";

/** Full-page fallback shown when a render error escapes a page or the app shell. */
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  // Error details help while building; published builds keep them out of the UI.
  const details = import.meta.env.DEV ? getErrorMessage(error) : undefined;

  return (
    <div
      role="alert"
      className="flex min-h-screen items-center justify-center bg-background p-6"
    >
      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        {details && (
          <pre className="mb-6 whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-left text-sm text-muted-foreground">
            {details}
          </pre>
        )}
        <div className="flex justify-center gap-3">
          <Button onClick={resetErrorBoundary}>Try again</Button>
          <Button variant="outline" asChild>
            <a href="/">Back to home</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
