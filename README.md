# KinConnect

Von Rosenberg family reunion registration platform — registration, schedule, announcements, and admin tools.

**Repository:** [LTapia03/KinConnect](https://github.com/LTapia03/KinConnect)

## Stack

- **Web:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Shared:** `@von-rosenberg/shared` — Zod schemas, types, pricing constants
- **Package manager:** pnpm workspaces

## Prerequisites

- Node.js 22+ (matches CI)
- [pnpm](https://pnpm.io/) 9+

## Local development

```bash
pnpm install
cp .env.example apps/web/.env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The `dev` script builds `@von-rosenberg/shared` before starting Next.js so workspace imports resolve to `dist/`.

### Environment variables

Copy `.env.example` to `apps/web/.env.local` and fill in values when integrating Supabase (future tickets):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin operations (never expose to the client) |
| `RESEND_API_KEY` | Transactional email (future tickets) |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Build shared package and start Next.js dev server |
| `pnpm build` | Build shared package and web app |
| `pnpm lint` | ESLint across workspaces |
| `pnpm test` | Vitest with coverage |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check |

## Project layout

```
apps/web/              Next.js web application
packages/shared/       Shared Zod schemas, types, constants
```

Supabase migrations, RLS policies, and seed data are added in [SCRUM-8](https://luistapia03.atlassian.net/browse/SCRUM-8).

## Jira

Phase 1 foundation epic: [SCRUM-5](https://luistapia03.atlassian.net/browse/SCRUM-5)

- [SCRUM-6](https://luistapia03.atlassian.net/browse/SCRUM-6) — Monorepo scaffold
- [SCRUM-8](https://luistapia03.atlassian.net/browse/SCRUM-8) — Supabase schema, RLS, seed data
