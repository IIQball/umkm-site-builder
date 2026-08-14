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
│  subdomain_blacklist (security)                                              │
│  ├─ id (primary)                                                             │
│  ├─ keyword (unique, e.g., 'www', 'admin', 'api')                            │
│  ├─ reason (documentation)                                                   │
│  └─ addedAt                                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TENANTS & STORES                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  payments (tenant activation fees)                                           │
│  ├─ id (primary)                                                             │
│  ├─ userId (FK) ──┐                                                          │
│  ├─ amount (decimal)                                                         │
│  ├─ transactionId (unique, from Xendit, idempotency key)                     │
│  ├─ status (pending|paid|failed)                                             │
│  ├─ provider (xendit)                                                        │
│  ├─ metadata (JSON: invoiceId, paidAt, method)                               │
│  ├─ createdAt                                                                │
│  └─ updatedAt                                                                │
│       │                                                                      │
│       └────────────────┐                                                     │
│                        │ 1:1                                                 │
│  stores (1 tenant = 1 store)                                                │
│  ├─ id (primary)                                                             │
│  ├─ userId (FK) ──────────────┐ (tenant owner)                               │
│  ├─ name                       │                                             │
│  ├─ subdomain (unique, lowercase)                                            │
│  ├─ whatsappNumber             │                                             │
│  ├─ status (active|inactive)   │                                             │
│  ├─ config (JSONB, versioned)  │ (layout, colors, template sections)        │
│  │  └─ version: 1              │                                             │
│  │     sections: [...]         │                                             │
│  │     customColors: {...}     │                                             │
│  ├─ templateId (FK) ───────────┼─────────────┐ (default/current template)   │
│  ├─ createdAt                  │             │                             │
│  └─ updatedAt                  │             │                             │
│                                │             │                             │
│  store_categories              │             │                             │
│  ├─ id (primary)               │             │                             │
│  ├─ storeId (FK) ──────────────┘             │                             │
│  ├─ name (e.g., Kopi, Makanan, Kerajinan)    │                             │
│  ├─ description                              │                             │
│  └─ ...                                      │                             │
│                                              │                             │
│  products                                    │                             │
│  ├─ id (primary)                             │                             │
│  ├─ storeId (FK)                             │                             │
│  ├─ name                                     │                             │
│  ├─ description                              │                             │
│  ├─ price (decimal)                          │                             │
│  ├─ imageId (FK) ──────────┐                 │                             │
│  ├─ status (active|hidden) │                 │                             │
│  ├─ createdAt              │                 │                             │
│  └─ updatedAt              │                 │                             │
│                            │                 │                             │
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
│  ├─ price (decimal) ────┐│ (set by designer; immutable once published)      │
│  ├─ status (draft|pending_approval|published|rejected)                      │
│  ├─ thumbnailId (FK) ───┼┼─────────────┐ (preview image)                    │
│  ├─ approvedBy (FK to users.id, admin) │ (null if draft)                    │
│  ├─ rejectionReason (text, nullable)   │                                    │
│  ├─ createdAt                          │                                    │
│  ├─ publishedAt (nullable)             │                                    │
│  └─ updatedAt                          │                                    │
│       │                                │                                    │
│       │ M:N via                        │                                    │
│  user_templates (ownership tracking)   │                                    │
│  ├─ id (primary)        │              │                                    │
│  ├─ userId (FK)         │              │                                    │
│  ├─ templateId (FK) ────┼──────┐       │                                    │
│  ├─ purchasedAt (nullable, null=assigned) │                                │
│  ├─ status (owned|purchased|revoked)  │                                    │
│  └─ createdAt           │              │                                    │
│                         │              │                                    │
│  transactions (template purchases)     │                                    │
│  ├─ id (primary)        │              │                                    │
│  ├─ buyerId (FK to users.id, tenant)   │                                    │
│  ├─ templateId (FK) ────┼──────────────┘                                    │
│  ├─ amount (decimal, price snapshot)                                        │
│  ├─ transactionId (unique, from Xendit)                                     │
│  ├─ status (pending|completed|failed|refunded)                              │
│  ├─ provider (xendit)                                                        │
│  ├─ metadata (JSON: invoiceId, paidAt)                                      │
│  ├─ createdAt                                                                │
│  └─ updatedAt                                                                │
│                                                                              │
│  commissions (calculated from each transaction)                              │
│  ├─ id (primary)                                                             │
│  ├─ designerId (FK) ──────────────────────────────────┐                    │
│  ├─ transactionId (FK)                               │                    │
│  ├─ templateId (FK)                                  │                    │
│  ├─ amount (decimal, calculated)                     │                    │
│  ├─ percentage (e.g., 0.30 = 30%)                    │                    │
│  ├─ status (pending|processed|paid_out)              │                    │
│  ├─ createdAt                                        │                    │
│  └─ updatedAt                                        │                    │
│                                                      │                    │
└──────────────────────────────────────────────────────┼────────────────────┘

