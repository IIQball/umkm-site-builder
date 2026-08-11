# AGENTS.md — Canonical Agent Rules

Binding rules for every agent and every session in this repo, whatever the tool
(Antigravity, Claude Code, Cursor, Codex, Gemini CLI). Read this before any work.

**This file is canonical and self-sufficient.** `CLAUDE.md` and `GEMINI.md` point here.
`.agents/rules/*.md` holds the detail; on conflict about detail the rules files win, but
nothing in this file may be broken by them.

---

## 0. How this repo works

```
SETUP.md                machine setup for humans: Bun, git, gh, editor, Windows/WSL traps.
PRD.md                  the human writes this. The ONLY file the human must write.
.agents/rules/          how you must behave (this file is the load-bearing subset)
.agents/workflows/      what you must run, in order
docs/                   the reconciled spec YOU generate from PRD.md. Source of truth for code.
```

- `PRD.md` is the raw brief. `docs/` is the refined, reconciled spec.
- If `docs/` is still all `TODO`, the project has not been kicked off. Run
  `.agents/workflows/00-kickoff.md` first. Do not write application code before that.
- Never write code that contradicts `docs/`. If a request contradicts `docs/`, stop and
  reconcile with the human before proceeding.
- **Some of this scaffold is single-use.** Kickoff workflows and the two selection
  procedures exist to produce decisions. Once those decisions are recorded in
  `docs/tech/architecture.md`, re-reading them every session is pure cost. Offer
  `.agents/workflows/01-cleanup.md` — never run it unprompted.
- **`.agents/archive/` is never read.** If that folder exists, its contents are retired
  scaffolding, kept only for recovery. Do not read it during normal work. Read it only if
  the human explicitly asks, or if a gate is being deliberately re-opened.
- **A file being absent is not a bug.** After cleanup, single-use files are gone by
  decision. `docs/PROJECT-STATE.md` records what was removed and when. Do not recreate them.
- **Setup questions already have an answer — `SETUP.md`.** It is the machine setup guide
  for humans: what to install, the exact commands, and the Windows/WSL mixing trap. When
  someone asks how to install something, why `bun` is not found, or why `bun install`
  fails, walk them through that file. **Do not improvise install steps from memory** and
  do not give a different install command than the one recorded there. If the file is
  wrong or missing a case, fix the file — then answer from it.
- **`README.md` carries the project's About block.** Everything between the
  `<!-- ABOUT:START -->` and `<!-- ABOUT:END -->` markers describes what this project
  actually is. It is agent-maintained: a human seeds it with a rough brief, then you
  rewrite it from `docs/prd/00-overview.md` at the end of kickoff, and again whenever
  product scope or purpose changes. Replace only what is between the markers — never the
  markers themselves, never the rest of `README.md`.

## 1. Mandatory session protocol (every session, no exceptions)

Before writing or editing ANY code or doc, in order:

1. **READ** — `docs/README.md`, `docs/PROJECT-STATE.md`, then the foundation docs
   (`prd/00-overview.md`, `tech/architecture.md`, `tech/data-model-erd.md`,
   `tech/permissions-matrix.md`, `tech/code-standards.md`, `planning/roadmap.md`).
   Do not act on memory alone. Do **not** read `.agents/archive/`, and do not re-read a
   selection procedure whose gate is already recorded in `tech/architecture.md`.
2. **PREVIEW** — check what is already built vs still `TODO`. Read
   `docs/memory/codebase-map.md` before searching the codebase by hand.
3. **RENEW** — after any change affecting scope, data model, permissions, routing, UI
   tokens, or structure, update the matching doc in the SAME session. If the change moved
   the product's scope or purpose, rewrite the About block in `README.md` too (§0).
4. **NEVER move on blindly.** Incomplete request means ask for everything needed. Never guess.

A session that skipped step 1 is not ready to work.

## 2. Preflight gates — DECIDE BEFORE CODE

These are unresolved on purpose. Each one, once decided, is recorded in `docs/tech/` and
never re-decided per feature. Surface them to the human and get an answer. Do not guess.

