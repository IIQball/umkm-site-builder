# Tech — Data Model & ERD

Status: LOCKED

Tables, relationships, and key constraints. Drizzle schema in `src/db/schema.ts` is source of truth; this doc describes the logical model.

---

## Entity Relationship Diagram (Logical)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ AUTHENTICATION & USERS                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  users (from BetterAuth)                     roles: [superadmin|admin|    │
│  ├─ id (primary)                             designer|tenant|public]      │
│  ├─ email (unique)                                                          │
│  ├─ name                                                                    │
│  ├─ image (avatar URL)                                                      │
│  ├─ role (enum)  ◄────────────┐                                             │
│  ├─ emailVerified              │                                             │
│  ├─ createdAt                  │                                             │
│  └─ updatedAt                  │                                             │
│                                │                                             │
│  sessions (from BetterAuth)    │                                             │
│  ├─ id (primary)               │                                             │
│  ├─ userId (FK) ──────────────┘                                             │
│  ├─ token (unique, hashed)                                                   │
│  ├─ expiresAt                                                                │
│  ├─ createdAt                                                                │
│  └─ updatedAt                                                                │
│                                                                              │
│  accounts (from BetterAuth, for OAuth)                                       │
│  ├─ id (primary)                                                             │
│  ├─ userId (FK)                                                              │
│  ├─ provider (google, etc.)                                                  │
│  ├─ providerAccountId                                                        │
│  └─ ...metadata...                                                           │
│                                                                              │
│  verifications (from BetterAuth, for password reset / email activation)      │
│  ├─ id (primary)                                                             │
│  ├─ identifier (email)                                                       │
│  ├─ token (unique)                                                           │
│  ├─ expiresAt                                                                │
│  └─ ...                                                                      │
│                                                                              │
│  admin_whitelist (security)                                                  │
│  ├─ id (primary)                                                             │
│  ├─ email (unique, allowed to register as Admin)                             │
│  ├─ createdAt                                                                │
│  └─ createdBy (FK to users.id, superadmin who added)                         │
│                                                                              │
│  (subdomain validation is app-layer logic, no database table)                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
  │ TENANTS & STORES                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  stores (1 tenant = 1 store)                                                │
