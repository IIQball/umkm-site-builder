# Tech — Code Standards

Status: LOCKED

Project-specific standards on top of `.agents/rules/20-code-standards.md`. General rules stay in that file; this file is project-specific additions only.

---

## 1. Project-specific conventions

### Naming

- **Stores/tenants:** Use `store` and `tenant` consistently (not `shop`, `business`, `account`)
- **Templates:** Always `template`, never `theme` or `layout`
- **Products:** Always `product`, never `item` or `listing`
- **Designer/Designer user:** Always `designer` (not `creator`, `author`, `vendor`)
- **Commissions:** Always `commission` (never `earning`, `revenue`, `payout`)
- **Wallet:** Always `wallet` (never `balance`, `account`, `funds`)

### Database/ORM

- **Table names:** Plural, snake_case (`users`, `stores`, `products`, `commissions`)
- **Columns:** snake_case (`user_id`, `store_id`, `created_at`, `updated_at`)
- **Primary key:** Always `id` (UUID, auto-generated)
- **Foreign keys:** `<table>_id` (e.g., `user_id`, `store_id`)
- **Boolean columns:** Prefix with `is_` (e.g., `is_active`, `is_deleted` — use `deleted_at` for soft delete instead)
- **Status columns:** Use enum type; never string without constraint
- **JSONB columns:** Always include `version` attribute for forward compatibility
- **Timestamps:** Always include `created_at` and `updated_at`; use CURRENT_TIMESTAMP default

### API

- **Error codes:** SCREAMING_SNAKE_CASE (`VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`)
- **Field names:** camelCase in JSON responses (not snake_case)
- **Route names:** Lowercase, hyphenated (e.g., `/api/tenant/products/create`, not `/api/Tenant/Products/Create`)
- **HTTP methods:** POST for create, GET for read, PUT/PATCH for update, DELETE for delete (no RPC-style verbs like /api/product/delete)

### React/Svelte components

- **File names:** PascalCase (e.g., `StoreCard.svelte`, `ProductList.svelte`)
- **Props:** camelCase (e.g., `<ProductCard productId={id} />`)
- **Event handlers:** `on<Action>` (e.g., `onClick`, `onSubmit`, not `handleClick`)
- **State variables:** camelCase (e.g., `const [isLoading, setIsLoading]` in JS; Svelte: `let isLoading = false`)

### Files & folders

- **Type definitions:** `src/types/<feature>.ts` (grouped by feature, not scattered)
- **Constants:** `src/lib/config/<feature>.ts` (not inline in components)
- **Utilities:** `src/lib/<feature>/utils.ts` (not `helpers.ts` or `common.ts`)
- **Schemas:** `src/lib/<feature>/schemas.ts` (Zod schemas co-located with feature)
- **Services:** `src/services/<provider>.ts` (e.g., `media.ts`, `payment.ts`, not `cloudinary.ts`, `xendit.ts`)

---

## 2. JSONB config versioning example

Every JSONB config includes `version` for forward compatibility:

```ts
// v1 config
{
  "version": 1,
  "sections": [
    { "id": "hero_1", "type": "hero", "title": "..." }
  ]
}

// Migration function (in src/lib/store.ts)
export function migrateStoreConfig(config: any): StoreConfigV2 {
  if (config.version === 1) {
    // Apply v1 → v2 transformations
    config.sections.forEach(s => {
      if (s.type === 'hero') s.cta = s.cta || { text: 'Browse', link: '#' };
    });
    config.version = 2;
  }
  return config;
}

// On save, always use current version
export async function saveStoreConfig(storeId: string, config: StoreConfigV1) {
  const current = migrateStoreConfig(config);  // ensure latest version
  await db.update(stores).set({ config: current });
}

// On render, migrate before use
export function renderStore(store: Store) {
  const config = migrateStoreConfig(store.config);
  // ... render with config
}
```

---

## 3. Error handling pattern

All handlers follow this pattern:

```ts
export async function handler(req: Request, context: Context) {
  try {
    // 1. Parse & validate input
    const input = RequestSchema.parse(await req.json());
    
    // 2. Authenticate
    const session = await getSession(context);
    if (!session) return unauthorizedError('Please log in');
    
    // 3. Authorize (role check)
    if (!canUserAction(session.user.role, 'resource', 'action')) {
      return forbiddenError('Your role cannot access this');
    }
    
    // 4. Ownership & state check (query with user context)
    const record = await db.select().from(table)
      .where(eq(table.id, input.id))
      .where(eq(table.userId, session.user.id));  // ownership
    
    if (!record) return forbiddenError('Access denied');
    
    if (action === 'approve' && record.status !== 'pending') {
      return invalidStateError('Not in pending state');
    }
    
    // 5. Act
    const result = await db.update(table).set({ ...updates });
    
    // 6. Log success
    logger.info('[PAYMENT] Operation: approve, User: ${session.user.id}, Entity: ${input.id}, Result: success');
    
    return okResponse({ data: result });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err.flatten());
    
    logger.error('[API] Operation: handler_name, User: ${context.user?.id}, Result: fail, Error: ${err.message}\n${err.stack}');
    return internalError('Something went wrong');
  }
}
```

