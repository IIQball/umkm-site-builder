# Tech — Architecture

Status: LOCKED

Stack is locked in `../../AGENTS.md` §3. This file records how it is wired **in this project**, and every preflight decision.

## 1. Preflight decisions (LOCKED once answered)

| Gate | Decision | Reason | Date |
|---|---|---|---|
| G1 database (D1 / Neon / Supabase) | Neon PostgreSQL Serverless | Read-heavy workload, persistent state, Serverless Driver for Edge compatibility | 2026-08-14 |
| G2 icon pack | Lucide | 400+ icons, tree-shakeable, excellent Svelte support, modern aesthetic | 2026-08-14 |
| G3 `vp` / Vite Plus — verified? | Plain Vite + Bun scripts | Explicit control, stable ecosystem, fewer dependencies; Vite Plus deferred | 2026-08-14 |
| G4 git mode (strict / light) | Strict | main protected, dev integration, PR-only with sign-off; professional team workflow | 2026-08-14 |
| G7 media storage (Cloudinary / R2 / R2+Images) | Cloudinary Free Tier | On-the-fly WebP conversion, resizing, <5GB/year fits Free Tier (25 credits/month) | 2026-08-14 |

### G1 detail — database

**Chosen:** Neon PostgreSQL Serverless
**Decided:** 2026-08-14 · **Procedure:** `.agents/rules/70-database-selection.md`

**PRD signals that drove it:**
- Read-heavy (platform renders public store pages 90% of traffic)
- <5GB storage after 1 year
- Simple schema (no graph/nested queries required)
- No realtime features (refresh-to-see-changes acceptable)
- Multitenancy via tenant_id foreign key (simple row-level filtering)
- Serverless workload (Cloudflare Edge)

**Ceiling accepted:**
- Neon Free Tier: 10 projects, 5GB storage, 0.25 GB RAM, no SLA
- Serverless Driver uses HTTP/WebSocket (no persistent TCP), ~10ms latency overhead per query
- Connection pooling is managed by Neon; no raw connection pool config available
- Cold starts may add 1-2s to first request after idle period (acceptable for MVP)

**Runner-up and flip condition:**
- Supabase was runner-up (includes auth, realtime, storage). Would flip if: realtime features added, >5GB data needed within 6 months, or need for Supabase's built-in auth APIs (we chose BetterAuth instead)
- D1 was rejected: SQLite doesn't scale to multitenancy well; schema migrations and backups are harder

**Limits verified on 2026-08-14, from Neon official docs:**

| Limit | Value |
|---|---|
| Free Tier storage | 3 GB (upgraded to 5 GB with verified email) |
| Connections | 100 concurrent connections |
| Read replicas | 1 |
| Logical replication | Available (for backups) |
| Serverless Driver requests/month | Unlimited |
| Cold start time | 0-5s depending on idle duration |

**How it connects:**
- Drizzle ORM + Neon Serverless Driver
- Connection string: `postgresql://<user>:<password>@<neon-host>/dbname`
- Environment variable: `DATABASE_URL` in `.env.local` (production uses Cloudflare Workers Secrets)
- Driver mode: `@neondatabase/serverless` (HTTP polling, no TCP)

**Migrations:**
- Generated: `bun run drizzle-kit generate` (schema → SQL)
- Applied locally: `bun run drizzle-kit push` (direct to Neon branch)
- Applied to production: Manual review required; run via GitHub Actions on merge to main (not auto-applied)
- Schema version tracked in Drizzle metadata; rollback via git history + manual SQL

**Local development:**
- Each developer uses own Neon branch (Neon branching feature for free)
- Branch is auto-deleted after 7 days if no activity (acceptable; recreate by pushing schema again)
- Seed data via `bun run seed` (calls Drizzle + custom scripts)
- Backup: Use `pg_dump` via Neon's psql CLI or export from Neon dashboard

### G7 detail — media storage

**Chosen:** Cloudinary Free Tier
**Decided:** 2026-08-14 · **Procedure:** `.agents/rules/71-media-selection.md`

