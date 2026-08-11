# Rules — Security

Detail behind `AGENTS.md` §7. These are not "nice to have" and they are never simplified
away to make a diff smaller.

## 1. Secrets

- Secrets live in environment variables only. Never in the repo, never in a commit, never
  in a client bundle, never in a log line, never in an error message.
- `.env.example` documents the required keys with placeholder values. `.env` is gitignored
  before the first commit.
- Anything prefixed for client exposure (e.g. `PUBLIC_*`) is public. Treat it as printed on
  a billboard. Never put a service key, DB URL, or admin token behind that prefix.
- If a secret is ever committed, it is compromised. Rotate it — removing the commit is not
  enough.
- Never paste real secrets, real user data, or production dumps into a chat, an issue, a
  PR, or a third-party tool.

## 2. Authorization

- **Every protected route and action checks authorization server-side.** Hiding a button
  is not a permission check. Assume the client is hostile and calls the endpoint directly.
- Guard order, always: authenticate → authorize (role) → check ownership → check resource
  state → act.
- Enforce the permission matrix at the data layer, not only in the UI or in one
  middleware. A single forgotten check in a new route is how a matrix leaks.
- Deny by default. A new route is closed until deliberately opened.
- Object-level checks matter more than route-level ones: "may this user read *this*
  record", not just "may this role read records".

## 3. Input

- Validate every input at the trust boundary with Zod before use (see `20-code-standards.md`).
- Validation is not authorization. Do both, in that order.
- Parameterized queries only. Never build SQL by string concatenation. Drizzle's query
  builder handles this — do not route around it with raw interpolation.
- Never trust a client-supplied id, role, price, quantity, status, or owner field. Derive
  authoritative values server-side from the session.
- Sanitize anything rendered as HTML. Avoid raw HTML injection sinks; if one is
  unavoidable, sanitize at the boundary and document why it exists.
- Validate uploads by type and size server-side, and never trust the client-reported MIME
  type or filename.
- **Media uploads are signed or authorized server-side.** The media provider's secret
  (whichever G7 chose) never reaches the client bundle. An unsigned upload path lets anyone
  who reads your JavaScript upload to your account, and you pay for it. Store only the
  reference in the database, never the bytes.

## 4. Errors

- Generic message plus an error code to the client. Full detail in the server log only.
- Do not let error responses distinguish "user does not exist" from "wrong password", or
  "record exists but is not yours" from "no such record", unless the spec deliberately
  requires it.

## 5. Sessions and auth

- Confirm BetterAuth mechanics against current docs at implementation time, never memory.
- Session cookies: httpOnly, secure, sameSite. Sessions expire and can be revoked.
- Rate-limit authentication endpoints, password reset, and anything that sends email or
  costs money.
- Never log a token, session id, password, or reset link.

## 6. Data safety

- **The local database is not the production database.** A change that is safe locally can
  destroy live data on deploy.
- Never break existing production data. Schema and data changes that could affect live
  records get confirmed with the human before they run anywhere shared.
- Migrations are forward-only and reviewed. No destructive migration (drop column, drop
  table, type narrowing) without explicit human approval and a stated backup plan.
- Never run a bulk `UPDATE` or `DELETE` without a `WHERE`, and never against production on
  your own initiative.

## 7. Dependencies

- Every new dependency is a new attacker surface and a new maintenance burden. Justify it,
  or use what is already installed.
- Never add a dependency for something a few lines of code or a native platform feature
  already covers.
- Do not silently swap a package for a similarly named one. Typosquats are a real supply
  chain vector.

## 8. What must never be pushed

Decided at preflight (G6) and enforced by `.gitignore` before the first commit:

- `.env` and any real env file
- keys, certificates, service-account JSON
- database dumps, `*.db`, `*.sqlite`
- uploaded media and user content
- real user data or seeded production data
- local tool caches, editor state, build output

## 9. Reporting a finding

A security finding is shown to the human first. Do not open a public issue containing a
working exploit path without asking. See `50-qa-testing.md` for the reporting format.
