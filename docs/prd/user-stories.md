# PRD — User Stories and Acceptance Criteria

Status: LOCKED

Format: `As a <persona>, I want <capability>, so that <outcome>.`

Acceptance criteria are **testable and binary**. "It works" is not acceptance criteria.
These are what the review workflow verifies one by one, so write them as checks.

---

## Authentication & Onboarding

### US-01 — Admin registers a new tenant

**Story:** As an Admin, I want to register a new tenant by entering only email and role, so that the tenant receives an activation link and can onboard themselves without me managing passwords.

**Priority:** must
**Phase:** Foundation
**Feature spec:** `features/01-auth-onboarding.md`

**Acceptance criteria**

- [ ] Given Admin in dashboard, when entering valid email and selecting "Tenant" role, then system sends activation email with 24-hour expiry link.
- [ ] Given activation link, when tenant clicks it within 24 hours, then tenant lands on password-setup page (not login).
- [ ] Given activation link expired (>24h), when tenant clicks it, then system returns 410 Gone and prompts to request new link.
- [ ] Given tenant sets password and confirms, when submitted, then account becomes active and tenant is redirected to login.
- [ ] Given duplicate email, when Admin attempts registration, then system rejects with "Email already in use" and no new record is created.
- [ ] Given invalid email format, when submitted, then system returns validation error before any DB write.

**Out of scope for this story:** Password reset flow, email verification bounce-back handling, role-specific onboarding (designers/admins).

---

### US-02 — Tenant pays activation fee and store setup begins

**Story:** As a Tenant, I want to see my payment status in the dashboard and trigger Admin notification upon successful payment, so that my store setup begins as soon as payment clears.

**Priority:** must
**Phase:** Foundation
**Feature spec:** `features/01-auth-onboarding.md`

**Acceptance criteria**

- [ ] Given newly activated tenant, when logging in, then dashboard displays "Payment Required" status with Xendit payment button.
- [ ] Given tenant clicks pay button, when payment gateway loads, then payment form is pre-filled with activation fee amount (not editable).
- [ ] Given successful Xendit payment, when webhook received, then transaction status updates to "success" in database (within 2 seconds).
- [ ] Given duplicate webhook from Xendit, when second webhook received, then system rejects silently (unique externalId constraint prevents double-crediting).
- [ ] Given payment webhook received, when verified, then Admin dashboard shows notification badge and transaction record is visible in audit log.
- [ ] Given payment fails or times out, when user returns to dashboard, then status remains "Payment Required" and user can retry.

**Out of scope for this story:** Refund flow, manual payment verification, payment plan options.

---

### US-03 — Admin sets up tenant store after payment

**Story:** As an Admin, I want to configure a tenant's initial store (name, subdomain, WhatsApp number, default template), so that the store launches live and appears in the public directory immediately.

**Priority:** must
**Phase:** Foundation
**Feature spec:** `features/01-auth-onboarding.md`

**Acceptance criteria**

- [ ] Given paid tenant in Admin dashboard, when Admin clicks "Setup Store", then Admin sees form for Store Name, Subdomain, WhatsApp, Template Selection.
- [ ] Given Admin enters subdomain (e.g., "kopi-budi"), when checking against reserved names, then system rejects reserved keywords (www, admin, api, etc.) with clear message (validation done in app layer).
- [ ] Given valid subdomain, when Admin submits store setup, then system creates store record, injects default JSONB blueprint (Header, Hero, Features, Catalog, Testimonial, FAQ, Footer), and marks store as "Active".
- [ ] Given store marked Active, when system checks, then store appears in public directory within 5 seconds.
- [ ] Given Admin submits duplicate subdomain, when validation runs, then system rejects with "Subdomain already in use".
- [ ] Given invalid WhatsApp number (non-digit characters), when submitted, then system returns validation error and form is not saved.

**Out of scope for this story:** Store editing after setup, subdomain reassignment, bulk store setup.

---

## Store Public Pages & Discovery

### US-04 — Visitor browses UMKM directory on main platform

**Story:** As a Visitor, I want to see a searchable directory of all active UMKM stores on the main platform page, so that I can discover local businesses easily.

**Priority:** must
**Phase:** Core
**Feature spec:** `features/04-directory.md`

**Acceptance criteria**

