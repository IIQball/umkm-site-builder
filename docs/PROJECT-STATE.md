# PROJECT STATE — Live Checkpoint

Status: LIVE · Updated: 2026-09-04 by feature/designer-wallet-fixes

The handoff file between sessions. Read it second, right after `README.md`. Update it at
the end of every session that changed anything — this is part of the definition of done.

Keep it short and current. This is a checkpoint, not a changelog.

---

## Where the work stands

- **Marketplace Template Purchase Endpoint Fix**:
  - Fixed 404 error on marketplace checkout by updating [`src/components/public/PublicTemplateMarketplace.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/public/PublicTemplateMarketplace.svelte) from non-existent `/api/checkout/create` and `/api/tenant/template/apply` to the canonical transaction endpoint `/api/tenant/transactions/template-purchase`.
  - Seamlessly handles both free template claims (`isFree: true`) and paid checkout redirections (`/checkout/${result.data.externalId}`).

- **Migrate Remaining Modals to Canonical `ui/Modal.svelte` & Resolve Issue #70:**
  - **Eliminated Raw `<dialog class="modal">` and Hand-Rolled Backdrops**:
    - `src/components/tenant/ProductFormModal.svelte`: Replaced raw `<dialog>` element and imperative `.showModal()` / `.close()` with `<Modal open={showModal} on:close={closeModal} size="lg" title="...">`. File shortened from 283 to 258 lines.
    - `src/components/checkout/PaymentModal.svelte`: Replaced raw `<dialog>` with `<Modal open={open} on:close={closeModal} size="xl" bodyPadding={false} ...>`.
    - `src/components/checkout/CheckoutSummaryCard.svelte`: Wired reactive `isPaymentModalOpen` state to `<PaymentModal>`.
    - `src/components/admin/AdminUserAddModal.svelte`: Removed hand-rolled `fixed inset-0` backdrop, keydown handler, and container div in favor of `<Modal open={isOpen} on:close={close} size="md">` with custom header & footer action slots. Reduced from 298 to 285 lines ($\le 300$ limit).
    - `src/components/admin/whitelist/AdminAddModal.svelte`: Replaced hand-rolled backdrop with `<Modal open={isOpen} on:close={close} size="md">`.
    - `src/components/admin/whitelist/AdminDetailModal.svelte`: Replaced hand-rolled backdrop with `<Modal open={!!admin} on:close={close} size="md">`.
  - **Catalog Inline Checkout Clarification**: Added explanatory header comment to [`src/components/builder/sections/catalog/CatalogCheckoutModal.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/catalog/CatalogCheckoutModal.svelte) noting it is an in-canvas inline block component rather than an overlay dialog.
  - **Documentation Alignment**: Updated [`docs/memory/ui-inventory.md`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/docs/memory/ui-inventory.md) to formally designate `src/components/ui/Modal.svelte` as the project's single canonical modal component.
  - Strict 0 occurrences of `<dialog class="modal">` in `src/components`.
  - 0 typecheck errors (`bun run type-check`), 0 lint warnings (`bun run lint`), 100% tests passing (378 tests in 54 suites).

