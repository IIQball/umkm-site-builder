# PROJECT STATE — Live Checkpoint

Status: LIVE · Updated: 2026-08-20 by core-financial-engine session

The handoff file between sessions. Read it second, right after `README.md`. Update it at
the end of every session that changed anything — this is part of the definition of done.

Keep it short and current. This is a checkpoint, not a changelog.

---

## Where the work stands

Core Financial Engine & Ledger implemented. Dynamic commission calculator configured from platformSettings (fallback 30%). Full designer wallet credit/debit with immutable ledger mutations (`walletMutations`). Post-payment webhook fulfillment automatically activates stores and awards net commissions to designer wallets with strict idempotency guards. Submit-review template API secured with real BetterAuth session & designer ownership verification.

## Last session did

- **Domain-Based Architecture & Proxy Cleanup:**
  - Removed duplicate proxy files in root: `src/schemas/template.schema.ts`, `src/schemas/transaction.schema.ts`, `src/services/transaction.service.ts`, `src/services/wallet.service.ts`, `src/services/commission.service.ts`, `src/services/template.service.ts`, `src/lib/xendit.ts`.
  - Migrated all imports across Svelte components, Astro pages, APIs, and tests to centralized barrel exports (`@/schemas`, `@/services`) or domain submodules (`@/lib/finance/xendit`).
  - `bun run type-check`: 0 errors. `bun test`: 79/79 pass.

## Next up

1. **Phase 1.2 (Designer Marketplace & Approval):** Admin review template UI, template status approval/rejection endpoints
2. **Phase 1.3 (Designer Payout System):** Payout requests, bank account management, minimum balance validation
3. **Phase 1.4 (Designer Templates & Wallet Dashboard):** `/dashboard/wallet` summary and transactions list
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