│  ├─ id (primary)                                                             │
│  ├─ userId (FK) ─────────────────────────────┐ (tenant owner)               │
│  ├─ name                                      │                             │
│  ├─ subdomain (unique, lowercase)             │                             │
│  ├─ waNumber (WhatsApp number)                │                             │
│  ├─ googleMapsUrl                             │                             │
│  ├─ isRegistrationPaid (boolean)              │                             │
│  ├─ status (pending|active|inactive|suspended) │                             │
│  ├─ customization (JSONB, versioned)          │ (layout, colors, sections)  │
│  │  └─ version: 1                             │                             │
│  │     sections: [...]                        │                             │
│  │     customColors: {...}                    │                             │
│  ├─ templateId (FK) ────────────────────┐     │ (default/current template)  │
│  ├─ totalWaClicks (integer)              │     │                            │
│  ├─ totalViews (integer)                 │     │                            │
│  ├─ createdAt                            │     │                            │
│  └─ updatedAt                            │     │                            │
│                                          │     │                            │
│  store_categories                        │     │                            │
│  ├─ id (primary)                         │     │                            │
│  ├─ storeId (FK)                         │     │                            │
│  ├─ name (e.g., Kopi, Makanan, Kerajinan) │    │                            │
│  ├─ slug                                 │     │                            │
│  ├─ createdAt                            │     │                            │
│  └─ updatedAt                            │     │                            │
│                                          │     │                            │
│  products                                │     │                            │
│  ├─ id (primary)                         │     │                            │
│  ├─ storeId (FK)                         │     │                            │
│  ├─ categoryId (FK to store_categories)  │     │                            │
│  ├─ name                                 │     │                            │
│  ├─ slug                                 │     │                            │
│  ├─ basePrice (bigint, in cents)         │     │                            │
│  ├─ imageUrls (JSONB array)              │     │                            │
│  ├─ variants (JSONB array)               │     │                            │
│  ├─ isAvailable (boolean)                │     │                            │
│  ├─ sortOrder (integer)                  │     │                            │
│  ├─ description                          │     │                            │
│  ├─ createdAt                            │     │                            │
│  └─ updatedAt                            │     │                            │
└────────────────────────────┼─────────────────┼─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TEMPLATES & MARKETPLACE                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  templates (master templates, created by designers or system default)      │
│  ├─ id (primary)                                                             │
│  ├─ designerId (FK) ────┐ (null = system default)                           │
│  ├─ name                 │                                                   │
│  ├─ description          │                                                   │
│  ├─ config (JSONB)       │ (versioned sections, components)                 │
│  │  └─ version: 1        │                                                   │
│  ├─ price (bigint, cents) ─┐ (set by designer; immutable once published)    │
│  ├─ status (draft|pending|approved|rejected)                                 │
│  ├─ thumbnailUrl (text) ──┘ (preview image URL from Cloudinary)             │
│  ├─ approvedBy (FK to users.id, admin) (null if draft)                       │
│  ├─ rejectionReason (text, nullable)                                        │
│  ├─ deleteReason (text, nullable)                                           │
│  ├─ createdAt                                                                │
│  └─ updatedAt                                                                │
│       │                                │                                    │
│       │ M:N via                        │                                    │
│  user_templates (ownership tracking)   │              │                    │
│  ├─ id (primary)        │              │                                    │
│  ├─ userId (FK)         │              │                                    │
│  ├─ templateId (FK) ────┼──────┐       │                                    │
│  ├─ acquiredAt          │      │       │                                    │
│  └─ (unique constraint on userId+templateId)                               │
│                         │      │       │                                    │
│  transactions (store_registration|template_purchase)  │                     │
│  ├─ id (primary)        │      │       │                                    │
│  ├─ userId (FK)         │      │       │                                    │
│  ├─ type (store_registration|template_purchase)      │                     │
│  ├─ amount (bigint, cents, from Xendit)              │                     │
│  ├─ status (pending|success|failed|expired|canceled|refunded)               │
│  ├─ storeId (FK) ──────────────┐                                            │
│  ├─ templateId (FK) ───────────┼──────┘                                    │
│  ├─ externalId (unique, from Xendit invoice)                                │
│  ├─ paymentGatewayRef (Xendit transaction ID)                               │
│  ├─ paymentChannel (BANK_TRANSFER, E_WALLET, etc.)                          │
│  └─ createdAt                                                                │
│                                                                              │
│  commissions (calculated from each transaction)                              │
│  ├─ id (primary)                                                             │
│  ├─ designerId (FK) ──────────────────────────────────┐                    │
│  ├─ transactionId (FK, unique)                        │                    │
│  ├─ templateId (FK)                                  │                    │
│  ├─ totalAmount (bigint, cents)                      │                    │
│  ├─ platformFee (bigint, cents)                      │                    │
│  ├─ designerAmount (bigint, cents)                   │                    │
│  └─ createdAt                                        │                    │
│                                                      │                    │
└──────────────────────────────────────────────────────┼────────────────────┘