- [ ] Given main platform page loaded, when directory section renders, then grid displays all active stores with name, logo, category, and "Visit Store" button.
- [ ] Given directory with 50+ stores, when page loads, then all stores render completely within 1 second (Astro SSR).
- [ ] Given Visitor types search term (e.g., "kopi"), when search executes, then results filter to stores matching keyword (case-insensitive) within 200ms.
- [ ] Given store with no products, when displayed in directory, then store card still shows but product count is "0" (not hidden).
- [ ] Given store card, when Visitor clicks, then browser navigates to subdomain (e.g., `kopi-budi.domain.com`).
- [ ] Given desktop and mobile viewport, when directory renders, then layout is responsive and grid adjusts (2 cols mobile, 3-4 cols desktop).

**Out of scope for this story:** Sorting by rating/recency, filtering by category, pagination (all stores shown on one page MVP).

---

### US-05 — Visitor accesses tenant store via subdomain and sees products

**Story:** As a Buyer, I want to access a tenant's store by subdomain (e.g., `kopi-budi.domain.com`), see products with photos and descriptions, so that I can browse and decide what to buy.

**Priority:** must
**Phase:** Core
**Feature spec:** `features/03-store-rendering.md`

**Acceptance criteria**

- [ ] Given subdomain `kopi-budi.domain.com` in browser, when request reaches server, then Astro middleware detects subdomain, queries tenant config, and renders store page.
- [ ] Given tenant store loaded, when page renders, then all JSONB-defined sections (Hero, Catalog, Testimonial, Footer) display correctly.
- [ ] Given product images in catalog, when rendered, then images are served from Cloudinary URLs (converted to WebP, max 200KB per image).
- [ ] Given store accessed on mobile and desktop, when viewport changes, then layout reflows responsive (mobile-first design).
- [ ] Given store with custom colors/fonts from tenant customization JSONB, when page renders, then CSS variables and theme apply correctly (no hardcoded colors).
- [ ] Given invalid subdomain (not registered), when accessed, then system returns 404 with helpful message (not 500).

**Out of scope for this story:** Cross-tenant cache invalidation, dynamic product updates during load.

---

### US-06 — Buyer clicks product and is redirected to WhatsApp with pre-filled order

**Story:** As a Buyer, I want to click a "Buy" button on a product and be redirected to WhatsApp with a pre-filled order template, so that I can easily send my details and complete the order.

**Priority:** must
**Phase:** Core
**Feature spec:** `features/03-store-rendering.md`

**Acceptance criteria**

- [ ] Given product displayed in store, when Buyer clicks "Buy" button, then client-side JavaScript constructs WhatsApp message (Name, Phone, Address, Product, Delivery, Notes placeholders).
- [ ] Given message constructed, when button clicked, then browser navigates to `wa.me/<store-whatsapp>?text=<encoded-template>`.
- [ ] Given WhatsApp app not installed, when URL opens, then browser falls back to WhatsApp Web (no error).
- [ ] Given product with special characters in name (e.g., "Kopi Spesial™"), when message encodes, then characters are URL-safe and render correctly in WhatsApp.
- [ ] Given Buyer fills WhatsApp template and sends, when message sent, then store owner receives order details in WhatsApp group/chat.
- [ ] Given product name or price truncated by URL length, when message rendered, then all critical info (product name, price, store WhatsApp) is present.

**Out of scope for this story:** Order tracking, WhatsApp business API integration, payment collection in WhatsApp.

---

## Template Marketplace & Builder

### US-07 — Designer creates a template using visual builder

**Story:** As a Designer, I want to use a split-screen visual builder (left: config panel, right: live preview) to drag/arrange pre-built sections and customize colors/text, so that I can create templates without writing code.

**Priority:** must
**Phase:** Core
**Feature spec:** `features/02-store-builder.md`

**Acceptance criteria**

- [ ] Given Designer in template builder, when page loads, then split-screen renders (50/50) with config panel (left) and live preview (right).
- [ ] Given drag handle on section, when Designer drags, then live preview updates instantly (client-side state, no DB query).
- [ ] Given text input field in config panel, when Designer types, then preview rerenders with new text within 50ms (no flicker).
- [ ] Given color picker for section background, when color selected, then preview shows new color immediately (client-side).
- [ ] Given "Save" button clicked, when client submits state, then state is serialized as JSONB (with version attribute) and stored to database.
- [ ] Given save in progress, when user clicks save again, then second click is ignored (no double-submit).
- [ ] Given invalid JSONB generated by client state, when validation runs via Zod, then save is rejected and user sees error message.

**Out of scope for this story:** Undo/redo, template versioning, live collaboration.

---

### US-08 — Designer publishes template and sets price

**Story:** As a Designer, I want to mark a template as "Published" and set a selling price, so that UMKM can purchase and use my design.

