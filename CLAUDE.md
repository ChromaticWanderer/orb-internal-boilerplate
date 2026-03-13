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
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions
- `src/providers/` — React context providers

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
