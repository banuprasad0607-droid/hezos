# HEZO SCHOOL Connect - App & Deployment Overview

This document provides a comprehensive overview of the HEZO SCHOOL Connect application's architecture, tech stack, and deployment configuration based on an analysis of the codebase.

## 🏗️ Application Architecture & Tech Stack

The application is a modern, high-performance web application built with the following technologies:

### Frontend

- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite v7 (`vite`, `@vitejs/plugin-react`)
- **Routing:** TanStack Router (`@tanstack/react-router`) - Provides type-safe routing.
- **State Management:** TanStack Query / React Query (`@tanstack/react-query`) - For robust server-state management and caching.
- **Styling:** Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`) with `clsx` and `tailwind-merge` for class utility management.
- **UI Components:** heavily relies on **Radix UI** primitives and `shadcn/ui` components for accessible, customizable components (dialogs, select, tabs, popovers, etc.).
- **Forms & Validation:** React Hook Form (`react-hook-form`) combined with Zod (`zod`) for schema validation.
- **Icons:** Lucide React (`lucide-react`).
- **Charts:** Recharts (`recharts`) for data visualization.

### Backend / Database

- **Backend as a Service (BaaS):** Supabase (`@supabase/supabase-js`).
- **Database:** PostgreSQL (managed by Supabase). The codebase includes extensive database setup scripts and schema dumps (`schema_dump.sql`, `schema_dump_utf8.sql`).
- **Migrations:** Managed via SQL files in `supabase/migrations/`. There are currently 29 migration files spanning modules like billing, achievements, id cards, whatsapp business, and report cards.
- **Scripting:** Heavy use of `.mjs` Node scripts in the root directory (e.g., `run_migration.mjs`, `apply-migration.mjs`, `audit_database.mjs`) to manage database state, check roles, and seed data.

---

## 🚀 Build & Lint Status

### 🟢 Build Verification

I ran a production build (`npm run build`) which executed `vite build`.
**The build was successful**, taking ~27 seconds to compile the client environment for production. It successfully generated the `dist` folder.

### 🟡 Linting Status

I ran the project's linter (`npm run lint`), which executed ESLint.
**The linter found 96 problems (49 errors, 47 warnings).**

- All 49 errors are potentially auto-fixable using `npm run lint -- --fix`.
- Most of the warnings are `react-hooks/exhaustive-deps` (missing dependencies in `useEffect` or `useCallback` hooks) and `react-refresh/only-export-components` (exporting non-components from files with components).
- **Recommendation:** Run the linter with the `--fix` flag to clean up the auto-fixable errors, and systematically address the `useEffect` dependency warnings to prevent potential stale closure bugs.

---

## 🌍 Deployment Process

The deployment process is configured to be straightforward and automated.

### Target Platforms

The application is primarily configured for **Netlify**, but also has a `.vercel` directory, indicating Vercel compatibility or past usage.

### Netlify Configuration (`netlify.toml`)

The application includes a `netlify.toml` file that defines the deployment behavior:

1. **Build Command:** `npm run build`
2. **Publish Directory:** `dist/client`
3. **Functions Directory:** `dist/server` (Configured for SSR/Serverless functions)
4. **Security Headers:** The deployment is hardened with strict security headers applied to all routes (`/*`):
   - `X-Frame-Options = "DENY"`
   - `X-Content-Type-Options = "nosniff"`
   - `X-XSS-Protection = "1; mode=block"`
   - `Referrer-Policy = "strict-origin-when-cross-origin"`
   - `Content-Security-Policy` to prevent XSS and clickjacking.
   - `Strict-Transport-Security` (HSTS) with preload enabled.
5. **Caching:** Aggressive caching is configured for assets (`/assets/*`) with `cache-control = "public, max-age=31536000, immutable"`.

### Deployment Flow

Based on the structure, the typical deployment flow would be:

1. Code is pushed to the main repository.
2. Netlify (or Vercel) triggers a build.
3. It installs dependencies (using `bun` based on `bun.lock` presence, or `npm`).
4. It executes `npm run build` (Vite build).
5. The `dist/client` folder is deployed to the CDN, and `dist/server` handles any server-side logic or API endpoints.

Database migrations and schema updates appear to be managed manually or via CI pipelines utilizing the root-level `.mjs` scripts (like `apply-final-migration.mjs`).

> [!TIP]
> The build passes successfully, which is great. To ensure long-term stability, I recommend running `npm run lint -- --fix` to clear the auto-fixable linting errors and addressing the remaining hook dependency warnings.