**Priority:** must
**Phase:** Core
**Feature spec:** `features/05-template-marketplace.md`

**Acceptance criteria**

- [ ] Given completed template in editor, when Designer clicks "Publish", then template status changes to "Pending Approval".
- [ ] Given pending template, when Admin reviews, then Admin can approve or reject with reason.
- [ ] Given approved template, when Designer is notified, then template becomes "Published" and appears in marketplace.
- [ ] Given published template, when Designer sets price (e.g., 50000 IDR), when submitted, then price is stored and cannot be edited by tenant (read-only).
- [ ] Given Designer views template in marketplace, when preview displayed, then live preview renders correctly and price is visible.
- [ ] Given published template, when UMKM purchases, then Designer wallet is credited with commission (percentage TBD).

**Out of scope for this story:** Template ratings, usage analytics, A/B testing templates.

---

### US-09 — Tenant purchases template and applies to store

**Story:** As a Tenant, I want to browse published templates, purchase one, and apply it to my store, so that my store gets a professional design without designing myself.

**Priority:** should
**Phase:** Core
**Feature spec:** `features/05-template-marketplace.md`

**Acceptance criteria**

- [ ] Given Tenant in dashboard, when clicking "Browse Templates", then Tenant sees grid of all published templates with previews, descriptions, and prices.
- [ ] Given template card, when Tenant clicks "Preview", then live preview loads in modal (read-only, same as designer's published view).
- [ ] Given template card, when Tenant clicks "Buy", then payment gateway loads with template price.
- [ ] Given Tenant completes payment, when webhook received, then transaction is recorded, Designer wallet is credited, and Tenant is notified.
- [ ] Given successful purchase, when Tenant views dashboard, then "Apply to Store" button appears for that template.
- [ ] Given Tenant clicks "Apply", when confirmed, then store config is replaced with template JSONB and page reloads showing new design.
- [ ] Given Tenant has already applied a template, when applying a new one, then old design is replaced (no versioning/history in MVP).

**Out of scope for this story:** Template mixing (combining sections from multiple templates), refunds, usage rights documentation.

---

## Admin & Finance

### US-10 — Admin monitors payments and payouts in dashboard

**Story:** As an Admin, I want a dashboard showing all tenant payments received and pending designer payouts, so that I can verify financial health and track reconciliation.

**Priority:** must
**Phase:** Foundation
**Feature spec:** `features/06-admin-dashboard.md`

**Acceptance criteria**

- [ ] Given admin in dashboard, when viewing "Payments" tab, then table shows all tenant transactions (type: store_registration) with date, amount, status, tenant name.
- [ ] Given admin in dashboard, when viewing "Payouts" tab, then table shows all pending/completed designer payouts with date, amount, status, designer name.
- [ ] Given transaction marked "success", when status checked, then status reflects successful Xendit webhook receipt.
- [ ] Given payout request from Designer, when status is "Pending", then Admin can manually trigger payout via Xendit Payouts API.
- [ ] Given payout triggered, when Xendit confirms, then status updates to "Completed" and Designer is notified.
- [ ] Given payout fails, when error returned, then Admin sees error reason and can retry.

**Out of scope for this story:** Custom date range filters, CSV export, revenue forecasting.

---

## Media Management

### US-11 — Admin/Tenant/Designer uploads images and they are optimized

**Story:** As an Admin/Tenant/Designer, I want to upload product/template images and have them automatically converted to WebP 200KB, so that storage costs are minimized and load times are fast.

**Priority:** must
**Phase:** Core
**Feature spec:** `features/07-media-handling.md`

**Acceptance criteria**

- [ ] Given file picker for image upload, when JPG/PNG selected, then client-side validation checks format and file size (<5MB).
- [ ] Given valid image, when upload button clicked, then signed upload request is generated server-side (Cloudinary auth).
- [ ] Given upload to Cloudinary succeeds, when response received, then image URL and metadata are stored in database.
- [ ] Given upload to Cloudinary succeeds but database save fails, when rollback occurs, then image is immediately hard-deleted from Cloudinary (no orphans).
- [ ] Given image stored in database, when served to client, then Cloudinary automatically converts to WebP format (via URL transformation).
- [ ] Given image deleted from database, when soft-delete flag set, then backend calls Cloudinary API to delete the file (sync verification).

**Out of scope for this story:** Batch uploads, drag-and-drop, image cropping UI (clients crop before upload).

---

Every story needs at least one unhappy-path criterion. A story with only happy-path
criteria ships a feature that breaks the first time a real user touches it.