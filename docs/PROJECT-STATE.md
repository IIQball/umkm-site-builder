# PROJECT STATE — Live Checkpoint

Status: LIVE · Updated: 2026-08-20 by auth-integration-dashboard-shell session

The handoff file between sessions. Read it second, right after `README.md`. Update it at
the end of every session that changed anything — this is part of the definition of done.

Keep it short and current. This is a checkpoint, not a changelog.

---

## Where the work stands

Visual Template Builder complete with Global Design System (Deselect / Root context), Figma-Style Layout Grid Guides (12/8/4-col adaptive + 8px pixel grid), Canvas Theme Preview toggle (Light / Dark mode), and Flat Pixel-Perfect Viewport Frame standardizations. All 7 UMKM sections inherit global tokens (colors, typography hierarchy, button variants/radius, layout container/safe-zone margins) with seamless local section override support.

## Last session did

- **Auth Integration — Template Builder & Xendit Transactions:**
  - `src/pages/builder/new.astro` — Auth guard: only `designer`/`superadmin` with `active` status.
  - `src/pages/builder/[templateId].astro` — Auth guard: same role check. Builder stays full-canvas (no dashboard shell).
  - `src/pages/api/templates/draft.ts` — Replaced `DEFAULT_DESIGNER_ID = 'designer_123'` with real `user.id` from BetterAuth session. POST returns 401 for unauthenticated or non-designer requests.
  - `src/pages/api/builder/save.ts` — Auth guard + ownership check (`designerId = user.id`). Superadmin bypasses ownership filter.
  - `src/pages/api/transactions/initiate.ts` — Replaced `x-user-id` header hack with real BetterAuth session. Added suspended account check.
  - `src/pages/checkout/[invoiceId].astro` — Redirect to `/auth/login` if unauthenticated. Ownership check: only `transaction.userId === currentUser.id` or admin/superadmin. 403 block rendered for unauthorized access.
- **Unified Responsive Dashboard Shell:**
  - `src/layouts/DashboardLayout.astro` (NEW) — Auth redirect shell. Wraps Sidebar + DashboardNavbar around page content. Does NOT wrap builder pages.
  - `src/components/dashboard/Sidebar.svelte` (NEW) — Desktop: collapsible 260px/72px sidebar, state persisted to `localStorage`. Mobile: FAB hamburger `fixed bottom-6 right-6 z-50 shadow-2xl` + slide-over drawer with backdrop. Role-based nav items (designer/tenant/admin/superadmin). Sign-out integration.
  - `src/components/dashboard/DashboardNavbar.svelte` (NEW) — Slim header: role badge, user name + initials avatar, theme toggle.
  - `src/pages/dashboard/index.astro` (NEW) — Entry point per role: designer (template count + wallet), tenant (toko status + produk), admin/superadmin (transaksi + user metrics placeholders).
- **Public Navbar & Homepage:**
  - `src/components/common/Navbar.astro` — Cleaned to Beranda + Direktori UMKM nav links only. Auth-aware: shows Masuk/Daftar or Ke Dashboard + avatar depending on session.
  - `src/pages/index.astro` — Replaced `Buka Visual Builder` (unauthenticated link) with `Daftar Gratis` → `/auth/register`.
  - `src/pages/umkm.astro` (NEW) — Public read-only UMKM directory stub with search bar + skeleton cards.
- **Bug Fixes:**
  - `NodeContentForm.svelte` — Fixed TS errors (Zod passthrough `{}` cast to `string`). Fixed A11y warnings (added `for`/`id` to Heading Level + Primary Color labels).
- **Code Quality & Testing:**
  - All files ≤ 300 lines. `bun run type-check`: 0 errors. `bun test`: 49/49 pass.
  - Updated `tests/api/builder/save.test.ts` to reflect new 401 auth guard behavior.

## Next up

1. **Phase 1.2 (BetterAuth continued):** Google OAuth, email verification flow, password reset
2. **Phase 1.3 (API Routes):** Unified response shape, route handlers, validation (extends existing payment endpoints)
3. **Phase 1.4 (Designer Templates page):** `/designer/templates` list page using DashboardLayout
4. **Phase 1.5 (Cloudinary Media):** Signed uploads, transformations, orphan cleanup
5. **Phase 1.6 (Testing):** Unit + integration tests for auth routes, 80%+ coverage
6. **Phase 1 exit:** Schema validated on Neon, auth working, payments tested, tests passing
7. **Phase 2 (Core Flow):** Admin store setup, store rendering, directory, builder, marketplace

## Documentation status

All 21 documentation files audited and aligned with authoritative schema:

