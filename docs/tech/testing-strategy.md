# Tech — Testing Strategy

Status: TODO · Runner: Vitest

General rules: `../../.agents/rules/50-qa-testing.md`. This file records what this project
actually tests, and what the gate is.

## 1. Highest risk first

The top asset from `security.md` §1 determines the first test layer. Name it here:

> Highest-risk failure in this project: <fill>. Tests that prove it cannot happen live in
> `<path>` and are a hard gate.

## 2. Layers

| Layer | Proves | Where | Status |
|---|---|---|---|
| Authorization / isolation | no cross-user data access | `tests/authz/` | TODO |
| Permission | role x action x resource matches the matrix | `tests/permissions/` | TODO |
| Validation | Zod rejects bad input; unified error shape; no 500s | `tests/api/` | TODO |
| Smoke | critical flows still work | `tests/smoke/` | TODO |
| UI / visual | renders, responsive, focus, clean console | real browser | manual |

## 3. Commands

| Command | Runs |
|---|---|
| `bun run typecheck` | |
| `bun run lint` | |
| `bun run test` | |
| `bun run verify` | typecheck + lint + test — the gate |

Adjust names to match `package.json` once it exists.

## 4. Permission tests

Table-driven from `permissions-matrix.md`. For each
`(role, action, resource, ownership, state)`: assert allow or deny **and** the exact error
code. Cover the guard order, not just the final outcome.

## 5. Validation tests

Per endpoint: one happy path, plus one case per invalid field. Every failure returns
`VALIDATION_ERROR` and the unified shape, and never carries server internals.

## 6. UI validation

Manual, in a real visible browser, per `../../.agents/rules/30-ui-ux.md` §10. Not asserted
in the unit suite. Per changed surface: renders, mobile-first responsive, keyboard focus,
reduced motion, clean console (0 errors, 0 warnings), screenshots captured.

## 7. Test data

How fixtures are created and torn down, and which database tests run against. **Never the
production database.**

## 8. Definition of done (testing slice)

Zero TS errors, zero lint warnings on touched files, suite green, clean console on every
changed surface. New protected path gets an authorization test. New endpoint gets
permission plus validation tests. Bug fix gets a test that fails without the fix.

Never skip, disable, or loosen a failing test to make the suite pass.
