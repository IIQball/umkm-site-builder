# Tech — API Spec

Status: LOCKED

Every route and server action. The Zod schema in code is the source of truth for shapes;
this doc is the contract and the review checklist.

---

## 1. Response shape (global)

```ts
{ ok: true, data: T }
{ ok: false, error: { code: string, message: string } }
```

`message` is always safe and generic. Detail stays in the server log.

Example:
```ts
// Success
{ ok: true, data: { id: 'store_123', name: 'Kopi Budi', subdomain: 'kopi-budi' } }

// Error
{ ok: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } }
```

---

## 2. Error codes

| Code | HTTP | Meaning | Client shows |
|---|---|---|---|
| VALIDATION_ERROR | 400 | input failed the Zod schema | field-level error messages |
| UNAUTHORIZED | 401 | no valid session | "Please log in" |
| FORBIDDEN | 403 | role or ownership check failed | "Access denied" (generic, no detail) |
| NOT_FOUND | 404 | no such resource, or not visible to this caller | "Not found" |
| DUPLICATE_KEY | 409 | unique constraint violated | specific (e.g., "Email already in use") |
| INVALID_STATE | 400 | resource state does not permit this action | specific (e.g., "Payment already received") |
| PAYMENT_FAILED | 402 | payment processing failed | specific reason from Xendit |
| INTERNAL | 500 | unexpected server error | "Something went wrong. Try again." |

Adding a code is deliberate. Document it here before using.

---

## 3. Routes

### `POST /api/auth/register`

- **Purpose:** Register a new user (designer or tenant, or admin if whitelisted)
- **Auth:** None (public)
- **Input:** Zod schema `RegisterInput` in `src/lib/auth/schemas.ts`

| Field | Type | Rules |
|---|---|---|
| email | string | valid email, max 255 chars; unique in users table |
| password | string | 8+ chars, 1 uppercase, 1 number |
| role | enum | designer \| tenant \| admin |

- **Server-derived:** `id`, `createdAt`, `emailVerified: false`, verification token
- **Success:** `{ ok: true, data: { userId, email, message: "Activation link sent" } }`
- **Errors:** VALIDATION_ERROR, DUPLICATE_KEY (email exists), FORBIDDEN (admin but not whitelisted)
- **Side effects:** Creates user record + verification token; sends email (idempotent if resent)
- **Rate limit:** 5 per IP per hour

---

### `POST /api/auth/verify-email`

- **Purpose:** Activate account via email link (set password for first time)
- **Auth:** None (public, but token required)
- **Input:** Zod schema `VerifyEmailInput` in `src/lib/auth/schemas.ts`

| Field | Type | Rules |
|---|---|---|
| token | string | from email link; must be valid and not expired (24h) |
| password | string | 8+ chars, 1 uppercase, 1 number |

- **Server-derived:** `emailVerified: true`, session cookie
- **Success:** `{ ok: true, data: { userId, email, message: "Account activated" } }`
- **Errors:** VALIDATION_ERROR, NOT_FOUND (token invalid), INVALID_STATE (token expired or already verified)
- **Side effects:** Sets password hash, marks email verified, creates session, sends welcome email
- **Rate limit:** 3 per token

---

### `POST /api/auth/login`

- **Purpose:** Authenticate with email and password
- **Auth:** None (public)
- **Input:** Zod schema `LoginInput`

| Field | Type | Rules |
|---|---|---|
| email | string | registered email |
| password | string | user's password |