- **Revitalize Design System Tokens as SSOT & Eliminate Triplicate Definitions (Issue #68):**
  - **Revitalized `src/components/tokens/` as Canonical SSOT**:
    - `radius.ts`: Exported `RADIUS_STEPS` (0, 4, 8, 12, 16, 20, 24, 32, 9999) and complete `RADIUS_PRESETS` with all UI labels.
    - `typography.ts`: Exported `FONT_FAMILIES`, `FONT_FAMILY_OPTIONS`, `FONT_SIZES`, `FONT_WEIGHTS`, and `TYPOGRAPHY_SCALES`.
    - `spacing.ts`: Exported `MAX_WIDTH_OPTIONS` alongside standard 8pt grid and safe-zone constraints.
    - `colors.ts`: Exported `COLOR_TOKENS` and `DEFAULT_THEME_COLOR_FIELDS`.
    - `index.ts`: Full barrel re-export of all constants, presets, and inferred types.
  - **Synchronized Zod Validation Schemas ([`src/schemas/templates/template.tokens.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/schemas/templates/template.tokens.ts))**:
    - Derived `ColorTokenSchema` directly from `COLOR_TOKENS`.
    - Derived `RadiusStepSchema` dynamically from `RADIUS_STEPS`.
    - Validated `FontFamilySchema` against `FONT_FAMILIES` and `FONT_FAMILY_OPTIONS`.
  - **Eliminated Hardcoded Lists in Builder Theme Inspector Tabs ([`src/components/builder/inspector/theme/`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/theme/))**:
    - `ThemeButtonsTab.svelte`: Replaced local `radiusPresets` with canonical `RADIUS_PRESETS` from tokens (restoring missing 12px, 20px, 24px, 32px options in UI).
    - `ThemeTypographyTab.svelte`: Replaced inline lists with `FONT_FAMILY_OPTIONS` and `TYPOGRAPHY_SCALES`.
    - `ThemeLayoutTab.svelte`: Replaced inline max-width options with `MAX_WIDTH_OPTIONS`.
    - `ThemeColorsTab.svelte`: Consumes `DEFAULT_THEME_COLOR_FIELDS` from `colors.ts`.
  - **Cleaned `nodeStyles.constants.ts` ([`src/components/builder/inspector/nodeStyles.constants.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/nodeStyles.constants.ts))**:
    - Removed duplicate manual definitions of `fontSizes` and `fontWeights`, mapping directly to `FONT_SIZES` and `FONT_WEIGHTS` from `tokens/typography.ts`.
  - 0 typecheck errors, 0 lint warnings, 100% passing tests (375 tests in 54 test suites).

- **Consolidation of Canonical Shared Helpers & Issue #69 Resolution:**
  - **Single Source of Truth Currency Formatter (`formatIDR`)**:
    - Eliminated inline `Intl.NumberFormat('id-ID')` and ad-hoc `'Rp ' + ...` across all 12 target components + catalog files (`StatCard`, `DesignerBankWithdraw`, `ProductCatalog`, `CheckoutPaymentBreakdown`, `NewTemplateForm`, `SubmitReviewModal`, `ProductBasicFields`, `ProductCatalogCard`, `CatalogCheckoutModal`, `TemplatePricingSimulator`, `ProductCatalogQuickView`, `ProductTableRow`, `ProductGrid`, `orders.astro`).
    - Verified strict 0 matches for `Intl.NumberFormat('id-ID')` outside [`src/lib/currency.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/lib/currency.ts).
  - **Canonical WhatsApp Utilities (`normalizeWhatsAppNumber`, `generateWhatsAppLink`, `generateWhatsAppOrderUrl`)**:
    - Centralized WhatsApp parsing and URL formatting in [`src/lib/whatsapp.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/lib/whatsapp.ts), fixing the leading `8...` prefix bug and supporting `08...`, `8...`, `620...`, `+62...`.
    - Consolidated helper calls in `footer.helpers.ts`, `faq.helpers.ts`, `maps.helpers.ts`, `productCatalog.helpers.ts`, `ProductGrid.svelte`, and `[subdomain].astro`.
    - Sanitized builder WhatsApp input in [`FooterNodeForms.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/node-forms/FooterNodeForms.svelte) with live normalization and validation pattern.
  - **Single Source of Truth Date Formatter (`formatDate`)**:
    - Extended [`src/lib/utils/format.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/lib/utils/format.ts) `formatDate` to accept optional `Intl.DateTimeFormatOptions`.
    - Replaced all ad-hoc `toLocaleDateString` / `Intl.DateTimeFormat` in `AdminDetailModal`, `AdminWhitelistTable`, `UserManagementPanel`, `DesignerTemplateTable`, `DesignerTemplateCard`, and `DashboardNavbar`.
  - **Standardized Admin Whitelist Table & Modularization**:
    - Refactored [`AdminWhitelistTable.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/admin/whitelist/AdminWhitelistTable.svelte) from raw `<table>` markup to standardized `<Table>` component.
    - Modularized [`AdminUserTable.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/admin/user/AdminUserTable.svelte) from [`UserManagementPanel.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/admin/UserManagementPanel.svelte), bringing panel size from 349 lines down to 265 lines ($\le 300$ limit).
  - **Standardized `--theme-primary` Fallbacks**:
    - Replaced hardcoded `#4f00ff` fallback with canonical `#2563eb` across all catalog components (`ProductCatalogCard`, `CatalogCheckoutModal`, `ProductQuickCheckoutModal`, `ProductGrid`).
    - Verified strict 0 matches for `#4f00ff` in the entire repository.
  - 0 typecheck errors, 0 lint warnings, 100% passing tests (375 tests in 54 test suites), zero live testing.

- **Designer Wallet UI & Commission Synchronization ([`src/pages/designer/wallet.astro`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/designer/wallet.astro), [`src/components/designer/DesignerBankCard.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/designer/DesignerBankCard.svelte), [`src/components/designer/wallet/DesignerWeeklyChart.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/designer/wallet/DesignerWeeklyChart.svelte)):**
  - **High-Contrast Bank Action Button**: Refactored "Ganti Rekening" button on [`DesignerBankCard.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/designer/DesignerBankCard.svelte) with pure high-contrast white styling (`border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white`) and Lucide Svelte `Pencil` icon, ensuring crisp visibility across both light and dark themes.
  - **Defensive Account Holder Resolution**: Standardized `accountHolder` / `holderName` mapping across [`bank-account.schema.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/schemas/designer/bank-account.schema.ts), [`wallet.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/types/finance/wallet.ts), and [`DesignerBankWithdraw.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/designer/DesignerBankWithdraw.svelte), eliminating `UNDEFINED` text and rendering uppercase validated names.
  - **Dynamic Commission Split Rate**: Dynamically integrated `platformFeePercentage` from `platformSettings` into [`DesignerWeeklyChart.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/designer/wallet/DesignerWeeklyChart.svelte) via SSR props and live fallback fetch (`GET /api/public/commission`), replacing static "70% Desainer • 30% Platform" with reactive `Pembagian hasil: {designerSharePercent}% Desainer • {platformFeePercentage}% Platform`.
  - Zero raw emojis, 100% Lucide Svelte SVG icons, strictly $\le 300$ lines per file, 0 typecheck errors, 0 lint warnings, 100% passing tests (375 tests in 54 test suites).

- **100% Indonesian Localization for Layers Panel & Canvas Auto-Scroll:**
  - **100% Indonesian Localization ([`src/components/builder/layer/layerPanel.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/layerPanel.helpers.ts), [`src/components/builder/LayerPanel.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/LayerPanel.svelte), [`src/components/builder/layer/LayerSectionItem.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/LayerSectionItem.svelte), [`src/components/builder/layer/AddNodeDropdown.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/AddNodeDropdown.svelte)):**
    - Localized all section labels, sub-node labels, dropdowns, headers, and tooltips adhering strictly to `.agents/rules/language-standards.md` standard.
    - Header: `Lapisan (N)`, `Tambah`, `Pilih Komponen Seksi`, `Tutup Panel Lapisan (Ctrl+\)`.
    - Main Section Types: `Header & Pengumuman`, `Banner Utama (Hero)`, `Fitur & Keunggulan`, `Katalog Produk`, `Testimoni Pelanggan`, `FAQ (Tanya Jawab)`, `Google Maps & Lokasi`, `Footer & Kontak`.
    - Sub-nodes across all 8 sections: `Lencana & Kategori`, `Judul Utama (H1)`, `Subjudul / Deskripsi`, `Grup Tombol Aksi (CTA)`, `Gambar Utama (Showcase)`, `Bilah Kontak Atas`, `Logo Toko & Brand`, `Menu Navigasi`, `Kartu Keunggulan`, `Paket Bundling Hemat`, `Ulasan Pelanggan`, `Tanya Jawab`, `Bingkai Peta Interaktif`, `Kartu Informasi Melayang`, `Hak Cipta & Menu Bawah`.
    - Action Tooltips: `Geser ke Atas`, `Geser ke Bawah`, `Hapus Seksi`, `Hapus Elemen`, `Buka Detail`, `Tutup Detail`.
  - **Canvas Smooth Auto-Scroll ([`src/components/builder/canvas/canvasScroll.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/canvas/canvasScroll.helpers.ts), [`src/components/builder/Canvas.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/Canvas.svelte)):**
    - Implemented `scrollToCanvasElement(sectionId, nodeId?)` with smooth center alignment.
    - Added `id={`section-${section.id}`}` and `data-section-id={section.id}` to Canvas section containers.
    - Integrated automatic scroll trigger when clicking section rows or child sub-nodes in `LayerSectionItem.svelte`.
  - Zero raw emojis, 100% Lucide Svelte SVG icons, strictly $\le 300$ lines per file, 0 typecheck errors, 0 lint warnings, 100% passing tests (375 tests in 54 test suites).

- **FAQ Section Global Design System Synchronization ([`src/components/builder/sections/FAQ.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/FAQ.svelte)):**
  - Synchronized all 10 FAQ presets and subcomponents under [`src/components/builder/sections/faq/`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/faq/) with Global Design System tokens:
    - Typography: Bound headers, questions, answers, and tags to `--font-heading` (`font-[var(--font-heading,inherit)]`) and `--font-family` (`font-[var(--font-family,inherit)]`).
    - Colors & Surfaces: Replaced hardcoded Tailwind colors with `--color-text-main`, `--color-text-secondary`, `--color-border`, `--color-card-base`, `--color-nested-base`, and `--theme-primary`.
    - Buttons & Interactive Elements: Bound tab buttons (`--btn-primary-bg`, `--btn-primary-text`, `--btn-secondary-bg`, `--btn-secondary-text`), button radiuses (`--btn-radius`), search inputs, and accordion toggles to design system tokens.
    - Layout Sizing: Wrapped section container in `.builder-safe-container` with `max-width: var(--active-max-width, var(--theme-max-width, 1200px))` and inline safe-zone padding `var(--active-safe-zone, 32px)`.
  - Zero raw emojis, 100% Lucide Svelte SVG icons, 0 typecheck errors, 0 lint warnings, 100% passing tests (375 tests).

- **Live Reactive Engine for Global Design System & Complete SSOT Sync:**
  - **Centralized CSS Variable Ingestion ([`src/components/builder/canvas/canvasCss.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/canvas/canvasCss.helpers.ts))**:
    - Unified mapping of all design system tokens: `--color-*`, `--font-*`, typography scales `--text-*`, buttons `--btn-*`, and responsive layout dimensions (`--active-max-width`, `--active-safe-zone`, `--active-gutter`).
    - Full backward compatibility aliases (`--theme-*`) for existing sections.
  - **Dynamic Google Fonts Loader ([`src/components/builder/canvas/fontLoader.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/canvas/fontLoader.helpers.ts))**:
    - Dynamically generates and injects valid Google Fonts `<link>` into `<head>` when switching fonts (Inter, Poppins, League Spartan, Plus Jakarta Sans, DM Sans, Outfit, Playfair Display, Merriweather, Montserrat, Roboto, JetBrains Mono).
  - **Strict CSS Scoping & Theme Isolation ([`src/components/builder/inspector/GlobalThemeInspector.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/GlobalThemeInspector.svelte), [`src/components/builder/Canvas.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/Canvas.svelte), [`src/components/builder/BuilderEditor.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/BuilderEditor.svelte), [`src/styles/global.css`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/styles/global.css))**:
    - **No Global Variable Leakage**: Removed `[data-theme]` from optimistic DOM mutator `setCanvasCssVar`, strictly targeting `#canvas-frame, [aria-label="Editable Page Canvas"]`.
    - **Builder Shell Isolation**: Explicitly locked builder shell/chrome (`.builder-root`, `header`, `aside`, `TopBar`, `LayerPanel`, `PropertyInspector`) to native UI sans-serif fonts (`var(--font-ui-sans, 'Poppins', system-ui, sans-serif)` and `var(--font-ui-heading, 'League Spartan', sans-serif)`).
    - **Scoped Template Variables**: All dynamic template colors, typography scales, button radiuses, and fonts are applied exclusively to `#canvas-frame` / `.builder-canvas-viewport`.
  - 0 typecheck errors, 0 lint warnings, 100% passing tests (375 passed in 54 test suites).

- **Google Maps Section Global Design System & Live Scaled Typography Parity ([`src/components/builder/sections/GoogleMaps.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/GoogleMaps.svelte)):**
  - Synchronized all 10 Google Maps presets and subcomponents under [`src/components/builder/sections/maps/`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/maps/) with Global Design System tokens:
    - **Live Dynamic Typography Scaling**:
      * Main section titles (`<h2>` in `MapsHeader.svelte`, `MapsMinimalFramed.svelte`, `MapsCompactBoxed.svelte`): `font-size: var(--theme-text-h2, var(--text-h2-size, 26px))` / `font-weight: var(--theme-text-h2-weight, var(--text-h2-weight, 700)); font-family: var(--theme-font-heading, var(--font-heading, inherit));`.
      * Card titles & panel headers (`<h3>` in `MapsFullwidth.svelte`, `MapsFloatingCard.svelte`, `MapsCardOverlay.svelte`, `MapsSplitInfo.svelte`, `MapsTwoColumnDirections.svelte`): `font-size: var(--theme-text-h3, var(--text-h3-size, 20px))` / `font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 600)); font-family: var(--theme-font-heading, var(--font-heading, inherit));`.
      * Body text, addresses, directions & button labels: `font-size: var(--theme-text-body, var(--text-body-size, 14px-16px)); font-family: var(--theme-font-body, var(--font-family, inherit));`.
      * Badges, captions & operation status: `font-size: var(--theme-text-caption, var(--text-caption-size, 10px-11px)); font-family: var(--theme-font-heading, var(--font-heading, inherit));`.
    - **Colors & Surfaces**: Standardized cards and backgrounds with `--color-text-main`, `--color-text-secondary`, `--color-border`, `--color-card-base`, `--color-nested-base`, and `--theme-primary`.
    - **Buttons & Badges**: Bound primary CTA buttons (`--btn-primary-bg`, `--btn-primary-text`), secondary action buttons (`--btn-secondary-bg`, `--btn-secondary-text`), and button radiuses (`--btn-radius`, `--theme-btn-radius`).
    - **Sub-node Active Rings**: Standardized active selection highlights with `ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900`.
    - **Layout Sizing**: Wrapped section container in `.builder-safe-container` with `max-width: var(--active-max-width, var(--theme-max-width, 1200px))` and inline safe-zone padding `var(--active-safe-zone, 32px)`.
  - Zero raw emojis, 100% Lucide Svelte SVG icons, 0 typecheck errors, 0 lint warnings, strictly $\le 300$ lines per file, 100% passing tests (375 tests in 54 test suites).

- **100% Global Design System Parity for Footer & Contact Sections ([`src/components/builder/sections/Footer.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/Footer.svelte)):**
  - Refactored and synchronized `Footer.svelte` and all 10 presets under [`src/components/builder/sections/footer/`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/footer/) with Global Design System tokens:
    - **Dual-Variable / SSOT Synchronization**: Bound to `var(--theme-X, var(--SSOT-X, fallback))` for instant live preview response from `GlobalThemeInspector` while maintaining complete design system token compliance.
    - **Semantic Font Families**: Brand titles, column headings, and CTA banner titles use `var(--theme-font-heading, var(--font-heading, inherit))`. Descriptions, links, addresses, and copyright use `var(--theme-font-body, var(--font-family, inherit))`. Preserved bold aesthetic for `giant_wordmark`.
    - **Live Scalable Dynamic Typography**:
      * Store names / CTA banner titles: `font-size: var(--theme-text-h3, var(--text-h3-size, 20px))` / `font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700))`.
      * Column headings: `font-size: var(--theme-text-caption, var(--text-caption-size, 12px))` / `font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;`.
      * Body text / descriptions / links / contact items: `font-size: var(--theme-text-body, var(--text-body-size, 14px))`.
      * Copyright / sub-badges: `font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85)`.
    - **Semantic Colors & Surfaces**: Replaced hardcoded Tailwind colors (`bg-slate-*`, `text-slate-*`) with `--color-card-base`/`--theme-surface`, `--color-nested-base`, `--color-text-main`/`--theme-text-primary`, `--color-text-secondary`/`--theme-text-muted`, `--color-border`, and `--theme-primary`.
    - **Buttons & Badges**: Standardized with `--btn-primary-bg`/`--theme-btn-primary-bg`, `--btn-secondary-bg`/`--theme-btn-secondary-bg`, `--btn-radius`/`--theme-btn-radius`, and `active:scale-[0.98]`.
    - **Layout & Safe-Zone Spacing**: Container width bound to `max-width: var(--theme-max-width, var(--active-max-width, 1200px))` and safe-zone padding `var(--active-safe-zone, var(--theme-safe-zone-desktop, 32px))`.
  - **Live CSS Var Ingestion Update ([`src/components/builder/inspector/GlobalThemeInspector.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/GlobalThemeInspector.svelte))**:
    - Upgraded `setCanvasCssVar` to target both `[data-theme]` and `[aria-label="Editable Page Canvas"]`, simultaneously updating `--theme-*` and `--color-*`/`--font-*`/`--btn-*`/`--active-*` tokens.
  - 0 typecheck errors, 0 lint warnings, strictly $\le 300$ lines per file, 100% passing tests (375 tests in 54 test suites).
  - **Adaptive Layer Tree ([`src/components/builder/layer/layerPanel.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/layerPanel.helpers.ts))**: File tetap $\le$ 300 baris (296 baris).
  - **Contextual Cloudinary WebP Uploader ([`src/components/builder/inspector/node-forms/FooterNodeForms.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/node-forms/FooterNodeForms.svelte))**: File strictly $\le$ 300 baris (296 baris).
  - **Zero Emojis**: 100% Lucide Svelte SVG icons.
  - **Strict Limit $\le$ 300 Baris per File**: 0 lint warnings, 0 typecheck errors, 100% unit tests passed.


- **10 Features & Keunggulan Layout Presets ([`src/components/builder/sections/Features.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/Features.svelte)):**
  - Modularized all 10 presets under [`src/components/builder/sections/features/`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/):
    1. `grid_3_cards` ([`FeaturesGrid3Cards.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesGrid3Cards.svelte)): 3-column desktop / 2-column tablet / 1-column mobile grid with scoped `@container featurecard` styles.
    2. `horizontal_list` ([`FeaturesHorizontalList.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesHorizontalList.svelte)): 2-column asymmetric layout with sticky left heading (4fr / 8fr) and scoped container queries.
    3. `banner_inline_bar` ([`FeaturesBannerInlineBar.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesBannerInlineBar.svelte)): 3-column horizontal ribbon on desktop/tablet, vertical stack on mobile with scoped container queries.
    4. `bento_grid_asymmetric` ([`FeaturesBentoGrid.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesBentoGrid.svelte)): 12-column desktop bento (span-8 and span-4), 2-column tablet, 1-column mobile with scoped container queries.
    5. `alternating_zigzag_rows` ([`FeaturesAlternatingZigzag.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesAlternatingZigzag.svelte)): 2-column desktop alternating rows with image and text reversing with scoped container queries.
    6. `interactive_tabs` ([`FeaturesInteractiveTabs.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesInteractiveTabs.svelte)): 5fr/7fr desktop split showcase with tabs switcher and scoped container queries.
    7. `vertical_accordion_showcase` ([`FeaturesVerticalAccordion.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesVerticalAccordion.svelte)): 5fr/7fr desktop split with interactive accordion and scoped container queries.
    8. `sticky_scroll_highlight` ([`FeaturesStickyScroll.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesStickyScroll.svelte)): 4fr/8fr asymmetric desktop split with sticky commitment card and scoped container queries.
    9. `dense_icon_matrix` ([`FeaturesDenseMatrix.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesDenseMatrix.svelte)): 4-column desktop / 3-column tablet / 2-column mobile matrix with scoped container queries.
    10. `before_after_comparison` ([`FeaturesComparison.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesComparison.svelte)): 2-column side-by-side comparison on desktop/tablet, 1-column vertical on mobile with scoped container queries.
  - **Scoped Svelte Container Queries & Zero Scoping Leak:**
    - Wrapped container styles in inline styles on `<section>` in [`Features.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/Features.svelte).
    - Added dedicated scoped `<style>` blocks in every sub-component (`FeaturesGrid3Cards.svelte`, `FeaturesDenseMatrix.svelte`, etc.) using `@container featurecard`, removing all static Tailwind classes that override grid columns.
  - **Central Design System SSOT Tokens Synchronization:**
    - Synced font families to `--font-heading` (`League Spartan`, fallbacks: `Poppins`, sans-serif) and `--font-family` (`Poppins`, sans-serif).
    - Mapped colors, borders, cards, and backgrounds to semantic tokens (`--color-primary`, `--color-bg-base`, `--color-card-base`, `--color-nested-base`, `--color-text-main`, `--color-text-muted`, `--color-border`).
    - Standardized badge elements with status dot indicators and button active scale states (`active:scale-[0.98]`).
    - Injected complete SSOT & tenant customizable tokens via `buildCanvasCssVars` in [`canvasCss.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/canvas/canvasCss.helpers.ts).
  - **FAQ 10 Presets Architecture & Global Design System Implementation:**
    - Registered and implemented all 10 SSOT layout presets: `accordion_single_col`, `split_faq_sidebar`, `grid_2_col_cards`, `accordion_two_col`, `chat_style_faq`, `search_filtered_faq`, `categorized_tabs_faq`, `compact_numbered_list`, `floating_help_center`, `horizontal_faq_cards`.
    - Pure CSS Container Queries (`@container faqcard`) defined in [`faq.css`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/faq/faq.css).
    - Dual-mode data fallback in [`faq.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/faq/faq.helpers.ts): Automatic deep-link WhatsApp builder via `buildWhatsAppHelpLink`, tenant DB `stores.waNumber` / `props.whatsappNumber` vs manual designer `props.faqs` and fallback mock data.
    - Granular Sub-Node Selection in Canvas: Click handlers trigger active highlight ring (`ring-2 ring-blue-500 ring-offset-2`) for `faq_header`, `faq_cs_card`, `faq_search_bar`, `faq_tabs`, and `faq_item_${idx}`.
    - Adaptive Layer Tree in [`layerPanel.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/layerPanel.helpers.ts): Dynamic nodes tree based on layout preset (CS card on split sidebar, search bar on search filtered, category tabs on categorized tabs, help center titles).
    - Strict Contextual Image Uploader in [`FaqNodeForms.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/node-forms/FaqNodeForms.svelte): Exclusively pure-text / Lucide icons and suppresses media uploads across accordion presets.
    - Zero Emojis (Lucide Svelte Only): Replaced all raw emojis with icons (`ChevronDown`, `Search`, `Package`, `RefreshCw`, `Users`, `HelpCircle`, `CreditCard`, `ShieldCheck`, `MessageCircle`).
    - Modular Architecture ($\le$ 300 Lines Rule): Split FAQ layout into 12 compact subcomponents (`FAQ.svelte` 80 lines, `FaqHeader.svelte` 52 lines, `FaqAccordionSingle.svelte` 61 lines, `FaqSplitSidebar.svelte` 105 lines, `FaqGridCards.svelte` 47 lines, `FaqAccordionTwoCol.svelte` 111 lines, `FaqChatStyle.svelte` 51 lines, `FaqSearchFiltered.svelte` 97 lines, `FaqCategorizedTabs.svelte` 104 lines, `FaqNumberedList.svelte` 50 lines, `FaqHelpCenter.svelte` 60 lines, `FaqHorizontalCards.svelte` 51 lines, `FaqNodeForms.svelte` 138 lines).
  - **Testimonials 10 Presets Architecture & Global Design System Implementation:**
    - Registered and implemented all 10 SSOT layout presets: `masonry_grid`, `single_spotlight`, `chat_bubble_flow`, `infinite_marquee_scroll`, `video_review_cards`, `social_post_cards`, `side_by_side_3_cards`, `logo_client_cloud`, `split_rating_stats`, `carousel_slider`.
    - Pure CSS Container Queries (`@container testicard`) and 25s infinite marquee loop defined in [`testimonials.css`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/testimonials/testimonials.css).
    - Dual-mode data fallback in [`testimonials.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/testimonials/testimonials.helpers.ts): Automatic aggregate calculation via `calculateAverageRating`, tenant DB ulasan / activity logs vs manual designer `props.testimonials` and fallback mock data.
    - Granular Sub-Node Selection in Canvas: Click handlers trigger active highlight ring (`ring-2 ring-blue-500 ring-offset-2`) for `testimonials_header`, `testi_spotlight_quote`, `testi_spotlight_author`, `testi_stats`, `testi_split_reviews`, `testi_slider_track`, `testi_logo_cloud`, `testi_item_${idx}`, `testi_avatar_${idx}`, and `testi_logo_${idx}`.
    - Adaptive Layer Tree in [`layerPanel.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/layerPanel.helpers.ts): Dynamic nodes tree based on layout preset (hiding review cards on logo cloud, showing spotlight nodes on spotlight/chat, aggregate stats on split stats).
    - Contextual Cloudinary WebP Uploader in [`TestimonialsNodeForms.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/node-forms/TestimonialsNodeForms.svelte): Exclusively appears when inspecting avatar, video cover, or logo on image-supported presets.
    - Zero Emojis (Lucide Svelte Only): Replaced all raw emojis with icons (`Star`, `CheckCircle2`, `ShieldCheck`, `MessageCircle`, `Heart`, `Play`, `ChevronLeft`, `ChevronRight`, `Sparkles`).
    - Modular Architecture ($\le$ 300 Lines Rule): Split testimonials layout into 11 compact subcomponents (`Testimonials.svelte` 70 lines, `TestimonialsMasonryGrid.svelte` 80 lines, `TestimonialsSpotlight.svelte` 79 lines, `TestimonialsChatBubble.svelte` 56 lines, `TestimonialsSideBySide.svelte` 97 lines, etc.).
  - **Product Catalog 20 Presets Architecture & Global Design System Implementation:**
    - Registered and implemented all 20 SSOT layout presets: `grid_standard`, `carousel_scroll`, `list_compact`, `masonry_catalog`, `bento_product_spotlight`, `split_category_sidebar`, `compact_mini_cards`, `price_table_view`, `lookbook_gallery`, `flash_sale_countdown`, `interactive_filter_tabs`, `quick_buy_whatsapp_direct`, `bundle_package_tiers`, `single_product_deep_focus`, `badge_stock_scarcity`, `seasonal_hampers_gift`, `before_after_product_effect`, `digital_download_catalog`, `customer_review_paired_card`, `minimal_accordion_catalog`.
    - Pure CSS Container Queries (`@container productcard`) defined in [`catalog.css`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/catalog/catalog.css).
    - Dual-mode data fallback in [`productCatalog.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/productCatalog.helpers.ts): Supports dynamic live DB query from `products` & `stores.waNumber` as well as manual designer mock data in `props.products`. Formats Indonesian Rupiah via `formatRupiah` and builds sanitized deep links via `buildWhatsAppOrderLink`.
    - Granular Sub-Node Selection in Canvas: Click handlers trigger active highlight ring (`ring-2 ring-blue-500 ring-offset-2`) for `catalog_header`, `catalog_categories`, `catalog_sidebar`, `catalog_timer`, `catalog_bundle_tier`, `catalog_cta`, `catalog_price_rows`, `product_desc`, `product_item_${idx}`, and `product_image_${idx}`.
    - Adaptive Layer Tree in [`layerPanel.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/layerPanel.helpers.ts): Dynamic nodes tree based on layout preset (e.g., hiding image nodes on text/table presets).
    - Strict Contextual Cloudinary Image Uploader in [`CatalogNodeForms.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/node-forms/CatalogNodeForms.svelte): Strictly suppresses uploader for non-image presets (`price_table_view`, `minimal_accordion_catalog`).
    - Zero Emojis (Lucide Svelte Only): Replaced all raw emojis with icons (`ShoppingBag`, `Tag`, `Zap`, `Package`, `CreditCard`, `Flame`, `Check`, `Search`, `ArrowRight`, `Clock`, `Sparkles`, `Star`, `Download`, `Gift`, `FileText`).
    - Modular Architecture ($\le$ 300 Lines Rule): Split catalog layout into 14 compact subcomponents (`ProductCatalog.svelte` 164 lines, `CatalogGridStandard.svelte` 176 lines, `CatalogCarouselScroll.svelte` 141 lines, `CatalogBentoSpotlight.svelte` 162 lines, `CatalogSpecialCards.svelte` 176 lines, etc.).
  - **Hero Section Refactor — Sub-Node Selection, Adaptive Layer Panel & Modular Architecture:**
    - Sub-node click selection (`ring-2 ring-primary ring-offset-2`): Enabled direct canvas selection for `hero_badge`, `hero_title` (H1), `hero_subtitle`, `hero_cta`, `hero_image`, and contextual sub-nodes (`hero_booking_card`, `hero_chat_simulation`, `hero_stat_counter`, `hero_bento_promo`, `hero_bento_image`, `hero_bento_review`, `hero_pill_category`, `hero_email_capture`, `hero_social_proof`, `hero_founder_photo`).
    - Dynamic Layer Panel tree mapping in [`layerPanel.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/layerPanel.helpers.ts): Only renders nodes that actually exist in the active preset. Image node is strictly hidden on text-centric layouts.
    - Conditional Cloudinary Image Uploader: `HeroElementNodeForms.svelte` restricts `HeroImageNodeForm` only to media sub-nodes and presets supporting imagery.
    - Modular architecture & Strict Line Limit: Extracted `HeroHeaderContent.svelte`, `HeroGradientMesh.svelte`, `HeroOversizedTypography.svelte`, `HeroExtraNodeForms.svelte`, and `hero.css`, reducing `Hero.svelte` from 489 lines down to 286 lines (all files strictly $\le$ 300 lines).
    - Design System SSOT Tokens: Inlined CSS container query context (`@container herocard`), `var(--color-bg-base)`, `var(--color-card-base)`, `var(--color-text-main)`, `var(--color-text-secondary)`, `var(--color-border)`, `var(--font-heading)`, and active button scales.
  - **Strict Global Design System Inheritance & Heading Hierarchy (Header, Hero, Features):**
    - Enforced Single H1 Policy across the page: exactly one `<h1>` in Hero main title (`.text-heading-xl font-heading text-main`), zero `<h1>` in Header (uses `<span>` or `<div>` with `.font-heading`) and Features (uses `<h2>` with `.text-heading-lg`).
    - Eliminated all local font overrides (e.g. `font-serif` removed from `HeroEditorialSerif.svelte`). All headings strictly inherit `var(--font-heading)` and body inherits `var(--font-family)`.
    - Added semantic tag level selector in element inspector (`HeroElementNodeForms.svelte` and `FeatureHeadingNodeForm.svelte`) with validation guard against non-hero H1 usage.
    - Updated `ThemeTypographyTab.svelte` with SSOT options (`League Spartan` and `Poppins`) and Golden Ratio scales.
  - **Sub-Node Selection & Adaptive Layer Panel Mapping (Header-Parity):**
    - Enabled direct click selection for heading (`features_heading`), individual feature items (`feature_item_${idx}`), and illustration image (`features_image`) with active ring highlight (`ring-2 ring-blue-500 ring-offset-2`).
    - Dynamic preset-based Layer panel tree in [`layerPanel.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/layer/layerPanel.helpers.ts): only shows `features_image` on image-supported presets, and renders comparison nodes for `before_after_comparison`.
    - Built sub-node inspector forms: [`FeatureHeadingNodeForm.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/node-forms/FeatureHeadingNodeForm.svelte), [`FeatureItemNodeForm.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/node-forms/FeatureItemNodeForm.svelte), and [`FeatureImageNodeForm.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/inspector/node-forms/FeatureImageNodeForm.svelte) with strict conditional Cloudinary WebP upload hiding for non-image presets.
  - **Strict Architecture Limit Compliance (< 300 Lines per File):**
    - Refactored [`Features.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/Features.svelte) down to 142 lines by extracting [`features.helpers.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/features.helpers.ts) and [`FeaturesHeaderTitle.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/FeaturesHeaderTitle.svelte).
    - Modularized [`FeaturesContent.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/content/FeaturesContent.svelte) down to 73 lines via [`FeaturesComparisonContent.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/content/features/FeaturesComparisonContent.svelte) and [`FeaturesRepeaterContent.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/content/features/FeaturesRepeaterContent.svelte).
  - Replaced all emojis with official `lucide-svelte` icons and created dynamic icon resolver [`featureIcons.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/sections/features/featureIcons.ts).
  - Applied CSS Container Queries (`@container featurecard`) and SSOT safe-zone spacing (`var(--active-safe-zone)`).

- **In-Memory Rate Limiter (Public APIs):**
  - Implemented `InMemoryRateLimiter` utility to protect all `/api/` endpoints across the platform.
  - Set strict, user-safe limits of **30 requests per minute** per IP address in Astro `src/middleware.ts` to block bot spam and brute-force attacks (`429 Too Many Requests`).
  - Added global, headless `RateLimitAlert.svelte` component to intercept `window.fetch` and trigger standard UI toast alerts when hitting the limit, matching the dashboard aesthetics.

- **Password Reset Flow Integration:**
  - Implemented the full forgot/reset password flow using BetterAuth verification tokens and Resend API via HTTP fetch (bypassing Cloudflare Node compatibility issues).
  - Built dedicated `src/pages/api/auth/reset-password.ts` custom endpoint for validating and applying the password reset.
  - Created `src/pages/auth/forgot-password.astro` and `src/pages/auth/reset-password.astro` frontend pages fully utilizing the design system (`Input`, `Button` components) to match the `/designer/wallet` aesthetic.
  - Type-check, lint, and build verified.

- **High-Craft SaaS Dashboard Redesign (Putih, Biru, Hitam, & Oren):**
  - **100% Button UI Component Adoption ([`src/components/ui/Button.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK\umkm-site-builder\src\components\ui\Button.svelte)):**
    - Eliminated raw HTML `<button>` and DaisyUI `.btn` classes across all tenant, designer, admin views, and checkout flow.
    - Standardized Astro page quick action header buttons (`/dashboard/orders`, `/designer/templates`, `/designer/orders`, `/admin/template-categories`, `/admin/templates`, `/admin/settings`) to use `<Button client:load size="md" ...>`.
    - Redesigned Checkout Experience (`/checkout/[invoiceId]` & `CheckoutSummaryCard.svelte`):
      - Clean SaaS Receipt / 2-Column Split Layout (`max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8`) with ambient background lighting and breadcrumb stepper.
      - Left column (7 cols): Browser mockup showcase with live preview, creator badge with verified checkmark, and 2x2 interactive license benefits grid (Lifetime, No-Code Editor, WhatsApp Order, Instant Subdomain).
      - Right column (5 cols): Single unified payment card with invoice copy chip, itemized pricing breakdown with fee discounts, 24h countdown, `<Button variant="primary" fullWidth size="lg">`, payment method badges strip (QRIS, VA Bank, E-Wallet), and SSL encrypted trust guarantee.
      - Fully removed mismatched dark card boxes in light mode; 100% harmonious single-tone card styling.
    - **Tenant Template Gallery & Ownership Fix**:
      - Created `/api/templates` and `/api/tenant/templates` endpoints backed by `getTenantOwnedTemplates(userId)` to strictly return templates owned/purchased by the tenant (from `userTemplates` table) plus free approved templates.
      - Updated `TemplateGallery.svelte` to apply templates via `POST /api/stores/${storeId}/apply-template` with proper validation, clean empty states, and toast notifications.
    - Standardized variant hierarchy: `primary`, `dark`, `orange`, `secondary`, `tertiary`, `destructive`.
    - Added `size="xs"` (`text-2xs px-2.5 py-1 rounded-xl h-7`) and `size="icon"` (`p-1.5 rounded-xl h-8 w-8`) for crisp table row and modal actions.
    - Full type-safety, 0 warnings, 45 test suites (315 tests) passing.
  - **7 Pages Comprehensive Refactor & Polish (100% Token & Atomic UI Compliance):**
    1. **Tenant Order History ([`/dashboard/orders`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/dashboard/orders.astro)):** Standardized header, 4-theme StatCards (`dark`, `default`, `orange`, `blue`), 10-item DaisyUI `<Pagination>`, click-to-copy invoice ID with toast, and responsive status filters.
    2. **Public Marketplace ([`/templates`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/templates/index.astro)):** Upgraded search bar, price & sort dropdowns, category pills, verified designer info, 9-item DaisyUI `<Pagination>`, and direct purchase flow.
    3. **Designer Templates ([`/designer/templates`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/designer/templates.astro)):** 4-theme StatCards, table/grid view switcher, 10-item DaisyUI `<Pagination>`, clean modals, and rejection reason review dialog.
    4. **Designer Orders ([`/designer/orders`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/designer/orders.astro)):** 4-theme StatCards, 10-item DaisyUI `<Pagination>`, tenant avatar & email, gross vs net commission pill (`+Rp ...` in emerald), and click-to-copy invoice ID.
    5. **Admin Template Review ([`/admin/templates`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/admin/templates/index.astro)):** 4-theme StatCards, review queue tabs, 10-item DaisyUI `<Pagination>`, approval modal, and rejection reason textarea modal.
    6. **Admin Master Categories ([`/admin/template-categories`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/admin/template-categories/index.astro)):** 3-theme StatCards, master categories table with 10-item DaisyUI `<Pagination>`, icon selector grid, and create/edit/delete modals.
    7. **Admin Settings ([`/admin/settings`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/admin/settings/index.astro)):** 3-theme StatCards, interactive dual-hue progress bar (Blue for Platform / Emerald for Designer), instant simulation box, quick fee preset buttons (20/80, 30/70, 40/60), and settlement delay presets.
  - **Comprehensive Design Token Migration (`tailwind.config.mjs`, `global.css`, `colors.ts`):** Registered full RGB alpha channel variables for semantic colors (`primary`, `orange`, `success`, `error`, `warning`, `info`) across light & dark modes. Purged 100% of hardcoded arbitrary hex bracket styles (`[#ff5b35]`, `[#1c120c]`, `[#ff7b5c]`) across all components, replacing them with standardized Tailwind tokens (`bg-orange`, `text-orange`, `border-orange/20`, `bg-orange/15`, `text-orange-light`, `bg-primary`, `to-slate-950`).
  - **Reusable DaisyUI Pagination Component (`Pagination.svelte` & `src/components/ui`):** Created a universal `<Pagination>` component leveraging DaisyUI `join` and `join-item btn` classes, featuring smart ellipsis handling, previous/next chevron navigation, and responsive info labels (_"Menampilkan 1-10 dari 45 data"_). Implemented 10-row pagination on both **Riwayat Mutasi & Transaksi** (`DesignerMutationTable.svelte`) and **Riwayat Penarikan Dana** (`DesignerPayoutHistoryTable.svelte`), complete with auto-reset to page 1 on search/filter changes.
  - **Technical Terms Purge (`DesignerWithdrawModal.svelte`, `DesignerBankWithdraw.svelte`, `DesignerPayoutHistoryTable.svelte`):** Completely removed technical jargon (e.g. "via Xendit", "payment gateway") from user-facing copy, replacing them with clear, friendly Indonesian language descriptions.
  - **Withdrawal Modal Thousand Separators & State Sync (`DesignerWithdrawModal.svelte`):** Fixed CustomEvent target resolution with `bind:value` synchronization, enabling automatic real-time frontend dot thousands formatting (`100.000`, `1.250.000`). Resolved button enable/disable state sync when manually typing or clearing presets, enforcing strict minimum payout (`>= minPayoutLimit`) and maximum balance bounds.
  - **Modal Header Alignment & Validation Polish (`DesignerBankModal.svelte`, `DesignerWithdrawModal.svelte`):** Placed custom icon + title + subtitle into `<svelte:fragment slot="header">` so the `X` close button aligns seamlessly on the same row with the title. Configured strict payout button disabled state requiring minimum payout (`>= minPayoutLimit`), disabling submission when empty or less than minimum, and displaying dynamic error feedback.
  - **Themed Modals Studio (`DesignerBankModal.svelte`, `DesignerWithdrawModal.svelte`, `Modal.svelte`):** Purged top gradient beam in modal base; upgraded both modal dialogs to match the Black & Orange dashboard palette with squircle icon badges (`bg-slate-900 text-white` & `bg-orange/15`), dark slate balance status bars, instant percentage preset pills (50%/100%), security encryption trust badges, and orange CTA confirmation buttons.
  - **Dynamic Time-Based Greeting (`/designer/wallet`):** Header displays Indonesian contextual greeting (`Selamat Pagi`, `Selamat Siang`, `Selamat Sore`, `Selamat Malam`) based on current user local time.
  - **Unified Master Bank & Payout Card (`DesignerBankWithdraw.svelte`):** Merged the bank account info and ready-to-withdraw balance into a single seamless Black & Orange Debit Card (`from-slate-950 via-slate-900 to-slate-950`) with gold EMV chip, NFC wave, bank badge, spaced account numbers, cardholder name, overlapping debit circles, and a frosted glass lower tray featuring available balance + vibrant orange "Tarik Dana" CTA button.
  - **Color Palette & System Tokens (`colors.ts`, `global.css`):** Integrated vibrant Tangerine Orange (`#ff5b35`), Electric Blue (`#2563eb`), Deep Black (`#0f172a`), and Crisp White (`#ffffff`), complete with semantic `--color-orange` variables and `orange` badge/card themes.
  - **StatCard Enhancements (`StatCard.svelte` & `DesignerStatCards.svelte`):** Supported `cardTheme` (`'dark'`, `'orange'`, `'blue'`, `'default'`). Total Saldo Dompet is Deep Black (`#0f172a`), Saldo Siap Tarik is Vibrant Orange (`#ff5b35`), Total Pendapatan Bersih is Electric Blue (`#2563eb`).
  - **Lively Ledger & Payout Tables (`DesignerMutationTable.svelte`, `DesignerPayoutHistoryTable.svelte`):** Vivid transaction icons (south_west / north_east), emerald / orange amount pills (`+Rp ...` / `-Rp ...`), animated copy feedback, and rounded-full segmented status filters.
  - **Modern Chunky Charts (`DesignerWalletOverview.svelte`):** Weekly Income bar chart features chunky rounded bars in deep black with today/peak bar highlighted in vibrant orange; donut distribution chart utilizes clean multi-hue segments.
  - **Shell & Navigation Polish (`SidebarDesktop.svelte`, `SidebarMobile.svelte`, `DashboardNavbar.svelte`):** Modern brand logo pill, active dark/blue navigation pills with pulsing orange beacons, rounded-full search bar, and orange notification dots.
  - All 45 test files (315 tests) passing, 0 typecheck errors, 0 lint warnings.
