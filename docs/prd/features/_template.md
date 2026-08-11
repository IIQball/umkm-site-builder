# Feature — <name>

Status: TODO · Phase: <roadmap phase> · Owner doc: `../00-overview.md`

Copy this file per feature. Small and specific beats one giant PRD nobody updates.

## 1. What it does

<One paragraph. Plain language.>

## 2. Why

<Which goal in `../00-overview.md` this serves, and for which persona.>

## 3. Scope

**In:**
- ...

**Out:**
- ...

## 4. User stories covered

- US-<nn> — <title>

## 5. Screens and states

| Screen / route | Purpose | States to build |
|---|---|---|
| | | loading, empty, error, denied, loaded |

Every screen builds every state. Not just the loaded one.

## 6. Data

Entities touched, fields read and written, and what is derived server-side rather than
accepted from the client.

| Entity | Read | Write | Server-derived |
|---|---|---|---|
| | | | |

## 7. API

| Method | Route | Input (Zod) | Success | Errors |
|---|---|---|---|---|
| | | | | |

Detail in `../../tech/api-spec.md`.

## 8. Permissions

| Role | Allowed | Denied |
|---|---|---|
| | | |

Must match `../../tech/permissions-matrix.md`. If it does not, the matrix wins.

## 9. Validation rules

Per field: type, required, bounds, format, and the error message shown.

## 10. Acceptance criteria

- [ ] Given <state>, when <action>, then <observable result>.
- [ ] Unauthorized access is denied server-side, not just hidden in the UI.
- [ ] Invalid input returns `VALIDATION_ERROR`, never a 500.

## 11. Tests owed

- authorization: ...
- validation: ...
- smoke: ...

## 12. Open questions

- ...
