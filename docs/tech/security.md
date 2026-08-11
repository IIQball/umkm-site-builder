# Tech — Security

Status: TODO

General rules live in `../../.agents/rules/40-security.md` and always apply. This file
records what is specific to **this** project: the actual threat surface and the controls
actually in place.

## 1. What is worth protecting here

| Asset | Why it matters | Worst case if leaked or corrupted |
|---|---|---|
| | | |

Rank them. The top item drives the test priority in `testing-strategy.md`.

## 2. Trust boundaries

Every place untrusted data enters the system.

| Boundary | Source | Validated by | Authorized by |
|---|---|---|---|
| HTTP request body | client | Zod schema | route guard |
| query / route params | client | | |
| file upload | client | | |
| webhook | external service | signature + Zod | |
| external API response | third party | | n/a |

## 3. Secrets inventory

| Key | Used by | Where stored | Public-safe? |
|---|---|---|---|
| | | env only | no |

Never put a service key, database URL, or admin token behind a client-exposed prefix.

## 4. Never pushed to GitHub (G6)

Enforced by `.gitignore` before the first commit exists.

- `.env` and any real env file
- keys, certificates, service-account JSON
- database dumps, `*.db`, `*.sqlite`
- uploaded media and user content
- real user data or production seed data
- build output, local caches, editor state
- <project-specific additions>

## 5. Authentication and sessions

Cookie flags, session lifetime, revocation, and which endpoints are rate-limited.

| Control | Setting |
|---|---|
| cookie httpOnly / secure / sameSite | |
| session lifetime | |
| revocation on password change | |
| rate limits | |

## 6. Authorization

Enforced per `permissions-matrix.md`. Record here **where** enforcement lives and what
happens if one layer is bypassed.

## 7. Data safety

- Local database is not the production database.
- Destructive migrations need explicit human approval plus a stated backup plan.
- Backup and restore procedure: <fill>
- Who can reach production data and how: <fill>

## 8. Known risks accepted

Risks deliberately taken, with the reason and the trigger for revisiting.

| Risk | Why accepted | Revisit when |
|---|---|---|

## 9. Review log

| Date | Scope reviewed | Findings | Where tracked |
|---|---|---|---|
