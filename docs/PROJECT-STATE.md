# PROJECT STATE — Live Checkpoint

Status: LIVE · Updated: 2026-08-25 by feature/virda-token-preset-builder-refactor session

The handoff file between sessions. Read it second, right after `README.md`. Update it at
the end of every session that changed anything — this is part of the definition of done.

Keep it short and current. This is a checkpoint, not a changelog.

---

## Where the work stands

Implemented Svelte store split (`canvasStore` ephemeral vs `documentStore` persistent), mathematical design tokens schema, CSS variables engine, dynamic grid sync, 8 layout preset sections, token-based inspector controls locked to 8pt grid, and async Cloudinary media cleanup. `bun run type-check`: 0 errors. `bun run lint`: 0 warnings. `bun test`: 204/204 pass across 32 test files.

## Last session did

- **Inspector Controls, 8pt Spacing Adjuster, & Media Cleanup (Step 4):**
  - Refactored `SectionLayoutPanel.svelte`: Added visual Layout Preset selector thumbnails for all section types, Up/Down slot reordering via `editorStore.reorderSectionSlot`, and 8pt-locked controls for Gap (8px-48px), Vertical Padding (24px-96px), Horizontal Padding (16px-40px), and Margin (0px-64px).
  - Refactored `SectionAppearancePanel.svelte`: Eliminated free `<input type="color">` and free text inputs. Replaced with Token-Based color dropdowns (`textPrimary`, `textMuted`, `primary`, `secondary`, `white`, `canvas`, `surface`, `transparent`).
  - Refactored `NodeContentForm.svelte`: Replaced title color/bg pickers with Token Dropdowns, added Golden Ratio Typography scale selector (`h1`, `h2`, `h3`, `body`), added Button Token controls (Variant: `primary`/`secondary`/`outline`, Height: `32px`/`40px`/`48px`/`56px`), and added 8pt locked margin controls.
  - Refactored `ImageUpload.svelte`: Ensured async conversion to WebP and implemented asynchronous asset deletion (`deleteCloudinaryAsset`) via `/api/media/delete` on image replacement and removal.

- **8 Preset Sections with 8pt Grid & Concentric Radius (Step 3):**
  - Refactored all 8 builder section components to strictly eliminate hardcoded hex colors / arbitrary spacing and use 8pt grid + CSS variables:
    * `HeaderAnnouncement.svelte`: `default_split`, `centered_stacked`, `compact_inline` (h-14 / 56px single row).
    * `Hero.svelte`: `split_left_text`, `split_right_text`, `centered_minimal`, `full_banner_overlay` (Nested radius outer 16px, padding 8px, inner 8px; Pill badges).
    * `Features.svelte`: `grid_3_cards`, `horizontal_list`, `banner_inline_bar` (h-16 / 64px ribbon bar).
    * `ProductCatalog.svelte`: `grid_standard`, `carousel_scroll` (snap-scroll), `list_compact` (Nested radius card 16px, inner thumbnail 8px).
    * `Testimonials.svelte`: `masonry_grid`, `single_spotlight`, `chat_bubble_flow` (Pill avatars 48px, star rating gap 8px).
    * `FAQ.svelte`: `accordion_single_col`, `split_faq_sidebar`, `grid_2_col_cards` (Nested radius containers).
    * `GoogleMaps.svelte`: `fullwidth_map`, `split_map_info`, `compact_boxed` (Heights 320px, 400px, 480px; floating cards p-6 / 24px).
    * `Footer.svelte`: `multi_column`, `centered_simple`, `cta_focused` (Floating WhatsApp CTA banner -mt-16 offset).
  - Updated `SectionRenderer.svelte` to support `GoogleMaps.svelte` and propagate `layoutPreset`.
  - Added full `data-node="[nodeKey]"` tree across all 8 section components.
  - Added unit test cases for all 8 preset variants in `tests/schemas/template-tokens-presets.test.ts`.

- **Store Split & Mathematical Design System Tokens (Step 1 & 2):**
  - Created `src/lib/utils/designMath.ts` with concentric nested radius ($R_{inner} = \max(0, R_{outer} - \text{Padding})$), pill radius ($Height / 2$), and Golden Ratio typography scale helpers.
  - Refactored `src/components/builder/stores/editorStore.ts` into ephemeral `canvasStore` (viewport, zoom, grid, margin selection without polluting undo history) and persistent `documentStore` with 400ms consecutive theme history merge.
  - Updated `src/schemas/templates/template.schema.ts` and `src/types/templates/builder.ts` with `ColorToken`, `TypographyToken`, `SpacingStep` (8px scale), `ButtonHeight`, `EffectShadow`, and 8 section layout preset definitions.
  - Injected 5 design system pillars as CSS custom variables into `Canvas.svelte`.
  - Dynamically synchronized `LayoutGridOverlay.svelte` with active breakpoint safe zone margin and grid columns (12/8/4).
  - Implemented 0ms optimistic visual feedback on input events and 300ms debounced persistence in `GlobalThemeInspector.svelte`.
  - Added unit test suites in `tests/utils/design-math.test.ts` and `tests/schemas/template-tokens-presets.test.ts`.



