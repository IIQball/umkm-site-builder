# Tech — Permissions Matrix

Status: TODO

The authoritative role x action x resource table. Enforced **server-side at the data
layer**, not only in the UI. Tests are generated from this table
(`../../.agents/rules/50-qa-testing.md` §2).

## 1. Roles (G5)

| Role | Who | How assigned | Notes |
|---|---|---|---|
| | | | |

Deny by default. A role not listed for an action does not have it.

## 2. Matrix

| Resource | Action | <role A> | <role B> | anonymous | Ownership required | Resource state required |
|---|---|---|---|---|---|---|
| | create | | | no | | |
| | read (own) | | | | yes | |
| | read (any) | | | | no | |
| | update | | | | yes | |
| | delete | | | | yes | |

Legend: yes / no / own-only.

## 3. Guard order (every protected path)

1. authenticate — is there a valid session
2. authorize — does the role permit this action on this resource type
3. ownership — does this specific record belong to this user
4. resource state — is the record in a state that permits this action
5. act

Skipping step 3 is the most common real breach: a role check passes and the user edits
someone else's record.

## 4. Denial behaviour

| Case | Response | Reason |
|---|---|---|
| no session | | |
| wrong role | | |
| not owner | | avoid confirming the record exists, unless the spec requires it |
| wrong state | | |

## 5. Public exposure rules

What is readable without a session, and the exact conditions. Be precise — this is where
data leaks.

## 6. Enforcement points

| Layer | What it enforces |
|---|---|
| route guard | |
| data layer | |
| database constraint / RLS | |
| tests | `tests/permissions/` |