---

## 4. Logging tag reference

Use these tags consistently:

- `[AUTH]` — Authentication (login, register, session)
- `[STORE]` — Store rendering, config updates
- `[PRODUCT]` — Product CRUD
- `[TEMPLATE]` — Template creation, publishing, approval
- `[PAYMENT]` — Payments, webhooks, transactions
- `[MEDIA]` — Image uploads, deletions, Cloudinary sync
- `[DESIGNER]` — Designer-specific operations
- `[ADMIN]` — Admin operations
- `[WEBHOOK]` — Webhook processing (any provider)
- `[API]` — Generic API errors
- `[DB]` — Database errors

---

## 5. CSS variable naming

All colors, spacing, fonts from CSS variables. No hardcoded values.

**Naming convention:**

```css
/* Colors */
--color-primary: #2563eb;
--color-primary-dark: #1e40af;
--color-secondary: #7c3aed;
--color-success: #10b981;
--color-error: #ef4444;
--color-warning: #f59e0b;
--color-text: #1f2937;
--color-text-muted: #6b7280;
--color-bg: #ffffff;
--color-bg-muted: #f9fafb;
--color-border: #e5e7eb;

/* Spacing (4px base unit) */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */

/* Typography */
--font-family-sans: system-ui, -apple-system, sans-serif;
--font-family-mono: monospace;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--line-height-tight: 1.25;
--line-height-normal: 1.5;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

**Usage in Svelte:**
```svelte
<style>
  .button {
    color: var(--color-text);
    background: var(--color-primary);
    padding: var(--space-3) var(--space-4);
    border-radius: 0.375rem;
    transition: background var(--transition-base);
  }
  
  .button:hover {
    background: var(--color-primary-dark);
  }
</style>
```

---

## 6. Zod schema patterns

All schemas in `src/lib/<feature>/schemas.ts`:

```ts
import { z } from 'zod';

// Request input
export const CreateProductInput = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  name: z.string().min(1, 'Name required').max(200, 'Name too long'),
  description: z.string().max(2000).optional(),
  price: z.number().min(0.01, 'Price must be > 0').max(999999999),
  imageId: z.string().uuid('Invalid image ID').optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductInput>;

// Response data shape
export const ProductData = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  imageId: z.string().uuid().optional(),
  createdAt: z.date(),
});

export type ProductData = z.infer<typeof ProductData>;

// Enum
export const StoreStatus = z.enum(['active', 'inactive', 'suspended']);
export type StoreStatus = z.infer<typeof StoreStatus>;
```

---

## 7. Service module pattern

Each external service (Cloudinary, Xendit, etc.) gets a dedicated service module:

```ts
// src/services/media.ts
import { v2 as cloudinary } from 'cloudinary';

export class MediaService {
  private client = cloudinary;
  
  constructor() {
    this.client.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }
  
  /**
   * Generate signed upload URL for direct client upload
   */
  async getSignedUploadUrl(folder: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.client.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_SECRET!
    );
    
    return {
      url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
    };
  }
  
  /**
   * Hard delete image from Cloudinary
   */
  async deleteImage(publicId: string) {
    try {
      await this.client.uploader.destroy(publicId);
    } catch (err) {
      logger.error(`[MEDIA] Failed to delete ${publicId}: ${err.message}`);
      throw err;
    }
  }
  
  /**
   * Transform URL to variant (thumbnail, card, hero)
   */
  getVariantUrl(publicId: string, variant: 'thumbnail' | 'card' | 'hero') {
    const transforms = {
      thumbnail: 'w_200,h_200,c_fill,f_webp',
      card: 'w_400,h_300,c_fill,f_webp',
      hero: 'w_1200,h_600,c_fill,f_webp',
    };
    
    return this.client.url(publicId, { transformation: transforms[variant] });
  }
}

export const mediaService = new MediaService();
```

---

## 8. Response helper pattern

All responses use unified helpers:

```ts
// src/lib/api/response.ts
export function okResponse<T>(data: T, status = 200) {
  return new Response(JSON.stringify({ ok: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(code: string, message: string, status: number) {
  return new Response(JSON.stringify({ ok: false, error: { code, message } }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const unauthorizedError = (msg?: string) => errorResponse('UNAUTHORIZED', msg || 'Please log in', 401);
export const forbiddenError = (msg?: string) => errorResponse('FORBIDDEN', msg || 'Access denied', 403);
export const notFoundError = (msg?: string) => errorResponse('NOT_FOUND', msg || 'Not found', 404);
export const validationError = (fields: any) => errorResponse('VALIDATION_ERROR', 'Validation failed', 400);
export const invalidStateError = (msg: string) => errorResponse('INVALID_STATE', msg, 400);
export const internalError = () => errorResponse('INTERNAL', 'Something went wrong', 500);
```

---

## 9. Pre-commit checks

Run locally before pushing:

```bash
bun run lint        # ESLint + Prettier
bun run type-check  # TypeScript
bun run test:unit   # Unit tests
```

CI will run full suite (unit + integration + permissions) before merge.