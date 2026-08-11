# Workflow — 20 Review

Review and QA a change. Findings go to the human first — **no GitHub action without
explicit confirmation.**

---

## Phase 1 — Scope

1. Read `AGENTS.md` and `.agents/rules/{20,30,40,50}-*.md`.
2. Get the diff. Know exactly what changed.
3. Classify it: pure logic/config, or does it touch UI, auth, payments, database, or an
   API boundary? The second class needs run checks, not just reading.

## Phase 2 — Static review

Check against the rules, in this order — highest risk first:

**Security** (`40-security.md`)
- Secrets in the diff, in logs, or behind a public-prefixed env var
- Missing server-side authorization on a new route or action
- Guard order wrong, or object-level ownership not checked
- Unvalidated input crossing a trust boundary
- Client-supplied id, role, price, status, or owner trusted
- Server error detail leaking to the client
- Destructive or unreviewed migration

**Correctness**
- Unguarded async, swallowed errors
- Off-by-one, wrong boundary condition, unhandled null
- A fix applied at one caller when the root cause is in the shared function

**Standards** (`20-code-standards.md`)
- Hand-rolled response shape
- Type declared inline instead of in `src/types/`
- File over 300 LOC, or doing more than one thing
- Logic duplicated from something already in `lib`

**UI** (`30-ui-ux.md`)
- Hand-rolled component daisyUI already provides
- Raw color, off-scale spacing, untracked custom class
- Missing state (loading, empty, error, denied)
- Accessibility: focus, semantics, labels, contrast

## Phase 3 — Run checks

Always:

- typecheck, lint, test suite

If UI changed:

- open every changed surface in a real visible browser
- mobile width first, then tablet, then desktop
- screenshots, and actually look at them
- tab through: focus visible everywhere
- console clean (0 errors, 0 warnings)

If auth, payments, database, or an API boundary changed:

- exercise the unauthorized path and confirm it is denied
- send invalid input and confirm `VALIDATION_ERROR`, not a 500
- confirm no server detail reaches the client

## Phase 4 — Verify before reporting

For every finding, before you write it down:

- Can you state concrete inputs or state that produce the wrong result?
- Have you read the surrounding code, not just the diff line?
- Is it real, or is it a style preference?

Drop anything you cannot substantiate. A confident wrong finding costs more than a missed
nitpick.

## Phase 5 — Report to the human, then stop

Give: severity, file and line, what is wrong, evidence, suggested fix. Most severe first.

Then **stop**. Do not:

- post a PR comment
- approve or request changes
- open, close, or comment on an issue
- merge anything

Wait for instruction. Only then act, and only on what you were told to do.

## Phase 6 — If told to file issues

Use the format in `.agents/rules/50-qa-testing.md` §6. One issue per finding, no batching.
Security findings with a working exploit path: ask before putting details in a public issue.

---

## Verdict

End with a plain verdict: **PASS** or **FAIL**, and the reason. Never merge as part of a
review, regardless of the verdict.
