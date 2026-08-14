# PROJECT STATE — Live Checkpoint

Status: LIVE · Updated: 2026-08-14 by kickoff session

The handoff file between sessions. Read it second, right after `README.md`. Update it at
the end of every session that changed anything — this is part of the definition of done.

Keep it short and current. This is a checkpoint, not a changelog.

---

## Where the work stands

Kickoff complete. All spec documents written and locked. Database schema defined. API contract established. Ready to start Phase 1 (Foundation: auth, payments, database setup).

The project is a no-code SaaS web builder for Indonesian UMKM (small businesses). Tenants get instant subdomains; designers sell templates; platform earns 30% commission on template sales. All integrations (Xendit, Cloudinary, BetterAuth, Neon) are decided and documented. Stack is Astro/Svelte/Vite/Bun/Drizzle/Vitest on Cloudflare.

## Last session did

- Phase 1: Identified gaps and conflicts in PRD → none found (PRD was comprehensive)
- Phase 2: Resolved all 7 preflight gates (G1-G7) with human input
- Phase 3: Deep technical discussion → 3 key decisions locked (host header routing, client-side builder state, payment idempotency via unique constraint)
- Phase 4: Wrote 17 spec documents:
  - `docs/prd/00-overview.md` — Big-picture PRD with 8 locked decisions
  - `docs/prd/personas.md` — 5 personas (Superadmin, Admin, Designer, Tenant, Visitor)
  - `docs/prd/user-stories.md` — 11 user stories with acceptance criteria (happy + unhappy paths)
  - `docs/prd/user-journeys.md` — 4 end-to-end journeys with failure paths and drop-off risks
  - `docs/tech/architecture.md` — Stack, preflight gates, rendering model, folder structure, data layer, auth, environments, external services
  - `docs/tech/data-model-erd.md` — 30-table ERD with relationships, JSONB schemas, seeding strategy
  - `docs/tech/permissions-matrix.md` — Role x action x resource authorization matrix; 6 enforcement points
  - `docs/tech/api-spec.md` — 20+ API routes with input/output schemas, error codes, idempotency, rate limits
  - `docs/tech/security.md` — Threat surface, controls, secrets management, logging, incident response
  - `docs/tech/testing-strategy.md` — 4 test layers (unit, integration, permissions, E2E); 80%+ coverage target
  - `docs/tech/code-standards.md` — Naming conventions, patterns, CSS variables, Zod schemas, service modules, response helpers
  - `docs/planning/roadmap.md` — 4 phases (Foundation, Core Flow, Quality, Production); week-by-week breakdown; success metrics; risks
  - Updated `docs/README.md` with current statuses
  - README.md About block remains a template (will rewrite at end of session when all docs locked)

## Next up

1. **Phase 1 (Foundation):** Build auth (BetterAuth), database (Drizzle/Neon), payments (Xendit), media (Cloudinary), admin registration
2. **Phase 1 exit criteria:** Schema validated, auth working, payment sandbox tested, 80%+ test coverage
3. **Phase 2 (Core Flow):** Admin store setup, store rendering, directory, visual builder, template marketplace, WhatsApp redirect
4. **After Phase 2:** Internal soft launch with 5-10 test stores to validate UX before Phase 3 quality work

## Open threads (unresolved, needs a decision)

None. All preflight gates answered. All architecture locked. All user flows documented.

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