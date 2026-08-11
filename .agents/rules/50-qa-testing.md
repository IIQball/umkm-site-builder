# Rules — QA and Testing

Detail behind `AGENTS.md` §8. Runner: Vitest.

## 1. Priority order

Test the highest-risk thing first, not the easiest thing first:

1. **Authorization and data isolation** — can a user reach data that is not theirs.
2. **Permissions** — each role x action x resource matches the matrix.
3. **Validation** — bad input is rejected with the right code, never a 500.
4. **Core-flow smoke** — the two or three paths whose breakage means the product is down.
5. **UI and visual** — validated in a real browser, not asserted in the unit suite.

## 2. Layers

| Layer | Proves | Where |
|---|---|---|
| Authorization / isolation | no cross-user or cross-tenant data access | `tests/authz/` |
| Permission | role x action x resource matches `docs/tech/permissions-matrix.md` | `tests/permissions/` |
| Validation | Zod rejects bad input; unified error shape; no 500s | `tests/api/` |
| Smoke | critical end-to-end flows still work | `tests/smoke/` |
| UI / visual | renders, responsive, focus, clean console | real browser + screenshots |

Permission tests are table-driven from the matrix doc: for each
`(role, action, resource, ownership, state)` assert allow or deny **and** the correct
error code. Cover the guard order, not just the outcome.

## 3. What a new change owes

- New protected route or data path → an authorization test proving the unauthorized case
  is denied.
- New endpoint → a validation test per invalid field, plus one happy path.
- New critical flow → a smoke test.
- Bug fix → a test that fails without the fix. No test, no fix.

Non-trivial logic leaves one runnable check behind. Trivial one-liners do not need a test.

## 4. Definition of done

All of these, every time:

- [ ] Zero TypeScript errors on touched files
- [ ] Zero lint errors and warnings on touched files
- [ ] Test suite green
- [ ] Browser console clean on every changed surface (0 errors, 0 warnings)
- [ ] UI reviewed in a real browser with screenshots (if UI changed)
- [ ] Affected `docs/` files renewed in the same session
- [ ] `docs/memory/` files renewed if structure, tokens, or components changed
- [ ] `docs/PROJECT-STATE.md` updated

Do not report work as done while any box is unchecked. If something is blocked, finish
everything else and state plainly what is left and why.

## 5. Review and QA behaviour

QA output is for the human first.

**Never do any of these without explicit confirmation:**

- post a comment on a PR
- approve a PR or request changes
- post test results anywhere public
- open, close, or comment on an issue
- merge anything

**Correct flow:**

1. Run the review or tests locally.
2. Show the full results to the human, in chat or terminal.
3. **Stop.** Wait for instruction.
4. Only then take the GitHub action you were told to take.

## 6. Bug and finding format

One issue per finding. No batching several findings into one issue.

```
Title: [AREA] short description of the finding

## Finding
**File:** path/to/file.ts:LINE
**Tag:** [SEC | QUAL | ARCH | PERF | UX]
**Severity:** critical | high | medium | low

**Description:**
What is wrong.

**Steps to reproduce / evidence:**
Concrete inputs or state, and the observed wrong result. Not a guess.

**Suggested fix:**
...
```

Rules:

- Show findings to the human and get confirmation **before** creating any issue.
- A fix branch references the issue: `fix/issue-42-short-description`.
- A finding without a reproduction is a hypothesis, not a finding. Label it as such.
- Security findings with a working exploit path are shown privately first — ask before
  putting the details in a public issue.

## 7. Do not fake green

- Do not skip, comment out, or loosen a failing test to make a suite pass.
- Do not mark a failing gate `continue-on-error` to get past it.
- If a test is genuinely wrong, say so, explain why, and get agreement before changing it.
- Report outcomes faithfully: if something fails, show the output.