┌──────────────────────────────────────────────────────┼────────────────────┐
│ DESIGNERS & FINANCE                                  │                    │
├──────────────────────────────────────────────────────┼────────────────────┤
│                                                      │                    │
│  wallets (designer earnings tracking)                │                    │
│  ├─ id (primary)                                     │                    │
│  ├─ designerId (FK) ◄───────────────────────────────┘                    │
│  ├─ balance (decimal, total earnings)                                     │
│  ├─ pendingBalance (decimal, unpaid commissions)                          │
│  ├─ totalPaidOut (decimal, historical)                                   │
│  ├─ createdAt                                                             │
│  └─ updatedAt                                                             │
│                                                                            │
│  wallet_mutations (ledger of all transactions)                            │
│  ├─ id (primary)                                                          │
│  ├─ walletId (FK)                                                         │
│  ├─ type (commission_added|commission_processed|payout_requested|paid)    │
│  ├─ amount (decimal, signed)                                              │
│  ├─ reference (commissionId, payoutId, etc.)                              │
│  ├─ description                                                           │
│  ├─ createdAt                                                             │
│  └─ updatedAt                                                             │
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
│  ├─ amount (decimal)                                                      │
│  ├─ status (pending|processing|completed|failed|cancelled)                │
│  ├─ payoutId (from Xendit, unique)                                        │
│  ├─ failureReason (nullable, if failed)                                   │
│  ├─ requestedAt                                                           │
│  ├─ processedAt (nullable)                                                │
│  └─ updatedAt                                                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│ MEDIA (Images & Files)                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  images (media references, metadata only; binary stored in Cloudinary)    │
│  ├─ id (primary)                                                            │
│  ├─ provider (cloudinary)                                                   │
│  ├─ provider_key (public_id from Cloudinary)                                │
│  ├─ version (1)                                                             │
│  ├─ dimensions (JSON: {width, height})                                      │
│  ├─ alt_text (accessibility)                                                │
│  ├─ size_bytes (final WebP size)                                            │
│  ├─ uploadedBy (FK to users.id)                                             │
│  ├─ deleted_at (soft delete timestamp, nullable)                            │
│  ├─ createdAt                                                               │
│  └─ updatedAt                                                               │
│       │                                                                     │
│       ├─→ (referenced by products.imageId)                                  │
│       ├─→ (referenced by templates.thumbnailId)                             │
│       └─→ (referenced by stores via config JSONB)                           │
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
| `subdomain_blacklist` | Reserved keywords | www, admin, api, dashboard, etc.; prevents routing conflicts |

### Tenants & Stores

| Table | Purpose | Notes |
|---|---|---|
| `payments` | Activation fees | 1 per tenant; idempotency key: `transactionId` (unique constraint) |
| `stores` | Tenant storefronts | 1:1 with userId (tenant); config is JSONB with version attribute |
| `store_categories` | Product grouping | Optional; allows tenants to organize products |
| `products` | Catalog items | Linked to store; each product has 1 image |

### Templates & Marketplace

| Table | Purpose | Notes |
|---|---|---|
| `templates` | Master designs | Created by designer or system (default template); immutable price once published |
| `user_templates` | Ownership tracking | M:N junction; tracks purchases and assignments |
| `transactions` | Purchases | Idempotency key: `transactionId` (unique constraint, prevents double-crediting) |
| `commissions` | Designer earnings | Auto-calculated from transaction; percentage is configurable (default 30%) |

### Designer Finance

| Table | Purpose | Notes |
|---|---|---|
| `wallets` | Balance summary | balance = total earned; pendingBalance = unpaid commissions |
| `wallet_mutations` | Ledger | Immutable log of all balance changes (audit trail) |
| `bank_accounts` | Payout destinations | Encrypted; Xendit bank codes stored for API calls |
| `payout_requests` | Withdrawal requests | Admin approves; system calls Xendit Payouts API |

### Media

| Table | Purpose | Notes |
|---|---|---|
| `images` | Image metadata | Binary stored in Cloudinary (not DB); DB stores reference + dimensions |

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