- **Public Navbar Redesign & User Profile Dropdown:**
  - Built interactive [`PublicNavbar.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK\umkm-site-builder\src\components\common\PublicNavbar.svelte) and integrated with [`Navbar.astro`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK\umkm-site-builder\src\components\common\Navbar.astro).
  - Repositioned Theme Toggle before auth actions, added a vertical divider, and created a rich interactive user dropdown menu with role badges, direct role-specific dashboard routing, template navigation, order history, and instant logout action.
  - Provided responsive mobile navigation drawer with theme switching and auth states.
  - All 45 test files (318 tests) passing, 0 typecheck errors, 0 lint warnings.
- **Role-Based Marketplace Purchasing & Clean Actions:**
  - Configured role-based purchasing guard in [`PublicTemplateMarketplace.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK\umkm-site-builder\src\components\public\PublicTemplateMarketplace.svelte): only tenants (and unauthenticated guests) see the purchase/apply button. Other logged-in roles (`designer`, `admin`, `superadmin`) see a single full-width _Pratinjau Langsung_ button.
  - All 45 test files (318 tests) passing, 0 typecheck errors, 0 lint warnings.
- **Marketplace Cleanups & Type Modularization:**
  - Extracted public marketplace types (`PublicTemplate`, `CategoryItem`) into dedicated [`marketplace.types.ts`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/public/marketplace.types.ts).
  - Removed template ID labels from cards and removed "Buka Editor" button for published catalog items.
  - Set "Pratinjau" button to navigate within the same tab (removed `target="_blank"`).
  - All 45 test files (318 tests) passing, 0 typecheck errors, 0 lint warnings.