| Gate | Question | Record in |
|---|---|---|
| G1 | **Which database** — Cloudflare D1, Neon, or Supabase. Depends on what the PRD describes; they have genuinely different strengths. Run `.agents/rules/70-database-selection.md`. | `docs/tech/architecture.md` |
| G2 | Icon pack — one pack, decided once, never a second one. Must have a Svelte-compatible package. | `docs/tech/architecture.md` |
| G3 | `vp` / Vite Plus — verify it exists and is stable for this stack before adopting. If unverified, use plain Vite/Bun scripts. | `docs/tech/architecture.md` |
| G4 | Git mode — strict or light (see §9). | `docs/tech/architecture.md` |
| G5 | Auth pools/roles — how many, and the exact role list. | `docs/tech/permissions-matrix.md` |
| G6 | What must never be pushed to GitHub (secrets, envs, dumps, uploads). | `.gitignore` + `docs/tech/security.md` |
| G7 | **Media storage** — Cloudinary, Cloudflare R2, or R2 + Cloudflare Images. Depends on transformation needs, video, and bandwidth. Run `.agents/rules/71-media-selection.md`. | `docs/tech/architecture.md` |

Rule: **verify every stack API against current official docs — never trained memory.**
Use context7 where available. Otherwise read the installed package's own type declarations
in `node_modules`, which are ground truth for this repo.

## 3. Stack

**Locked** — host Cloudflare · meta-framework Astro · UI Svelte + scoped CSS · build Vite ·
runtime and package manager Bun · ORM Drizzle · components daisyUI · tests Vitest ·
validation Zod · auth BetterAuth.

**Chosen per project at preflight** — two decisions depend on the workload the PRD
describes. Recommend one, let the human decide, then it is LOCKED for that project:

| Gate | Choice | Options | Procedure |
|---|---|---|---|
| G1 | Database | D1, Neon, Supabase — all work with Drizzle | `.agents/rules/70-database-selection.md` |
| G7 | Media storage | Cloudinary, R2, R2 + Cloudflare Images | `.agents/rules/71-media-selection.md` |

Do not add a library that duplicates something in this list. Do not add a second icon pack,
second CSS system, second validation library, second test runner, second database, or
second media provider.

**Media never goes in the database.** Images, video, and files go to the G7 provider; the
database stores a provider-neutral reference (provider, key, version, dimensions, alt text)
and nothing binary. All media access goes through **one service module** — no component
builds a provider URL directly. This keeps the database text-only, which is what makes the
G1 free tier last, and keeps a provider swap cheap.

## 4. Structure

- **Global and reusable only.** `lib` / `util` / `services`, components, and TypeScript
  types are never declared locally when they could be shared.
- **Types live in `src/types/`**, grouped by feature scope. Never declare `interface` or
  `type` inside a page, component, or lib file. Exception: a short props/params type used
  only by that one file, and derived types in a return signature.
- **Feature-scoped folders**, not one flat dump: `components/{public,admin,shared}/`, and
  the same split for `lib/` and `src/types/`.
- **Single purpose per file.** One util, one type group, one component. Not a grab bag.
- **Pages and components stay under 300 LOC.** Past that, extract sub-components and move
  logic to `lib/`. Many small files beat one big file.
- **No duplication.** Extract a shared helper before copy-pasting. Prefer importing a
  function from `lib`/`services`/`utils` over writing it inline in a component.

## 5. Code standards

- **One unified response shape** for every API route and server action, defined once in
  global `lib` (types in `src/types/`). Never hand-roll `{ error: ... }` per route.
  ```ts
  { ok: true, data: T }
  { ok: false, error: { code: string, message: string } }   // message = safe/generic
  ```
- **Every async function has try/catch.** No unguarded `await`. Catch, log server-side,
  return the unified error shape. No silent failures.
- **Server logs are readable and greppable** — stable context tag (route/function name),
  the operation, and the real error/stack. Full detail server-side only.
- **Never leak server error detail to the client.** No stack traces, DB errors, internal
  messages, or secrets. Map to a safe message plus an error code.
