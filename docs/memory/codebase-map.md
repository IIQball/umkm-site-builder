# Memory — Codebase Map

Status: LIVE · Renew whenever a folder, module, entry point, or major flow is added or moved.

The orientation index. A new session reads this instead of crawling the whole repo. If it
is stale it is worse than empty, because it gets trusted.

## 1. Entry points

| Entry | File | Purpose |
|---|---|---|
| app root layout | src/layouts/BaseLayout.astro | HTML shell, global styles |
| home route | src/pages/index.astro | Marketing landing page |
| checkout route | src/pages/checkout/[invoiceId].astro | Dynamic transaction checkout page |
| transaction API | src/pages/api/transactions/initiate.ts | POST: initiate Xendit transaction |
| webhook API | src/pages/api/webhooks/xendit.ts | POST: receive transaction confirmation |
| media sign API | src/pages/api/media/sign.ts | POST: generate Cloudinary signed upload params |
| db client | src/lib/db/client.ts | Drizzle ORM singleton |

## 2. Folder map

| Path | Holds | Rules |
|---|---|---|
| `src/pages/` | Astro routes and API endpoints | File-based routing per Astro |
| `src/pages/checkout/` | Checkout page | Dynamic route: [invoiceId] |
| `src/pages/api/transactions/` | Transaction API routes | POST initiate, GET status |
| `src/pages/api/webhooks/` | Webhook handlers | Xendit transaction confirmations |
| `src/components/checkout/` | Checkout UI components | Svelte: InvoiceDetails, TransactionStatus |
| `src/components/public/` | Public-facing components | (empty, for Phase 2) |
| `src/components/admin/` | Admin components | (empty, for Phase 2) |
| `src/components/shared/` | Cross-feature UI | ImageUpload.svelte (drag-and-drop) |
| `src/lib/xendit.ts` | Xendit API client | Single module, no subfolder |
| `src/lib/cloudinary.ts` | Cloudinary operations | Signed upload params, upload, delete |
| `src/lib/transactions/` | Transaction business logic | schemas.ts, service.ts |
| `src/lib/db/` | Database layer | Drizzle ORM client |
| `src/lib/config/` | Configuration | Environment variables |
| `src/schemas/media.schema.ts` | Media Zod schemas | MediaSignInput, CloudinaryUploadResult |
| `src/types/transactions.ts` | Transaction types | Interfaces and contracts |
| `src/db/schema.ts` | Drizzle schema | 19 tables, all entities |
| `src/pages/api/media/` | Media API routes | POST sign (Cloudinary signature) |
| `tests/` | Test suites | Vitest, mirrors src structure |

## 3. Shared primitives — check here before writing anything new

| Primitive | Location | Does |
|---|---|---|
| response shape | src/pages/api/*.ts | `{ ok: true, data: T }` or `{ ok: false, error: { code, message } }` |
| Xendit client | src/lib/xendit.ts | Invoice creation, signature verification, API calls |
| Cloudinary lib | src/lib/cloudinary.ts | generateSignedUploadParams(), uploadToCloudinary(), deleteFromCloudinary() |
| transaction service | src/lib/transactions/service.ts or src/services/transaction.service.ts | Transaction initiation, webhook processing, currency formatting (uses transactions table) |
| db client | src/lib/db/client.ts | Lazy-loaded Drizzle ORM singleton |
| media schemas | src/schemas/media.schema.ts | MediaSignInput, CloudinaryUploadResult, CLOUDINARY_VARIANTS |
| transaction schemas | src/lib/transactions/schemas.ts | Zod validation for inputs and webhooks |
| transaction types | src/types/transactions.ts | TransactionType, PaymentStatus, TransactionRecord interfaces |

## 4. Major flows — where each one actually lives

| Flow | Path through the code |
|---|---|
| Initiate transaction | POST /api/transactions/initiate → transactionService.initiateTransaction() → xenditClient.createInvoice() → transactions table (type: store_registration or template_purchase) |
| Receive webhook | POST /api/webhooks/xendit → verify signature → transactionService.processWebhook() → update transactions table (status: success, failed, expired, etc) |
| View checkout | GET /checkout/[invoiceId] → getTransactionDetails() → render invoice, amount, status |
| Poll status | Frontend: TransactionStatus.svelte → GET /api/transactions/status/[invoiceId] → fetch from transactions table |
| Signed image upload | ImageUpload.svelte → convert WebP → POST /api/media/sign → get params → POST direct to Cloudinary → get URL → store in entity JSONB |

## 5. Where to add a new X

| Adding | Goes in | Also update |
|---|---|---|
| a route | `src/pages/` | `tech/api-spec.md` |
| a UI component | `src/components/<scope>/` | `memory/ui-inventory.md` |
| a type | `src/types/<feature>/` | — |
| a token or custom class | `src/styles/` | `memory/css-vars.md` |
| a table | `src/db/schema.ts` | `tech/data-model-erd.md` |
| a payment flow | `src/lib/transactions/` or API route | `tech/api-spec.md`, this file |
| a media endpoint | `src/pages/api/media/` | `tech/api-spec.md`, this file |
| a Zod schema | `src/schemas/<feature>.schema.ts` | — |

## 6. Gotchas

Things that surprised a previous session. Each entry saves the next one an hour.

- ...
