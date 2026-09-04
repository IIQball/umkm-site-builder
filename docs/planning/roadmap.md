# Planning — Roadmap

Status: LOCKED

Foundation → Core Flow → Quality → Production. Each phase gates the next.

---

## Phase 1: Foundation (Weeks 1-2)

**Goal:** Scaffolding, auth, payment infrastructure, database schema.

**Deliverables:**
- [ ] Project setup (Astro, Svelte, Drizzle, Vitest, Zod)
- [ ] BetterAuth integration (Google OAuth, email/password, sessions)
- [ ] Database schema (users, sessions, stores, storeCategories, products, transactions, templates, wallets, commissions, activityLogs, platformSettings)
- [ ] Xendit integration (payment initiation, webhook verification)
- [ ] Cloudinary integration (signed uploads, transformations)
- [ ] Admin registration flow (whitelist, email verification, password setup)
- [ ] Tenant registration & payment flow (email verification, Xendit payment initiation)
- [ ] API scaffolding (unified response shape, error codes, rate limiting)
- [ ] Unit tests (80%+ coverage on utilities, lib/)
- [ ] Integration tests (auth, payments, media flows)

**Stories:**
- US-01: Admin registers tenant
- US-02: Tenant pays activation fee
- US-11: Admin/Tenant/Designer uploads images

**Exit criteria:**
- Database schema validated with Drizzle
- Admin can register a tenant and receive email
- Tenant can activate account and pay via Xendit
- Images can be uploaded to Cloudinary and stored in DB
- All tests passing; 80%+ coverage

---

## Phase 2: Core Flow (Weeks 3-4)

**Goal:** Admin store setup, store rendering, public directory, template builder.

**Deliverables:**
- [ ] Admin store setup (subdomain validation, application-layer reserved keyword check, JSONB blueprint injection)
- [ ] Store rendering (subdomain routing via host header, Astro SSR, CDN caching)
- [ ] Public directory (store cards, search, responsive grid)
- [ ] Product management (tenant CRUD, imageUrls JSONB array per product, categoryId support)
- [ ] Visual template builder (split-screen, live preview, save-on-click)
- [ ] Template publishing (designer submits, admin approves/rejects)
- [ ] Template marketplace (published templates visible to tenants)
- [ ] Template purchase & apply (tenant buys, applies to store via Xendit payment, transaction type: template_purchase)
- [ ] WhatsApp redirect (product buy button → wa.me URL with pre-filled order)
- [ ] Designer wallet setup (commissions auto-calculated, balance tracking via wallet_mutations)
- [ ] Integration tests (all user journeys, error paths)
- [ ] Permissions tests (generated from matrix, all roles)

**Stories:**
- US-03: Admin sets up tenant store
- US-04: Visitor browses directory
- US-05: Buyer accesses store via subdomain
- US-06: Buyer clicks product → WhatsApp
- US-07: Designer creates template
- US-08: Designer publishes template
- US-09: Tenant purchases & applies template

**Exit criteria:**
- Store can be set up by admin and goes live in <5 seconds
- Directory renders in <1 second with 50+ stores
- Visual builder is responsive (desktop, tablet, mobile)
- Template purchase triggers commission auto-calculation
- WhatsApp redirect works on mobile and web
- All permission tests passing
- E2E smoke tests for 4 main journeys

---

## Phase 3: Quality & Resilience (Weeks 5-6)

**Goal:** Error handling, edge cases, monitoring, performance optimization.

**Deliverables:**
- [ ] Error handling (all error codes tested, client sees safe messages)
- [ ] Edge cases (empty states, slow networks, image upload failures, media JSONB handling)
- [ ] Admin dashboard (transactions table, templates table, payout_requests table, metrics)
- [ ] Payout flow (designer requests payout, admin triggers Xendit disbursement via xenditPayoutId)
- [ ] Audit logging (all state changes logged to activity_logs with user ID and timestamp)
- [ ] Caching strategy (CDN cache TTL per route, cache invalidation on updates)
- [ ] Performance (Lighthouse scores, Core Web Vitals, <1s store render SLA)
- [ ] Security hardening (secrets audit, permission matrix enforcement, OWASP checks)
- [ ] E2E full suite (all journeys, both happy and failure paths)
- [ ] Load testing (concurrent users, spike handling)
- [ ] Documentation (README updates, onboarding guide, deployment runbook)

