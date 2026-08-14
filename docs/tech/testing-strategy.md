# Tech — Testing Strategy

Status: LOCKED

Test layers, coverage targets, and CI gate.

---

## 1. Test layers

| Layer | Tool | Where | Coverage target | Runs on |
|---|---|---|---|---|
| **Unit** | Vitest | `tests/unit/` | 80%+ of lib/, services/, utils/ | Every commit (pre-commit) |
| **Integration** | Vitest | `tests/integration/` | All routes, handlers, queries | Every PR (CI) |
| **Permissions** | Vitest | `tests/permissions/` | Generated from permissions matrix | Every PR (CI) |
| **E2E** | Playwright | `tests/e2e/` | Happy paths for all 4 journeys | Pre-release only (manual) |

---

## 2. Unit tests

**Focus:** Pure functions, utilities, business logic.

**Examples:**
- `src/lib/store.ts` → `tests/unit/store.test.ts` (rendering logic, config validation)
- `src/services/media.ts` → `tests/unit/media.test.ts` (URL generation, transformations)
- `src/lib/errors/handler.ts` → `tests/unit/error-handler.test.ts` (error code mapping)

**Template:**
```ts
import { describe, it, expect } from 'vitest';
import { migrateStoreConfig } from '../../src/lib/store';

describe('store config migration', () => {
  it('should migrate v1 to v2 config', () => {
    const v1 = { version: 1, sections: [{ type: 'hero' }] };
    const result = migrateStoreConfig(v1);
    
    expect(result.version).toBe(2);
    expect(result.sections[0].cta).toBeDefined();
  });
  
  it('should reject invalid config', () => {
    const invalid = { version: 1, sections: 'invalid' };
    expect(() => migrateStoreConfig(invalid)).toThrow();
  });
});
```

---

## 3. Integration tests

**Focus:** Routes, handlers, database interactions, external API calls.

**Coverage:**
- **Authentication:** login, logout, register, email verification, session expiry
- **Authorization:** role checks, ownership checks, permission matrix enforcement
- **API routes:** all routes from `docs/tech/api-spec.md` (happy path + error paths)
- **Database:** CRUD operations, foreign key constraints, soft deletes
- **Payments:** Xendit webhook verification, idempotency, status updates
- **Media:** upload signing, confirmation, orphan cleanup

**Template:**
```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../../src/lib/db/client';
import { createTestUser, createTestStore } from '../helpers';

describe('POST /api/tenant/products/create', () => {
  let session, store;
  
  beforeAll(async () => {
    const user = await createTestUser({ role: 'tenant' });
    session = await createTestSession(user);
    store = await createTestStore(user);
  });
  
  it('should create a product with valid input', async () => {
    const response = await fetch('/api/tenant/products/create', {
      method: 'POST',
      headers: { 'Cookie': session.cookie },
      body: JSON.stringify({
        storeId: store.id,
        name: 'Kopi Spesial',
        price: 25000,
        imageId: 'img_123',
      }),
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.data.productId).toBeDefined();
  });
  
  it('should reject invalid price', async () => {
    const response = await fetch('/api/tenant/products/create', {
      method: 'POST',
      headers: { 'Cookie': session.cookie },
      body: JSON.stringify({
        storeId: store.id,
        name: 'Kopi',
        price: -100,  // invalid
        imageId: 'img_123',
      }),
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });
  
  it('should reject unauthorized user', async () => {
    const response = await fetch('/api/tenant/products/create', {
      method: 'POST',
      // no session
      body: JSON.stringify({ ... }),
    });
    
    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe('UNAUTHORIZED');
  });
  
  afterAll(async () => {
    await db.delete(stores).where(eq(stores.id, store.id));
  });
});
```

---

## 4. Permission tests

**Focus:** Generated from permissions matrix (`docs/tech/permissions-matrix.md`).

**Coverage:** One test per row in matrix (or per meaningful combination).

