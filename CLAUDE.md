# [App Name]

## Overview
Internal operational app built from `orb-internal-boilerplate`.

## Tech Stack
- Next.js 16, React 19, TypeScript 5 (strict)
- Tailwind CSS 4, shadcn/ui, @tabler/icons-react
- WorkOS SSO authentication
- Supabase (shared Barcelos DB or standalone)
- TanStack Query + Table, Recharts, Sonner

## Project Structure
- `src/app/` — App Router pages and API routes
- `src/components/` — UI components (shadcn in ui/, layout/, shared/, data/)
- `src/lib/` — Auth helpers, Supabase clients, utilities
- `src/lib/email/` — Resend email client and template helpers
- `src/lib/upload/` — S3-compatible presigned URL generation
- `src/lib/pdf/` — PDF generation with @react-pdf/renderer
- `src/lib/audit/` — Audit logging to Supabase
- `src/lib/rate-limit.ts` — Upstash rate limiting helpers
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions
- `src/providers/` — React context providers
- `src/__tests__/` — Vitest + Testing Library tests
- `supabase/migrations/` — SQL migrations (audit_logs, etc.)

## Auth Pattern
- WorkOS SSO via cookies (workos_session + user_email)
- Use `getCurrentUser()` / `requireUser()` from `@/lib/auth/workos-auth`
- Middleware redirects unauthenticated users to /login
- All dashboard routes are protected

## Supabase Pattern
- Browser client: `@/lib/supabase/client` (client components)
- Server client: `@/lib/supabase/server` (server components, actions)
- Admin client: `@/lib/supabase/admin` (API routes, service role)
- Always filter queries by `organization_id` for multi-tenancy

## Additional Features
- **CI/CD** — GitHub Actions pipeline (lint, type-check, test, build) in `.github/workflows/ci.yml`
- **Testing** — Vitest + Testing Library; run `npm test` or `npm run test:watch`
- **Rate Limiting** — Upstash Redis rate limiter; see `src/lib/rate-limit.ts`
- **Email** — Resend client with template helpers; see `src/lib/email/`
- **Error Tracking** — Sentry integration (client, server, edge configs at project root)
- **File Upload** — S3-compatible presigned uploads; see `src/lib/upload/` and `src/components/shared/file-upload.tsx`
- **Cron Jobs** — Vercel Cron setup in `vercel.json`; example handler at `src/app/api/cron/`
- **PDF Generation** — @react-pdf/renderer; see `src/lib/pdf/` and `src/app/api/reports/`
- **Audit Logging** — Supabase audit_logs table; see `src/lib/audit/logger.ts` and `supabase/migrations/`
- **PWA** — Progressive Web App via @ducanh2912/next-pwa; manifest at `public/manifest.json`

## Conventions
- Use `@/*` path aliases (maps to `./src/*`)
- Use `"use client"` only where needed
- Use `cn()` from `@/lib/utils` for conditional classes
- Icons from `@tabler/icons-react`
- Toasts via `sonner` (toast function)
- Dark mode via `next-themes` (works out of the box)

## Do Not
- Use `pages/` router
- Install competing UI libraries
- Create Supabase clients inline
- Hardcode organization/tenant IDs
- Put secrets in code
- Use `@supabase/supabase-js` directly for SSR (use `@supabase/ssr`)
- Install `framer-motion` (use `motion` package instead)