**PRD signals that drove it:**
- Images need on-the-fly resizing (2-3 sizes: thumbnail, card, hero)
- Auto-convert to WebP for compression
- <5GB after 1 year (lightweight workload)
- Public uploads (no private auth needed)
- Transform cost is main constraint; Cloudinary Free Tier: 25 credits/month

**Ceiling accepted:**
- Free Tier limited to 25 credits/month; each transformation costs ~0.1-0.5 credits depending on complexity
- Limit: ~50-100 images with multiple transformations per month (acceptable for MVP)
- No video support (out of scope per PRD)
- Soft delete sync: if image is deleted in DB, backend must call Cloudinary API to delete file (extra API calls)
- Hard delete on upload failure: if Cloudinary succeeds but DB save fails, image must be rolled back (no orphan files)

**Limits verified on 2026-08-14, from Cloudinary official docs:**

| Limit | Value |
|---|---|
| Free Tier storage | 25 GB (but credits limited) |
| API calls per hour | 500 (sufficient for MVP) |
| Transformation credits/month | 25 |
| Fetch delivery | Unlimited (CDN included) |
| Bandwidth | 25 GB/month (Free Tier) |
| Supported formats | JPG, PNG, WebP, GIF, PDF, etc. |
| Auto-optimization | Available (WebP conversion) |

**Service module:** `src/services/media.ts`
- Single entry point for all image reads and writes
- Handles: signed uploads, transformations, deletions, sync logic
- No component builds Cloudinary URLs directly

**Reference shape stored in the database:**

```sql
-- columns on images/media table
provider: 'cloudinary'                      -- always 'cloudinary'
provider_key: 'v1234/ufmbnca5n4bnab'        -- Cloudinary public_id
version: 1                                  -- For future provider migration
dimensions: { width: 1920, height: 1080 }   -- Captured at upload
alt_text: 'Product photo'                   -- User-provided accessibility
size_bytes: 201024                          -- Final WebP size
deleted_at: null                            -- Soft delete timestamp
```

**Variant set:** The defined list of sizes/formats

| Variant | Use case | Transformation | Cost |
|---|---|---|---|
| `thumbnail` | Directory cards, thumbnails | `w_200,h_200,c_fill,f_webp` | ~0.2 credits |
| `card` | Product cards, store cards | `w_400,h_300,c_fill,f_webp` | ~0.3 credits |
| `hero` | Hero sections, banners | `w_1200,h_600,c_fill,f_webp` | ~0.4 credits |
| `original` | Download/backup | `f_webp` (no resize) | ~0.1 credits |

**Upload flow:**

1. Client submits file (JPG/PNG, <5MB) — client-side validation
2. Server generates signed upload URL from Cloudinary (includes auth + folder path)
3. Client uploads directly to Cloudinary (not through our servers)
4. Cloudinary returns public_id and metadata
5. Server saves reference to database (transaction):
   - If DB save succeeds: done
   - If DB save fails: immediately call Cloudinary API to delete file (hard delete, rollback)
6. Client receives confirmation; media is live

**Soft delete sync:** When image record is soft-deleted (deleted_at timestamp set), background job calls Cloudinary API to hard-delete the file (prevents orphans).

### G2 detail — icon pack

**Package:** `lucide-svelte`
**Import path:** `import { IconName } from 'lucide-svelte'`
**Usage:** Icons are sized and colored via CSS variables.

```svelte
<script>
  import { ShoppingCart, Heart } from 'lucide-svelte';
</script>

<ShoppingCart size={24} strokeWidth={1.5} class="text-primary" />
```

Sizes: 16px (inline text), 24px (buttons), 32px (section headers), 48px (hero icons).
Colors: All icons inherit text color from CSS var `--icon-color` (default `currentColor`).

---

## 2. Rendering model

Which routes are static, which are server-rendered, and which carry a Svelte island.
Every `client:*` directive is a deliberate cost — list them and why.