- **Validate every input at the boundary with Zod.** Invalid input returns
  `VALIDATION_ERROR`, never a 500.
- **Toaster, not show/hide divs**, for action-level success/error. Inline field validation
  stays where it belongs.

## 6. UI and UX

- **Frontend first, then backend, then integration.**
- **Mobile-first**, then tablet, then desktop.
- **Never hand-roll what daisyUI provides.** Read `docs/memory/ui-inventory.md` before
  building any UI, and add a row for every component you introduce.
- Svelte scoped `<style>` is for what daisyUI genuinely cannot do. It is not an excuse to
  re-implement a daisyUI component.
- **Never write a raw color, font, or spacing value.** Everything comes from a CSS
  variable or token, and every variable and custom class is tracked in
  `docs/memory/css-vars.md` with where it is used.
- **One spacing scale** (4px multiples). Same relationship gets the same value everywhere:
  heading to body, section to section, icon to label, grid gutters. No arbitrary one-offs.
- **No emojis anywhere** — not in UI, code, comments, commits, or PRs. Use the icon pack
  decided in G2.
- **Review the UI after building it.** Validate in a real visible browser: renders
  correctly, mobile-first responsive, keyboard focus, clean console (0 errors, 0 warnings).
  Capture screenshots. Details in `.agents/rules/30-ui-ux.md`.

## 7. Security

- Secrets only in env, never in the repo, never in client bundles, never in logs.
- Server-side authorization on every protected route. A hidden UI element is not a
  permission check.
- Enforce the permission matrix at the data layer, not only in the UI.
- Treat every client input as hostile: validate, then authorize, then act.
- Never break existing production data. Local DB is not production DB. Schema and data
  changes get confirmed before they run anywhere shared.
- Full list in `.agents/rules/40-security.md`.

## 8. Quality gates — mandatory before "done"

- Zero TypeScript errors and zero lint errors/warnings on every touched file.
- Tests green. New protected path gets a permission test; new endpoint gets a validation
  test; new critical flow gets a smoke test.
- Clean browser console on every changed surface.
- Matching `docs/` file renewed in the same session.
- `docs/PROJECT-STATE.md` updated with where the work now stands.

Work that fails any of these is not done. Do not report it as done.

## 9. Git and GitHub

**ASK BEFORE ANY GITHUB ACTION.** Never auto-commit, auto-branch, auto-PR, auto-merge,
auto-close an issue, or auto-post a comment. Ever. This holds in both modes.

Two modes ship with this scaffold. At kickoff, **ask the human which one applies** and
record the answer in `docs/tech/architecture.md`:

- **Strict** (`.agents/rules/60-git-strict.md`) — `main` protected, `dev` integration,
  PR-only, human sign-off before anything reaches production.
- **Light** (`.agents/rules/61-git-light.md`) — single protected branch, PR-only, fewer
  ceremonies. For solo or very small teams.

Until the human answers, assume strict.

## 10. Required tooling

Non-negotiable, every session:

- **context7** (or equivalent live-docs source) — read current docs, never trained memory.
- **ponytail** — code behaviour: simplest thing that works, no speculative abstractions.
- **caveman** — communication behaviour: compressed output, full technical accuracy.
- **clean-code** — invoked whenever writing, editing, reviewing, or refactoring code.
- **frontend-design rules** — `.agents/rules/30-ui-ux.md`. Claude Code users may also use
  the `frontend-design` skill; it does not exist on other agents, so the rules file is the
  portable source of truth.

Install guide and source URLs: `.agents/skills/README.md`.

## 11. Never

- Never write code before `docs/` exists and has been read.
- Never guess a preflight gate (§2).
- Never use trained memory for a library API.
- Never declare types inline in pages/components/lib.
- Never use a raw color or off-scale spacing value.
- Never hand-roll a component daisyUI already provides.
- Never leak server error detail to the client.
- Never use emojis.
- Never take a GitHub action without being asked to.
- Never report work done while a quality gate in §8 is failing.
