# Tech — Data Model / ERD

Status: TODO · Database: <D1 / Neon / Supabase — per G1 in architecture.md>

Drizzle schema lives in code; this doc is the human-readable contract. Both must agree —
if they drift, the code is right and this file is a bug.

## 0. Schema conventions for the chosen database

Fill this in **first**, right after G1 is decided. It is what stops each new session from
designing for a different database than the one you are on.

**If D1 (SQLite) — these are hard constraints, not preferences:**

| Postgres habit | SQLite reality | Convention here |
|---|---|---|
| `JSONB` column | no JSON type | <TEXT + parse, or normalize into a table> |
| array column | no array type | <join table> |
| `timestamptz` | no date type | <INTEGER epoch ms, or ISO TEXT — pick one> |
| `boolean` | stored as 0/1 | <convention> |
| `uuid` type | no native type | <TEXT> |
| `ILIKE` | not available | <`LIKE` with `COLLATE NOCASE`, or normalized column> |
| row-level security | none | authorization enforced in app layer only |
| bulk insert | bound-parameter cap per query | chunk size: <N> rows |

Also for D1: an unindexed scan bills every row it reads, so a missing index is a cost
issue as well as a speed issue. Index review is part of the definition of done.

**If Neon or Supabase (Postgres):** note which extensions are enabled (pgvector and so on)
and whether RLS is used as an enforcement layer or authorization lives entirely in the app.

Confirm the current type and feature support against the vendor's docs via context7 before
designing the schema. Do not design from memory.

## 1. Entities

### <entity>

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | | no | | primary key |
| created_at | timestamptz | no | now() | |
| updated_at | timestamptz | no | now() | |

**Indexes:** <which columns, and the query each one serves>
**Unique constraints:** <which, and why>
**Foreign keys:** <target, and on-delete behaviour>

## 2. Relations

```
<entity> 1---N <entity>
```

<Or a diagram. Keep it readable.>

## 3. Ownership and access

Which column establishes "this record belongs to this user or org". This is the column the
authorization tests target — name it explicitly.

| Entity | Owner column | Enforced where |
|---|---|---|

## 4. Constraints and invariants

Rules that must hold regardless of application code. Prefer a database constraint over an
application check — the database is the last line that cannot be bypassed.

- ...

## 5. Soft delete / retention

Whether records are hard-deleted, and what happens to dependent rows.

## 6. Migrations

- Forward-only. Reviewed before running.
- No destructive migration (drop column, drop table, type narrowing) without explicit
  human approval and a stated backup plan.
- Record each applied migration and what it changed.

| Migration | Changes | Applied |
|---|---|---|
