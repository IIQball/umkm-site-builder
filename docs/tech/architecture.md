# Tech — Architecture

Status: TODO

Stack is locked in `../../.agents/rules/00-stack.md`. This file records how it is wired
**in this project**, and every preflight decision.

## 1. Preflight decisions (LOCKED once answered)

| Gate | Decision | Reason | Date |
|---|---|---|---|
| G1 database (D1 / Neon / Supabase) | | | |
| G2 icon pack | | | |
| G3 `vp` / Vite Plus — verified? | | | |
| G4 git mode (strict / light) | | | |
| G7 media storage (Cloudinary / R2 / R2+Images) | | | |

### G1 detail — database

**Chosen:** <D1 / Neon / Supabase>
**Decided:** <date> · **Procedure:** `.agents/rules/70-database-selection.md`

**PRD signals that drove it:** <the specific ones — write volume, model complexity, search
needs, realtime, idle behaviour. Not "it seemed simpler".>

**Ceiling accepted:** <the limitation this choice imposes, stated plainly, so nobody is
surprised by it in six months.>

**Runner-up and flip condition:** <what would have changed the answer.>

**Limits verified on <date>, from <source>:**

| Limit | Value |
|---|---|
| | |

**How it connects:** <binding name, or driver and connection strategy. Whatever the
current docs specify — do not copy a snippet from memory.>

**Migrations:** <how generated, how applied locally, how applied to production, and
whether they use a different connection mode than runtime queries.>

**Local development:** <how a developer runs against a local or branch database rather
than production.>

### G7 detail — media storage

**Chosen:** <Cloudinary / R2 / R2 + Cloudflare Images>
**Decided:** <date> · **Procedure:** `.agents/rules/71-media-selection.md`

**PRD signals that drove it:** <transformation needs, video, bandwidth, storage growth>

**Ceiling accepted:** <what this choice cannot do>

**Limits verified on <date>, from <source>:**

| Limit | Value |
|---|---|
| | |

**Service module:** <path — the single module every media read and write goes through>

**Reference shape stored in the database:** <columns and what each holds>

**Variant set:** <the defined list of sizes/formats, since every distinct variant is metered>

**Upload flow:** <how an upload is signed or authorized server-side, and what is validated>

### G2 detail — icon pack

<package name, SSR import path, and how icons are sized and colored>

## 2. Rendering model

Which routes are static, which are server-rendered, and which carry a Svelte island.
Every `client:*` directive is a deliberate cost — list them and why.

| Route | Rendering | Islands | Why |
|---|---|---|---|
| | | | |

## 3. Folder structure

```
src/
  pages/                    Astro routes
  components/
    public/
    admin/
    shared/
  lib/
    <feature>/
    shared/
  services/                 external integrations
  types/
    <feature>/
  db/                       Drizzle schema + client
  styles/                   global tokens
```

Rules that govern this: `../../.agents/rules/20-code-standards.md` §7.

## 4. Data layer

- Where the Drizzle client is created and how it is reused.
- The single path application queries take. If both Drizzle and a Supabase client are in
  play, say which is authoritative for what — two paths to one database is how a
  permission model gets bypassed.
- Where migrations live and how they run.

## 5. Auth

BetterAuth wiring: pools, session storage, cookie settings, route guards, and what an
unauthorized request gets (redirect, 403, or 404). Confirm mechanics against current docs
at implementation time.

## 6. Environments

| Environment | Host | Database | Notes |
|---|---|---|---|
| local | | | never the production database |
| preview | | | |
| production | | | |

## 7. External services

| Service | Used for | Keys needed | Failure mode |
|---|---|---|---|

## 8. Cross-cutting

- Response shape and error codes: `../../.agents/rules/20-code-standards.md` §1
- Logging tags per module
- Where shared config lives

## 9. Known constraints and gotchas

Runtime limits, cold starts, request size caps, timeouts, and anything already discovered
the hard way.
