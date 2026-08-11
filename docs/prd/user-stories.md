# PRD — User Stories and Acceptance Criteria

Status: TODO

Format: `As a <persona>, I want <capability>, so that <outcome>.`

Acceptance criteria are **testable and binary**. "It works" is not acceptance criteria.
These are what the review workflow verifies one by one, so write them as checks.

---

## <Feature area>

### US-01 — <short title>

**Story:** As a <persona>, I want <capability>, so that <outcome>.

**Priority:** must / should / could
**Phase:** <roadmap phase>
**Feature spec:** `features/<name>.md`

**Acceptance criteria**

- [ ] Given <state>, when <action>, then <observable result>.
- [ ] Given <invalid input>, when <action>, then <specific error>, and no 500.
- [ ] Given <unauthorized user>, when <action>, then denied with <code>.

**Out of scope for this story:** <what it deliberately does not cover>

---

Every story needs at least one unhappy-path criterion. A story with only happy-path
criteria ships a feature that breaks the first time a real user touches it.