- **Server-derived:** session cookie
- **Success:** `{ ok: true, data: { userId, email, role, message: "Logged in" } }`
- **Errors:** VALIDATION_ERROR, NOT_FOUND (email doesn't exist, or password wrong — generic message for both)
- **Side effects:** Creates session, sets secure HttpOnly cookie
- **Rate limit:** 5 attempts per IP per 15 minutes

---

### `POST /api/auth/logout`

- **Purpose:** Invalidate session
- **Auth:** Required (any role)
- **Success:** `{ ok: true, data: { message: "Logged out" } }`
- **Side effects:** Deletes session record, clears cookie

---

### `POST /api/payments/initiate`

- **Purpose:** Initiate tenant activation payment via Xendit
- **Auth:** Required (tenant only)
- **Input:** Zod schema `PaymentInitiateInput`

| Field | Type | Rules |
|---|---|---|
| amount | number | activation fee (hardcoded, must match server fee) |

- **Server-derived:** `transactionId`, `invoiceId` (from Xendit API)
- **Success:** `{ ok: true, data: { invoiceId, paymentUrl } }`
- **Errors:** VALIDATION_ERROR, INVALID_STATE (already paid), INTERNAL (Xendit API error)
- **Side effects:** Creates payment record (status: pending); calls Xendit API to create invoice
- **Rate limit:** 10 per user per hour

---

### `POST /api/webhooks/xendit`

- **Purpose:** Receive payment confirmation webhook from Xendit
- **Auth:** Verified via XENDIT_WEBHOOK_SECRET signature
- **Input:** Raw Xendit webhook payload

- **Server-derived:** None (only updates existing payment record)
- **Success:** `{ ok: true, data: {} }`
- **Errors:** VALIDATION_ERROR (signature invalid), NOT_FOUND (transaction not in DB)
- **Idempotency:** Unique constraint on `payments.transactionId` prevents double-crediting
- **Side effects:** Updates payment status (pending → paid); creates wallet for Designer if applicable; sends email to tenant and notification to admin
- **Rate limit:** None (webhook retries from Xendit)

---

### `POST /api/admin/tenants/register`

- **Purpose:** Admin registers a new tenant (or designer, or admin)
- **Auth:** Required (superadmin or admin)
- **Input:** Zod schema `AdminRegisterInput`

| Field | Type | Rules |
|---|---|---|
| email | string | valid email; unique |
| role | enum | tenant \| designer \| admin |

- **Server-derived:** `id`, `createdAt`, verification token
- **Success:** `{ ok: true, data: { userId, email, message: "Registration email sent" } }`
- **Errors:** VALIDATION_ERROR, DUPLICATE_KEY (email), FORBIDDEN (non-admin trying to register admin)
- **Side effects:** Creates user + verification token; sends activation email
- **Audit:** Logged with admin ID, timestamp, action, new user ID
- **Rate limit:** 100 per admin per day

---

### `POST /api/admin/stores/setup`

- **Purpose:** Admin creates and activates a tenant's store after payment
- **Auth:** Required (admin or superadmin), ownership (tenant must exist and have paid)
- **Input:** Zod schema `StoreSetupInput`

| Field | Type | Rules |
|---|---|---|
| tenantId | string | existing tenant user ID |
| storeName | string | 1-100 chars |
| subdomain | string | lowercase, alphanumeric + hyphen, 3-63 chars, not in blacklist |
| whatsappNumber | string | digits only, Indonesian format (62...) |
| templateId | string | published template ID (default: system-default-template) |

- **Server-derived:** `id`, `createdAt`, `status: active`, `config` (injected from template)
- **Success:** `{ ok: true, data: { storeId, subdomain, status: 'active' } }`
- **Errors:** VALIDATION_ERROR, NOT_FOUND (tenant/template), INVALID_STATE (tenant not paid), DUPLICATE_KEY (subdomain taken), CONFLICT (blacklist match)
- **Side effects:** Creates store + injects JSONB config from template; tenant can now edit products; store appears in public directory; sends email to tenant with store URL
- **Audit:** Logged with admin ID, tenant ID, store ID
- **Rate limit:** 50 per admin per day

---

### `GET /api/stores/[subdomain]`

- **Purpose:** Render a store's public page (data + config)
- **Auth:** None (public)
- **Query params:** `subdomain` (from URL path)

- **Success:** `{ ok: true, data: { store, products, config } }`
- **Errors:** NOT_FOUND (subdomain doesn't exist or inactive), INTERNAL
- **Query:** Drizzle query filters by subdomain, status = active, deleted_at IS NULL
- **Caching:** CDN cache TTL = 300s (5 minutes); invalidate on store update
- **Side effects:** None (read-only)
- **Rate limit:** None (public, CDN cached)

---

### `POST /api/tenant/products/create`

- **Purpose:** Tenant creates a new product in their store
- **Auth:** Required (tenant), ownership (user must own the store)
- **Input:** Zod schema `ProductCreateInput`

| Field | Type | Rules |
|---|---|---|
| storeId | string | tenant's store ID |
| name | string | 1-200 chars |
| description | string | 0-2000 chars |
| price | number | > 0, max 999,999,999 |
| imageId | string | image ID (already uploaded) |

- **Server-derived:** `id`, `createdAt`, `status: active`
- **Success:** `{ ok: true, data: { productId, name, price } }`
- **Errors:** VALIDATION_ERROR, NOT_FOUND (store/image), FORBIDDEN (not owner), INVALID_STATE (store not active/paid)
- **Side effects:** Creates product; store page is invalidated in cache
- **Rate limit:** 100 per tenant per day

---

### `POST /api/media/upload-signed-url`

- **Purpose:** Generate signed upload URL for Cloudinary (client uploads directly)
- **Auth:** Required (admin, designer, or tenant)
- **Input:** Zod schema `MediaUploadInput`

| Field | Type | Rules |
|---|---|---|
| fileName | string | basename only (no path); checked for valid image ext |
| contentType | string | image/jpeg, image/png, etc. |

- **Server-derived:** `signedUrl` (Cloudinary signed request), `publicId` (Cloudinary folder/id)
- **Success:** `{ ok: true, data: { signedUrl, publicId, maxSize: 5242880 } }`
- **Errors:** VALIDATION_ERROR (bad filename/type), INTERNAL (Cloudinary API error)
- **Side effects:** None (just generates URL; actual upload happens client-side to Cloudinary)
- **Rate limit:** 50 per user per hour

---

### `POST /api/media/confirm-upload`

- **Purpose:** After client uploads to Cloudinary, confirm and store metadata in DB
- **Auth:** Required (admin, designer, or tenant)
- **Input:** Zod schema `MediaConfirmInput`

| Field | Type | Rules |
|---|---|---|
| publicId | string | returned from Cloudinary |
| dimensions | object | { width, height } |
| altText | string | 0-255 chars |

- **Server-derived:** `id`, `provider: cloudinary`, `size_bytes`, `createdAt`
- **Success:** `{ ok: true, data: { imageId, url } }`
- **Errors:** VALIDATION_ERROR, NOT_FOUND (publicId not found in Cloudinary), INTERNAL
- **Side effects:** Creates image metadata record in DB; if DB save fails, hard-deletes from Cloudinary (rollback)
- **Rate limit:** 50 per user per hour

---

### `DELETE /api/media/[imageId]`

- **Purpose:** Delete image (soft delete in DB, hard delete in Cloudinary)
- **Auth:** Required (admin, uploader, or store owner if product image)
- **Success:** `{ ok: true, data: { message: "Image deleted" } }`
- **Errors:** NOT_FOUND, FORBIDDEN (not uploader/owner)
- **Side effects:** Sets `deleted_at` timestamp; queues async Cloudinary deletion (may retry if API fails)
- **Rate limit:** 50 per user per hour

---

### `POST /api/designer/templates/create`

- **Purpose:** Designer creates a new template (starts as draft)
- **Auth:** Required (designer)
- **Input:** Zod schema `TemplateCreateInput`

| Field | Type | Rules |
|---|---|---|
| name | string | 1-100 chars |
| description | string | 0-500 chars |

- **Server-derived:** `id`, `designerId`, `status: draft`, `config: { version: 1, sections: [] }`, `createdAt`
- **Success:** `{ ok: true, data: { templateId, editorUrl } }`
- **Errors:** VALIDATION_ERROR
- **Side effects:** Creates template record (empty config)
- **Rate limit:** 100 per designer per day

---

### `POST /api/designer/templates/[templateId]/save`

- **Purpose:** Designer saves template config (visual builder state)
- **Auth:** Required (designer), ownership (designer must own template), state (template must not be published)
- **Input:** Zod schema `TemplateSaveInput`

| Field | Type | Rules |
|---|---|---|
| config | object | full JSONB config (validated against schema) |

- **Server-derived:** None (config from client, validated)
- **Success:** `{ ok: true, data: { templateId, savedAt } }`
- **Errors:** VALIDATION_ERROR (config invalid per Zod), FORBIDDEN (not owner), INVALID_STATE (published)
- **Side effects:** Updates template.config (JSONB); updates template.updatedAt
- **Rate limit:** 100 per designer per hour (save can happen frequently)

---

### `POST /api/designer/templates/[templateId]/publish`

- **Purpose:** Designer submits template for approval
- **Auth:** Required (designer), ownership, state (draft)
- **Input:** None

- **Success:** `{ ok: true, data: { templateId, status: 'pending_approval' } }`
- **Errors:** FORBIDDEN, INVALID_STATE (not draft or already published)
- **Side effects:** Sets status to pending_approval; notifies admin (email); sends confirmation to designer
- **Rate limit:** 50 per designer per day

---

### `POST /api/admin/templates/[templateId]/approve`

- **Purpose:** Admin approves template for publication
- **Auth:** Required (admin), state (pending_approval)
- **Input:** None

- **Success:** `{ ok: true, data: { templateId, status: 'published', publishedAt } }`
- **Errors:** NOT_FOUND, FORBIDDEN, INVALID_STATE
- **Side effects:** Sets status to published; sends email to designer; template appears in marketplace
- **Audit:** Logged with admin ID, template ID, action
- **Rate limit:** None (admin action, low frequency)

---

### `POST /api/admin/templates/[templateId]/reject`

- **Purpose:** Admin rejects template with reason
- **Auth:** Required (admin), state (pending_approval)
- **Input:** Zod schema `TemplateRejectInput`

| Field | Type | Rules |
|---|---|---|
| reason | string | 1-500 chars |

- **Success:** `{ ok: true, data: { templateId, status: 'rejected' } }`
- **Errors:** VALIDATION_ERROR, NOT_FOUND, INVALID_STATE
- **Side effects:** Sets status to rejected; sends email to designer with reason
- **Audit:** Logged with admin ID, template ID, reason
- **Rate limit:** None (admin action)

---

### `POST /api/tenant/templates/[templateId]/purchase`

- **Purpose:** Tenant purchases a template; initiates payment via Xendit
- **Auth:** Required (tenant), state (template published)
- **Input:** Zod schema `TemplatePurchaseInput`

| Field | Type | Rules |
|---|---|---|
| templateId | string | published template ID |
| storeId | string | tenant's store ID |

- **Server-derived:** `transactionId`, `invoiceId`
- **Success:** `{ ok: true, data: { invoiceId, paymentUrl } }`
- **Errors:** VALIDATION_ERROR, NOT_FOUND, INVALID_STATE (template not published)
- **Side effects:** Creates transaction record (status: pending); calls Xendit API; sends confirmation email
- **Rate limit:** 50 per tenant per hour

---

### `POST /api/tenant/templates/[templateId]/apply`

- **Purpose:** Tenant applies purchased template to their store
- **Auth:** Required (tenant), ownership, state (template owned by tenant, template published)
- **Input:** None

- **Success:** `{ ok: true, data: { storeId, config, message: "Template applied" } }`
- **Errors:** FORBIDDEN (not owner), NOT_FOUND, INVALID_STATE (not purchased or published)
- **Side effects:** Updates store.config with template.config; store page is invalidated in cache; sends email to tenant
- **Rate limit:** 50 per tenant per day

---

### `GET /api/admin/dashboard/summary`

- **Purpose:** Admin dashboard summary (metrics, pending actions)
- **Auth:** Required (admin)

- **Success:** `{ ok: true, data: { activeStores, revenue, pendingPayouts, pendingApprovals } }`
- **Errors:** INTERNAL
- **Caching:** Cached for 60s (stale data acceptable)
- **Side effects:** None (read-only)

---

### `POST /api/designer/payouts/request`

- **Purpose:** Designer requests payout
- **Auth:** Required (designer), state (pendingBalance > 0)
- **Input:** Zod schema `PayoutRequestInput`

| Field | Type | Rules |
|---|---|---|
| bankAccountId | string | designer's registered bank account |
| amount | number | > 0, <= wallet.pendingBalance |

- **Server-derived:** `id`, `status: pending`, `requestedAt`
- **Success:** `{ ok: true, data: { payoutRequestId, amount, status: 'pending' } }`
- **Errors:** VALIDATION_ERROR, NOT_FOUND (account), FORBIDDEN (not owner), INVALID_STATE (insufficient balance)
- **Side effects:** Creates payout_requests record; notifies admin (email/dashboard badge)
- **Rate limit:** 10 per designer per day

---

### `POST /api/admin/payouts/[payoutRequestId]/process`

- **Purpose:** Admin triggers payout to designer's bank account via Xendit
- **Auth:** Required (admin), state (pending)
- **Input:** None

- **Success:** `{ ok: true, data: { payoutRequestId, status: 'processing', payoutId } }`
- **Errors:** NOT_FOUND, INVALID_STATE, INTERNAL (Xendit API error)
- **Side effects:** Calls Xendit Payouts API; sets status to processing; sends email to designer
- **Audit:** Logged
- **Rate limit:** None (admin action)

---

## 4. Rate limiting

| Endpoint | Limit | Window | Reason |
|---|---|---|---|
| POST /api/auth/login | 5 | 15 min | Brute-force protection |
| POST /api/auth/register | 5 | 1 hour | Spam prevention |
| POST /api/auth/verify-email | 3 | per token | Link misuse prevention |
| POST /api/payments/initiate | 10 | 1 hour | Prevent accidental duplication |
| POST /api/media/upload-signed-url | 50 | 1 hour | Prevent abuse |
| POST /api/media/confirm-upload | 50 | 1 hour | Prevent abuse |
| POST /api/designer/templates/*/save | 100 | 1 hour | Live save during editing |
| POST /api/admin/tenants/register | 100 | 1 day | Admin work hours |
| POST /api/admin/stores/setup | 50 | 1 day | Admin work hours |
| All others (read-only) | unlimited | — | CDN/caching handles load |

---

## 5. Validation rules (Zod schemas)

All input validation happens via Zod before any database operation. Schema files live in `src/lib/<feature>/schemas.ts`.

Example:
```ts
export const ProductCreateInput = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().min(0.01).max(999999999),
  imageId: z.string().uuid('Invalid image ID'),
});
```

Invalid input returns VALIDATION_ERROR with field-level messages.

---

## 6. Idempotency

**Payment webhooks:** Unique constraint on `transactionId` prevents double-crediting if webhook is retried.

**Payout requests:** Similar constraint on `payoutId`.

**Safe to retry (idempotent):**
- POST /api/payments/initiate (if same amount/user, returns same invoiceId)
- POST /api/media/confirm-upload (if same publicId, returns same imageId)
- POST /api/webhooks/xendit (retries are harmless due to unique constraints)

**Not safe to retry (avoid retrying):**
- POST /api/designer/templates/*/publish (changes state each time)
- POST /api/admin/stores/setup (creates new store each time)

---

## 7. Server-derived values (never trust client)

- `userId`, `createdAt`, `updatedAt`
- `price` (for purchases; snapshot from template)
- `commission` amount (calculated from transaction price)
- `status` (set by system logic, not client input)
- `transactionId` (generated or verified from provider)
- Session data (role, permissions)

Always re-derive or fetch from DB; never echo client input back as if it were authoritative.