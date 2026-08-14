# PRD — User Journeys

Status: LOCKED

End-to-end flows. Where a user story says what someone wants, a journey says every screen
and state they pass through to get it — including the ones that go wrong.

---

## Journey — Tenant Concierge Onboarding & Store Launch

**Persona:** Tenant (UMKM Business Owner)
**Trigger:** Admin sends activation email after registering tenant in dashboard
**Success state:** Tenant's store is live, appears in public directory, tenant can log in and see dashboard

### Happy path

| # | Screen / route | User does | System does | State shown |
|---|---|---|---|---|
| 1 | Email inbox | Clicks "Activate Account" link from email | System validates token, expires after 24h | Redirects to password setup page |
| 2 | `/auth/setup-password` | Enters password and confirms | System hashes password, creates session, marks account active | Redirects to login |
| 3 | `/auth/login` | Enters email and password | System authenticates | Redirects to tenant dashboard |
| 4 | `/tenant/dashboard` | Views dashboard | System shows "Payment Required" status | Dashboard with Xendit payment button visible |
| 5 | Xendit payment modal | Tenant enters card details and completes payment | System receives webhook, verifies transaction_id (unique), updates payment status to "Paid" | Payment confirmed, redirects back to dashboard with "Setup In Progress" status |
| 6 | Dashboard (waiting) | Tenant refreshes or waits | Admin receives notification and sets up store (sets name, subdomain, template) | Dashboard shows "Store Live" with store URL |
| 7 | Email + dashboard | Tenant receives "Store Live" email and notification | System injects default JSONB blueprint, adds to directory | Tenant can click "View Store" to see live subdomain |
| 8 | Tenant's subdomain (e.g., `kopi-budi.domain.com`) | Tenant clicks "View Store" | System renders store from JSONB config, displays default template layout | Store loads in <1s with Hero, Catalog, Footer sections visible |

### Failure and edge paths

| Where | What goes wrong | What the user sees | Recovery |
|---|---|---|---|
| Email activation | Link is clicked after 24h expires | "Activation link expired. Request a new one." with resend button | Admin re-registers tenant or tenant requests new activation link |
| Password setup | Password is <8 chars or missing uppercase | Field validation: "Password must be 8+ chars, 1 uppercase" | User corrects and retries |
| Payment modal | Payment card is declined | "Payment failed. Try another card or contact support." | Tenant retries with different card or cancels |
| Payment webhook | Duplicate webhook received (network retry) | System silently rejects (unique constraint on transaction_id) | Duplicate does not double-charge; payment status remains accurate |
| Admin store setup | Subdomain is reserved (e.g., "admin") | Admin sees error: "Subdomain reserved. Choose another." | Admin enters different subdomain and retries |
| Admin store setup | Admin enters invalid WhatsApp format | Form rejects: "WhatsApp must be numbers only" | Admin corrects and retries |
| Store rendering | Tenant accesses subdomain before Admin completes setup | 404 page: "Store not ready yet. Check back soon." | Admin completes setup; tenant refreshes and store appears |
| Store rendering | Image fails to load from Cloudinary | Broken image icon appears; console shows CDN error | System retries image fetch; tenant can refresh to retry |
| Payment recovery | Tenant loses session during payment | "Session expired. Please log in again." | Tenant logs back in; payment status is already recorded (webhook independent of session) |

### Drop-off risks

1. **24-hour activation link expires before tenant notices email** → Mitigation: Resend link button is prominent. Admin can manually extend token in emergency.
2. **Payment modal is confusing or payment repeatedly fails** → Mitigation: Clear error messages, support email visible, payment status is persistent (tenant can retry anytime).
3. **Tenant pays but store doesn't appear after 5 minutes** → Mitigation: Dashboard shows "Setup In Progress" status. Admin is notified to expedite. Worst case, tenant can contact support.
4. **Tenant's store loads slowly (<1s SLA not met)** → Mitigation: Astro SSR + CDN caching is optimized. If image loads are slow, blamed on Cloudinary; retry automatically.

---

## Journey — Visitor Store Discovery & Purchase via WhatsApp

**Persona:** Visitor / Buyer
**Trigger:** Visitor lands on main platform homepage
**Success state:** Buyer completes WhatsApp order and store owner receives message

### Happy path