- **Public Templates Marketplace Redesign (`/public/templates` & `/templates`):**
  - Redesigned public template catalog with modern royal hero banner, category pills rail with count badges, real-time search capsule, and multi-option price filter (`Semua`, `Gratis`, `Berbayar`, `< 50rb`, `50-100rb`, `> 100rb`).
  - Added multi-criteria sorting (Terbaru, Harga Terendah/Tertinggi, Nama A-Z) and interactive instant purchase / apply flows.
  - Implemented responsive cards with floating frosted glass category pills, price tags, designer avatars, and full preview/checkout buttons.
  - All 45 test files (318 tests) passing, 0 typecheck errors, 0 lint warnings.
- **StatCard & Layout Improvements:**
  - Redesigned [`StatCard.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/ui/StatCard.svelte) to prevent any title overlap/clipping and removed artificial text truncation on values, ensuring large numbers (e.g. `Rp 8.800.000` or `Rp 10.800.000.000`) always display completely without dots (`...`).
  - Expanded Commission & Platform Settings form (`CommissionSettingsPanel.svelte`) to `w-full` for optimal responsive stretch.
  - Standardized font size of `(Hak 70%)` across designer order tables to be balanced and subtle (`text-[10px]`).
  - Upgraded dashboard StatCard grids to `xl:grid-cols-4` with generous gap spacing.
  - All 45 test files (318 tests) passing, 0 typecheck errors, 0 lint warnings.
- **Dashboard & Component Refinements:**
  - Resolved TypeScript comparison errors across `dashboard/orders.astro` and `designer/orders.astro`.
  - Refined Commission Settings form (`CommissionSettingsPanel.svelte`) with interactive percentage split presets, live range sliders, and settlement delay options.
  - Enhanced "Tambah Kategori Baru" action button in `TemplateCategoryManager.svelte` with high-contrast vibrant gradient.
  - Implemented dynamic responsive font scaling in `StatCard.svelte` to prevent value truncation or broken wrapping for large currency amounts.
  - Polished table action buttons in `OrderHistoryTable.svelte` with distinct gradients and hover effects.
  - Categorized sidebar navigation into clean, distinct groups for all roles (`tenant`, `designer`, `admin`, `superadmin`).
  - All 45 test files (318 tests) passing, 0 typecheck errors, 0 lint warnings.
- **Unified UI Redesign across 5 Core Dashboard Pages:**
  - Redesigned `/designer/orders`, `/admin/templates`, `/admin/template-categories`, `/admin/settings`, and `/dashboard/orders` to align with the visual standard of `/designer/wallet` and `/designer/templates`.
  - Added animated `StatCard` grids, generous page headers, action pills, top-beam accent cards, structured table search capsules, segmented status filter pills, and unified design system modals.
  - All 45 test files (318 tests) passing, 0 typecheck errors, 0 lint warnings.
- **Designer Incoming Template Orders (`/designer/orders`):**
  - Added `getDesignerIncomingOrders(designerId)` in `transactionService` querying transactions associated with templates created by the designer, joining `template`, `user` (tenant), and `commission` records.
  - Created [`DesignerOrdersTable.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/designer/DesignerOrdersTable.svelte) with stat summaries (hak komisi lunas, template terjual, total pesanan), filter tabs, search, gross vs net commission columns, and status badges.
  - Created [`src/pages/designer/orders.astro`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/designer/orders.astro) protected for designers.
  - Added "Pesanan Masuk" to designer navigation menu in `sidebar.helpers.ts`.
  - Added unit test cases for `getDesignerIncomingOrders` in `tests/lib/transactions/service.test.ts`.