**Stories:**
- US-10: Admin monitors payments and payouts in dashboard

**Exit criteria:**
- Admin dashboard functional and responsive
- Lighthouse score ≥90 (performance, accessibility, best practices)
- All E2E journeys passing (4 main + variants)
- Zero TypeScript errors, zero lint errors
- Security review completed (secrets not in repo, auth flows verified)
- Load test: 100 concurrent users without errors

---

## Phase 4: Production Readiness (Week 7)

**Goal:** Deployment, monitoring, incident response, go-live prep.

**Deliverables:**
- [ ] CI/CD pipeline (GitHub Actions, tests gate merge, auto-deploy to staging)
- [ ] Production deployment (Cloudflare Workers, Neon production branch, secret management)
- [ ] Monitoring & alerting (error rate, failed webhooks, quota usage, downtime)
- [ ] Backup & disaster recovery (Neon daily backups, manual export procedure)
- [ ] Runbook (incident response, manual payout processing, subdomain troubleshooting)
- [ ] Soft launch (invite 5-10 UMKM, collect feedback, iterate)
- [ ] Go-live (public launch, blog post, marketing)

**Exit criteria:**
- Zero issues in soft launch (or documented + prioritized for future)
- Monitoring active and alerting working
- Team trained on runbook
- Backups tested and recoverable
- Go-live checklist completed

---

## Deferred (Post-MVP)

- [ ] Template versioning & rollback
- [ ] Custom domain per store (not subdomain-only)
- [ ] Inventory sync & stock alerts
- [ ] Order history & analytics for tenants
- [ ] Designer template ratings & reviews
- [ ] Undo/redo in visual builder
- [ ] Bulk product import (CSV)
- [ ] Email order notifications (WhatsApp order → email to tenant)
- [ ] Multi-language UI (not just Indonesian)
- [ ] Mobile app (React Native or Flutter)
- [ ] Advanced permission roles (e.g., tenant sub-users for staff)
- [ ] A/B testing templates
- [ ] Video upload support
- [ ] Live chat customer support widget
- [ ] Automated payout scheduling (weekly, monthly)

---

## Success metrics

| Metric | Target | Why |
|---|---|---|
| Store onboarding time | <5 min | Core value prop |
| Directory render time | <1 sec | User retention (bounce if slow) |
| Tenant adoption | 10+ stores in soft launch | Validation of demand |
| Designer adoption | 3+ published templates | Marketplace viability |
| Payment success rate | >95% | Revenue reliability |
| Uptime | 99.5% | SLA target |
| Error rate | <0.5% of requests | Quality bar |
| Support tickets | <5 per 100 tenants/month | UX quality |

---

## Dependencies & risks

| Risk | Mitigation |
|---|---|
| **Xendit API changes** | Monitor API changelog; pin SDK version; fallback to manual verification |
| **Cloudinary quota exceeded** | Set alert at 80%; upgrade to paid tier if needed; compress images more aggressively |
| **Subdomain routing complexity** | Test thoroughly in Phase 2; have static generation fallback ready for Phase 3 |
| **Designer adoption slow** | Provide template templates/starters; offer design feedback; market to local design communities |
| **Payment fraud** | Use Xendit's built-in fraud detection; manual review of high-value transactions |
| **Data loss** | Test Neon backups weekly; document recovery procedure; alert on backup failures |

---

## Approval gate

**Before Phase 2 starts:**
- [ ] Schema migration tested locally
- [ ] Auth flows working end-to-end
- [ ] Xendit payment testing successful (use sandbox credentials)
- [ ] Cloudinary uploads tested
- [ ] All Phase 1 tests passing

**Before Phase 3 starts:**
- [ ] All Phase 2 stories merged and tested
- [ ] Director and WhatsApp flow working on mobile
- [ ] Admin can set up 5+ test stores without errors

**Before Phase 4 starts:**
- [ ] E2E suite green
- [ ] Performance SLAs met
- [ ] Security review completed and signed off

**Before go-live:**
- [ ] Soft launch feedback incorporated
- [ ] Runbook walkthrough completed with team
- [ ] Post-launch support plan agreed