| # | Screen / route | User does | System does | State shown |
|---|---|---|---|---|
| 1 | `/` (main homepage) | Arrives at platform | System renders homepage with directory section | Homepage loads; directory grid is visible with all active stores |
| 2 | Directory grid | Scans store cards (name, logo, category) | System displays store cards with images from Cloudinary | Cards are responsive, 2 cols on mobile, 3-4 cols on desktop |
| 3 | Store card | Clicks on "Kopi Budi" card | System navigates to subdomain | Browser navigates to `kopi-budi.domain.com` |
| 4 | Store subdomain | Arrives at store | Astro middleware detects host header, queries tenant config, renders store from JSONB | Store loads with Hero banner, product catalog, testimonials, footer |
| 5 | Product catalog | Browses 3-5 products with photos | System renders products from store config; images served as optimized WebP | Product cards display with name, price, "Buy Now" button |
| 6 | Product card | Clicks "Buy Now" on "Kopi Spesial" product | Client-side JS constructs WhatsApp message template with placeholders | Browser navigates to `wa.me/<store-whatsapp>?text=<encoded-message>` |
| 7 | WhatsApp app/web | WhatsApp opens with pre-filled order template | WhatsApp displays message: "Nama: ___, Nomor HP: ___, Alamat: ___, Produk: Kopi Spesial, Harga: Rp 25.000, ..." | Buyer sees template, fills in blanks |
| 8 | WhatsApp chat | Buyer sends message | Store owner receives message in WhatsApp | Order complete; store owner can respond with confirmation, payment instructions, or delivery details |

### Failure and edge paths

| Where | What goes wrong | What the user sees | Recovery |
|---|---|---|---|
| Homepage | Directory fails to load (DB error) | "Directory temporarily unavailable. Please refresh." | Page shows retry button; directory loads on refresh |
| Store card | Store card is clicked but subdomain doesn't exist (malformed link) | 404 page: "Store not found" | Visitor returns to directory and tries another store |
| Store subdomain | Subdomain accessed but Astro rendering fails | 500 error page with retry option | User refreshes; if persistent, contact support |
| Store page | Product images fail to load from Cloudinary | Placeholder/broken image appears | No blocking error; buyer can still complete order via WhatsApp |
| Store page | Mobile view breaks responsiveness (layout not mobile-first) | Store looks crowded; text overlaps buttons | User can still scroll and click "Buy Now"; experience is suboptimal but functional |
| Product button | "Buy Now" button clicked but WhatsApp app not installed | Browser opens WhatsApp Web instead | Buyer can still fill and send order; no interruption |
| WhatsApp message | Product name contains special characters (™, ®, emoji) | Message encodes incorrectly; buyer sees gibberish | Buyer manually corrects product name when sending |
| WhatsApp message | Store WhatsApp number is invalid or disconnected | WhatsApp shows "Contact not found" or number not recognized | Buyer cannot reach store; no way to complete order (UX failure; Admin should validate WhatsApp format) |
| Store page | Visitor has poor connection; page loads slowly | Loading spinner shown; page takes 5+ seconds | Astro SSR + CDN should meet <1s SLA; if not, lazy-load sections below fold |
| Empty store | Store has no products yet | Product catalog section is empty with message "No products yet" | Visitor can still browse other sections or return to directory |

### Drop-off risks

1. **Visitor can't find the store they want in the directory** → Mitigation: Implement keyword search (simple substring match). Show store category. Improve card design with clear branding.
2. **Store loads slowly; visitor leaves before it finishes** → Mitigation: Aggressive Astro SSR caching + Cloudflare CDN. Monitor CLS (layout shift) and LCP (load time) metrics.
3. **WhatsApp message is confusing or looks like spam** → Mitigation: Pre-fill only essential info (product name, store name, store WhatsApp). Let buyer fill name, address, notes to personalize.
4. **Buyer completes WhatsApp order but store owner doesn't respond** → Out of scope (this is the store owner's responsibility). But system can prompt store owner to enable WhatsApp Business notifications.

---

## Journey — Designer Creates & Publishes Template

**Persona:** Designer
**Trigger:** Designer logs in to dashboard after account activation
**Success state:** Template is published, appears in marketplace, and first UMKM purchases it

### Happy path

