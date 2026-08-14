# PRD — Overview (big picture)

Status: LOCKED · Source: `../../PRD.md` + decisions on 2026-08-14

The big-picture PRD. Per-feature detail lives in `features/`. Keep this one readable in
five minutes.

## 1. Product

A no-code SaaS web builder for Indonesian micro-enterprises (UMKM). Business owners publish their own websites and product catalogs using instant subdomains, with zero technical knowledge required. The platform also serves as a marketplace where UI designers create, upload, and monetize web templates directly to UMKM users.

## 2. Problem

Professional website creation is prohibitively expensive for small businesses, and existing platforms (WordPress, Shopify) require technical knowledge (hosting, DNS, plugins). Meanwhile, local UI designers lack a direct channel to sell functional template designs to end users who need them.

## 3. Goals

- UMKM can launch a public website with interactive product catalog in under 5 minutes with zero technical skill required.
- Platform provides a centralized directory where the public discovers all registered UMKM stores.
- Designers earn recurring passive income (commissions) from premium templates used by UMKM.
- Purchase flow is frictionless: buyers on UMKM catalogs redirect to WhatsApp with auto-formatted order messages.

## 4. Non-goals

- No backend checkout or shopping cart. Purchases route to WhatsApp with pre-filled templates only.
- No custom HTML/CSS/JS editing. Tenants and designers work only with pre-built, hardcoded sections.
- Not a centralized marketplace or transaction hub. Each store operates independently under its own subdomain.

## 5. Success criteria

- A new UMKM store is live and discoverable within 5 minutes of Admin setup.
- Buyers click a product and land in WhatsApp with order template pre-filled (name, phone, address, product, delivery, notes).
- Designers can create and publish templates; at least one template is in use by a live store.
- Platform directory renders completely within 1 second.
- Admin dashboard shows real-time payment status and payout tracking.

## 6. Users

- **Tenant (UMKM Business Owner):** Small business operator, high phone mobility, moderate technical literacy. Needs instant setup and easy product management.
- **Designer:** UI/layout professional. Needs visual component editor and automated commission tracking.
- **Admin / Superadmin:** Platform operator. Needs store registration, payment verification, and audit oversight.
- **Visitor / Buyer:** Public user browsing stores and discovering UMKM. (No account required.)

## 7. Feature map

| Feature | Spec | Phase | Status |
|---|---|---|---|
| Concierge Registration & Payment | `features/01-auth-onboarding.md` | Foundation | TODO |
| Store Builder (Visual) | `features/02-store-builder.md` | Core | TODO |
| Store Public Pages | `features/03-store-rendering.md` | Core | TODO |
| Platform Directory & Discovery | `features/04-directory.md` | Core | TODO |
| Template Marketplace | `features/05-template-marketplace.md` | Core | TODO |
| Admin Dashboard | `features/06-admin-dashboard.md` | Foundation | TODO |
| Media Management | `features/07-media-handling.md` | Core | TODO |
| Payout & Finance | `features/08-designer-payouts.md` | Quality | TODO |

## 8. Locked decisions

Decided with the human. Do not change without explicit approval. Each one carries its reason.

| # | Decision | Reason | Date |
|---|---|---|---|
| 1 | Database: Neon PostgreSQL Serverless | Read-heavy workload, persistent state required, Serverless Driver required for Cloudflare Edge compatibility (no TCP). | 2026-08-14 |
| 2 | Media storage: Cloudinary Free Tier | Images need on-the-fly WebP conversion and resizing. Free Tier fits <5GB/year budget. Supports soft+hard delete sync. | 2026-08-14 |
| 3 | Icon pack: Lucide | 400+ icons, tree-shakeable, excellent Svelte support, modern design. | 2026-08-14 |
| 4 | Git mode: Strict | main protected, dev integration, PR-only with sign-off. Professional workflow for team collaboration. | 2026-08-14 |
| 5 | Build tool: Plain Vite + Bun scripts | Explicit control, fewer dependencies, stable Vite ecosystem. Vite Plus deferred unless complexity justifies it. | 2026-08-14 |
| 6 | Subdomain routing: Host header detection (Astro SSR) | Every request queries DB to resolve host → tenant → config. Acceptable because workload is read-heavy and refresh-to-see-changes is fine. | 2026-08-14 |
| 7 | Builder state: Client-side only, save-on-click | Live preview instant (client state). No auto-save to reduce DB load. Users click explicit "Save" button. Data loss risk accepted for simplicity. | 2026-08-14 |
| 8 | Payment idempotency: Unique transaction_id constraint | Duplicate webhooks fail silently (natural idempotency). Simpler than separate idempotency table. | 2026-08-14 |

## 9. Open questions

None identified. All preflight gates decided, architecture locked, and trade-offs accepted.

## 10. Constraints

- **Stack:** Cloudflare, Astro, Svelte, Vite, Bun, Drizzle, daisyUI, Vitest, Zod, BetterAuth.
- **Database driver:** Neon Serverless Driver (HTTP/WebSocket, no TCP, Edge-compatible).
- **Media validation:** JPG/JPEG/PNG only, 5MB max (client-side), auto-convert to WebP 200KB (server-side).
- **Accessibility:** Mobile-first, keyboard navigation, clean console (0 errors/warnings).
- **Browser support:** Modern browsers (no IE11). Mobile-first responsive design.
- **Languages:** Indonesian UI, English tech docs.
