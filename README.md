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

## Configuration Checklist

- [ ] `package.json` — name and dev port updated
- [ ] `.env.local` — Supabase and WorkOS keys configured
- [ ] `CLAUDE.md` — project name and description updated
- [ ] WorkOS redirect URI configured: `http://localhost:30XX/api/auth/callback`

## Supabase Mode

**Shared DB (Barcelos Platform):** Point `.env.local` at the shared Supabase project. Set a table prefix in `TABLE_PREFIX`.

**Standalone DB:** Create a new Supabase project and use its credentials.

See `boilerplate-guide.md` in `Projects/Tools/` for full documentation.