| Route | Rendering | Islands | Why |
|---|---|---|---|
| `/` (homepage) | SSR | `<DirectorySearch client:idle />` | Search UI is interactive; defer to idle for performance |
| `/[subdomain]/` (store) | SSR | `<StoreBuilder client:load />` (tenant only), `<ProductBuyButton client:load />` (buyer) | Subdomain detection + rendering happens server-side; islands for interactivity |
| `/[subdomain]/builder` | SSR + hydrate | Full page is interactive island | Builder must be interactive; client-side state, real-time preview |
| `/tenant/dashboard` | SSR | `<PaymentWidget client:load />`, `<TemplateGrid client:idle />` | Minimal interactivity; defer grid loading |
| `/designer/builder` | SSR + hydrate | Full page is interactive island | Visual builder requires client-side state and instant feedback |
| `/admin/dashboard` | SSR | `<DataTable client:load />`, `<MetricsChart client:idle />` | Tables are interactive (sort, filter); charts load after table |
| `/.well-known/*` | Static | None | Cloudflare SSL, BetterAuth routes |

---

## 3. Folder structure

```
src/
  pages/                         # Astro routes (file-based routing)
    index.astro                  # Homepage + directory
    [subdomain].astro            # Store subdomain routing (catch-all)
    auth/
      setup-password.astro
      login.astro
    tenant/
      dashboard.astro
      builder/[templateId].astro
    designer/
      dashboard.astro
      builder/[templateId].astro
    admin/
      dashboard.astro
      tenants.astro
      templates.astro
  
  components/
    public/                       # Homepage + store pages
      DirectorySearch.svelte
      StoreCard.svelte
      ProductCard.svelte
    admin/                        # Admin dashboard components
      TenantTable.svelte
      PaymentsList.svelte
    shared/                       # Used across multiple roles
      Button.svelte
      Modal.svelte
      Toast.svelte
      FormField.svelte
  
  lib/
    auth/                         # BetterAuth setup, session validation
      index.ts
      middleware.ts
    routes/                       # API route handlers
      auth.ts                     # POST /api/auth/*
      webhooks.ts                 # POST /api/webhooks/xendit
    db/                           # Drizzle setup
      client.ts                   # Single Drizzle client instance
      schema.ts                   # Tables + types
    errors/                       # Error handling
      handler.ts                  # Unified error responder
      codes.ts                     # Error code constants
  
  services/
    media.ts                      # Cloudinary uploads, transformations, deletes
    payment.ts                    # Xendit payment + webhook verification
    store.ts                      # Store config, rendering
    user.ts                        # User queries, auth logic
  
  types/
    api.ts                        # Unified API response shape
    db.ts                         # Database entity types (from Drizzle)
    user.ts                       # User, Session, roles
    store.ts                      # Store, Template, Product
    media.ts                      # Image, media references
  
  db/
    schema.ts                     # Drizzle ORM schema
    migrations/                   # SQL migration files (auto-generated)
  
  styles/
    global.css                    # CSS variables, base tokens, daisyUI overrides
```

Rules that govern this: `../../AGENTS.md` §4.

---

## 4. Data layer

- **Drizzle client creation:** `src/lib/db/client.ts` — single instance, reused across handlers
- **Single path application queries take:** All queries go through Drizzle ORM; no raw SQL except migrations
- **Two-layer authorization:**
  - Middleware layer (before handler): Validate user is logged in, has correct role
  - Data layer (inside handler): Drizzle query filtered by `tenant_id`, `user_id`, or `permission` (row-level)
- **Migrations:**
  - Generated: `bun run drizzle-kit generate` (compares schema.ts to remote DB)
  - Applied locally: `bun run drizzle-kit push` (Neon branch)
  - Applied to production: Manual trigger via GitHub Actions; requires review + approval

---

## 5. Auth

**BetterAuth setup:**

```ts
// src/lib/auth/index.ts
import { betterAuth } from "better-auth";
import { neonHttp } from "@neondatabase/serverless";

export const auth = betterAuth({
  database: neonHttp(process.env.DATABASE_URL!),
  secret: process.env.BETTER_AUTH_SECRET!,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "tenant", // superadmin, admin, designer, tenant
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // Refresh after 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes in memory
    },
  },
});
```

