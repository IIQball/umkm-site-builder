# Rules — Process

Detail behind `AGENTS.md` §1.

## Docs-first, every session

`PRD.md` is the raw brief. `docs/` is the reconciled spec. Code follows `docs/`.

**READ → PREVIEW → RENEW.**

1. **READ** — `docs/README.md`, `docs/PROJECT-STATE.md`, then the foundation docs. If you
   have not read them, you are not ready to work, no matter how small the task looks.
2. **PREVIEW** — what is built vs `TODO`. Check `docs/memory/codebase-map.md` before
   searching the codebase manually.
3. **RENEW** — update the affected doc in the same session as the change. A doc updated
   "later" is a doc that is wrong now.

Conflict between a doc and a request, or a doc and the code: **stop and reconcile with
the human.** Do not silently pick one.

## Order of work

**Frontend first, then backend, then integration.**

The UI surfaces the real requirements — missing states, unclear flows, fields nobody
mentioned — before a schema hardens around the wrong assumptions. Build the screens with
stubbed data, get them reviewed, then build the backend they actually need.

Within a feature:

1. Read the feature spec in `docs/prd/features/`.
2. Confirm data model and permissions against `docs/tech/`.
3. Build UI (mobile-first) with stub data.
4. Review the UI in a real browser. Fix before continuing.
5. Build the data layer and API with Zod validation and permission checks.
6. Integrate. Replace stubs.
7. Tests, quality gates, doc renewal, `PROJECT-STATE.md` update.

## Ask, do not guess

Ask when:

- A requirement is ambiguous or a decision is the human's to make.
- A preflight gate (`00-stack.md`) is unresolved.
- The request touches production data, secrets, or deploy.
- Any GitHub action is implied.
- A doc and the request disagree.

When asking, ask for **everything** needed in one pass. Do not drip one question per turn.

## Single purpose, small units

- One purpose per file, per function, per API route. A route that authenticates,
  validates, queries, transforms, and formats is five things.
- Prefer importing a `lib`/`service`/`util` function over writing logic inline in a
  component. This is the main defense against duplicated logic.
- Before writing anything that resembles existing code, find the existing one and reuse
  or extract. Check `docs/memory/codebase-map.md` first.

## Keep the memory files alive

`docs/memory/` is what lets a fresh session start working in minutes instead of reading
the whole repo.

| File | Renew when |
|---|---|
| `codebase-map.md` | a folder, module, entry point, or major flow is added or moved |
| `css-vars.md` | any token, CSS variable, or custom class is added or changed |
| `ui-inventory.md` | a daisyUI component is used for the first time, or a pattern is established |

Stale memory is worse than no memory — it gets trusted.

## Definition of done

See `50-qa-testing.md`. Do not report work as done while any gate is failing. If part of
the task is blocked, finish everything else and say plainly what is left and why.
