# Feature — H12 CDN Cache Optimization

Status: IN_PROGRESS · Phase: Quality · Owner doc: `../00-overview.md`

## 1. What it does

Optimizes SSR storefront pages for CDN caching by adding response headers (Cache-Control, Surrogate-Control) on the backend, and reduces Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) on the frontend by inlining critical CSS and deferring non-critical assets.

## 2. Why

Storefront pages (`/storefront/[subdomain]`) are read-heavy, public, and cacheable. CDN caching reduces latency and server load. Frontend optimizations improve Core Web Vitals scores.

Personas: Tenant (faster storefront), Visitor (faster load), Platform (reduced compute).

## 3. Scope

**In:**
- Add `Cache-Control: public, max-age=3600` header to storefront SSR responses
- Add `Surrogate-Control: max-age=86400` for Cloudflare cache
- Inline critical CSS (above-the-fold) in `<head>`
- Defer non-critical CSS and scripts with `rel="preload"` / `loading="lazy"`
- Verify no layout shift on image load (set `width` / `height` on images)

**Out:**
- CDN configuration (assumed Cloudflare via Astro adapter)
- JavaScript optimization (already using code splitting)
- Image optimization (already using Cloudinary WebP)

## 4. User stories covered

- US-32 — Storefront page loads within 2 seconds on 4G
- US-33 — No layout shift when product images load
- US-34 — Repeated visits reuse cache (no re-render)

## 5. Screens and states

| Screen / route | Purpose | States to build |
|---|---|---|
| `/storefront/[subdomain]` (SSR) | Store public page | loading, error, loaded |

Every state builds correctly with cache headers present.

## 6. Data

No new database entities. Uses existing: `stores`, `products`, `storeCategories`.

| Entity | Read | Write | Server-derived |
|---|---|---|---|
| stores | subdomain, template config, customization | — | Cache-Control header |
| products | name, price, image, variants, availability | — | — |
| storeCategories | name, slug | — | — |

## 7. API

No new endpoints. Modifies SSR response of existing route.

| Method | Route | Header change |
|---|---|---|
| GET | `/storefront/[subdomain]` | `Cache-Control: public, max-age=3600` + `Surrogate-Control: max-age=86400` |

## 8. Permissions

Public route. No auth required. Cache applies to all visitors.

## 9. Validation rules

- Cache-Control header must not set `private` (public only)
- max-age must be >= 3600 (1 hour minimum)
- Surrogate-Control applies only on Cloudflare
- All images must have explicit `width` and `height` to prevent CLS

## 10. Acceptance criteria

- [ ] Given a storefront request, when response is returned, then `Cache-Control` and `Surrogate-Control` headers are present
- [ ] Given a second request to same URL within 1 hour, then response is served from cache (observable via `cf-cache-status: HIT`)
- [ ] Given a storefront page, when images load, then no layout shift occurs (CLS < 0.1)
- [ ] Given above-the-fold content, when page renders, then critical CSS is inlined in `<head>` (LCP < 2.5s on 4G)

## 11. Tests owed

- header verification: storefront responds with Cache-Control and Surrogate-Control
- layout shift: all images have width/height attributes
- smoke: storefront renders correctly with headers applied

## 12. Open questions

None. Feature spec complete.
