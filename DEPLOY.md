# Deploying HubAIOps to Vercel

The site is a Next.js 15 app with server routes (HubSpot OAuth, scan API, Claude optimizer, audit storage), so it needs a Node host. Vercel's free Hobby plan covers it. Production deploys from `main`; every pull request gets a preview URL.

## What Claude can do through the Vercel MCP

The official Vercel MCP (`https://mcp.vercel.com`) is registered for this project in Claude Code. Once authenticated it can list teams and projects, create and configure the project, set environment variables, trigger and inspect deployments, read build and runtime logs, and manage domains.

**You authenticate once:**

1. In Claude Code, type `/mcp`, choose **vercel**, and finish the sign-in in the browser.
2. Grant access to the team (your personal account counts as a team) that should own the project.
3. If the Vercel tools don't appear afterwards, restart Claude Code in this folder.

The connection has the same rights as your Vercel account, so review each write before approving it.

## What only you can provide

| Item | Where to get it | How to hand it over |
|---|---|---|
| GitHub ↔ Vercel link | vercel.com → Add New → Project → Import `DavitGadyan/HubSpot` (installs the Vercel GitHub app on first use) | Do this once in the dashboard; after that pushes to `main` deploy automatically. Claude can create the project via MCP instead, but the GitHub app install still happens in the browser. |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys | Add it in Vercel → Project → Settings → Environment Variables (keeps the secret out of chat). |
| `DATABASE_URL` | supabase.com → New project → Connect → **Transaction pooler** URI (port 6543) | Add to Vercel as above, and put the same line in a local `.env.local` so Claude can run `npm run db:push` to create the tables. Without it the app still runs, but audits live in ephemeral `/tmp` storage. |
| `TOKEN_ENC_KEY`, `ADMIN_PASSWORD` | `openssl rand -base64 32` | Add in Vercel. |
| HubSpot app (optional, enables the live scan) | developers.hubspot.com → Apps → Create public app | Redirect URL: `https://<your-domain>/api/hubspot/oauth/callback`. Scopes are listed in the README. Add `HUBSPOT_CLIENT_ID`, `HUBSPOT_CLIENT_SECRET`, `HUBSPOT_REDIRECT_URI` in Vercel. |
| Custom domain | Your registrar | Tell Claude the domain; it adds it to the project and reports the DNS records to set. |

Non-secret variables Claude sets via MCP: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_BOOKING_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `SHOW_DRAFTS=false`, `ANTHROPIC_MODEL`.

## Order of operations

1. You: `/mcp` → authenticate Vercel. Import the repo once in the dashboard (or ask Claude to create the project).
2. Claude: set the non-secret env vars, trigger a production deploy from `main`, read the build log, open the deployment URL and smoke-test `/`, `/case-studies`, `/audit`, the quiz and a results page.
3. You: add `ANTHROPIC_API_KEY` (and `DATABASE_URL` when ready) in Vercel. Claude redeploys and verifies the results page shows "Plan written by Claude".
4. Optional: HubSpot app, custom domain, Resend email (`RESEND_API_KEY`, `EMAIL_FROM`).

## Fallback without the MCP

`npx vercel login` then `npx vercel link` and `npx vercel --prod` from this folder. A `VERCEL_TOKEN` (vercel.com/account/tokens) in the environment lets Claude run those non-interactively.

## GitHub Pages?

Not for this app. Pages serves static files only; it cannot run the OAuth callback, the scan API, the Claude call, or store audits. A static export would keep only the marketing pages and a browser-scored self-assessment.
