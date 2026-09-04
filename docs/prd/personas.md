# PRD — Personas

Status: LOCKED

One section per persona. A persona that never appears in a user story or the permissions
matrix is decoration — delete it.

## Tenant (UMKM Business Owner) — Small business operator

- **Context:** Runs a micro-enterprise (coffee shop, clothing, handicraft, food). Uses phone primarily; occasional laptop. Works from shop floor or on-the-go. Speaks Indonesian.
- **Technical level:** Moderate to low. Can use WhatsApp and e-commerce apps but unfamiliar with hosting, domains, or HTML.
- **Needs:** A professional storefront online in minutes. Easy product photo uploads and inventory updates. Simple way for customers to place orders.
- **Pain:** Frustrated by complexity of traditional web platforms (WordPress, Shopify). Vendor setup fees and monthly costs are a barrier. Worried about security and data handling.
- **Success:** Store goes live same day. Customers discover them and place orders via WhatsApp. Monthly revenue from orders exceeds platform costs.
- **Access level:** `tenant` role in permissions matrix.

## Designer — UI/UX professional

- **Context:** Freelancer or small design studio. Comfortable with design tools (Figma, Adobe) and component thinking. May lack fullstack dev skills. Works from laptop/desktop.
- **Technical level:** Design-literate (layout, typography, color, responsive). May not know HTML/CSS deeply; prefers visual builders.
- **Needs:** A way to design reusable templates once and sell them to many UMKM without writing backend code. Transparent commission tracking and easy payouts.
- **Pain:** No direct channel to UMKM clients today. Hard to monetize design work at scale. Manual invoicing and payment collection is time-consuming.
- **Success:** Templates in use by 5+ stores within first month. Monthly payout from commissions arrives reliably.
- **Access level:** `designer` role in permissions matrix.

## Admin — Platform operator

- **Context:** Employee or contractor managing the SaaS platform. Uses desktop/laptop, works standard business hours. Speaks Indonesian and English.
- **Technical level:** Comfortable with databases, dashboards, and configuration. May not be a full developer; primarily operational.
- **Needs:** Simple dashboard to onboard tenants, verify payments, set up subdomains, and monitor financial health. Audit trail for compliance.
- **Pain:** Manual setup is error-prone and slow. Payment verification and payout tracking require reconciliation.
- **Success:** Can register and activate a new tenant in under 2 minutes. Payment and payout processes are fully automated.
- **Access level:** `admin` role in permissions matrix.

## Superadmin — Platform governance

- **Context:** Founder, CTO, or senior ops lead. Desktop/laptop. Handles strategic decisions and compliance.
- **Technical level:** Technical. May read logs, make schema decisions, or manage infrastructure.
- **Needs:** Full audit trail, role management, and ability to override or investigate anomalies.
- **Pain:** Compliance risk if payment or payout data is unclear. Cannot easily audit who did what.
- **Success:** Full audit trail is available. All financial transactions are traceable and reconcilable.
- **Access level:** `superadmin` role in permissions matrix.

## Visitor / Buyer — Public user

- **Context:** Customer browsing stores on the main platform or within a store's subdomain. Uses phone or laptop. No account required.
- **Technical level:** General consumer. Uses e-commerce and social media daily.
- **Needs:** Discover stores, view products, place orders easily.
- **Pain:** Wants to buy but doesn't want to create yet another account. Needs clear payment/order flow.
- **Success:** Finds a product, clicks buy, lands in WhatsApp with pre-filled order, completes transaction within 30 seconds.
- **Access level:** `public` (no login required).

## Anti-persona

**NOT for:** Enterprise customers needing custom integrations, complex multi-vendor checkout, inventory sync, or compliance (PCI DSS, SOC 2) at this stage. Also NOT for developers wanting to extend with custom code — this is a no-code platform.