✅ **Fixed in this session:**
- docs/tech/data-model-erd.md — Removed `images` table, removed `subdomain_blacklist` table (app-layer validation), updated transactions fields, clarified media as JSONB
- docs/tech/api-spec.md — Updated all payment endpoints, transaction status values, removed imageId references, updated payout fields
- docs/tech/architecture.md — Clarified media storage (JSONB URLs, no orphan cleanup), updated data layer, transaction fields
- docs/prd/user-stories.md — Updated payment/transaction status, blacklist validation note
- docs/prd/user-journeys.md — Updated transaction status values, externalId usage
- docs/memory/feature-01b-database-layer.md — Clarified 19 tables, updated all field names, media handling

**No changes needed (already correct or not applicable):**
- docs/README.md — Index is accurate
- docs/PROJECT-STATE.md — Being updated now
- docs/prd/00-overview.md — Decision summary is correct
- docs/prd/personas.md — No schema references
- docs/planning/roadmap.md — No schema references
- docs/tech/security.md — No detailed schema references
- docs/tech/code-standards.md — No schema references
- docs/tech/permissions-matrix.md — No schema references
- docs/tech/testing-strategy.md — No schema references
- docs/memory/codebase-map.md — Maps to code, not schema
- docs/memory/css-vars.md — Design tokens, not schema
- docs/memory/ui-inventory.md — Component inventory, not schema
- docs/memory/feature-01-project-setup.md — Historical, not schema-dependent

## Known gaps and deliberate shortcuts

- **Builder auto-save:** Deliberately omitted (Phase 1) to reduce complexity. Users must click Save explicitly. Data loss risk if browser crashes accepted for MVP simplicity. Upgrade when: designer feedback indicates this is blocking adoption.

- **Template versioning:** Not implemented in MVP. Each template has one version; applying new template overwrites old config. No rollback history. Upgrade when: designers request template version history or A/B testing.

- **Subdomain reassignment:** Not allowed after Admin setup. If business name changes, need new subdomain. Breaking change; document clearly. Upgrade when: custom domain feature added (post-MVP).

- **Batch product import:** Not in MVP. Tenant adds products one-by-one via UI. Upgrade when: tenants have 100+ products and need CSV import.

- **Soft delete sync eventual consistency:** If database soft-delete succeeds but Cloudinary API fails, orphan files may accumulate. Weekly cron job will clean up. Acceptable for MVP. Upgrade when: file storage cost becomes significant.

- **Payment refunds:** Not implemented. Once transaction marked paid, no refund flow. Upgrade when: refund requests become frequent.

- **Designer tier system:** All designers earn 30% commission. No tiered rates or incentive programs. Upgrade when: designer retention needs tuning.

## Do not repeat these mistakes

- **Don't guess Xendit webhook structure** — Always verify against current Xendit API docs (not training data). Webhook format may have changed.
- **Don't hardcode Cloudinary URLs** — Always go through `mediaService` module. Swapping CDN later will be cheaper if URLs are centralized.
- **Don't skip ownership checks** — Role check alone is insufficient. Every query must filter by user context. This is where IDOR vulnerabilities live.
- **Don't save unparsed JSONB** — Always validate JSONB config with Zod before saving. Forward compatibility breaks if config structure changes and old records are invalid.
- **Don't commit secrets** — Use `.env.local` locally; Workers Secrets in production. Test `.gitignore` before first commit.

## Scaffold cleanup

**Status:** offered · **Date:** 2026-08-14 · **Decision pending**

Single-use kickoff files and selection procedures have completed their job. The following can be archived or deleted:
- `.agents/workflows/00-kickoff.md` (no longer needed; spec is written)
- `.agents/rules/70-database-selection.md` (G1 decided; no need to re-read)
- `.agents/rules/71-media-selection.md` (G7 decided; no need to re-read)
- `.agents/skills/README.md` (setup reference; can stay for future projects)
- `docs/prd/features/_template.md` (template; delete when first feature doc created)

**To clean up:** Run `.agents/workflows/01-cleanup.md` and choose archive/delete/keep for each. Or leave as-is; they won't be read by future sessions per `AGENTS.md` §0 protocol.

## Preflight decisions (from kickoff)

| Gate | Decision | Recorded in |
|---|---|---|
| G1 database (D1 / Neon / Supabase) | Neon PostgreSQL Serverless | docs/tech/architecture.md |
| G2 icon pack | Lucide (lucide-svelte) | docs/tech/architecture.md |
| G3 vp / Vite Plus | Plain Vite + Bun scripts (no vp) | docs/tech/architecture.md |
| G4 git mode (strict / light) | Strict (main protected, dev integration, PR-only) | docs/tech/architecture.md |
| G5 auth pools and roles | 5 roles: superadmin, admin, designer, tenant, public | docs/tech/permissions-matrix.md |
| G6 never-push list | .env*, secrets, dumps, uploaded media, credentials | .gitignore + docs/tech/security.md |
| G7 media storage (Cloudinary / R2 / R2+Images) | Cloudinary Free Tier with WebP auto-convert | docs/tech/architecture.md |