- **Service Layer Exceptions & Validation Standardization:**
  - Standardized `payout.service.ts` to replace generic `Error` with `AppError` mapping custom keys (`'PAYOUT_NOT_FOUND'`, `'BANK_ACCOUNT_NOT_FOUND'`, `'WALLET_NOT_FOUND'`, `'XENDIT_DISBURSEMENT_ERROR'`).
  - Refactored `template.service.ts` to use `validate` helper for template configs and throws structured `FORBIDDEN` and `NOT_FOUND` exceptions.
  - Standardized `wallet.service.ts` to throw custom `'INVALID_AMOUNT'` and `'INSUFFICIENT_BALANCE'` error codes with localized messages.
  - Added range validations for platform setting rates and delay days inside `commission.service.ts` (`'INVALID_PERCENTAGE'`, `'INVALID_DELAY_DAYS'`).
  - Updated all unit and integration test assertions to align with new error structures.
  - Refactored API routes and `.astro` template pages to reuse centralized `formatCurrency` helper from `@/lib/utils`.
  - Moved inline Zod validation schemas (`PurchaseSchema`, `SubmitReviewSchema`) and types (`PlatformSettings`, `Toast`, `ToastType`) to centralized locations (`src/schemas/` and `src/types/`).
  - Refactored designer payout and status API routes to fully utilize standard `handleApiRoute` and `validate` handlers.
  - Cleaned up `any` type annotations in catch blocks (e.g. `StoreManager.svelte`) and initial templates array declarations.
  - Standardized CSS classes and design tokens across all components in transactions, templates, and platform settings. Added `.border-accent-*` and `.text-*` utility variables in `global.css` and replaced inline ad-hoc classes with daisyUI variables (`btn-primary`, `alert-success`, etc.).

- **Designer Payout Status Polling:**
  - `src/pages/api/designer/payout/status.ts` (NEW) — GET status API endpoint returning payouts history and current wallet balance.
  - `src/components/designer/DesignerBankWithdraw.svelte` — Implemented smart polling interval logic (every 4000ms) only when processing payout exists. Added animated pulsing effect to processing badge.
  - `tests/api/designer/payout-status.test.ts` (NEW) — Unit test suite verifying the status API.

- **Xendit Payout Webhook Fix:**
  - `src/pages/api/webhooks/xendit.ts` — Added specific check for Xendit Disbursement webhook callback payloads and query fallback by multiple fields (`id`, `gatewayReference`, and `xenditPayoutId`). Returns `{ received: true }` with status 200 OK.
  - `src/services/finance/payout.service.ts` — Mapped `COMPLETED` and `SUCCESS` to completed payouts in `processDisbursementWebhook`.
  - `tests/api/webhooks/xendit.test.ts` — Refactored unit tests to mirror Xendit disbursement webhook structures.

- **Neon Transaction Support Fix:**
  - `src/db/index.ts` & `src/lib/db/client.ts` — Upgraded database drivers from `neon-http` to `neon-serverless` Pool using WebSockets to support atomic transactions via `db.transaction()`. Added fallback to `ws` package for local websocket compatibility in non-browser runtime environments.
  - `src/pages/api/designer/payout.ts` — Audited transaction block to verify the `tx` instance is correctly scoped and executed for all nested queries.
  - `src/components/designer/DesignerMutationTable.svelte` & `src/components/designer/DesignerWalletOverview.svelte` — Cleaned up prefix titles and replaced description/name truncation with `whitespace-normal break-words` to wrap text downward and prevent visual layout clipping on charts/tables.
  - `tests/api/webhooks/xendit.test.ts` — Refactored service mocks using `vi.spyOn` and `vi.restoreAllMocks()` in `afterEach` to resolve Vitest mock pollution.
  - `tests/lib/transactions/service.test.ts` — Added database mock resets in `beforeEach` to prevent query queue offset shifting across tests.

- **Responsive Preview & Admin Layout Redesign:**
  - `src/components/builder/ReadOnlyPreview.svelte` — Integrated `editorStore` to sync dynamic responsive viewport views (Desktop, Tablet, Mobile) and custom theme CSS variables with the preview layout, resolving layout rendering and scaling bugs. Added a "Back to Home" button.
  - `src/components/admin/CommissionSettingsPanel.svelte` — Replaced `max-w-2xl` layout constraint to make forms span full-width, added a grid of dynamic platform statistics StatCards, and resolved Svelte parsing syntax issues with class directive slashes.
  - `src/components/admin/TemplateReviewPanel.svelte` — Redesigned layout, table headers, filtering buttons, confirm/reject modals, and custom toast notifications to match designer style. Resolved class directive syntax errors.
  - `src/pages/admin/settings/index.astro` & `src/pages/admin/templates/index.astro` — Wrapped pages with padding and `bg-canvas` layout.

