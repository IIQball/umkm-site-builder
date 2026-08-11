# Rules — Media Storage Selection (preflight gate G7)

Media provider is **not** pre-decided. Three approved options. Which fits depends on what
the PRD says gets uploaded and how it gets served.

Run once per project during `00-kickoff.md`. Same shape as G1: you recommend, the human
decides, the answer is recorded and locked for that project.

---

## 0. The rule that applies whatever is chosen

**All media access goes through one service module.** No component, page, or lib file
constructs a provider URL directly. The database stores a provider-neutral reference
(`provider`, `key`/`public_id`, `version`, width, height, alt text) — never bytes, never a
fully-built URL.

This is what keeps the decision cheap to reverse. A provider swap should touch one module
and a re-upload script, not fifty components. If provider strings leak into components,
this gate stops being reversible and becomes as sticky as the database.

## 1. Read the current docs FIRST

Tradeoffs below are durable. Prices, limits, and APIs are not. Before recommending:

1. Pull current docs via context7 for the candidates you are seriously considering.
2. Re-verify every number before quoting it. These change quarterly.
3. Never quote §7 of this file as current fact.

| Candidate | Read before recommending |
|---|---|
| Cloudinary | pricing/credits, signed upload API, transformation URL syntax |
| Cloudflare R2 | pricing, Workers bucket binding, public access vs presigned URLs |
| Cloudflare Images | pricing, transformations on remote sources |

## 2. Signals from the PRD

Answer from the PRD. Anything unanswered goes to the human as a question.

| # | Question | Why it matters |
|---|---|---|
| M1 | What actually gets uploaded — images, video, documents, mixed? | video and documents have completely different needs |
| M2 | Do images need on-the-fly transformation — responsive sizes, crops, format conversion? | this is the single biggest fork |
| M3 | Is there video, and does it need transcoding or adaptive streaming? | rules out plain object storage |
| M4 | Roughly how much media gets served per month? | bandwidth is metered by one option and free on another |
| M5 | How many distinct variants per asset (thumb, card, hero, og-image)? | both transformation meters count unique variants |
| M6 | User-generated uploads or admin-curated? | drives volume, moderation, and abuse surface |
| M7 | Public, private/signed, or both? | access control differs sharply between options |
| M8 | Expected total storage after a year? | free tiers diverge here |

## 3. Disqualifiers

