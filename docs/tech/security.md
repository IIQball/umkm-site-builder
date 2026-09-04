# Tech — Security

Status: LOCKED

Threat surface, enforced controls, and incident response.

---

## 1. Threat surface

| Threat | Vector | Mitigation |
|---|---|---|
| **SQL Injection** | Raw SQL queries; unsanitized input | Use Drizzle ORM; all queries parameterized; Zod validation at boundary |
| **XSS** | Unsanitized user-generated content (store names, product descriptions) | Astro auto-escapes HTML in templates; no `dangerouslySetInnerHTML`; sanitize JSONB config before rendering |
| **CSRF** | State-changing requests without token verification | Astro forms include CSRF token; all POST/PUT/DELETE require valid token |
| **Auth bypass** | Session forgery, token reuse, JWT manipulation | BetterAuth handles session; HttpOnly cookies; token verified on every request; short expiry (7 days) |
| **Privilege escalation** | User modifies role or accesses data outside their permission | Role and ownership checks enforced at data layer (not UI); all queries filtered by user context |
| **Payment fraud** | Double-spending; webhook replay; tampered amounts | Unique constraint on transactionId; Xendit signature verification; immutable transaction amount |
| **Data breach** | Credentials, PII, secrets exposed | Secrets in .env only (never committed); encrypted at rest (Neon); TLS in transit; no sensitive data in logs |
| **Subdomain takeover** | Attacker reserves reserved domain names | Blacklist enforced via unique constraint + validation on admin setup |
| **Rate limiting bypass** | Attacker exhausts resources (auth brute-force, spam uploads) | Per-IP and per-user rate limits on sensitive endpoints; CDN-level DoS protection via Cloudflare |
| **Broken file upload** | Attacker uploads malicious files (executables, zip bombs) | Only images allowed (JPG/PNG); client-side + server-side validation; Cloudinary scans uploaded files |
| **Orphan media** | Uploaded files not cleaned up; storage leak; orphan cost | Soft delete sync: when image record deleted, Cloudinary API called to hard-delete file; weekly cron job identifies orphans |
| **Weak passwords** | User sets "123456" or dictionary word | Zod validation: 8+ chars, 1 uppercase, 1 number; no dictionary words (future: consider against common list) |
| **Insecure direct object reference (IDOR)** | Attacker accesses another user's store by guessing URL | All queries include ownership check (e.g., `where(eq(stores.userId, session.user.id))`); 404 returned if not owner |
| **Open redirect** | Attacker tricks user via redirect to phishing site | Redirect targets validated against whitelist; only redirect to same origin or whitelisted external (Xendit, WhatsApp) |

---

## 2. Enforced controls

### Authentication

- **BetterAuth:** Handles session management, OAuth (Google), password hashing
- **Session storage:** Database-backed (Neon `sessions` table); token is cryptographic random
- **Cookie:** Secure, HttpOnly, SameSite=Lax, domain=`.domain.com` (shared across subdomains)
- **Expiry:** 7 days; refreshed automatically on each request if >1 day old
- **Logout:** Session record deleted; cookie cleared

### Authorization

- **Middleware:** All protected routes check session before handler runs
- **Permissions matrix:** Role x action x resource enforced at data layer
- **Ownership:** Every query filtered by `userId` or `tenant_id`; handler never trusts client-supplied IDs as proof of ownership
- **State checks:** Resource state (e.g., payment status, template approval) validated before action

### Input Validation

- **Zod schemas:** All API inputs validated against strict schema before any DB operation
- **Field-level rules:** Email format, string length, enum values, number ranges
- **Custom validation:** Subdomain blacklist check, WhatsApp format, image type/size
- **Invalid input response:** VALIDATION_ERROR with field messages; no 500 errors for bad input

### Data Protection

- **Secrets:** Never in code, never in logs, never in client bundles
- - `.env.local` (dev) and Cloudflare Workers Secrets (prod)
- **Sensitive fields:** Password hashed via BetterAuth; bank account encrypted at rest
- **Audit logs:** Who did what, when; immutable (append-only, no updates/deletes)
- **Soft deletes:** Records marked `deleted_at` instead of hard-deleted; preserves referential integrity

### Payment Security

- **Webhook verification:** Xendit signature verified on every webhook; reject if invalid
- **Idempotency:** Unique constraint on `transactionId` prevents double-crediting
- **Amount immutability:** Once transaction amount set, never modified; prevents price tampering
- **No payment data in DB:** Only reference (transactionId) and status stored; never card numbers or sensitive payment info

### Media Security

- **Whitelist:** Only JPG, JPEG, PNG allowed; validated client-side and server-side
- **Size limit:** 5MB per file (client-side validation); hard limit enforced server-side
- **Cloudinary scanning:** Automatic malware/virus scanning on upload
- **Signed uploads:** Direct client→Cloudinary upload via signed URL; server never handles binary
- **Orphan cleanup:** Weekly cron job identifies images in Cloudinary with no DB reference and deletes them

### Network Security

- **HTTPS only:** Cloudflare enforces; all traffic encrypted in transit
- **CORS:** Restricted to same-origin; external APIs (Xendit, Cloudinary) use server-side calls, not client fetch
- **Rate limiting:** Per-IP and per-user limits on sensitive endpoints (auth, payments, uploads)
- **Cloudflare DDoS:** WAF rules block common attack patterns; rate-based rules

