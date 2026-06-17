import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { useEffect } from "react";
import { reportLovableError } from "../lib/lovable-error-reporting";

interface ErrorFallbackProps {
  error: Error | any;
  reset?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({ error, reset, title, message }: ErrorFallbackProps) {
  useEffect(() => {
    if (error) {
      reportLovableError(error, { boundary: "error_fallback_component" });
    }
  }, [error]);

  const getFriendlyMessage = () => {
    if (message) return message;
    if (!error) return "An unexpected error occurred. Please try again later.";

    const errorMsg = error.message || String(error);
    const lowerMsg = errorMsg.toLowerCase();

    // Catch database errors and hide internal technical details
    if (
      lowerMsg.includes("postgres") ||
      lowerMsg.includes("relation") ||
      lowerMsg.includes("column") ||
      lowerMsg.includes("foreign key") ||
      lowerMsg.includes("database") ||
      lowerMsg.includes("pgrst") ||
      lowerMsg.includes('code:"42') ||
      lowerMsg.includes('code:"pgrst')
    ) {
      return "Unable to load data. Please contact the administrator.";
    }

    // Network / fetch errors
    if (
      lowerMsg.includes("network") ||
      lowerMsg.includes("fetch") ||
      lowerMsg.includes("failed to fetch")
    ) {
      return "Network connection issue. Please check your internet and try again.";
    }

    // Session / Auth errors
    if (
      lowerMsg.includes("permission") ||
      lowerMsg.includes("authorized") ||
      lowerMsg.includes("jwt") ||
      lowerMsg.includes("unauthorized")
    ) {
      return "Session expired or permission denied. Please sign in again.";
    }

    return errorMsg;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl text-center shadow-sm max-w-md mx-auto my-8">
      <div className="size-12 rounded-full bg-danger-soft text-danger flex items-center justify-center mb-4">
        <AlertCircle className="size-6 animate-pulse" />
      </div>
      <h3 className="font-semibold text-lg text-foreground">{title || "Something went wrong"}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{getFriendlyMessage()}</p>

      <div className="mt-6 flex items-center justify-center gap-3">
        {reset && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 shadow-sm"
          >
            <RotateCcw className="size-4" /> Try again
          </button>
        )}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-border rounded-md hover:bg-accent text-foreground"
        >
          <Home className="size-4" /> Go Home
        </a>
      </div>
    </div>
  );
}