| If the PRD needs... | Rule out |
|---|---|
| on-the-fly image transformation | R2 alone |
| video transcoding or adaptive streaming | R2 alone, and R2+Images (Cloudflare's answer is Stream — a separate product and a real architecture change, so surface it rather than assuming it) |
| heavy monthly bandwidth on a free tier | Cloudinary (bandwidth consumes the same credits as storage and transformations) |
| large per-file uploads | verify each option's per-file caps before recommending |
| a large variant matrix on a free tier | check both transformation meters — variants multiply fast |

## 4. Strength profiles (durable)

### Cloudinary

**Strongest when:** images are central to the product, need real transformation work
(responsive variants, auto-format, auto-quality, smart cropping), or there is video.

**Wins:** richest transformation and optimization feature set of the three. Handles video.
Best developer experience for responsive images. One service for store, transform, deliver.

**Ceilings:** third-party, so it sits outside your Cloudflare bill and dashboard. The
credit model is the thing to watch — storage, bandwidth, and transformations all draw on
the same allowance, so a traffic spike drains the month's budget through bandwidth even if
storage and uploads never moved. Per-file size caps on the free plan.

### Cloudflare R2 + Cloudflare Images transformations

**Strongest when:** you want to stay in-vendor, bandwidth is significant, and image
transformation needs are real but ordinary (resize, crop, format).

**Wins:** **zero egress fees** — the decisive advantage for anything media-heavy. Generous
free storage. One vendor, one bill, one dashboard alongside Workers and D1. Images
transformations work on remote sources, so R2 holds the bytes and Images does the work.

**Ceilings:** two services to wire instead of one. Transformation features are narrower
than Cloudinary's. Transformations are metered by *unique* transformation, and past the
free allowance new transforms fail rather than silently billing — cached ones keep
working, so the failure is partial and confusing if you have not planned variants. No
video transcoding.

### Cloudflare R2 alone

**Strongest when:** the media is not images needing processing — PDFs, downloads,
documents, exports, backups, or images that are pre-sized at upload time.

**Wins:** simplest of the three. Zero egress. Cheapest at scale. One binding, no second
service, no transformation meter to reason about.

**Ceilings:** no transformation at all. Either you pre-size on upload and accept a fixed
set of variants, or you serve unoptimized originals — which is a performance and bandwidth
problem on an image-heavy site. No video processing.

## 5. Scoring

Score survivors against the signals, weighted by what the PRD emphasizes. One hard
requirement outweighs several conveniences.

| Criterion | Weight from PRD | Cloudinary | R2 + Images | R2 alone |
|---|---|---|---|---|
| transformation needs (M2, M5) | | | | |
| video (M3) | | | | |
| bandwidth economics (M4) | | | | |
| storage growth (M8) | | | | |
| access control (M7) | | | | |
| vendor consolidation | | | | |
| setup cost | | | | |

## 6. Present, then stop

Give the human: the recommendation, why (tied to specific M-signals), the ceiling being
accepted, the runner-up and what would flip it, every number with its verification date,
and any signal the PRD left unanswered. Then wait.

After confirmation, record in `docs/tech/architecture.md` (choice, reasoning, ceiling,
date) and add the media reference-column convention to `docs/tech/data-model-erd.md`.

## 7. Volatile facts — re-verify, do not trust

Accurate on **2026-07-29**, recorded to show the *shape* of each option's limits. Re-verify
before quoting.

| Fact | As of 2026-07-29 |
|---|---|
| Cloudinary free: monthly credits | 25 |
| Cloudinary: what one credit buys | 1 GB storage, or 1 GB bandwidth, or 1,000 transformations |
| Cloudinary free: per-file caps | 10 MB image / 100 MB video |
| R2 free: storage | 10 GB |
| R2 free: Class A operations (writes) | 1M / month |
| R2 free: Class B operations (reads) | 10M / month |
| R2: egress | $0, all storage classes |
| Cloudflare Images free: transformations | 5,000 unique / month, all accounts |
| Cloudflare Images: past free limit | cached transforms keep working; new ones error until upgraded |
| Cloudflare Images: hosted storage | paid plan only — on free, store in R2 and transform from there |

## 8. Integration checklists — what to resolve, not how

No code. Setup APIs change; these questions do not.

### If Cloudinary

- [ ] Uploads signed server-side; API secret never in the client bundle
- [ ] Transformation variants pinned to a defined set, not generated per request
- [ ] Upload validation server-side: type, size, dimensions
- [ ] Deleting a record deletes its media — no orphans
- [ ] Credit consumption monitored, with a plan for what happens at the cap

### If R2 (with or without Images)

- [ ] Bucket binding declared in Wrangler config; binding name matches the code
- [ ] How the binding is reached from Astro's Cloudflare adapter — verify against current
      docs, this is the step people get wrong
- [ ] Public bucket versus presigned URLs decided, per M7
- [ ] CORS configured for direct browser uploads, if used
- [ ] Key naming convention — predictable, collision-free, no user input in the raw key
- [ ] Deleting a record deletes its object
- [ ] Local development story: how you run against a local or separate bucket

### If R2 + Images transformations

- [ ] Everything in the R2 list above
- [ ] How transformation URLs are formed against the remote R2 source
- [ ] The variant set defined and named — every distinct variant burns the unique
      transformation meter
- [ ] Behaviour at the free-tier cap understood and handled, since new transforms fail
      while cached ones keep serving