**Template:**
```ts
import { describe, it, expect } from 'vitest';
import { createTestUser, createTestStore } from '../helpers';

describe('permissions: stores', () => {
  describe('read (own store)', () => {
    it('tenant can read own store', async () => {
      const tenant = await createTestUser({ role: 'tenant' });
      const store = await createTestStore(tenant);
      
      const response = await GET(`/api/stores/${store.id}`, {
        session: await createTestSession(tenant),
      });
      
      expect(response.status).toBe(200);
      expect(response.data.storeId).toBe(store.id);
    });
    
    it('different tenant cannot read', async () => {
      const tenant1 = await createTestUser({ role: 'tenant' });
      const tenant2 = await createTestUser({ role: 'tenant' });
      const store = await createTestStore(tenant1);
      
      const response = await GET(`/api/stores/${store.id}`, {
        session: await createTestSession(tenant2),
      });
      
      expect(response.status).toBe(403);
      expect(response.error.code).toBe('FORBIDDEN');
    });
    
    it('admin can read any store', async () => {
      const tenant = await createTestUser({ role: 'tenant' });
      const admin = await createTestUser({ role: 'admin' });
      const store = await createTestStore(tenant);
      
      const response = await GET(`/api/stores/${store.id}`, {
        session: await createTestSession(admin),
      });
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('update (own store)', () => {
    it('tenant can update own store config', async () => {
      const tenant = await createTestUser({ role: 'tenant' });
      const store = await createTestStore(tenant);
      
      const response = await POST(`/api/stores/${store.id}/update-config`, {
        session: await createTestSession(tenant),
        body: { config: { version: 1, sections: [] } },
      });
      
      expect(response.status).toBe(200);
    });
    
    it('tenant cannot update subdomain', async () => {
      const tenant = await createTestUser({ role: 'tenant' });
      const store = await createTestStore(tenant);
      
      const response = await POST(`/api/stores/${store.id}/update-subdomain`, {
        session: await createTestSession(tenant),
        body: { subdomain: 'new-subdomain' },
      });
      
      expect(response.status).toBe(403);
    });
    
    it('admin can update subdomain', async () => {
      const admin = await createTestUser({ role: 'admin' });
      const tenant = await createTestUser({ role: 'tenant' });
      const store = await createTestStore(tenant);
      
      const response = await POST(`/api/stores/${store.id}/update-subdomain`, {
        session: await createTestSession(admin),
        body: { subdomain: 'new-subdomain' },
      });
      
      expect(response.status).toBe(200);
    });
  });
});
```

---

## 5. E2E tests

**Focus:** Full user journeys (Playwright).

**Coverage:** 4 main journeys from `docs/prd/user-journeys.md`

**When to run:** Pre-release (manual trigger); not on every commit (too slow).

**Template:**
```ts
import { test, expect } from '@playwright/test';

test.describe('Journey: Tenant onboarding', () => {
  test('tenant registers, pays, store is set up', async ({ page, context }) => {
    // 1. Admin registers tenant
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL('/admin/dashboard');
    
    await page.click('button:has-text("Register Tenant")');
    await page.fill('input[name="email"]', 'tenant@test.com');
    await page.selectOption('select[name="role"]', 'tenant');
    await page.click('button:has-text("Send")');
    
    await expect(page.locator('text=Registration email sent')).toBeVisible();
    
    // 2. Tenant clicks activation link (simulated)
    const activationLink = '...'; // Extract from test email or use test helper
    await page.goto(activationLink);
    
    await page.fill('input[name="password"]', 'SecurePass123');
    await page.click('button:has-text("Activate")');
    
    // 3. Tenant pays
    await expect(page).toHaveURL('/tenant/dashboard');
    await page.click('button:has-text("Pay Now")');
    
    // Mock Xendit payment success (via test helper)
    await simulateXenditWebhook({ transactionId: '...', status: 'paid' });
    
    // 4. Admin sets up store
    await page.goto('/admin/dashboard');
    await page.click('button:has-text("Setup Store")');
    await page.fill('input[name="storeName"]', 'Kopi Budi');
    await page.fill('input[name="subdomain"]', 'kopi-budi');
    await page.fill('input[name="whatsapp"]', '62812345678');
    await page.click('button:has-text("Create")');
    
    // 5. Verify store is live
    await page.goto('http://kopi-budi.localhost:3000');
    await expect(page.locator('text=Kopi Budi')).toBeVisible();
  });
});
```

---

## 6. CI gate (before merge to main)

**Every PR must pass:**

- [ ] `bun run test:unit` — 100% exit code (any failure blocks merge)
- [ ] `bun run test:integration` — 100% exit code
- [ ] `bun run test:permissions` — 100% exit code
- [ ] `bun run lint` — 0 errors, 0 warnings
- [ ] `bun run type-check` — 0 TypeScript errors
- [ ] Coverage report — 80%+ overall (tracked per file in comments)

**Before release to production:**

- [ ] `bun run test:e2e` — all journeys pass
- [ ] Manual QA testing (visual, UX, edge cases)
- [ ] Security review (secrets not in code, auth flows correct)

---

## 7. Test helpers

**Location:** `tests/helpers.ts`

```ts
export async function createTestUser(opts: { role: 'tenant' | 'designer' | 'admin' }) {
  return db.insert(users).values({
    email: `test-${Date.now()}@test.com`,
    role: opts.role,
    emailVerified: true,
    // ... other defaults
  }).returning();
}

export async function createTestSession(user) {
  // Create session record, return session cookie
}

export async function createTestStore(tenant) {
  return db.insert(stores).values({
    userId: tenant.id,
    name: 'Test Store',
    subdomain: `test-${Date.now()}`,
    whatsappNumber: '62812345678',
  }).returning();
}

export async function simulateXenditWebhook(opts) {
  // Call webhook handler with mocked data
}
```

---

## 8. Coverage tracking

**Target:** 80%+ overall, with focus on critical paths

**Excluded:** Type definitions, config files, migrations (if auto-generated)

**Report:** Run `bun run test:coverage` locally; CI posts report to PR comments.

---

## 9. Test data cleanup

All tests use `beforeAll` and `afterAll` to create and destroy test data. No persistent test data in production or staging databases.

**Database isolation:** Each test suite uses a transaction that is rolled back after the test (or use separate test DB schema per environment).