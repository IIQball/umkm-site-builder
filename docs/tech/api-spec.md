# Tech — API Spec

Status: TODO

Every route and server action. The Zod schema in code is the source of truth for shapes;
this doc is the contract and the review checklist.

## 1. Response shape (global)

```ts
{ ok: true, data: T }
{ ok: false, error: { code: string, message: string } }
```

`message` is always safe and generic. Detail stays in the server log.

## 2. Error codes

| Code | HTTP | Meaning | Client shows |
|---|---|---|---|
| VALIDATION_ERROR | 400 | input failed the Zod schema | field messages |
| UNAUTHORIZED | 401 | no valid session | sign-in prompt |
| FORBIDDEN | 403 | role or ownership check failed | generic denial |
| NOT_FOUND | 404 | no such resource, or not visible to this caller | generic |
| CONFLICT | 409 | state conflict, duplicate | specific, safe |
| INTERNAL | 500 | unexpected | generic |

Adding a code is deliberate. Document it here.

## 3. Routes

### `<METHOD> /api/<path>`

- **Purpose:** <one line>
- **Auth:** <required role, ownership, resource state>
- **Input:** Zod schema `<name>` in `src/lib/<feature>/schemas.ts`

  | Field | Type | Rules |
  |---|---|---|
  | | | |

- **Server-derived (never taken from the client):** <user id, role, price, status, owner>
- **Success:** `{ ok: true, data: <shape> }`
- **Errors:** <codes and what triggers each>
- **Guard order:** authenticate → authorize → ownership → state → act
- **Side effects:** <writes, emails, external calls, and whether they are idempotent>

## 4. Rate limiting

Which endpoints are limited and at what threshold. At minimum: authentication, password
reset, and anything that sends email or costs money.

| Route | Limit | Window |
|---|---|---|

## 5. Conventions

- Plural resource nouns in paths.
- No verbs in paths — the HTTP method is the verb.
- Pagination: <cursor or offset, parameter names, default and max page size>.
- Timestamps: ISO 8601, UTC.
