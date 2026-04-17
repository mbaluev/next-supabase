# next-supabase

A production-ready skeleton that bundles a **Next.js 15** application with a fully **self-hosted Supabase** stack, all orchestrated via a single `docker-compose.yml`.

## What's included

| Layer | Details |
|-------|---------|
| **Next.js app** (`web/`) | App Router, TypeScript, Tailwind CSS v4, `@supabase/ssr` |
| **Supabase** | PostgreSQL 15, Auth (GoTrue), PostgREST, Realtime, Storage, Edge Functions, Studio, Kong API Gateway, Supavisor pooler, Logflare analytics, Vector, imgproxy |
| **Docker** | Multi-stage Next.js Dockerfile (`standalone` output), single compose file for all services |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2+
- [Git](https://git-scm.com/)
- (Optional) Node.js 22+ for local `web/` development without Docker

## Quick start

```bash
# 1. Clone the repo
git clone <your-repo-url> next-supabase
cd next-supabase

# 2. Fetch Supabase config files (volumes/ and utils/)
sh setup.sh

# 3. Create your environment file and configure secrets
cp .env.example .env

# 4. Generate secure secrets (recommended)
sh ./utils/generate-keys.sh

# 5. Start everything
docker compose up -d
```

After a minute or two all containers should be healthy:

```bash
docker compose ps
```

## Accessing services

| Service | URL |
|---------|-----|
| **Next.js app** | [http://localhost:3000](http://localhost:3000) |
| **Supabase Studio** | [http://localhost:8000](http://localhost:8000) |
| **REST API** | `http://localhost:8000/rest/v1/` |
| **Auth API** | `http://localhost:8000/auth/v1/` |
| **Realtime** | `http://localhost:8000/realtime/v1/` |
| **Storage** | `http://localhost:8000/storage/v1/` |

Studio requires login with `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` from your `.env`.

## Project structure

```
next-supabase/
├── docker-compose.yml        # All services: Supabase + Next.js
├── .env.example              # Environment variables template
├── setup.sh                  # Fetches Supabase configs from official repo
├── web/                      # Next.js application
│   ├── Dockerfile            # Multi-stage production build
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── middleware.ts     # Auth token refresh
│   │   └── lib/supabase/     # Browser & server client utilities
│   └── ...
├── volumes/                  # Supabase service configs (fetched by setup.sh)
└── utils/                    # Supabase helper scripts (fetched by setup.sh)
```

## Local development (Next.js only)

If you want to iterate on the Next.js app without rebuilding the Docker image:

```bash
cd web
yarn install
cp ../.env .env.local   # or create a .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
yarn dev
```

Make sure the Supabase stack is running (`docker compose up -d` from the project root, excluding the `web` service if desired).

## Configuring secrets

**Do not use the default placeholder values in production.**

At minimum you must change:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY` (use `sh ./utils/generate-keys.sh`)
- `DASHBOARD_PASSWORD`
- `SECRET_KEY_BASE`, `VAULT_ENC_KEY`, `PG_META_CRYPTO_KEY`
- `LOGFLARE_PUBLIC_ACCESS_TOKEN`, `LOGFLARE_PRIVATE_ACCESS_TOKEN`

See the [Supabase self-hosting docs](https://supabase.com/docs/guides/self-hosting/docker#configuring-and-securing-supabase) for the full list.

## Stopping and resetting

```bash
# Stop all services
docker compose down

# Stop and remove all data (destructive!)
docker compose down -v
rm -rf volumes/db/data volumes/storage
```

## Updating Supabase

Re-run `setup.sh` to pull the latest config files, then update image tags in `docker-compose.yml` as needed:

```bash
sh setup.sh
docker compose pull
docker compose down && docker compose up -d
```

## License

MIT
