# PROJECT STATE — Live Checkpoint

Status: LIVE · Updated: 2026-08-21 by store-settings session

The handoff file between sessions. Read it second, right after `README.md`. Update it at
the end of every session that changed anything — this is part of the definition of done.

Keep it short and current. This is a checkpoint, not a changelog.

---

## Where the work stands

Fixed designer wallet currency formatting: removed division by 100 on designer balance and mutations display. Centralized IDR formatting in `formatIDR` helper in `src/lib/utils/format.ts` to format pure integer amounts without division. All database records (`wallets.balance`, `wallet_mutations.amount`, `wallet_mutations.balance_after`) and UI displays now consistently handle raw integer IDR. `bun run type-check`: 0 errors. `bun test` / `vitest`: 140/140 pass across 20 test files.

## Last session did

- **Store Settings Feature:**
  - `src/lib/stores/schemas.ts` — Added `StoreSettingsInput` schema to validate settings updates.
  - `src/pages/api/stores/settings.ts` (NEW) — Endpoint for updating store profile (name, waNumber, googleMapsUrl) for tenants.
  - `src/components/dashboard/StoreSettingsForm.svelte` (NEW) — Client-side Svelte component with Zod-based validation and Lucide icons for UI feedback.
  - `src/pages/dashboard/store-settings.astro` (NEW) — Settings page mounted within `DashboardLayout`.
  - `tests/schemas/store-settings.test.ts` (NEW) — 5 unit tests covering validation rules for store settings.
  - All files strictly typed. `bun run type-check` passes successfully. Created PR #14.

- **Auth Zod Schemas & Per-Field Inline Validation (Previous):**
  - `src/schemas/auth.schema.ts` (NEW) — `LoginSchema` and `RegisterSchema` with localized Indonesian error messages, password complexity regex (`^(?=.*[A-Za-z])(?=.*\\d)`), role validation, and `confirmPassword` matching refinement.
  - `src/components/auth/LoginForm.svelte` — Added `novalidate`, `errors: Record<string, string>`, real-time typing error cleanup, Lucide icons (`Eye`, `EyeOff`, `AlertCircle`), styled inputs with `input-error` states, and inline error text below inputs.
  - `src/components/auth/RegisterForm.svelte` — Added `novalidate`, per-field Zod validation across `name`, `role`, `email`, `password`, `confirmPassword`, instant error clearing on input, and modern Lucide icons.
  - `src/components/auth/GoogleAuthButton.svelte` — Refined button design tokens and Lucide error alerts.
  - `src/pages/auth/login.astro` & `src/pages/auth/register.astro` — Modern container aesthetic with backdrop blur, rounded-3xl cards, and polished typography.
- **Testing & Verification:**
  - `tests/schemas/auth.test.ts` (NEW) — 8 unit tests covering login/register validation scenarios.
  - `tests/lib/auth-helpers.test.ts` (NEW) — 9 unit tests for `getAuthenticatedUser`, `getRedirectUrlForRole`, `isDesigner`, `isActive`, and `isAuthorizedDesigner`.
  - `tests/lib/auth-google-whitelist.test.ts` — 10 unit tests for role-based redirects, BetterAuth config, and hook lifecycle execution.
  - Total 27 unit tests specifically for the Auth module.
  - Browser subagent verified empty form submission, real-time error cleanup on typing, password complexity, and confirm password mismatch.
  - All files ≤ 300 lines. `bun run type-check`: 0 errors. `bun test`: 81/81 pass.
- **Store Onboarding Feature:**
  - `src/lib/stores/schemas.ts` — Added `OnboardStoreInput` schema to validate store profiles.
  - `src/pages/api/stores/onboard.ts` (NEW) — Endpoint for saving store profile and subdomain, ensuring unique subdomains, valid names, and correct roles.
  - `src/components/onboarding/OnboardingWizard.svelte` (NEW) — Multi-step wizard UI covering Subdomain choice, Store Info (Name, WA, Maps), and Success state.
  - `src/pages/onboarding/index.astro` — Replaced the old isolated subdomain page with the new Onboarding Wizard component, updating auth guards to enforce `tenant` role.
  - Removed deprecated `src/pages/onboarding/subdomain.astro` and `src/components/onboarding/SubdomainInput.svelte`.
  - Fixed `tsconfig.json` so `bun run type-check` passes successfully.

## Next up

1. **Phase 1.3 (Designer Payout System):** Payout requests, bank account management, minimum balance validation
2. **Phase 1.4 (Designer Templates & Wallet Dashboard):** `/dashboard/wallet` summary and transactions list
3. **Phase 1.5 (Cloudinary Media):** Signed uploads, transformations, orphan cleanup

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