# Workflow — 10 Feature

Build one feature end to end. Run once per feature, in roadmap order.

Prerequisite: kickoff complete (`docs/` filled in, roadmap approved).

---

## Phase 1 — Orient

1. `AGENTS.md`, then `docs/README.md`, then `docs/PROJECT-STATE.md`.
2. Foundation docs: `prd/00-overview.md`, `tech/architecture.md`, `tech/data-model-erd.md`,
   `tech/permissions-matrix.md`, `planning/roadmap.md`.
3. The feature spec: `docs/prd/features/<feature>.md`.
4. `docs/memory/codebase-map.md` — what exists already. Reuse before you write.
5. `docs/memory/ui-inventory.md` and `css-vars.md` if there is any UI.

If the feature spec is missing or contradicts the foundation docs, **stop and reconcile**
with the human. Do not build from an inference.

## Phase 2 — Plan

State, before touching code:

- Which files you will create or change.
- Which existing `lib` / component / type you will reuse (name them).
- Which routes, which Zod schemas, which permission checks.
- What the acceptance criteria are, from the feature spec.
- Anything still ambiguous — ask now, all of it at once.

Keep the plan short. If it is longer than the change, the change is over-scoped.

## Phase 3 — Frontend first

1. Build the UI mobile-first with stubbed data.
2. daisyUI components only — never hand-roll what it provides. Check `ui-inventory.md`.
3. Tokens only — no raw colors, no off-scale spacing.
4. Build every state: loading, empty, error, permission-denied, long content.
5. Run the review loop in `.agents/rules/30-ui-ux.md` §10: real visible browser,
   mobile first, screenshots, tab through, clean console.
6. Show the human the screenshots and get agreement before wiring the backend.

Reason for the order: the UI exposes missing requirements before a schema hardens around
the wrong assumptions.

## Phase 4 — Backend

1. Schema and migration if needed. Confirm anything destructive with the human first.
2. Zod schema per input boundary; derive types from it.
3. Route or server action using the unified response shape.
4. Guard order: authenticate → authorize → ownership → resource state → act.
5. try/catch on every async, tagged server logs, generic client messages.
6. Never trust a client-supplied id, role, price, status, or owner field.

## Phase 5 — Integrate

Replace the stubs. Verify against the acceptance criteria in the feature spec, one by one,
in a real browser. Check the failure paths, not just the happy one.

## Phase 6 — Test

Per `.agents/rules/50-qa-testing.md`:

- authorization test for any new protected path
- validation test per new endpoint
- smoke test if this is a critical flow
- a failing-first test for any bug fixed along the way

## Phase 7 — Close out

1. Run the full definition of done in `50-qa-testing.md` §4.
2. Renew the affected `docs/` files — feature spec status, ERD, API spec, permissions.
3. Renew `docs/memory/`: `codebase-map.md` for new modules, `ui-inventory.md` for new
   components, `css-vars.md` for new tokens or custom classes.
4. Update `docs/PROJECT-STATE.md`: what is now done, what is next, open threads.
5. Report to the human: what was built, evidence it works, what was left out and why.
6. **Ask** before any git or GitHub action.

---

## Done means

- [ ] Every acceptance criterion in the feature spec verified, not assumed
- [ ] Definition of done in `50-qa-testing.md` §4 fully green
- [ ] `docs/` and `docs/memory/` renewed in this session
- [ ] `PROJECT-STATE.md` updated
- [ ] Nothing committed or pushed without being asked