**Route guards:**
- All protected routes check session via middleware (`src/lib/auth/middleware.ts`)
- Unauthorized request: return 403 Forbidden with error code
- Missing session: redirect to `/auth/login`
- Wrong role: return 403 Forbidden (authorization, not authentication)

**Cookie settings:**
- Secure, HttpOnly, SameSite=Lax (default BetterAuth)
- Domain: `.domain.com` (shared across subdomains for tenant/designer access)

---

## 6. Environments

| Environment | Host | Database | Notes |
|---|---|---|---|
| local | `localhost:3000` | Neon branch (`main_dev_<userid>`) | Developer's personal branch; auto-reset OK |
| preview | `*.netlify.app` or `*.vercel.app` | Neon `preview` branch (dedicated) | Staging deployments from feature branches; reset weekly |
| production | `domain.com` + `*.domain.com` | Neon `main` branch (production) | Never reset; backups automated daily |

---

## 7. External services

| Service | Used for | Keys needed | Failure mode |
|---|---|---|---|
| Neon PostgreSQL | Database | `DATABASE_URL` | If unavailable: all queries fail; return 503 Service Unavailable |
| Cloudinary | Image storage + transformation | `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET` | If unavailable: uploads blocked; reads use CDN fallback cache; queue retries |
| Xendit | Payment (inbound) + payouts (outbound) | `XENDIT_API_KEY`, `XENDIT_WEBHOOK_SECRET` | If unavailable: payment UI shows "Service temporarily unavailable"; webhook retries from Xendit |
| BetterAuth | Authentication | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET` | If unavailable: OAuth login blocked; email/password login works (if DB accessible) |
| Cloudflare | DNS, CDN, Workers (deployment) | `CLOUDFLARE_API_TOKEN` (for CI/CD) | If unavailable: site goes offline; manual failover via Netlify/Vercel (backup deploy target) |

---

## 8. Cross-cutting

**Response shape and error codes:**
All API responses use unified shape from `src/types/api.ts`:
```ts
{ ok: true, data: T }
{ ok: false, error: { code: string, message: string } }
```

Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `DUPLICATE_KEY`, `PAYMENT_FAILED`, etc.
See `src/lib/errors/codes.ts` for full list.

**Logging tags per module:**
- `[AUTH]` — authentication, session, BetterAuth events
- `[STORE]` — store rendering, config loading
- `[PAYMENT]` — Xendit webhook, payment verification
- `[MEDIA]` — Cloudinary uploads, deletions, sync
- `[DB]` — database errors, query logs
- `[API]` — request/response logging

All logs include: timestamp, tag, operation (verb), result (success/failure), error stack (server-side only).

**Where shared config lives:**
- Build config: `astro.config.mjs`
- Environment vars: `.env.local` (dev), `.env.production` (committed template, no secrets)
- Feature flags: `src/lib/config/features.ts` (opt-in, gated by role + deployment)

---

## 9. Known constraints and gotchas

1. **Neon cold starts:** First request after 5+ minutes idle may take 1-5s. Acceptable for MVP. Mitigate: Cloudflare caching, keep-alive pings in CI.
2. **Subdomain routing via host header:** Every store request queries DB. Acceptable because workload is read-heavy and cache hit rate will be high (same tenant visited repeatedly). If SLA violated, migrate to static generation per tenant.
3. **Builder state is client-side only (no auto-save):** Users can lose work if browser crashes. Accepted trade-off for simplicity. Future: IndexedDB persistence.
4. **Cloudinary Free Tier credit limit:** Once 25 credits exhausted, all transformations fail silently. Monitoring is critical. Alert Admin when 80% spent.
5. **Payment idempotency via unique constraint:** If webhook delivery fails after 3 retries, manual intervention required. Acceptable; status quo per payment industry standards.
6. **Tenant cannot change subdomain after Admin setup:** If business name changes, new subdomain required (breaking change). Document clearly. Future: alias domains.
7. **No persistent undo/redo in builder:** Each Save overwrites previous version. Acceptable for MVP. Future: version history with revert.
8. **Soft delete sync is eventual consistent:** If DB soft-delete succeeds but Cloudinary delete API fails, orphan files may accumulate. Monitor and clean up weekly via cron job.