| # | Screen / route | User does | System does | State shown |
|---|---|---|---|---|
| 1 | `/designer/dashboard` | Logs in; arrives at dashboard | System shows "Designer" role and no payment requirement (unlike Tenant) | Dashboard with "Create New Template" button |
| 2 | `/designer/dashboard` | Clicks "Create New Template" | System initializes new template record with empty JSONB config (version: 1) | Redirects to builder |
| 3 | `/designer/builder/[templateId]` | Builder loads | System renders split-screen (50/50): left panel (config), right panel (live preview) | Split-screen visible; preview is blank |
| 4 | Builder config panel | Designer drags "Hero Section" from component library | Client-side state updates; preview rerenders instantly | Hero section appears in preview with default placeholder |
| 5 | Config panel | Designer changes Hero background color via color picker | Client-side state updates; preview color changes <50ms | Preview hero background changes to new color (no flicker) |
| 6 | Config panel | Designer edits hero text: "Welcome to my store" | Client-side state updates; preview text changes | Preview text updates instantly |
| 7 | Config panel | Designer adds "Catalog Section" component | Client-side state updates; preview adds catalog placeholder | Preview now shows Hero + Catalog sections |
| 8 | Config panel (Catalog) | Designer uploads product image (JPG, 3MB) | Client validates format and size; server generates signed Cloudinary upload URL; image uploads | Image preview appears in catalog section |
| 9 | Upload complete | System converts image to WebP 200KB and stores URL in database (rollback if DB save fails) | Image is stored with metadata; no orphan files | Catalog section shows product with image |
| 10 | Builder | Designer clicks "Save" button | Client serializes full JSONB state (with version: 1) and sends to server | Toast: "Template saved" appears; button dims briefly |
| 11 | Builder | Designer clicks "Publish" button | System validates JSONB, marks template status as "Pending Approval" | Toast: "Submitted for approval"; status badge shows "Pending" |
| 12 | Email + dashboard | Designer receives "Template under review" email; Admin reviews and approves | System updates template status to "Published" | Designer notification: "Your template is published!" |
| 13 | `/designer/marketplace` | Designer views published template in marketplace | System displays template with live preview, description, price field | Template card shows in marketplace grid |
| 14 | Template card | Designer clicks template and sets price: 50,000 IDR | System saves price to template record | Price is set and locked (Tenant will see this price when purchasing) |
| 15 | Marketplace | Designer's template is now visible to all Tenants | System includes template in marketplace query | Template appears in Tenant browse/purchase flow |
| 16 | Email + dashboard | Tenant purchases template; Designer receives payout notification | System credits Designer wallet with commission (percentage TBD); records transaction | Designer sees wallet balance increase; email confirms commission |

### Failure and edge paths

| Where | What goes wrong | What the user sees | Recovery |
|---|---|---|---|
| Builder load | Websocket connection drops during editing | Live preview freezes; message: "Connection lost. Reconnecting..." | System auto-reconnects; state is client-side, so no data loss |
| Config panel | Designer drags invalid component | Component is not added | No error; UI prevents invalid drag-drop |
| Image upload | File is PNG but >5MB | "File too large. Max 5MB. Please compress and try again." | Designer compresses image and retries |
| Image upload | Upload to Cloudinary succeeds, but DB save fails | System hard-deletes image from Cloudinary (rollback) | Toast: "Save failed. Try again." Designer can retry upload |
| Save button | Designer clicks Save, then immediately clicks again | Second click is ignored; no double-submit | Only one JSONB snapshot saved to database |
| Publish button | Designer publishes template with incomplete config (e.g., no sections) | Zod validation rejects invalid state: "Template must contain at least 1 section" | Designer adds sections and retries |
| Admin review | Admin rejects template for quality reasons | Designer receives email: "Your template was not approved. Reason: Colors not accessible (low contrast)." | Designer can edit template and resubmit |
| Price setting | Designer tries to set price to 0 or negative | Form validation: "Price must be > 0" | Designer enters valid price |
| Published template | Designer later tries to edit published template | "Published templates are read-only. Create a new version." | Designer can create a new template or contact support to unpublish |
| Payout | Designer requests payout but bank account not registered | "Bank account required. Add account in Settings." | Designer adds bank account and retries payout request |

### Drop-off risks

1. **Builder UX is confusing; Designer doesn't know how to add sections** → Mitigation: Clear component library with drag/drop hints. Provide 2-3 template presets to start from (not blank canvas).
2. **Publish review takes too long; Designer gives up** → Mitigation: Set SLA for Admin review (<24h). Notify Designer of status. Auto-approve simple, non-problematic templates.
3. **First template doesn't sell quickly; Designer loses motivation** → Mitigation: Show Designer usage analytics (how many times viewed, purchased). Suggest design improvements. Market templates to Tenants via email.
4. **Image upload fails repeatedly; Designer frustrated** → Mitigation: Clear error messages, support email, fallback option (upload via URL instead of file picker).

---

## Journey — Admin Setup & Monitoring

**Persona:** Admin
**Trigger:** Admin logs into Admin dashboard at start of business day
**Success state:** Admin reviews payments, approves templates, triggers payouts

### Happy path

