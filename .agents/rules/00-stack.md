# Rules — Stack

Detail behind `AGENTS.md` §2 and §3.

## Locked

| Layer | Choice |
|---|---|
| Host | Cloudflare |
| Meta-framework | Astro |
| UI | Svelte + scoped CSS |
| Build | Vite |
| Runtime + package manager | Bun |
| ORM | Drizzle |
| Components | daisyUI |
| Tests | Vitest |
| Validation | Zod |
| Auth | BetterAuth |

Two things are **not** on the locked list, because the right answer depends on the workload
the PRD describes. Both are chosen per project at preflight, and both are locked for that
project once chosen:

| Gate | Choice | Options | Procedure |
|---|---|---|---|
| G1 | Database | Cloudflare D1, Neon, Supabase | `70-database-selection.md` |
| G7 | Media storage | Cloudinary, Cloudflare R2, R2 + Cloudflare Images | `71-media-selection.md` |

Locked means: do not swap, do not add a parallel library that does the same job, do not
introduce a second one of anything on this list. Changing a locked choice is a human
decision recorded in `docs/tech/architecture.md`, not an agent decision.

## Docs come from the source, never from memory

Every one of these ships breaking changes between majors. Before using an API:

1. Use context7 (or equivalent live-docs tool) for the current docs.
2. If unavailable, read the installed package's own `.d.ts` in `node_modules` — for this
   repo those type declarations are ground truth, more reliable than any blog or memory.
3. Only then write code.

Applies even to libraries you "know". Especially to those.

## Undecided — DECIDE BEFORE CODE

Do not guess. Surface each to the human, then record the answer in the named doc.

### G1 — Which database

Three approved options: **Cloudflare D1**, **Neon**, **Supabase**. Full decision procedure
in `70-database-selection.md`. Run it during kickoff, recommend one, let the human decide.

Why this is a gate and not a default: the Workers runtime is not Node, and its isolates are
short-lived and numerous. A database that expects a long-lived process holding a connection
pool behaves badly there — the classic failure is code that works locally on Bun and then
exhausts the database's connection limit under real traffic, which no typecheck, lint, or
test will catch. Each of the three options answers that problem differently (native
binding, HTTP driver, or transaction pooler), and each carries a different ceiling.

Record the choice, the reasoning, and the accepted ceiling in `docs/tech/architecture.md`.

### G2 — Icon pack

One pack. Decided once. Never a second one added later. It must have a Svelte-compatible
package, and SSR usage must be verified before adoption (some packs need a separate SSR
entry point). Emojis are never a substitute.

Record in `docs/tech/architecture.md`.

### G3 — `vp` / Vite Plus

Unverified for this stack at the time this scaffold was written. Do not adopt it on the
strength of this document. Verify it exists, is stable, and works with Astro + Bun +
Cloudflare before using it. Until then use plain Vite and Bun scripts.

Record the verification result in `docs/tech/architecture.md`.

### G4 — Git mode

Strict (`60-git-strict.md`) or light (`61-git-light.md`). Ask. Assume strict until answered.

### G5 — Auth pools and roles

How many auth pools, exact role list, how a role is assigned, and what happens on
unauthorized access (redirect vs 404 vs 403). BetterAuth mechanics get confirmed against
current docs at implementation time, not from memory.

Record in `docs/tech/permissions-matrix.md`.

### G6 — What never gets pushed

Env files, keys, service-account JSON, DB dumps, uploaded media, seeded real user data,
local database files. Write the `.gitignore` before the first commit, not after.

Record in `.gitignore` and `docs/tech/security.md`.

### G7 — Media storage provider

Three approved options: **Cloudinary**, **Cloudflare R2**, **R2 + Cloudflare Images**.
Procedure in `71-media-selection.md`. Recommend one, let the human decide.

The fork is whether images need on-the-fly transformation, whether there is video, and how
much bandwidth gets served — R2 charges no egress while Cloudinary meters bandwidth against
the same allowance as storage and transformations.

Record in `docs/tech/architecture.md`.

## Stack tensions to handle deliberately

- **daisyUI + Svelte scoped CSS.** daisyUI is class-based; Svelte `<style>` is scoped and
  will not reach a child component's markup. Structure and theming come from daisyUI
  classes and tokens. Scoped CSS is only for what daisyUI genuinely cannot express. It is
  never a way to re-implement a daisyUI component.
- **Astro islands.** Server-rendered Astro by default; a Svelte island only where real
  interactivity is needed. Every `client:*` directive is a deliberate cost. Do not
  hydrate a static section.
- **One path to the database.** Whichever G1 option is chosen, application queries go
  through Drizzle and only Drizzle. If the vendor also ships its own client (Supabase does),
  do not use both — the permission model ends up enforced on one path and bypassed on the
  other.
- **Postgres reflexes on SQLite.** If G1 chose D1, expect models to reach for `JSONB`,
  array columns, `timestamptz`, and `ILIKE` out of habit. None exist in SQLite. The
  project's schema conventions get written into `docs/tech/code-standards.md` at kickoff
  so every session inherits them.

## Media — provider chosen at G7

The database stores text. The media provider stores bytes. This is what keeps the database
small enough that the G1 free tier lasts.

Provider is chosen per project from three approved options — Cloudinary, Cloudflare R2, or
R2 + Cloudflare Images. See `71-media-selection.md`.

These rules apply **whichever provider is chosen**:

- **Never store binary in the database.** No base64 columns, no BLOBs. Store a
  provider-neutral reference — `provider`, key or `public_id`, `version`, dimensions, alt
  text. The reference, not the file, and not a fully-built URL.
- **All media access goes through one service module.** No component, page, or lib file
  builds a provider URL directly. This is what keeps a provider swap to one module plus a
  re-upload, instead of fifty components.
- **Uploads are signed or authorized server-side.** Provider secrets stay server-side and
  never enter the client bundle. An unsigned upload path is an open door to your account
  for anyone who reads your JavaScript.
- **Validate uploads server-side** — type, size, dimensions — and never trust the
  client-reported MIME type or filename.
- **Pin your variants.** Define the handful of sizes and formats the app uses and reuse
  them. Every provider meters transformations somehow, and arbitrary per-request variants
  burn the allowance fast.
- **Deleting a record must delete its media**, or storage fills with orphans nobody can
  trace back to anything.

Verify current limits, per-file caps, and the upload API against the chosen provider's own
docs via context7 before implementing. Never rely on remembered numbers.
