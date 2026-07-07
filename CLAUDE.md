# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

This repo has two layers that are easy to conflate:

- **Root** — a self-hosted Supabase stack (Postgres, GoTrue, PostgREST, Realtime, Storage, Kong, Studio, etc.) defined entirely in `docker-compose.yml`. `volumes/` and `utils/` are fetched from the upstream Supabase repo via `setup.sh` — treat them as vendored, not hand-edited.
- **`web/`** — the actual product code: a Next.js 15 (App Router) + TypeScript + Tailwind v4 app. Nearly all Claude Code work happens here.

## Commands (run from `web/`)

```bash
yarn dev          # dev server on port 3001 (--turbopack)
yarn build        # production build
yarn start        # run production build
yarn lint         # next lint
```

There is no test runner configured in this project.

Full stack (Supabase + web in Docker) is started from the repo root with `docker compose up -d`; see `README.md` for first-time setup (`setup.sh`, `.env`, `utils/generate-keys.sh`). For iterating on the web app alone, run Supabase via Docker and `yarn dev` locally against it — the app needs `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `web/.env.local`.

## Auth architecture

Auth is Supabase Auth (GoTrue) via `@supabase/ssr`, wired through three clients that must all agree on the cookie name:

- `src/supabase/client.ts` — browser client (`createBrowserClient`)
- `src/supabase/server.ts` — server client for Server Components/Actions (`createServerClient`, cookie-backed)
- `src/supabase/proxy.ts` — the middleware's client, used to refresh the session and gate routes
- `src/supabase/const.ts` — defines `SUPABASE_COOKIE_NAME = 'sb-auth-token'`, a **fixed** cookie name shared by all three. Do not let this drift: `@supabase/ssr` otherwise derives the cookie name from each client's Supabase URL, and the browser (`localhost`) vs. server/Docker (`kong`) hostnames differ, which silently breaks session lookup.

`src/middleware.ts` delegates to `updateSession()` in `proxy.ts`, which:
- Calls `supabase.auth.getClaims()` immediately after client creation — nothing may run between client creation and this call (see comment in `proxy.ts`), or sessions can randomly drop.
- Redirects unauthenticated requests for routes matching `PROTECTED_PREFIXES` (currently `/profile`, `/dashboard`, `/debug*`) to `/auth/login?next=<path>`.
- Redirects authenticated users away from `/auth/login` and `/auth/register`.
- Sets `Cache-Control: private, no-store` on every response it touches.

When adding a new protected route, add its prefix to `PROTECTED_PREFIXES` in `proxy.ts` — the route group name (`(protected)`) does not enforce this by itself.

Server-side auth checks in components use `useServerAuth()` (`src/supabase/auth-server.ts`). Client-side, wrap consumers in `SupabaseAuthProvider` (already mounted in the root layout) and use `useSupabaseUser` / `useSupabaseAuth`, or the `<Authenticated>` / `<Unauthenticated>` conditional-render components (`src/supabase/auth-client.tsx`).

`src/app/api/auth/[...all]/` currently exists but is empty — not a live route.

## App Router structure

Route groups under `src/app/`:
- `(home)` — public landing page
- `(protected)` — dashboard, profile, debug pages; wrapped in `MasterDefault` layout
- `auth/` — login, register, reset, error, and the OAuth `callback/route.ts`
- `debug/` — scratch pages for exercising components (list-load, list-static) — a pattern to copy when prototyping a new widget in isolation
- `(_sample)` — sample/reference implementation, not routed (leading underscore)

Route metadata (path, label, icon) is centralized in `src/settings/routes.tsx` as the `ROUTES` map — pages don't hardcode paths/labels, they reference `ROUTES.X`. Sidebar navigation trees are built from this map via `CTree` (`src/utils/tree.ts`) in `src/settings/menu.tsx`, then rendered by `src/components/layout/menu.tsx`. To add a nav entry: add it to `ROUTES`, then `menuLeft.insert(...)` it into the tree.

## Layout system

`src/components/layout/layout.tsx` composes the page shell: resizable `SidebarLeft`/`SidebarRight` (state persisted via cookies, e.g. `menu-left`, `menu-left_width`, read in the root `layout.tsx` and passed down as initial props to avoid layout flash) around a `Header`/`main`/`Footer` stack. Sidebars only render their content when `useServerAuth()` reports an authenticated user.

`src/components/layout/master.tsx` provides page-level content wrappers (`MasterDefault`, `MasterCenter`, `MasterSeparator`) used inside route group layouts (e.g. `(protected)/layout.tsx` just wraps `children` in `MasterDefault`).

`src/components/layout/widget.tsx` defines the `Widget`/`WidgetHeader`/`WidgetTitle`/`WidgetContent` primitives used to build dashboard cards — most feature UI (debug widgets, profile widget, chart widgets) is composed from these rather than raw markup.

## Component conventions

- `src/components/ui/` — shadcn-style primitives wrapping Radix UI (button, dialog, select, etc.), styled via `class-variance-authority` + Tailwind and the `cn()` helper (`src/utils/cn.ts`).
- `src/components/domains/<domain>/` — feature-specific components grouped by domain (`auth`, `profile`), e.g. `form-login.tsx`, `widget-login.tsx`. Follow this domain grouping for new features rather than a flat `components/` dump.
- `src/components/charts/` — D3-based chart primitives.
- Theming uses CSS variables (`--color-*`, HSL-based) defined in `globals.css` and mapped into Tailwind's `@theme`; dark mode via `next-themes` using the `class` strategy. Reuse existing tokens (`primary`, `destructive`, `success`, `warning`, `info`, `chart-1..3`, etc.) instead of introducing new colors.

## Style

- Prettier is authoritative (`web/.prettierrc.js`): single quotes, semicolons, 100-char width, trailing commas (es5), 2-space indent. Run through your editor/`next lint`, don't hand-format.
- Path alias `@/*` → `web/src/*` (see `tsconfig.json`).
