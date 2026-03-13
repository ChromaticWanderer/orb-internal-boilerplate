# Orb Internal Boilerplate

Boilerplate template for internal operational apps (admin dashboards, franchise tools, etc.).

## Quick Start

```bash
# 1. Clone the boilerplate
cp -r Projects/Tools/orb-internal-boilerplate Projects/Apps/my-new-app

# 2. Clean git and initialize
cd Projects/Apps/my-new-app
rm -rf .git
git init

# 3. Install dependencies
npm install

# 4. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase and WorkOS credentials

# 5. Update package.json
# Change "name" and dev port (-p 30XX)

# 6. Start development
npm run dev
```

## Included Features

| Feature | Description | Config Required |
|---------|-------------|-----------------|
| CI/CD | GitHub Actions pipeline (lint, type-check, test, build) | Add secrets to GitHub repo |
| Testing | Vitest + Testing Library (`npm test`) | None |
| Rate Limiting | Upstash Redis sliding window | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Email | Resend with welcome, notification, password reset templates | `RESEND_API_KEY`, `EMAIL_FROM` |
| Error Tracking | Sentry (client, server, edge) | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` |
| File Upload | S3-compatible presigned URL uploads with drag-and-drop UI | `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT` |
| Cron Jobs | Vercel Cron with example daily cleanup | `CRON_SECRET` |
| PDF Generation | @react-pdf/renderer with example report template | None |
| Audit Logging | Supabase audit_logs table with RLS | Run migration in `supabase/migrations/` |
| PWA | Progressive Web App support | Add icon files to `public/icons/` |

## Configuration Checklist

- [ ] `package.json` — name and dev port updated
- [ ] `.env.local` — Supabase and WorkOS keys configured
- [ ] `CLAUDE.md` — project name and description updated
- [ ] WorkOS redirect URI configured: `http://localhost:30XX/api/auth/callback`
- [ ] `public/manifest.json` — app name and theme color updated
- [ ] `public/icons/` — add icon-192x192.png and icon-512x512.png
- [ ] Optional: configure Sentry, Resend, Upstash, S3 env vars in `.env.local`
- [ ] Optional: run `supabase/migrations/00001_audit_logs.sql` against your database

## Supabase Mode

**Shared DB (Barcelos Platform):** Point `.env.local` at the shared Supabase project. Set a table prefix in `TABLE_PREFIX`.

**Standalone DB:** Create a new Supabase project and use its credentials.

See `boilerplate-guide.md` in `Projects/Tools/` for full documentation.
