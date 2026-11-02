# HubAIOps

HubAIOps: a HubSpot optimization agency site with an AI-readiness auditor and optimizer. It has three parts:

- **Case studies.** A filterable grid (industry, HubSpot product, AI use case) with a detail page for each study. Content lives in `content/case-studies/*.md`.
- **HubSpot Auditor.** A 30-question self-assessment, plus a read-only OAuth scan of a real portal. The scan measures 15 of the checks directly: lifecycle, owner and association coverage, duplicates, property sprawl, industry standardization, ICP fields, ticket pipelines, blog sources and workflow health.
- **AI optimizer and results page.** Claude turns the findings into a Do Now / Do Next / Do Later plan for each use case. The plan lands on a private, shareable results page with its own OG image. If Claude isn't available, a rubric-based plan is used instead.

The use cases covered are the data foundation, permissions and seats, brand voice and knowledge, the Customer Agent, the Prospecting Agent, the Content Agent, and governance and rollout. All of it is defined in `src/lib/audit/rubric.ts`.

## Run locally

```bash
npm install
cp .env.example .env.local   # every variable is optional for local dev
npm run dev                  # http://localhost:3000
```

Without `DATABASE_URL`, data is stored in `.data/db.json`. Without `ANTHROPIC_API_KEY`, results use the template plan. Draft case studies are shown in dev and hidden in production; `SHOW_DRAFTS` overrides this.

```bash
npm test          # vitest: scoring, detectors (fake HubSpot API), report schema, crypto, OAuth state
npm run typecheck
npm run lint
npm run build
```

## Two deployment modes

| Mode | Command | What runs | Host |
|---|---|---|---|
| Full app | `npm run build && npm start` | Everything: quiz, HubSpot scan, Claude plan, audits DB, admin | Any Node host (Vercel, Render, VPS) |
| Static site | `npm run build:static` → `.next-static/` | Home, use cases, case studies, and a gated `/audit` page ("sign-in only"). No server routes. | GitHub Pages via `.github/workflows/pages.yml` (push to `main`) |

The static build temporarily moves the server-only routes out of `src/` (see `scripts/static-build.mjs`), swaps in `src/app/audit/page.static.tsx`, and restores everything afterwards. GitHub Pages serves a project site under `/HubSpot`, so asset URLs go through `src/lib/asset.ts` and `NEXT_PUBLIC_BASE_PATH`. Repository variables `PAGES_BASE_PATH` (set to empty for a custom domain), `PAGES_SITE_URL`, `BOOKING_URL`, `CONTACT_EMAIL`, `APP_URL` (turns the "Sign in" button on) are read by the workflow. The first run needs GitHub Pages enabled with source "GitHub Actions" (Settings → Pages) if the workflow cannot enable it itself.

## Demo recording (portfolio assets)

With the app running locally (`npm run dev`), `set -a; . ./.env.local; set +a; npm run demo:record` records a full walkthrough (home → case studies → use case → audit → quiz → Claude results → admin) to `demo/hubaiops-demo.mp4` and full-page screenshots to `demo/screenshots/`. Set `ANTHROPIC_API_KEY` and `DATABASE_URL` in `.env.local` first so the recording shows the Claude-written plan and persistent audits; `ADMIN_PASSWORD` enables the admin page.

## Deploy (GitHub + Vercel)

1. **Database.** Create a Supabase project and copy the *transaction pooler* connection string (port 6543). Then run `DATABASE_URL=... npm run db:push`.
2. **Vercel.** Import this GitHub repo at vercel.com/new. The framework is detected automatically. Every PR gets a preview URL, and `main` deploys to production.
3. **Environment variables** (Vercel → Settings → Environment Variables):
   - `DATABASE_URL`, `ANTHROPIC_API_KEY`, `TOKEN_ENC_KEY` (`openssl rand -base64 32`), `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL=https://your-domain`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_BOOKING_URL`
   - Optional: `RESEND_API_KEY`, `EMAIL_FROM`
4. **HubSpot app**, which enables the live scan:
   1. Create a public app in a HubSpot developer account.
   2. Add the redirect URL `https://your-domain/api/hubspot/oauth/callback` (and the localhost one for dev).
   3. Required scopes: `oauth crm.objects.contacts.read crm.objects.companies.read crm.objects.deals.read crm.objects.owners.read crm.schemas.contacts.read crm.schemas.companies.read`.
   4. Optional scopes: `tickets automation content settings.users.read`.
   5. Set `HUBSPOT_CLIENT_ID`, `HUBSPOT_CLIENT_SECRET` and `HUBSPOT_REDIRECT_URI`.
5. **Domain.** In Vercel → Domains, add your custom domain.

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, tests and build on every PR.

## How the scan stays safe

- Only read scopes are requested, and the app never writes to the portal.
- Tokens are AES-256-GCM encrypted at rest and **deleted when the scan finishes**.
- Detectors store counts and percentages only. Claude receives aggregates, check titles and redacted ticket subjects, never contact records.
- The OAuth `state` is HMAC-signed and bound to the audit id.
- The scan runs one step per request, driven by the client, so each call stays well within serverless time limits.

## Case studies

- **Add one:** drop a Markdown file into `content/case-studies/` (copy an existing one for the frontmatter). Use `status: draft` until the client approves the numbers.
- **Representative engagements:** the shipped set is modelled on common HubSpot engagement types (pipeline cleanup, migrations, dedup + ERP sync, integrations, scoring, workflow repair, help desk, agent rollouts). They carry `sample: true` in frontmatter (no visible label). One footnote, `site.caseStudyDisclosure` in `src/config/site.ts`, appears under case-study pages; replace figures with real client numbers and set `sample: false` as you publish real work, then shorten or remove the footnote.
- **Engagement metadata:** `engagement` (type) and `duration` show in the detail-page sidebar.
- **Readiness metric:** `readiness: { before, after }` is HubAIOps' own metric, shown on every card and detail page.
- **Admin:** `/admin` uses HTTP basic auth (`ADMIN_PASSWORD`, any username). It lists leads and audits.

## Project map

```
src/lib/audit/rubric.ts      use cases + 30 checks (single source of truth)
src/lib/audit/score.ts       scoring, bands (0–2 strong, 3–6 notable, 7+ expert), quiz/scan merge
src/lib/audit/detectors.ts   HubSpot scan steps
src/lib/audit/service.ts     audit lifecycle (quiz, OAuth, chunked scan, analysis)
src/lib/ai/optimize.ts       Claude structured-output plan (+ fallback.ts)
src/lib/hubspot/*            OAuth, API client, token crypto
src/db/*                     Drizzle schema + Postgres / local-file store
src/app/audit/[id]           AI results landing page
content/case-studies/        case study Markdown
```