---

## 3. Secrets (G6 — never pushed to GitHub)

| Secret | Used for | Storage | Rotation |
|---|---|---|---|
| `DATABASE_URL` | Neon connection string | Cloudflare Workers Secrets; `.env.local` (dev only) | Manual; on key compromise |
| `BETTER_AUTH_SECRET` | Session encryption | Workers Secrets; `.env.local` | Manual; annually recommended |
| `XENDIT_API_KEY` | Xendit API calls (inbound + outbound) | Workers Secrets; `.env.local` | Manual; follow Xendit policy |
| `XENDIT_WEBHOOK_SECRET` | Webhook signature verification | Workers Secrets; `.env.local` | Manual; rotate when Xendit requires |
| `CLOUDINARY_API_KEY` | Signed upload URLs | Workers Secrets; `.env.local` | Manual; on compromise |
| `CLOUDINARY_SECRET` | Signed upload URLs | Workers Secrets; `.env.local` | Manual; on compromise |
| `GOOGLE_CLIENT_ID` | OAuth (dev only; production uses different app) | Workers Secrets; `.env.local` | Manual; on compromise |
| `GOOGLE_CLIENT_SECRET` | OAuth | Workers Secrets; `.env.local` | Manual; on compromise |

**Never committed to repo.** `.gitignore` includes:
```
.env.local
.env.production.local
node_modules/
dist/
.DS_Store
```

---

## 4. Logging and monitoring

### Loggable events (server-side only)

- Authentication: login (success/fail), logout, registration, password reset
- Authorization: permission denied, role mismatch, ownership check failed
- Data changes: create, update, delete (with entity ID and user ID)
- Payments: initiation, webhook receipt, webhook rejection (signature invalid), payout processing
- Errors: 500 errors with full stack (server-side only; client never sees)

### Log format

```
[YYYY-MM-DD HH:MM:SS] [TAG] [LEVEL] Operation: <verb>, User: <userId>, Entity: <entityId>, Result: <success|fail>, Error: <error (if fail)>
```

Example:
```
[2026-08-14 09:15:22] [PAYMENT] INFO Operation: initiate_payment, User: user_123, Entity: payment_456, Result: success
[2026-08-14 09:16:00] [AUTH] WARN Operation: login_failed, User: user_789, Result: fail, Error: password_mismatch, Attempts: 3
```

### What NOT to log

- Passwords, API keys, secrets
- Full payment details (only transaction ID)
- Bank account numbers (only last 4 digits if needed)
- Full PII (use masked email or ID)
- Stack traces (server-side only; never in response to client)

### Monitoring (future)

- Alert if >5 failed logins per IP in 15 minutes
- Alert if payout fails more than once
- Alert if Cloudinary quota >80% consumed
- Alert if >10% of requests are errors

---

## 5. HTTPS and TLS

- **Cloudflare:** Universal SSL enabled; automatic HTTPS redirect
- **Certificates:** Cloudflare-managed; rotated automatically
- **Minimum TLS version:** 1.2
- **Ciphers:** Cloudflare modern (no weak ciphers)

---

## 6. Database security

- **Connection:** Neon Serverless Driver (HTTP/WebSocket, no plain TCP)
- **Encryption in transit:** TLS 1.3
- **Encryption at rest:** Neon default (AWS KMS-managed)
- **Backups:** Neon automatic daily; 7-day retention
- **Access control:** Connection string in Workers Secrets; no hardcoded credentials
- **No public access:** Database not accessible from internet; only from Cloudflare Workers

---

## 7. Incident response

### If secrets are compromised

1. **Rotate immediately:** Re-generate API keys in Xendit, Cloudinary, Google Cloud Console
2. **Update Workers Secrets:** Deploy new secrets to Cloudflare
3. **Audit logs:** Check access logs for unauthorized API usage in past 24h
4. **Notify users:** If user data was accessed, notify affected users (GDPR)
5. **Post-mortem:** Document what happened, how it will be prevented

### If payment webhook verification fails

1. **Log the failure:** Tag as `[PAYMENT] ERROR`
2. **Alert Admin:** Dashboard notification; email to ops
3. **Retry:** Xendit will retry webhook delivery; eventual success expected
4. **Manual reconciliation:** If >3 failures, admin manually verifies with Xendit logs

### If Cloudinary upload fails

1. **Client-side error:** User sees "Upload failed. Try again."
2. **Retry:** Client can retry up to 3 times
3. **Fallback:** If upload fails after 3 retries, offer support link
4. **No orphan files:** If DB save fails, Cloudinary file is hard-deleted (no orphans)

---

## 8. Compliance and data residency

- **Data residency:** Neon hosted in AWS; region depends on deployment (Asia-Southeast for Indonesia preferred, but not enforced in MVP)
- **GDPR:** Not in scope for MVP (Indonesian users only)
- **Payment compliance:** PCI DSS — Xendit certified; we never handle card data
- **Data retention:** No explicit retention policy in MVP; data deleted only via soft delete (preserves audit trail)