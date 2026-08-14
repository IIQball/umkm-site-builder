# PROJECT STATE — Live Checkpoint

Status: LIVE · Updated: 2026-08-14 by kickoff session

The handoff file between sessions. Read it second, right after `README.md`. Update it at
the end of every session that changed anything — this is part of the definition of done.

Keep it short and current. This is a checkpoint, not a changelog.

---

## Where the work stands

Kickoff complete + Phase 1.1 (Project Scaffolding) complete. Astro/Svelte/Tailwind/daisyUI project fully initialized with folder structure, configuration, and design system. Ready for Phase 1.2 (BetterAuth authentication).

The project is a no-code SaaS web builder for Indonesian UMKM (small businesses). Tenants get instant subdomains; designers sell templates; platform earns 30% commission on template sales. All integrations (Xendit, Cloudinary, BetterAuth, Neon) are decided and documented. Stack is Astro/Svelte/Vite/Tailwind/daisyUI/Vitest on Cloudflare.

## Last session did

- Kickoff (4 phases):
  - Phase 1: Identified gaps and conflicts in PRD → none found (PRD was comprehensive)
  - Phase 2: Resolved all 7 preflight gates (G1-G7) with human input
  - Phase 3: Deep technical discussion → 3 key decisions locked (host header routing, client-side builder state, payment idempotency via unique constraint)
  - Phase 4: Wrote 17 spec documents (all LOCKED)
  - Phase 5: Presented summary and got human approval
  - Phase 6: Committed kickoff work to `dev` branch
- Feature 01 (this session):
  - Initialized Astro 3.6 project with Svelte 4 integration
  - Configured Tailwind CSS + daisyUI with CSS variables
  - Created project folder structure (20 directories per architecture spec)
  - Set up TypeScript strict mode with path aliases
  - Created global design system (colors, spacing, typography, shadows)
  - Created base layout, home page, API response types, environment config
  - All 666 dependencies installed and locked (package-lock.json)
  - Build tested successfully (`npm run build` → dist/ complete)
  - Committed to `feature/01-project-setup` with full feature documentation

## Next up

1. **Phase 1.2 (BetterAuth Setup):** Email/password auth, Google OAuth, session management, route guards
2. **Phase 1.3 (Database Schema):** Drizzle ORM schema, Neon connection, migrations
3. **Phase 1.4 (Xendit Payments):** Payment initiation, webhook verification, idempotency
4. **Phase 1.5 (Cloudinary Media):** Signed uploads, transformations, orphan cleanup
5. **Phase 1.6 (Testing):** Unit + integration tests, 80%+ coverage
6. **Phase 1 exit:** Schema validated, auth working, payments tested, tests passing
7. **Phase 2 (Core Flow):** Admin store setup, store rendering, directory, builder, marketplace

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