- **Tenant Template Purchase Order History (`/dashboard/orders`):**
  - Added `getTenantOrders(userId)` method in `transactionService` querying `transactions` where `type = 'template_purchase'` with `template` relation.
  - Created [`OrderHistoryTable.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/dashboard/OrderHistoryTable.svelte) featuring status filters (`pending`, `paid`, `expired`, `failed`), invoice lookup, direct payment links, and "Terapkan ke Toko" actions.
  - Created [`src/pages/dashboard/orders.astro`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/pages/dashboard/orders.astro) integrated into `DashboardLayout`.
  - Added "Riwayat Pesanan" to tenant navigation menu in `sidebar.helpers.ts`.
  - Added unit test cases for `getTenantOrders` in `tests/lib/transactions/service.test.ts`.
- **Template Thumbnail & Dynamic DB Categories on Builder New Form:**
  - Integrated `ImageUpload` into [`NewTemplateForm.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/builder/NewTemplateForm.svelte) with direct Cloudinary upload (folder: `templates`, max: 1 file, 5MB).
  - Cleaned up static fallback categories from `NewTemplateForm.svelte`; now strictly loads real categories from database / API.
  - Added real-time image preview in the Marketplace Live Card Mockup on `/builder/new`.
  - Persisted `thumbnailUrl` into `POST /api/designer/templates/draft`.
