# KinConnect

Von Rosenberg family reunion registration platform — registration, schedule, announcements, and admin tools.

**Repository:** [LTapia03/KinConnect](https://github.com/LTapia03/KinConnect)

## Stack

- **Web:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Shared:** `@von-rosenberg/shared` — Zod schemas, types, pricing constants
- **Database:** Supabase (PostgreSQL, Auth, RLS)
- **Package manager:** pnpm workspaces

## Prerequisites

- Node.js 22+ (matches CI)
- [pnpm](https://pnpm.io/) 9+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local database)

## Local development

```bash
pnpm install
cp .env.example apps/web/.env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The `dev` script builds `@von-rosenberg/shared` before starting Next.js so workspace imports resolve to `dist/`.

### Environment variables

Copy `.env.example` to `apps/web/.env.local` and fill in values from your Supabase project dashboard:

| Variable                        | Purpose                                                   |
| ------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key                                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-side admin operations (never expose to the client) |
| `RESEND_API_KEY`                | Transactional email (future tickets)                      |

### Supabase local setup

```bash
supabase start
supabase db reset
```

Migrations live in `supabase/migrations/`. Seed data loads from `supabase/seed.sql`.

Run `supabase status` to copy local API URL and anon key into `.env.local`.

### Promote an admin user

1. Sign up through Supabase Auth with `first_name`, `last_name`, and `phone` in user metadata.
2. Run in the SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'your-admin@example.com'
);
```

Replace `your-admin@example.com` with the admin email address.

### Verify RLS policies

See `supabase/scripts/test-rls.sql` for a manual checklist covering registrant isolation, role-escalation prevention, public schedule reads, and admin-only writes.

## Scripts

| Command             | Description                                       |
| ------------------- | ------------------------------------------------- |
| `pnpm dev`          | Build shared package and start Next.js dev server |
| `pnpm build`        | Build shared package and web app                  |
| `pnpm lint`         | ESLint across workspaces                          |
| `pnpm test`         | Vitest with coverage                              |
| `pnpm format`       | Prettier write                                    |
| `pnpm format:check` | Prettier check                                    |

## Project layout

```
apps/web/              Next.js web application
packages/shared/       Shared Zod schemas, types, constants
supabase/migrations/   SQL migrations and RLS policies
supabase/seed.sql      Sample schedule events and announcements
```

## Jira

Phase 1 foundation epic: [SCRUM-5](https://luistapia03.atlassian.net/browse/SCRUM-5)

- [SCRUM-6](https://luistapia03.atlassian.net/browse/SCRUM-6) — Monorepo scaffold
- [SCRUM-8](https://luistapia03.atlassian.net/browse/SCRUM-8) — Supabase schema, RLS, seed data
