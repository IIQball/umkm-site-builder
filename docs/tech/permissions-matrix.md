# Tech — Permissions Matrix

Status: LOCKED

The authoritative role x action x resource table. Enforced **server-side at the data
layer**, not only in the UI. Tests are generated from this table
(`../../.agents/rules/50-qa-testing.md` §2).

## 1. Roles (G5)

| Role | Who | How assigned | Notes |
|---|---|---|---|
| `superadmin` | Founder, CTO, ops lead | Manual in database; cannot self-register | Full system access; can manage admins and view audit logs |
| `admin` | Platform operator | Email whitelisted in `admin_whitelist` table; activated by Superadmin | Can register tenants/designers, setup stores, approve templates, trigger payouts |
| `designer` | UI/UX professional | Self-register (no payment required); email auto-verified via link | Can create templates, publish for marketplace, view commissions and payouts |
| `tenant` | UMKM business owner | Admin registers via dashboard (no password); activated via email link | Must pay activation fee before accessing store features; can edit 1 store only |
| `public` | Unauthenticated visitor | No login required | Can browse directory and stores; cannot make purchases (redirects to WhatsApp) |

Deny by default. A role not listed for an action does not have it.

---

## 2. Matrix

| Resource | Action | Superadmin | Admin | Designer | Tenant | Public | Ownership | State |
|---|---|---|---|---|---|---|---|---|
| **Users** | | | | | | | | |
| users | create (self register) | no | no | yes | no | no | — | — |
| users | read (own profile) | yes | yes | yes | yes | no | yes | — |
| users | read (any user) | yes | no | no | no | no | no | — |
| users | update (own) | yes | yes | yes | yes | no | yes | — |
| users | update (any) | yes | no | no | no | no | no | — |
| users | delete (own) | no | no | no | no | no | yes | — |
| users | delete (any) | yes | no | no | no | no | no | — |
| **Admin Whitelist** | | | | | | | | |
| admin_whitelist | create | yes | no | no | no | no | — | — |
| admin_whitelist | read (all) | yes | no | no | no | no | — | — |
| admin_whitelist | update | yes | no | no | no | no | — | — |
| admin_whitelist | delete | yes | no | no | no | no | — | — |
| **Subdomain Blacklist** | | | | | | | | |
| subdomain_blacklist | create | yes | no | no | no | no | — | — |
| subdomain_blacklist | read (all) | yes | yes | no | no | no | — | — |
| subdomain_blacklist | update | yes | no | no | no | no | — | — |
| subdomain_blacklist | delete | yes | no | no | no | no | — | — |
| **Payments (Activation)** | | | | | | | | |
| payments | create (self, tenant) | no | no | no | yes | no | yes | tenant paid=false |
| payments | read (own) | yes | yes | no | yes | no | yes | — |
| payments | read (any) | yes | yes | no | no | no | no | — |
| payments | update (status via webhook) | yes | no | no | no | no | — | — |
| **Stores** | | | | | | | | |
| stores | create (admin setup) | no | yes | no | no | no | — | tenant paid=true |
| stores | read (own) | yes | yes | no | yes | no | yes | any |
| stores | read (any, public) | yes | yes | no | no | yes | no | status=active |
| stores | update (config, own) | yes | no | no | yes | no | yes | any |
| stores | update (subdomain, name, etc.) | yes | yes | no | no | no | — | — |
| stores | delete | yes | no | no | no | no | — | — |
| **Products** | | | | | | | | |
| products | create (own store) | no | no | no | yes | no | yes | owner.paid=true |
| products | read (own store) | yes | yes | no | yes | no | yes | any |
| products | read (any, public) | yes | yes | no | no | yes | no | store.status=active |
| products | update (own store) | no | no | no | yes | no | yes | owner.paid=true |
| products | delete (own store) | no | no | no | yes | no | yes | owner.paid=true |
| **Templates** | | | | | | | | |
| templates | create (designer) | no | no | yes | no | no | yes | — |
| templates | read (own draft) | yes | yes | yes | no | no | yes | any |
| templates | read (published) | yes | yes | yes | yes | yes | no | status=published |
| templates | read (all, admin) | yes | yes | no | no | no | — | — |
| templates | update (own draft) | no | no | yes | no | no | yes | status=draft |
| templates | update (own pending) | no | no | yes | no | no | yes | status=pending_approval |
| templates | update (published) | no | no | no | no | no | — | — |
| templates | approve (admin) | no | yes | no | no | no | — | status=pending_approval |
| templates | reject (admin) | no | yes | no | no | no | — | status=pending_approval |
| templates | delete (own draft) | no | no | yes | no | no | yes | status=draft |
| templates | delete (any, admin) | yes | no | no | no | no | — | — |
| **User Templates (Ownership)** | | | | | | | | |
| user_templates | create (assign default to new store) | yes | yes | no | no | no | — | template.status=published |
| user_templates | create (purchase template) | no | no | no | yes | no | yes | template.status=published |
| user_templates | read (own) | yes | yes | yes | yes | no | yes | — |
| user_templates | read (any) | yes | no | no | no | no | — | — |
| user_templates | delete (revoke) | yes | yes | no | no | no | — | — |
| **Transactions (Purchases)** | | | | | | | | |
| transactions | create (webhook from Xendit) | yes | no | no | no | no | — | — |
| transactions | read (own) | yes | yes | yes | yes | no | yes | — |
| transactions | read (any) | yes | yes | no | no | no | — | — |
| transactions | refund | yes | yes | no | no | no | — | status=completed |
| **Commissions** | | | | | | | | |
| commissions | create (auto from transaction) | yes | no | no | no | no | — | — |
| commissions | read (own) | yes | yes | yes | no | no | yes | — |
| commissions | read (any) | yes | yes | no | no | no | — | — |
| commissions | update (status) | yes | yes | no | no | no | — | — |
| **Wallets** | | | | | | | | |
| wallets | read (own) | yes | yes | yes | no | no | yes | — |
| wallets | read (any) | yes | yes | no | no | no | — | — |
| wallets | update (balance) | yes | no | no | no | no | — | — |
| **Wallet Mutations** | | | | | | | | |
| wallet_mutations | create (auto from ledger event) | yes | no | no | no | no | — | — |
| wallet_mutations | read (own wallet's ledger) | yes | yes | yes | no | no | yes | — |
| wallet_mutations | read (any) | yes | yes | no | no | no | — | — |
| **Bank Accounts** | | | | | | | | |
| bank_accounts | create (designer setup) | no | no | yes | no | no | yes | — |
| bank_accounts | read (own) | yes | yes | yes | no | no | yes | — |
| bank_accounts | read (any) | yes | yes | no | no | no | — | — |
| bank_accounts | update (own) | no | no | yes | no | no | yes | — |
| bank_accounts | update (any, admin) | yes | yes | no | no | no | — | — |
| bank_accounts | delete (own) | no | no | yes | no | no | yes | — |
| **Payout Requests** | | | | | | | | |
| payout_requests | create (designer requests) | no | no | yes | no | no | yes | wallet.pendingBalance > 0 |
| payout_requests | read (own) | yes | yes | yes | no | no | yes | — |
| payout_requests | read (all, admin) | yes | yes | no | no | no | — | — |
| payout_requests | process (admin triggers) | no | yes | no | no | no | — | status=pending |
| payout_requests | cancel (admin or designer) | no | yes | yes | no | no | yes/own | status=pending |
| **Images (Media)** | | | | | | | | |
| images | create (upload) | yes | yes | yes | yes | no | — | — |
| images | read (metadata) | yes | yes | yes | yes | yes | no | — |
| images | delete (soft delete) | yes | yes | yes | yes | no | — | deleted_at=null |
| **Audit Logs** | | | | | | | | |
| audit_logs | read (all) | yes | no | no | no | no | — | — |
| audit_logs | read (own entity logs) | yes | yes | yes | yes | no | yes | — |

---

## 3. Guard order (every protected path)

1. **Authenticate** — is there a valid session (check `sessions` table, verify token)
2. **Authorize** — does the role permit this action on this resource type (check matrix, row 1)
3. **Ownership** — does this specific record belong to this user (check `userId` or tenant membership)
4. **Resource state** — is the record in a state that permits this action (check `status`, `deleted_at`, etc.)
5. **Act** — perform the operation

Skipping step 3 is the most common real breach: a role check passes and the user edits
someone else's record. Every handler must explicitly check ownership after role validation.

---

## 4. Denial behaviour

| Case | Response | HTTP Code | Reason |
|---|---|---|---|
| no session | `{ ok: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } }` | 401 | User must authenticate first |
| wrong role | `{ ok: false, error: { code: 'FORBIDDEN', message: 'Your role cannot access this' } }` | 403 | Role lacks permission for action |
| not owner | `{ ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }` | 403 | Avoid confirming record exists (information leak) |
| wrong state | `{ ok: false, error: { code: 'INVALID_STATE', message: 'Resource is not in a state that permits this action' } }` | 400 | E.g., trying to approve a template that is already published |

---

## 5. Public exposure rules

What is readable without a session, and the exact conditions.

| Resource | Readable | Conditions |
|---|---|---|
| **Directory (stores list)** | yes | Only stores with `status = 'active'` and `deleted_at IS NULL` |
| **Store page** | yes | Only store with `status = 'active'` (via subdomain routing); config and products rendered |
| **Products (public view)** | yes | Only products in active stores with `status = 'active'` |
| **Templates (marketplace)** | yes | Only templates with `status = 'published'` and `designerId IS NOT NULL` |
| **Images** | yes | Only images with `deleted_at IS NULL`; served via Cloudinary CDN |
| **User profiles** | no | Login required; only own profile readable |
| **Payment records** | no | Login required; only Admin and Superadmin see across users |
| **Commission data** | no | Login required; only Designer and Admin see |
| **Bank accounts** | no | Login required; only Designer and Admin see |
| **Payout history** | no | Login required; only Designer and Admin see |

**Cart / Checkout:** NOT implemented. Buyers are redirected to WhatsApp; no order state stored in DB.

---

## 6. Enforcement points

| Layer | What it enforces |
|---|---|
| **Route guard (middleware)** | Check `session` cookie; verify token exists and is not expired. If missing/expired, redirect to `/auth/login` (for HTML pages) or return 401 (for API). |
| **Handler authorization** | Before querying, check `user.role` against the matrix. If role not in allowed list, return 403 immediately. |
| **Data layer (Drizzle query)** | Every query filters by `userId` or `tenant_id` or `storeId`. E.g., `db.select().from(products).where(eq(products.storeId, userStore.id))`. No query without a WHERE clause on tenant context. |
| **Database constraints** | Foreign keys cascade on delete; unique constraints prevent duplicates (e.g., one store per tenant). RLS can be added later if multitenancy becomes complex. |
| **Tests** | `tests/permissions/` contains one test per row in matrix (or per role x resource x action). Tests verify: allowed access succeeds, denied access fails with correct code. |

---

## 7. Implementation checklist per handler

Every handler must follow this checklist before acting:

```ts
export async function handler(req: Request, context: Context) {
  // 1. Authenticate
  const session = await getSession(context);
  if (!session) return forbiddenError('UNAUTHORIZED', 'Please log in');
  
  // 2. Authorize (role x action)
  if (!canUserAction(session.user.role, 'resource', 'action')) {
    return forbiddenError('FORBIDDEN', 'Your role cannot access this');
  }
  
  // 3. Ownership + resource state (query with user context)
  const record = await db.select().from(tableName)
    .where(eq(tableName.id, recordId))
    .where(eq(tableName.userId, session.user.id));  // OWNERSHIP CHECK
  
  if (!record || record[0].status === 'deleted') {
    return forbiddenError('FORBIDDEN', 'Access denied');  // Don't leak existence
  }
  
  // 4. Resource state (specific to action)
  if (action === 'approve' && record[0].status !== 'pending_approval') {
    return errorResponse('INVALID_STATE', 'Template is not pending approval');
  }
  
  // 5. Act
  await db.update(tableName).set({ status: 'approved' }).where(...);
  return okResponse({ data: record });
}
```

---

## 8. Role hierarchy (for reference)

Not enforced by the matrix, but useful for UI (e.g., showing "Admin or higher"):

```
Superadmin
  ↓ (can do most Admin tasks)
Admin
  ↓ (can do most Designer tasks)
Designer
  ↓ (can do most Tenant tasks)
Tenant
  ↓ (can do most Public tasks)
Public
```

**Note:** This hierarchy is descriptive, not prescriptive. Check the matrix for exact permissions.