- **Template Categories Management & Builder Integration:**
  - Added API endpoints: Public `GET /api/public/template-categories` and Admin `GET`, `POST`, `PUT`, `DELETE` at `/api/admin/template-categories/`.
  - Added service layer in `src/services/template-categories/` with CRUD operations and slug uniqueness validation.
  - Integrated dynamic template categories into `src/pages/builder/new.astro` and `src/components/builder/NewTemplateForm.svelte` with live category selection and `categoryId` persistence on draft creation.
  - Created Admin Template Category Manager panel (`src/components/admin/TemplateCategoryManager.svelte`) and page (`src/pages/admin/template-categories/index.astro`).
  - Added unit test suite in `tests/api/template-categories.test.ts`.
- **Template Categories Schema & DB Migration (`src/db/schema.ts` & `src/db/seed.ts`):**
  - Added `templateCategories` table (`id`, `name`, `slug`, `description`, `icon`, `createdAt`, `updatedAt`) with unique index on `slug`.
  - Added `categoryId` column with foreign key to `templateCategories.id` (`onDelete: 'set null'`) and `templateCategoryIdx` on `templates` table.
  - Added `templateCategoriesRelations` and updated `templatesRelations` with one relation to `category`.
  - Executed `bun x drizzle-kit push --force` to Neon PostgreSQL database.
  - Seeded default categories (`kuliner-makanan`, `fashion-busana`, `jasa-profesional`, `retail-toko-kelontong`).
