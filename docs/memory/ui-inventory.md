# Memory — UI Component Inventory

Status: LIVE · Rule: use daisyUI components, never hand-roll what it provides
(`../../.agents/rules/30-ui-ux.md` §2).

**Read this before building any UI.** Add a row the first time you use a component.

## 1. Install model

How daisyUI is wired in this project (plugin declaration, themes enabled, whether there is
any per-component install step). Confirm unfamiliar markup against current daisyUI docs
via context7 before use — major versions change markup and defaults.

```css
/* src/styles/... */
```

## 2. Icon pack (G2)

| Package | SSR import path | Sizing convention | Color source |
|---|---|---|---|
| | | | token only |

One pack. Never a second. No emojis as substitutes.

## 3. In use

| Component | Classes | Where |
|---|---|---|
| btn | btn-primary, btn-outline, btn-lg | index.astro, checkout page |
| card | card, card-body, card-title | checkout/InvoiceDetails.svelte |
| badge | badge-success, badge-warning, badge-error | checkout/InvoiceDetails.svelte |
| alert | alert, alert-success, alert-error, alert-info, alert-warning | checkout/InvoiceDetails.svelte, PaymentStatus.svelte |
| form-control | form-control, label, label-text, input, input-bordered | checkout/InvoiceDetails.svelte |
| loading | loading-spinner | checkout page, PaymentStatus.svelte |
| link | link, link-hover | checkout page |
| progress | progress-primary, progress-success | shared/ImageUpload.svelte, dashboard/TrafficWidget.svelte |
| stat | implicit via card + flex layout | dashboard/TrafficWidget.svelte (two stat cards) |

## 3.1 Composite components (project-specific)

| Component | File | Built from | Props |
|---|---|---|---|
| ImageUpload | src/components/shared/ImageUpload.svelte | card, btn, alert, progress, lucide icons | folder, maxFiles, maxSizeMB, existingUrls, onUpload |
| TrafficWidget | src/components/dashboard/TrafficWidget.svelte | card, btn, alert, progress, lucide icons (TrendingUp, Users, MessageCircle, Loader2) | storeId |

## 4. Established patterns

Composite patterns settled once and reused, so three sessions do not produce three
different cards.

| Pattern | Built from | Used by | Notes |
|---|---|---|---|
| page shell | | | |
| form field | | | |
| data table | | | |
| empty state | | | |
| loading state | | | |
| error state | | | |
| confirm dialog | | | |

## 5. Version gotchas

Markup that differs from what a model would assume from training data. Record each one the
first time it bites.

- ...

## 6. Not yet used

Components available but not yet needed. Move a row up to §3 when introduced.

navbar, modal, tabs, table, tooltip, skeleton, stat, drawer, dropdown, menu, pagination,
alert, toast, badge, avatar, breadcrumbs, steps, accordion.
