import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth";
import { SchoolContextProvider } from "../lib/school-context";
import { TenantProvider } from "../lib/tenant-context";
import { Toaster } from "sonner";
import { ErrorFallback } from "../components/ErrorFallback";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <ErrorFallback
        error={error}
        reset={() => {
          router.invalidate();
          reset();
        }}
      />
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HEZO SCHOOL — Daily school operations" },
      { name: "description", content: "Attendance, homework, teacher remarks and a Parent Daily Digest — built for Indian schools." },
      { property: "og:title", content: "HEZO SCHOOL — Daily school operations" },
      { property: "og:description", content: "Attendance, homework, teacher remarks and a Parent Daily Digest — built for Indian schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "HEZO SCHOOL — Daily school operations" },
      { name: "twitter:description", content: "Attendance, homework, teacher remarks and a Parent Daily Digest — built for Indian schools." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6bc13b80-45c0-4a8f-8bc2-cdf74edc9267/id-preview-d077aa99--0014a056-074e-4284-843d-2caf00c15828.lovable.app-1780137494189.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6bc13b80-45c0-4a8f-8bc2-cdf74edc9267/id-preview-d077aa99--0014a056-074e-4284-843d-2caf00c15828.lovable.app-1780137494189.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { ThemeProvider } from "../lib/theme-provider";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <SchoolContextProvider>
            <TenantProvider>
              <Outlet />
              <Toaster richColors position="top-right" />
            </TenantProvider>
          </SchoolContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