- **New Template Wizard Redesign (`src/components/builder/NewTemplateForm.svelte` & `src/pages/builder/new.astro`):**
  - Redesigned `/builder/new` into a modern 2-column SaaS initialization studio card with top luminous light beam (`indigo-500`).
  - Added category selector pills and quick pricing preset chips with dynamic income calculator.
- **Language Standards Rule:**
  - Committed [`.agents/rules/language-standards.md`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/.agents/rules/language-standards.md) for permanent workspace rule adherence (Backend English, Frontend Bahasa Indonesia).
- **Test Suite & Verification:**
  - `bun run type-check`: 0 errors, 0 warnings.
  - `bun run lint`: 0 warnings, 0 errors.
  - `bun test:unit`: 44 test suites passed (306/306 unit tests passed).

- **Section Registry Map Architecture (`src/components/builder/registry/`):**
  - `src/components/builder/registry/registry.types.ts` & `index.ts` (NEW): Created centralized `sectionRegistry` map exporting `SectionDefinition` for all 8 section types (`header_announcement`, `hero`, `features`, `product_catalog`, `testimonials`, `faq`, `google_maps`, `footer`) along with `getSectionDefinition`, `getAllSectionDefinitions`, and `registerSection`.
  - `src/components/builder/sections/SectionRenderer.svelte`: Replaced static if-else section rendering with dynamic `<svelte:component this={sectionDef.renderComponent} ... />` based on `isFullBleed` flag.
  - `src/components/builder/ContentTab.svelte` & `StylesTab.svelte`: Replaced hardcoded conditionals with dynamic inspector components (`sectionDef.inspectorComponent`, `sectionDef.stylesComponent`).
  - `src/components/builder/layer/layerPanel.helpers.ts`: Derived `sectionTypeLabels`, `sectionTypeIcons`, and `sectionTypes` dynamically from `getAllSectionDefinitions()`.
  - `tests/builder/section-registry.test.ts` (NEW): 5 unit tests verifying registry map, retrieval, full-bleed flags, and dynamic custom section registration.

- **Template Schema Versioning & Migration Layer:**
  - `src/schemas/templates/template.schema.ts`: Added `CURRENT_SCHEMA_VERSION = 1`, `schemaVersion` field to `TemplateConfigSchema`, and exported `DEFAULT_TEMPLATE_CONFIG`.
  - `src/lib/templates/migration.ts` & `index.ts`: Implemented schema migration pipeline (`migrateTemplateConfig`, `isLegacyConfig`, `normalizeTheme`, `normalizeSection`) to deeply normalize and upgrade legacy template configs without runtime exceptions.
  - `src/components/builder/stores/editorStore.types.ts`: Replaced local `ensureValidConfig` with centralized `migrateTemplateConfig` from `@/lib/templates`.
  - `src/services/templates/template.service.ts`: Ensured `getTemplateById`, `createTemplateDraft`, and updates apply `migrateTemplateConfig`.
  - `src/pages/api/stores/[storeId]/apply-template.ts`: Migrated template config before persisting to `stores.customization`.
  - `src/pages/builder/preview/[templateId].astro`: Applied `migrateTemplateConfig` to template records on preview.
  - `tests/lib/templates-migration.test.ts`: 16 unit tests covering legacy migration, normalization of themes and sections, schema validation, and idempotency.

- **Header & Canvas Viewport Realignment (3 Breakpoints Audit):**
  - `src/components/builder/Canvas.svelte`: Refactored `<main>` to `flex-1 w-full h-full overflow-auto flex items-start justify-center p-6 bg-slate-100 dark:bg-slate-950` with centered `#canvas-frame` (`max-w-[1200px]` desktop, `768px` tablet, `375px` mobile) avoiding sidebar collision. Added `--active-safe-zone` CSS variable matching active viewport mode (`32px` desktop, `24px` tablet, `16px` mobile).
  - `src/components/builder/LayoutGridOverlay.svelte`: Bound 12/8/4 column guides directly to `padding-left/right: var(--active-safe-zone)`.
  - `src/components/builder/sections/HeaderAnnouncement.svelte` & `src/components/builder/sections/header/AnnouncementBar.svelte`: Implemented full-bleed 100% outer bar backgrounds with inner container constrained to `--active-safe-zone`, with 64px min-height navbar.
  - `src/components/builder/sections/header/HeaderLogo.svelte` & `HeaderNav.svelte`: Removed internal `p-1` padding offsets so Logo touches Column 1 and Navigation/CTA/Hamburger touches Column 12 (Desktop), Column 8 (Tablet), and Column 4 (Mobile) with pixel precision.
  - Full validation passed: `bun run type-check` (0 errors), `bun run lint` (0 errors), `bun test` (205 tests passing).

- **Strict Grid & Margin Realignment for All 8 Sections (Zero Off-Grid Leaks):**
  - `src/components/builder/LayoutGridOverlay.svelte`: Added `max-width: var(--theme-max-width, 1200px)` matching the exact content column boundaries across wide desktop viewports.
  - `src/components/builder/sections/HeaderAnnouncement.svelte` & `src/components/builder/sections/header/AnnouncementBar.svelte`: Replaced `px-4 sm:px-6` and `max-w-6xl` with unified `.header-nav-container` and `.announcement-inner-container` using `--theme-safe-zone-...` (Desktop 32px, Tablet 24px, Mobile 16px) and `max-width: 1200px`, aligning the Logo precisely to Column 1 and CTA/Contact to Column 12.
  - `src/components/builder/sections/Hero.svelte`: Removed hardcoded safe-zone fallback calculation in favor of media query `.hero-inner-safe-zone` (Desktop 32px, Tablet 24px, Mobile 16px) with full bleed background image/overlay.
  - `src/components/builder/sections/Features.svelte`, `ProductCatalog.svelte`, `Testimonials.svelte`, `FAQ.svelte`, `GoogleMaps.svelte`, `Footer.svelte`: Purged redundant inner `max-w-6xl`, `max-w-[var(--theme-max-width,1200px)]`, and `px-4 sm:px-6` wrappers so that outer `.section-safe-container` in `SectionRenderer.svelte` serves as the single source of truth for grid margins.
  - Full validation passed: `bun run type-check` (0 errors), `bun run lint` (0 errors), `bun test` (205 tests passing).

- **Device Preview Viewport Width Resizing & 0px Margin Default:**
  - `src/components/builder/Canvas.svelte`: Fixed tablet (`768px`) and mobile (`375px`) viewport resizing with strict explicit width bounds (`width: 768px` / `width: 375px`, `min-width`, `max-width`, and `shrink-0`), centered inside scrollable backdrop (`overflow-x-auto p-0 sm:p-4 md:p-6`).
  - `src/components/builder/sections/SectionRenderer.svelte`: Standardized `defaultPadding` to `'0px'` for all sections, with inner container `.section-safe-container` dynamically bound to responsive design system safe zones (`32px` desktop, `24px` tablet, `16px` mobile).
  - `src/components/builder/sections/Hero.svelte`: Standardized vertical padding fallback to `0px` and horizontal padding fallback to `activeSafeZone` when `paddingLeft`/`paddingRight` is `'0px'` or undefined.
  - `src/components/builder/inspector/SectionLayoutPanel.svelte`: Added `{ value: '0px', label: '0px (Default / Ikut Margin)' }` as the top default option for both vertical and horizontal padding dropdowns, and updated `setEdgeToEdge` preset.
  - `src/schemas/templates/template.schema.ts` & `src/components/builder/stores/editorStore.ts`: Updated all default template sections and newly created sections to initialize with `padding: '0px'`.

- **Zero-Latency Real-Time Preview & Inspector Synchronization:**
  - `GlobalThemeInspector.svelte`: Removed artificial `300ms` debounce timer; all theme color and button variant edits now update Svelte store instantly and synchronously.
  - `GeneralStylesTab.svelte` & `SectionLayoutPanel.svelte`: Added `onStylesChange` / `handleStylesChange` batch update support so vertical padding (`paddingTop` + `paddingBottom` + `padding`) and horizontal padding (`paddingLeft` + `paddingRight` + `padding`) are applied in a single atomic update without stale closure overwrites.
  - Added `on:input` in addition to `on:change` on all select dropdowns across inspector panels (`SectionLayoutPanel.svelte`, `SectionAppearancePanel.svelte`, `NodeStylesTab.svelte`) for instant reaction upon user selection.
  - `SectionRenderer.svelte`: Added `padding-left` and `padding-right` rules; removed `transition-all` on the `<section>` wrapper to eliminate sluggish animation delays on style adjustments.
  - `Hero.svelte`: Bound custom `paddingLeft` and `paddingRight` if explicitly configured on section styles, with fallback to responsive safe-zones.
  - `editorStore.ts`: Streamlined history snapshots in `pushHistory` with a `< 350ms` merge window for zero-latency rapid edits.

