# Memory — Codebase Map

Status: LIVE · Renew whenever a folder, module, entry point, or major flow is added or moved.

The orientation index. A new session reads this instead of crawling the whole repo. If it
is stale it is worse than empty, because it gets trusted.

## 1. Entry points

| Entry | File | Purpose |
|---|---|---|
| app root layout | src/layouts/BaseLayout.astro | HTML shell, global styles |
| home route | src/pages/index.astro | Marketing landing page |
| checkout route | src/pages/checkout/[invoiceId].astro | Dynamic payment checkout page |
| payment API | src/pages/api/payments/initiate.ts | POST: initiate Xendit payment |
| webhook API | src/pages/api/webhooks/xendit.ts | POST: receive payment confirmation |
| db client | src/lib/db/client.ts | Drizzle ORM singleton |

## 2. Folder map

| Path | Holds | Rules |
|---|---|---|
| `src/pages/` | Astro routes and API endpoints | File-based routing per Astro |
| `src/pages/checkout/` | Checkout page | Dynamic route: [invoiceId] |
| `src/pages/api/payments/` | Payment API routes | POST initiate, GET status |
| `src/pages/api/webhooks/` | Webhook handlers | Xendit payment confirmations |
| `src/components/checkout/` | Checkout UI components | Svelte: InvoiceDetails, PaymentStatus |
| `src/components/public/` | Public-facing components | (empty, for Phase 2) |
| `src/components/admin/` | Admin components | (empty, for Phase 2) |
| `src/components/shared/` | Cross-feature UI | (empty, for Phase 2) |
| `src/lib/xendit.ts` | Xendit API client | Single module, no subfolder |
| `src/lib/payments/` | Payment business logic | schemas.ts, service.ts |
| `src/lib/db/` | Database layer | Drizzle ORM client |
| `src/lib/config/` | Configuration | Environment variables |
| `src/types/payments.ts` | Payment types | Interfaces and contracts |
| `src/db/schema.ts` | Drizzle schema | 19 tables, all entities |
| `tests/` | Test suites | Vitest, mirrors src structure |

## 3. Shared primitives — check here before writing anything new

| Primitive | Location | Does |
|---|---|---|
| response shape | src/pages/api/*.ts | `{ ok: true, data: T }` or `{ ok: false, error: { code, message } }` |
| Xendit client | src/lib/xendit.ts | Invoice creation, signature verification, API calls |
| payment service | src/lib/payments/service.ts | Payment initiation, webhook processing, currency formatting |
| db client | src/lib/db/client.ts | Lazy-loaded Drizzle ORM singleton |
| payment schemas | src/lib/payments/schemas.ts | Zod validation for inputs and webhooks |

## 4. Major flows — where each one actually lives

| Flow | Path through the code |
|---|---|
| Initiate payment | POST /api/payments/initiate → paymentService.initiatePayment() → xenditClient.createInvoice() → payments table |
| Receive webhook | POST /api/webhooks/xendit → verify signature → paymentService.processWebhook() → update payments table |
| View checkout | GET /checkout/[invoiceId] → fetch payment details → render InvoiceDetails + PaymentStatus |
| Poll status | Frontend: PaymentStatus.svelte → GET /api/payments/status/[invoiceId] → fetch from payments table |

## 5. Where to add a new X

| Adding | Goes in | Also update |
|---|---|---|
| a route | `src/pages/` | `tech/api-spec.md` |
| a UI component | `src/components/<scope>/` | `memory/ui-inventory.md` |
| a type | `src/types/<feature>/` | — |
| a token or custom class | `src/styles/` | `memory/css-vars.md` |
| a table | `src/db/schema.ts` | `tech/data-model-erd.md` |
| a payment flow | `src/lib/payments/` or API route | `tech/api-spec.md`, this file |

## 6. Gotchas

Things that surprised a previous session. Each entry saves the next one an hour.

- ...