┌──────────────────────────────────────────────────────┼────────────────────┐
│ DESIGNERS & FINANCE                                  │                    │
├──────────────────────────────────────────────────────┼────────────────────┤
│                                                      │                    │
│  wallets (designer earnings tracking)                │                    │
│  ├─ id (primary)                                     │                    │
│  ├─ designerId (FK) ◄───────────────────────────────┘                    │
│  ├─ balance (bigint, total earnings in cents)                             │
│  ├─ createdAt                                                             │
│  └─ updatedAt                                                             │
│                                                                            │
│  wallet_mutations (immutable ledger of all transactions)                  │
│  ├─ id (primary)                                                          │
│  ├─ walletId (FK)                                                         │
│  ├─ type (CREDIT|DEBIT)                                                   │
│  ├─ amount (bigint, signed, in cents)                                     │
│  ├─ balanceAfter (bigint, wallet balance after mutation)                  │
│  ├─ description                                                           │
│  ├─ referenceId (commissionId, payoutId, etc.)                            │
│  └─ createdAt                                                             │
│                                                                            │
│  bank_accounts (designer's withdrawal destination)                        │
│  ├─ id (primary)                                                          │
│  ├─ designerId (FK)                                                       │
│  ├─ accountHolderName                                                     │
│  ├─ accountNumber (encrypted)                                             │
│  ├─ bankCode (e.g., BRI, BCA, Mandiri) ◄── Xendit bank codes             │
│  ├─ status (active|inactive|verified)                                     │
│  ├─ isDefault (boolean, used for auto-payout)                             │
│  ├─ createdAt                                                             │
│  └─ updatedAt                                                             │
│                                                                            │
│  payout_requests (designer withdrawal requests)                           │
│  ├─ id (primary)                                                          │
│  ├─ designerId (FK)                                                       │
│  ├─ bankAccountId (FK)                                                    │
│  ├─ amount (bigint, cents)                                                │
│  ├─ status (pending|processing|completed|rejected)                        │
│  ├─ xenditPayoutId (from Xendit, unique)                                  │
│  ├─ gatewayReference (Xendit reference)                                   │
│  ├─ gatewayMessage (Xendit response message)                              │
│  ├─ processedBy (FK to users.id, admin)                                   │
│  ├─ createdAt                                                             │
│  └─ updatedAt                                                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│ MEDIA & ACTIVITY                                                           │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Note: Media is stored as JSONB arrays or external URLs, not in DB table   │
│  - products.imageUrls (JSONB array of Cloudinary URLs)                     │
│  - templates.thumbnailUrl (text URL from Cloudinary)                       │
│  - stores.customization (JSONB with backgroundImage URLs)                  │
│                                                                             │
│  activity_logs (audit trail)                                               │
│  ├─ id (primary)                                                            │
│  ├─ userId (FK)                                                             │
│  ├─ storeId (FK, nullable)                                                  │
│  ├─ action (text, e.g., 'product_created', 'payment_received')              │
│  ├─ details (JSONB, additional context)                                     │
│  └─ createdAt                                                               │
│                                                                             │
│  platform_settings (configuration)                                         │
│  ├─ id (primary)                                                            │
│  ├─ platformFeePercentage (integer, default 30)                             │
│  ├─ payoutMinimumBalance (bigint, default 50000 cents)                      │
│  ├─ updatedAt                                                               │
│  └─ updatedBy (FK to users.id)                                              │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Tables & Relationships

### Authentication (BetterAuth Standard)

| Table | Purpose | Notes |
|---|---|---|
| `users` | Central identity | role: superadmin \| admin \| designer \| tenant |
| `sessions` | Active sessions | 7-day expiry, refreshed daily |
| `accounts` | OAuth providers | Google OAuth via BetterAuth |
| `verifications` | Email links | Password reset, activation (24h expiry) |

### Security

| Table | Purpose | Notes |
|---|---|---|
| `admin_whitelist` | Email allowlist | Only whitelisted emails can register as Admin |
| (subdomain validation) | Reserved keywords | www, admin, api, dashboard, etc.; validation in application layer, no DB table |

### Tenants & Stores

| Table | Purpose | Notes |
|---|---|---|
| `transactions` | Payments (store_registration type) | 1 per tenant activation; idempotency key: `externalId` (unique constraint) |
| `stores` | Tenant storefronts | 1:1 with userId (tenant); customization is JSONB with version attribute |
| `store_categories` | Product grouping | Allows tenants to organize products by category |
| `products` | Catalog items | Linked to store and category; imageUrls is JSONB array of Cloudinary URLs |

### Templates & Marketplace

| Table | Purpose | Notes |
|---|---|---|
| `templates` | Master designs | Created by designer or system (default template); immutable price once published; thumbnailUrl is external URL |
| `user_templates` | Ownership tracking | M:N junction; tracks purchases and ownership; unique on (userId, templateId) |
| `transactions` | Purchases | type='template_purchase'; idempotency key: `externalId` (unique constraint) |
| `commissions` | Designer earnings | Auto-calculated from transaction; fees calculated from platformFeePercentage setting |

### Designer Finance

| Table | Purpose | Notes |
|---|---|---|
| `wallets` | Balance summary | balance = total earned (bigint, cents); no pendingBalance (calculated on-demand) |
| `wallet_mutations` | Ledger | Immutable log of all balance changes (audit trail); type is CREDIT\|DEBIT |
| `bank_accounts` | Payout destinations | Encrypted; Xendit bank codes stored for API calls |
| `payout_requests` | Withdrawal requests | Admin approves; system calls Xendit Payouts API; xenditPayoutId for idempotency |

### Activity & Configuration

| Table | Purpose | Notes |
|---|---|---|
| `activity_logs` | Audit trail | Immutable logs of all user actions (product_created, store_updated, etc.) |
| `platform_settings` | Configuration | Platform-wide settings (platformFeePercentage, payoutMinimumBalance); single record |

---

## JSONB Schemas

### Store Config (`stores.config`)

```jsonb
{
  "version": 1,
  "sections": [
    {
      "id": "hero_1",
      "type": "hero",
      "title": "Welcome to Kopi Budi",
      "subtitle": "Premium Indonesian Coffee",
      "backgroundImage": { "imageId": "img_123", "alt": "Coffee beans" },
      "cta": { "text": "Shop Now", "link": "#catalog" },
      "colors": { "textColor": "#fff", "bgColor": "#2d1810" }
    },
    {
      "id": "catalog_1",
      "type": "catalog",
      "columns": 3,
      "products": []  // populated from products table at render time
    },
    {
      "id": "testimonials_1",
      "type": "testimonials",
      "items": [
        { "quote": "Best coffee in town!", "author": "Budi" }
      ]
    },
    {
      "id": "footer_1",
      "type": "footer",
      "text": "© 2026 Kopi Budi. All rights reserved."
    }
  ],
  "customCss": ""  // future: scoped CSS per store
}
```

### Template Config (`templates.config`)

```jsonb
{
  "version": 1,
  "sections": [
    {
      "id": "hero_template",
      "type": "hero",
      "title": "[CUSTOMIZE ME]",
      "subtitle": "[CUSTOMIZE ME]",
      "backgroundImage": null,
      "colors": { "textColor": "#fff", "bgColor": "#333" }
    },
    {
      "id": "catalog_template",
      "type": "catalog",
      "columns": 3
    }
    // ... more sections
  ]
}
```

### Image Dimensions (`images.dimensions`)

```jsonb
{
  "width": 1920,
  "height": 1080,
  "format": "webp"
}
```

---

## Database Constraints & Indexes

### Unique Constraints

- `users.email` — one account per email
- `stores.subdomain` — one subdomain per store
- `images.provider_key` — one image per Cloudinary public_id
- `payments.transactionId` — payment idempotency (unique per tenant)
- `transactions.transactionId` — purchase idempotency (unique per template)
- `payout_requests.payoutId` — payout idempotency (unique per designer per request)
- `admin_whitelist.email` — one entry per email
- `subdomain_blacklist.keyword` — one entry per reserved keyword

### Foreign Keys (Cascading)

- `stores.userId` → `users.id` (ON DELETE CASCADE)
- `products.storeId` → `stores.id` (ON DELETE CASCADE)
- `templates.designerId` → `users.id` (ON DELETE SET NULL, designer can be deleted)
- `wallets.designerId` → `users.id` (ON DELETE CASCADE)
- `commissions.designerId` → `users.id` (ON DELETE SET NULL, audit trail preserved)

### Indexes

- `stores.subdomain` — fast subdomain lookup (used on every public request)
- `products.storeId` — fast product listing per store
- `templates.status` — fast query for published templates
- `user_templates.userId` — fast lookup of tenant's purchased templates
- `transactions.buyerId` — fast lookup of buyer's purchase history
- `commissions.designerId` — fast lookup of designer's earnings
- `wallet_mutations.walletId` — fast ledger query
- `images.deleted_at` — identify orphan files for cleanup

---

## Version Strategy (Forward Compatibility)

Every JSONB config includes a `version` attribute (integer). When schema changes are needed in the future:

1. Increment version in new records (e.g., version: 2)
2. On render, check version and apply migrations (e.g., v1 → v2 adapter)
3. On save, always save with current version
4. Gradual rollout: old versions continue to render; new saves use new version

Example:
```ts
// src/lib/store.ts
function migrateStoreConfig(config: any) {
  if (config.version === 1) {
    // Apply v1 → v2 migrations
    config.sections.forEach(s => {
      if (s.type === 'hero') s.cta = s.cta || { text: 'Browse', link: '#' };
    });
    config.version = 2;
  }
  return config;
}
```

---

## Seeding & Initial Data

On first deployment, system must create:

1. **System Default Template** (templates.id = `system-default-template`)
   - Designer: null
   - Status: published
   - Price: 0 (free)
   - Config: 7-section default (Hero, Catalog, Testimonials, FAQ, Footer, etc.)
   - Purpose: Used by Admin to set up new stores; ID is hardcoded in admin setup flow

2. **Reserved Subdomain Blacklist** (subdomain_blacklist)
   - www, admin, api, dashboard, blog, support, status, help, contact

Seeding script: `src/db/seed.ts` — run once per environment via `bun run seed`.