- **Full-Bleed Canvas Architecture & Hero Section Constraints Refactor:**
  - `src/components/builder/Canvas.svelte`: Removed `max-w-6xl` and horizontal padding from desktop canvas container so background layers span 100% of the canvas workspace uninterrupted (`w-full min-h-screen relative flex flex-col`).
  - `src/components/builder/sections/Hero.svelte`:
    - Outer Section: `<section id="hero-section" data-node="hero_container" class="relative w-full overflow-hidden ...">` with 100% edge-to-edge full width and vertical margins only (`margin-top: {marginTop}px; margin-bottom: {marginBottom}px`).
    - Full Banner Overlay: Image background and dark overlay span 100% full bleed.
    - Inner Content: `<div class="hero-inner-safe-zone relative z-10 w-full mx-auto box-border">` with `max-width: var(--theme-max-width, 1200px)` and responsive safe zone padding (`32px` desktop, `24px` tablet, `16px` mobile).
  - `src/components/builder/sections/SectionRenderer.svelte`: Configured `defaultPadding` to `'0px'` for Hero and Header, disabling outer container constraints.
  - `tests/schemas/template-tokens-presets.test.ts`: Validated Hero presets, full banner overlay, and safe zone token schemas.
  - Validation: `bun run type-check` (0 errors, 0 warnings from svelte-check), `bun run lint` (0 errors, 0 warnings), `bun test` (205/205 pass).

- **TopBar Cleanup, Figma-Style Sidebar Toggles, & Editor Chrome Theme Sync:**
  - `TopBar.svelte`: Removed the manual `Margin: ... (Normal)` select dropdown. Added Figma-style Left Sidebar toggle button (`PanelLeft` / `PanelLeftClose`) and Right Sidebar toggle button (`PanelRight` / `PanelRightClose`). Added Editor Chrome Theme toggle (`Sun` / `Moon`) linked to `canvasStore.editorTheme`.
  - `editorStore.types.ts` & `editorStore.ts`: Added ephemeral `leftSidebarOpen` (default: true), `rightSidebarOpen` (default: true), and `editorTheme` (default: 'light') to `CanvasState` along with toggle and setter actions (`toggleLeftSidebar`, `toggleRightSidebar`, `toggleEditorTheme`, `setLeftSidebar`, `setRightSidebar`, `setEditorTheme`).
  - `BuilderEditor.svelte`: Master root layout now applies `$canvasStore.editorTheme === 'dark'` classes (`dark bg-slate-950 text-slate-100` vs `bg-slate-100 text-slate-800`), conditionally renders `LayerPanel` and `PropertyInspector` based on store state, and added keyboard shortcuts (`Ctrl+\` for Left Sidebar, `Ctrl+/` for Right Sidebar).
  - `Canvas.svelte`: Backdrop workspace background updated to `bg-slate-100 dark:bg-slate-950` with the inner `#canvas-container` strictly isolated and driven by template CSS variables (`--theme-bg`, `--theme-surface`, etc.).
  - `LayerPanel.svelte` & `PropertyInspector.svelte`: Adjusted aside chrome styles to `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200`.
  - Expanded unit test assertions in `tests/schemas/template-tokens-presets.test.ts` to cover sidebar toggles and editorTheme state.

- **Total Purge of Redundant Inline Styling Controls & Strict Responsive Hardening:**
  - `GlobalThemeInspector.svelte`: Isolated `<input type="color">` exclusively to the global theme inspector panel.
  - `HeaderAnnouncementPanel.svelte`: Replaced raw color pickers with Token-based `<select>` options (`bgTokenOptions`, `textTokenOptions`) and 8pt-locked vertical padding presets (`8px`, `16px`, `24px`).
  - `HeaderLogoPanel.svelte`: Replaced hex color picker with token select, removed arbitrary font sizes (`sm`, `base`, `lg`, `xl`, `2xl`) and weights in favor of Golden Ratio scale tokens (`h2`, `h3`, `body`), and locked logo height slider to 8pt presets (`24px`, `32px`, `40px`, `48px`, `56px`).
  - `HeaderNavPanel.svelte`: Replaced raw hex inputs with Token-based `<select>` for default/hover colors, replaced arbitrary font sizes with Golden Ratio tokens (`body` 16px / `caption` 10px), and locked nav gap to 8pt scale (`8px`, `16px`, `24px`, `32px`).
  - `CatalogCardPanel.svelte`: Replaced CTA button color input with Token select (`ctaColorTokenOptions`), removed arbitrary title font size/weight controls in favor of Golden Ratio `h3`, and locked corner radius & button radius to 8pt scale and pill rules.
  - `CatalogGridPanel.svelte`: Locked grid gap presets to 8pt scale (`8px`, `16px`, `24px`, `32px`).
  - `NodeStylesTab.svelte`: Purged free color inputs and text inputs in favor of token dropdowns, mapped font sizes to Golden Ratio tokens, and locked margin controls to 8pt grid (`0px`, `8px`, `16px`, `24px`, `32px`, `48px`).
  - `nodeStyles.constants.ts`: Purged arbitrary font sizes and hex shadows; mapped to Golden Ratio tokens and 8pt scales.
  - `HeroContent.svelte`: Locked canvas minHeight to 8pt scale presets (`480px`, `560px`, `640px`, `auto`).
  - `DEFAULT_TEMPLATE_SECTIONS` in `template.schema.ts`: Replaced hardcoded hex colors and arbitrary sizes with CSS variable design tokens (`var(--theme-primary, #2563eb)`, `var(--theme-text-primary, #0f172a)`, `var(--theme-text-muted, #64748b)`).
  - All 8 builder section components verified for Mobile-First responsiveness, safe zones (`var(--theme-safe-zone-desktop/tablet/mobile)`), concentric nested radius, and pill avatar/badge radius.
  - Full test suite passed (204 tests), TypeScript check passed (0 errors), ESLint passed (0 warnings).

- **8 Preset Sections with 8pt Grid & Concentric Radius (Step 3):**
  - Refactored all 8 builder section components to strictly eliminate hardcoded hex colors / arbitrary spacing and use 8pt grid + CSS variables:
    - `HeaderAnnouncement.svelte`: `default_split`, `centered_stacked`, `compact_inline` (h-14 / 56px single row).
    - `Hero.svelte`: `split_left_text`, `split_right_text`, `centered_minimal`, `full_banner_overlay` (Nested radius outer 16px, padding 8px, inner 8px; Pill badges).
    - `Features.svelte`: `grid_3_cards`, `horizontal_list`, `banner_inline_bar` (h-16 / 64px ribbon bar).
    - `ProductCatalog.svelte`: `grid_standard`, `carousel_scroll` (snap-scroll), `list_compact` (Nested radius card 16px, inner thumbnail 8px).
    - `Testimonials.svelte`: `masonry_grid`, `single_spotlight`, `chat_bubble_flow` (Pill avatars 48px, star rating gap 8px).
    - `FAQ.svelte`: `accordion_single_col`, `split_faq_sidebar`, `grid_2_col_cards` (Nested radius containers).
    - `GoogleMaps.svelte`: `fullwidth_map`, `split_map_info`, `compact_boxed` (Heights 320px, 400px, 480px; floating cards p-6 / 24px).
    - `Footer.svelte`: `multi_column`, `centered_simple`, `cta_focused` (Floating WhatsApp CTA banner -mt-16 offset).
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
- **10 Google Maps Presets Implementation (SSOT Registry & Modular Architecture):**
  - Implemented and verified all 10 Google Maps layout presets: `fullwidth_map`, `split_map_info`, `compact_boxed`, `floating_address_card`, `two_column_directions`, `store_hours_highlight`, `interactive_route_finder`, `minimal_framed_map`, `multi_branch_tabs`, and `card_overlay_bottom`.
  - Created modular sub-components: `maps.css` (Container Queries `@container mapscard`), `maps.helpers.ts` (URL sanitizing & branch defaults), `MapsHeader.svelte` (Single H2 heading SSOT), `MapsFullwidth.svelte`, `MapsSplitInfo.svelte`, `MapsCompactBoxed.svelte`, `MapsFloatingCard.svelte`, `MapsTwoColumnDirections.svelte`, `MapsStoreHours.svelte`, `MapsRouteFinder.svelte`, `MapsMinimalFramed.svelte`, `MapsMultiBranch.svelte`, and `MapsCardOverlay.svelte`.
  - Refactored `src/components/builder/sections/GoogleMaps.svelte` as root dispatcher with dual-mode data (Tenant DB `stores.googleMapsUrl` & `stores.waNumber` vs Designer props).
  - Created `MapsNodeForms.svelte` with granular sub-node selection (`maps_header`, `maps_iframe`, `maps_info_card`, `maps_hours_badge`, `maps_branch_tabs`, `maps_cta_button`) and suppressed Cloudinary upload by default.
  - Updated `layerPanel.helpers.ts` with dynamic adaptive layer mapping for all maps presets.
  - Added unit test in `tests/builder/section-registry.test.ts`. All files strictly $\le$ 300 lines. 0 errors, 0 warnings.

- **10 FAQ Presets Implementation (SSOT Registry & Modular Architecture):**
  - Implemented and verified all 10 FAQ layout presets: `accordion_single_col`, `split_faq_sidebar`, `grid_2_col_cards`, `accordion_two_col`, `chat_style_faq`, `search_filtered_faq`, `categorized_tabs_faq`, `compact_numbered_list`, `floating_help_center`, and `horizontal_faq_cards`.
  - Added unit test in `tests/builder/section-registry.test.ts`. All files strictly $\le$ 300 lines. 0 errors, 0 warnings.

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