| # | Screen / route | User does | System does | State shown |
|---|---|---|---|---|
| 1 | `/admin/dashboard` | Logs in | System authenticates and loads dashboard | Dashboard home shows key metrics (active stores, revenue, pending actions) |
| 2 | Dashboard | Notices "1 Tenant Awaiting Setup" | System shows notification badge | Sidebar highlights "Tenants" with count badge |
| 3 | `/admin/tenants` | Clicks "Tenants" tab | System queries all paid-but-not-yet-setup tenants | List shows tenant names, payment dates, status "Awaiting Setup" |
| 4 | Tenant row | Clicks "Setup Store" on tenant "Budi Coffee" | System shows form for Store Name, Subdomain, WhatsApp, Template Selection | Setup form is pre-populated with tenant email; Admin enters store details |
| 5 | Setup form | Admin enters: Name: "Kopi Budi", Subdomain: "kopi-budi", WhatsApp: "62812345678", Template: "Default" | System validates subdomain against blacklist (not www, admin, api, etc.) | Form shows "Valid" checkmark next to subdomain |
| 6 | Setup form | Admin clicks "Create Store" | System creates store record, injects JSONB blueprint, marks store as "Active", adds to directory | Toast: "Store created and is now live!"; button disables briefly |
| 7 | `/admin/payments` | Admin clicks "Payments" tab | System queries all tenant payment transactions | Table shows columns: Tenant Name, Payment Date, Amount, Status (Paid/Pending), Transaction ID |
| 8 | Payments table | Admin sees all payments; all show "Paid" | System confirms webhook receipts matched transaction_ids | All rows show green "Paid" badge |
| 9 | `/admin/templates` | Admin clicks "Templates" tab | System queries templates with status "Pending Approval" | List shows 3 pending templates with Designer names and preview thumbnails |
| 10 | Template row | Admin clicks "Review" on Designer "Eka's Template" | System shows template preview, description, Designer info | Preview loads; Admin can inspect design quality |
| 11 | Review panel | Admin clicks "Approve" | System marks template as "Published"; Designer receives email notification | Toast: "Template approved"; status updates to "Published" |
| 12 | `/admin/payouts` | Admin clicks "Payouts" tab | System queries all payout requests (Designer withdrawal requests) | Table shows: Designer Name, Amount Requested, Bank Account, Status (Pending/Completed), Date |
| 13 | Payout row | Admin sees Designer "Eka" requesting 500,000 IDR | Payout status is "Pending" | Admin reviews request details |
| 14 | Payout row | Admin clicks "Process Payout" | System calls Xendit Payouts API with Designer's bank account and amount | Spinner shows while API processes |
| 15 | After payout | Xendit confirms transfer | System updates payout status to "Completed"; Designer receives email confirmation | Row shows "Completed" badge; timestamp logged |
| 16 | Dashboard (refresh) | Admin refreshes dashboard | System recalculates metrics (revenue, active stores, pending payouts) | Dashboard metrics are up-to-date |

### Failure and edge paths

| Where | What goes wrong | What the user sees | Recovery |
|---|---|---|---|
| Setup form | Admin enters subdomain that is already taken | Form validation: "Subdomain already in use. Choose another." | Admin enters different subdomain and retries |
| Setup form | Admin enters WhatsApp with non-numeric characters | Form validation: "WhatsApp must be numbers only" | Admin corrects and retries |
| Setup form | Admin tries to set up same tenant twice | System prevents duplicate store creation (unique constraint on tenant_id) | Duplicate request fails silently or shows "Store already exists" |
| Create Store | Store creation succeeds but JSONB injection fails | Toast: "Store created but config not ready. Retry in 5 seconds." | Admin refreshes or clicks retry; JSONB is injected on next attempt |
| Payments table | Payment webhook was never received (network failure) | Payment shows "Pending" despite tenant claiming to have paid | Admin can manually verify with Tenant, mark as "Paid" if confirmed, or investigate Xendit logs |
| Templates tab | Admin tries to approve a template with invalid JSONB | System validation catches error: "Template config is invalid. Cannot approve." | Template stays "Pending"; Admin contacts Designer to fix |
| Payout | Payout to Designer fails (invalid bank account) | Toast: "Payout failed. Reason: Invalid bank account. Contact Designer." | Admin notifies Designer to correct bank account and retries |
| Payout | Xendit API is down | "Payout system temporarily unavailable. Try again in 5 minutes." | System queues payout for retry; Admin is notified |
| Dashboard metrics | Metrics query is slow (many stores/transactions) | Dashboard loads but metrics are delayed (spinning loader) | System implements caching; metrics load within 2 seconds |

### Drop-off risks

1. **Admin forgets to set up a paid Tenant's store; Tenant is frustrated** → Mitigation: Notification badge on dashboard, email reminder to Admin, escalation after 24h.
2. **Subdomain blacklist check is incomplete; Admin creates conflict** → Mitigation: Maintain a hardcoded reserved list (www, admin, api, dashboard, etc.). Add to docs.
3. **Payout to Designer fails; Admin doesn't notice** → Mitigation: Failed payouts are flagged with red badge on dashboard. Email alert to Admin.
4. **Admin manually marks payment as "Paid" without verification** → Mitigation: Audit log records who marked what and when. Require proof (email from Xendit, screenshot, etc.) in comments field.

---

Every journey must list its failure paths. A journey with only a happy path produces a UI
with only a happy state.