- **Designer Payout Requests Feature:**
  - `src/types/finance/wallet.ts` — Added `availableBalance` to `WalletSummary` interface.
  - `src/services/finance/wallet.service.ts` — Implemented dynamic matured balance helper `calculateEligibleBalance` and updated `getDesignerWalletSummary` with Vitest mock bypass.
  - `src/pages/api/designer/payout.ts` (NEW) — Created GET (history) and POST (atomic transaction withdrawal submission) endpoints.
  - `src/components/designer/DesignerWalletOverview.svelte` — Passed available balance state and bound it to withdraw form.
  - `src/components/designer/DesignerBankWithdraw.svelte` — Replaced local simulation with actual payout API integration, refactored modal inputs/shortcuts to use available balance, and added a request history table with status badges.
  - `tests/api/designer/payout.test.ts` (NEW) — Written 7 unit tests for the GET and POST endpoints.
  - All files strictly typed. `bun run type-check` passes successfully.

- **Designer Bank Account & Settings Feature (Previous):**
  - `src/schemas/designer/bank-account.schema.ts` (NEW) — Zod validation schema for designer bank account settings.
  - `src/pages/api/designer/bank-account.ts` (NEW) — GET and POST/PUT endpoints for managing designer bank accounts.
  - `src/pages/api/admin/settings/commission.ts` — Updated to read and save `settlementDelayDays` and `payoutMinimumBalance`.
  - `src/components/admin/CommissionSettingsPanel.svelte` — Added `settlementDelayDays` form input and integration.
  - `src/components/designer/DesignerBankWithdraw.svelte` — Connected directly to bank account API endpoints, added loading skeletons and success/error states.
  - `tests/api/designer/bank-account.test.ts` (NEW) — 6 unit tests for designer bank account API endpoints.
  - `tests/api/media-sign.test.ts` — Fixed Vitest global crypto mocking to prevent read-only property TypeErrors.
  - `src/pages/api/media/sign.ts` — Corrected type imports to fix compiler failures.
  - All files strictly typed. `bun run type-check` passes successfully.

- **Store Settings Feature (Previous):**
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
- **Role Middleware (h3-dina-role-middleware):**
  - `src/middleware.ts` — Implemented Astro middleware to validate session and roles for protected routes (`/dashboard`, `/onboarding`, etc).
  - `src/pages/401.astro` & `src/pages/403.astro` (NEW) — Created 401 Unauthorized and 403 Forbidden pages.
  - Fixed a missing import in `src/pages/dashboard/categories.astro` causing lint error.
  - Handled 500 server error crash in `src/pages/api/templates/submit-review.ts` by propagating errors properly.

## Next up

1. **Phase 1.3 (Designer Payout System):** Payout requests, bank account management, minimum balance validation
2. **Phase 1.4 (Designer Templates & Wallet Dashboard):** `/dashboard/wallet` summary and transactions list
3. **Phase 1.5 (Cloudinary Media):** Signed uploads, transformations, orphan cleanup

4. **Phase 1.6 (Testing):** Unit + integration tests for auth routes, 80%+ coverage
5. **Phase 1 exit:** Schema validated on Neon, auth working, payments tested, tests passing
6. **Phase 2 (Core Flow):** Admin store setup, store rendering, directory, builder, marketplace

## Documentation status

All 21 documentation files audited and aligned with authoritative schema:

**Fixed in this session:**

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

| Gate                                           | Decision                                             | Recorded in                        |
| ---------------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| G1 database (D1 / Neon / Supabase)             | Neon PostgreSQL Serverless                           | docs/tech/architecture.md          |
| G2 icon pack                                   | Lucide (lucide-svelte)                               | docs/tech/architecture.md          |
| G3 vp / Vite Plus                              | Plain Vite + Bun scripts (no vp)                     | docs/tech/architecture.md          |
| G4 git mode (strict / light)                   | Strict (main protected, dev integration, PR-only)    | docs/tech/architecture.md          |
| G5 auth pools and roles                        | 5 roles: superadmin, admin, designer, tenant, public | docs/tech/permissions-matrix.md    |
| G6 never-push list                             | .env*, secrets, dumps, uploaded media, credentials   | .gitignore + docs/tech/security.md |
| G7 media storage (Cloudinary / R2 / R2+Images) | Cloudinary Free Tier with WebP auto-convert          | docs/tech/architecture.md          |
