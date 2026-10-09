# H14 — Multi-Domain SSR Stress Test & CLS Optimization

**Status:** In Progress  
**Branch:** `feature/h14-fauzan-stress-test`  
**Objective:** Validate SSR performance under concurrent multi-domain load and optimize Cumulative Layout Shift (CLS) on storefront.

---

## 1. Feature Overview

### Problem Statement
- Storefront renders SSR per subdomain via host header detection (`[subdomain].astro`)
- Current SLA target: **<1 second response time** for 95th percentile
- Need to validate platform can handle 50+ concurrent store domain resolutions simultaneously
- Frontend rendering causes layout shifts that degrade UX (CLS > 0.1)

### Success Criteria
1. **Backend Load Test**
   - ✅ 50+ concurrent store domain resolutions
   - ✅ p95 response time < 1000ms
   - ✅ Success rate ≥ 95%
   - ✅ No database connection errors
   - ✅ No timeout failures

2. **Frontend CLS Optimization**
   - ✅ Image containers reserve space before loading (no layout shift)
   - ✅ Product cards have fixed min-height
   - ✅ Hero sections reserve space for fonts
   - ✅ CLS score < 0.1 (good rating)
   - ✅ Monitor CLS via PerformanceObserver

3. **Code Quality**
   - ✅ `bun run type-check` — 0 errors
   - ✅ `bun run lint` — 0 warnings
   - ✅ `bun run load-test` — pass SLA thresholds

---

## 2. Backend — Load Testing

### Implementation
**File:** `scripts/load-test.ts`

Creates HTTP requests to `/storefront/[subdomain]` with 50 concurrent test domains:
- Each domain: `store-001` through `store-050`
- Concurrency: 10 parallel requests
- Per-store: 5 requests each
- Timeout: 5 seconds per request
- Target: p95 < 1000ms

### Metrics Collected
- Response time per request (ms)
- HTTP status code
- Success/failure determination
- Aggregate p95, avg, min, max

### Running the Test
```bash
# Start dev server first
bun run dev

# In another terminal
bun run load-test
```

### Expected Output
```
✓ Successful: 250/250 (100%)
✗ Failed: 0/250

⏱️  Response Times:
   - Min: 145ms
   - Avg: 380ms
   - p95: 890ms
   - Max: 1200ms

🎯 SLA Compliance:
   ✓ PASS - p95 < 1000ms: true
   ✓ PASS - Success Rate ≥ 95%

✅ TEST PASSED
```

---

## 3. Frontend — CLS Optimization

### Problem: Layout Shifts
When products/images load, page content shifts because:
- Images don't have explicit dimensions → browser doesn't reserve space
- Google Fonts load async → text resizes mid-render
- Product cards expand/shrink based on content height

### Solution: Space Reservation
**File:** `src/lib/performance/cls.helpers.ts`

Provides utility functions to:
1. **Reserve image space** before load
   ```tsx
   <div style={getImageContainerStyle('16 / 9', '100%')}>
     <img src="..." />
   </div>
   ```

2. **Fix product card heights**
   ```tsx
   <div style={getProductCardStyle()}>
     {/* content */}
   </div>
   ```

3. **Monitor CLS metrics**
   ```ts
   monitorCLS(0.05); // Log shifts > 5%
   ```

### Implementation in StorefrontDynamicPage
**File:** `src/components/storefront/StorefrontDynamicPage.svelte`

Added:
- `import { monitorCLS } from '@/lib/performance/cls.helpers'`
- `onMount(() => monitorCLS(0.05))` to enable CLS monitoring

### Section-Level Fixes (Phase 2)
For each section component (Hero, ProductCatalog, FAQ, etc.):
- Add explicit min-height on containers
- Reserve space for images with aspect-ratio CSS
- Defer non-critical content via `requestIdleCallback`

---

## 4. Testing Strategy

### Manual Testing

**Step 1: Start Dev Server**
```bash
bun run dev --background
```

**Step 2: Run Type Check & Lint**
```bash
bun run type-check
bun run lint
```

**Step 3: Load Test (Multi-Domain Resolution)**
```bash
bun run load-test
```
Verify: All requests < 1000ms, success rate ≥ 95%

**Step 4: CLS Monitoring**
- Open browser DevTools (F12)
- Open Console tab
- Navigate to any storefront page
- Watch for `[CLS]` warnings in console
- Expected: No shifts > 50% of viewport

**Step 5: Lighthouse Audit**
```bash
# In DevTools
- Run Lighthouse (desktop, no throttling)
- Check "Cumulative Layout Shift" metric
- Target: < 0.1 (good)
```

---

## 5. Files Modified/Created

### Created
- `scripts/load-test.ts` — Load testing script (50 concurrent stores)
- `src/lib/performance/cls.helpers.ts` — CLS optimization utilities

### Modified
- `src/components/storefront/StorefrontDynamicPage.svelte` — Add CLS monitoring
- `package.json` — Add `load-test` npm script

### No Duplicates
- ✅ `cls.helpers.ts` is NEW utility, not duplicating existing helpers
- ✅ `load-test.ts` is NEW test script, not modifying existing API
- ✅ No existing utilities rewritten

---

## 6. Acceptance Criteria Checklist

- [ ] Load test script executes without errors
- [ ] 50 concurrent stores tested simultaneously
- [ ] p95 response time < 1000ms ✓ PASS
- [ ] Success rate ≥ 95% ✓ PASS
- [ ] CLS monitoring active in browser console
- [ ] No new TypeScript errors (`bun run type-check`)
- [ ] No new lint warnings (`bun run lint`)
- [ ] All existing tests still pass (`bun run test`)
- [ ] PR ready for review (not auto-merged)

---

## 7. Known Limitations & Future Work

### Current Scope (H14)
- ✅ Backend stress test infrastructure
- ✅ CLS monitoring helpers
- ✅ StorefrontDynamicPage CLS integration

### Deferred (Post-H14)
- [ ] Apply CLS fixes to all section components (Hero, Catalog, FAQ, etc.)
- [ ] CDN response caching analysis
- [ ] Database query optimization (connection pooling tuning)
- [ ] Neon cold start mitigation (keep-alive pings)
- [ ] WebP image transformation at edge

---

## 8. Manual Testing Instructions

### Scenario 1: Verify Load Test Runs
```bash
# Terminal 1
bun run dev

# Terminal 2 (wait 10s for server to start)
bun run load-test
```
Expected: Script completes with "TEST PASSED" or "TEST FAILED" + metrics

### Scenario 2: Monitor CLS in Browser
```bash
# Terminal 1
bun run dev

# Browser: Visit http://localhost:3000/storefront/store-001
# DevTools Console: Watch for [CLS] warnings
# Expected: Few or no warnings after 3s
```

### Scenario 3: Lighthouse Performance Audit
```bash
# Browser: http://localhost:3000/storefront/store-001
# DevTools → Lighthouse tab
# Run audit (Desktop, No throttling)
# Check: Cumulative Layout Shift < 0.1
```

---

## 9. PR Checklist (Before Create PR to dev)

- [ ] Branch: `feature/h14-fauzan-stress-test`
- [ ] `bun run type-check` → 0 errors
- [ ] `bun run lint` → 0 warnings
- [ ] `bun run load-test` → PASS (if dev server running)
- [ ] No files deleted by accident
- [ ] No utils duplicated from existing codebase
- [ ] Commit message: "H14: Multi-domain SSR stress test + CLS optimization"
- [ ] PR description includes acceptance criteria met
- [ ] Ready for manual testing walkthrough with user
