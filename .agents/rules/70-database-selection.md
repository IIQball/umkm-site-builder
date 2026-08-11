# Rules — Database Selection (preflight gate G1)

The database is **not** pre-decided in this scaffold. Three are approved. Which one fits
depends on what the PRD describes, and they have genuinely different strengths.

Run this once per project, during `00-kickoff.md`. Once decided, it is **LOCKED** for that
project and recorded in `docs/tech/architecture.md`.

---

## 0. Hard rule — you recommend, the human decides

Analyze, score, recommend **one** option with your reasoning, then **stop and wait**.

This choice is sticky. Moving off SQLite later is a schema and query rewrite, not a
dump-and-restore. Never pick silently, and never start writing data-layer code before the
human has confirmed.

## 1. Read the current docs FIRST

Everything in this file about *tradeoffs* is durable. Everything about *numbers, package
names, and APIs* rots. Before you recommend anything:

1. Use context7 to pull current docs for the candidates you are seriously considering.
2. Re-verify every number you intend to quote to the human. Free tiers change quarterly.
3. Never quote a limit from this file, from your training data, or from a blog post as
   current fact. Quote what you just read, and say when you read it.

Doc targets:

| Candidate | Read before recommending |
|---|---|
| Cloudflare D1 | D1 limits, D1 pricing, Drizzle's D1 adapter |
| Neon | Neon plans and limits, Neon serverless/HTTP driver, Drizzle's Neon adapter |
| Supabase | Supabase pricing, connecting to Postgres (pooler modes), Drizzle's postgres-js adapter |

If context7 is unavailable, say so explicitly in your recommendation and mark every number
as unverified. Do not quietly fall back on memory.

## 2. Extract the signals from the PRD

Answer these **from the PRD**, not from assumption. Anything the PRD does not answer goes
to the human as a question — it does not get guessed.

| # | Question | Why it matters |
|---|---|---|
| S1 | Read-heavy or write-heavy? Roughly how many rows written on a busy day, including logs, counters, and audit trails? | D1 free meters rows written per day |
| S2 | Are writes concurrent (chat, live feed, collaborative editing)? | D1 processes requests sequentially |
| S3 | How relational is the model — few flat tables, or many joins, constraints, and transactions? | SQLite handles simple models fine; complex ones want Postgres |
| S4 | Any need for JSON documents, array columns, or flexible per-record fields? | SQLite has no JSONB or array types |
| S5 | Any search? Simple `LIKE`, full-text, or semantic/vector? | vector and rich FTS point away from D1 |
| S6 | Any AI/embedding features? | needs pgvector, or Cloudflare Vectorize as a separate service |
| S7 | Is row-level security needed as an enforcement layer? | SQLite has no RLS |
| S8 | Does the app need realtime subscriptions (push, not poll)? | only Supabase ships this natively |
| S9 | Will the project sit idle for a week or more between demos? | Supabase free pauses on inactivity |
| S10 | How many projects will share one vendor account? | free-tier project caps differ sharply |
| S11 | Is there a realistic path to outgrowing the free tier, and what happens then? | migration cost differs by an order of magnitude |
| S12 | Is scheduled or bulk import part of the product? | D1 caps bound parameters per query, forcing chunked batches |

## 3. Disqualifiers — apply before scoring

These are vetoes, not preferences. If one fires, the option is out regardless of how well
it scores elsewhere.

| If the PRD needs... | Rule out |
|---|---|
| row-level security as an enforcement layer | D1 |
| array or JSONB columns central to the model | D1 |
| vector / semantic search inside the database | D1 (Cloudflare's answer is Vectorize, a separate service and a separate binding — that is a real architecture change, surface it) |
| Postgres extensions | D1 |
| heavy concurrent writes | D1 |
| native realtime subscriptions | D1 and Neon (both would need you to build it) |
| more free projects than the vendor's cap allows | whichever cap is exceeded |
| the project to stay reachable while idle for weeks | Supabase free tier |

If every option is disqualified, stop and take it to the human. Do not pick the
least-bad one silently.

## 4. Strength profiles (durable — this is the part that does not rot)

### Cloudflare D1 — SQLite

**Strongest when:** read-dominant content sites, portfolios, catalogs, docs, marketing
sites, internal tools with light writes. Simple relational models. Teams that want one
vendor, one dashboard, one bill.

**Wins:** no connection string, no pooler, no driver decision — it is a Workers binding,
so the whole edge-database problem disappears. Never sleeps. Point-in-time recovery
included. No egress charge.

**Ceilings:** SQLite, not Postgres — no RLS, no extensions, no JSONB or array types, dates
stored as INTEGER or TEXT. Requests are processed **sequentially**, so the slowest query
caps total throughput. Bound parameters per query are capped, which breaks naive bulk
inserts. Exit is a rewrite.

**Agent tax:** models default to Postgres. Expect Postgres-isms (`JSONB`, arrays,
`timestamptz`, `ILIKE`) to appear and fail. If D1 is chosen, that becomes a standing rule
in `docs/tech/code-standards.md`.

### Neon — serverless Postgres

**Strongest when:** relationally complex models, write-heavy or concurrent workloads,
anything needing real Postgres features, AI features needing pgvector, and teams running
many projects or wanting a database branch per pull request.

**Wins:** real Postgres, so agents write correct code by default and the exit is
`pg_dump`. HTTP driver removes the socket problem. Scales to zero and wakes on request.
Branching fits a PR-based git workflow.

**Ceilings:** free storage and compute-hours are the tightest of the three, so verify them
against the current docs. Cold start on wake. Still a network hop out of Cloudflare.

### Supabase — Postgres plus a platform

**Strongest when:** the project wants the *bundle* — Postgres plus auth plus file storage
plus realtime in one place. Realtime subscriptions are the one capability the other two
do not have natively. Also the largest ecosystem, which means the most training data
behind your agents.

**Wins:** real Postgres, RLS, realtime, biggest community.

**Ceilings:** most setup friction on Workers — transaction-mode pooler, prepared
statements disabled, and a second direct connection string for migrations. Free tier
pauses idle projects and caps active projects low.

**Important for this scaffold:** auth is locked to BetterAuth, and media goes to whatever
G7 chose. If both of those sit outside Supabase, most of Supabase's value is unused and you
are paying its friction for a bare Postgres host. Say so in your recommendation rather than
scoring it as a tie. Its realtime capability is the one thing that can still justify it on
its own.

## 5. Scoring

Score each surviving candidate 1-5 against the signals, weighted by what the PRD actually
emphasizes. Do not average blindly — a single hard requirement outweighs three
conveniences.

| Criterion | Weight from PRD | D1 | Neon | Supabase |
|---|---|---|---|---|
| workload shape (S1, S2) | | | | |
| model complexity (S3, S4) | | | | |
| search and AI needs (S5, S6) | | | | |
| security model (S7) | | | | |
| realtime (S8) | | | | |
| operational fit (S9, S10) | | | | |
| growth and exit (S11) | | | | |
| setup cost on Cloudflare | | | | |
| agent correctness | | | | |

## 6. Present the recommendation

Give the human, in this order:

1. **The recommendation** — one option, named.
2. **Why**, tied to specific PRD signals. "Read-dominant, no vector search, under 5k
   writes/day" beats "it seemed simpler."
3. **What it costs you** — the ceiling you are accepting, stated plainly.
4. **The runner-up** and the one condition that would flip the decision.
5. **Every number you quoted**, with when and from where you verified it.
6. **Any signal the PRD did not answer**, as an explicit question.

Then stop. Wait for confirmation.

## 7. After the human decides

1. Record in `docs/tech/architecture.md`: the choice, the reasoning, the ceiling accepted,
   and the date.
2. Record the schema consequences in `docs/tech/data-model-erd.md` — especially if D1 was
   chosen (no arrays, no JSONB, date storage convention, bulk-insert chunking).
3. Add DB-specific standing rules to `docs/tech/code-standards.md` so every future session
   inherits them.
4. Update `docs/PROJECT-STATE.md` G1 row.
5. **Then** read the current setup docs via context7 and wire it up. Not before.

## 8. Integration checklists — what to resolve, not how

Deliberately no code here. Setup APIs change; these questions do not. Read the current
docs, then confirm you have an answer for every line.

### If D1

- [ ] Binding declared in Wrangler config, and the binding name matches what the code uses
- [ ] Drizzle's D1 adapter wired to the binding (not to a connection string)
- [ ] How the binding is reached from Astro's Cloudflare adapter — this is the step people
      get wrong; verify against current Astro and Cloudflare docs, not memory
- [ ] Local development story: how you run against a local D1 instead of production
- [ ] Migration workflow: how migrations are generated, applied locally, and applied remotely
- [ ] Schema conventions written down: date storage, no arrays, no JSONB, boolean handling
- [ ] Bulk-insert chunking helper, sized under the bound-parameter cap
- [ ] Indexes reviewed — on D1 an unindexed scan bills every row it reads

### If Neon

- [ ] HTTP/serverless driver chosen and confirmed to work on the Workers runtime
- [ ] Drizzle's Neon adapter matched to that driver
- [ ] Connection string in env, never in the repo
- [ ] Whether migrations need a different connection mode than runtime queries
- [ ] Cold-start behaviour after autosuspend measured, not assumed
- [ ] Branching strategy if you want a database per pull request

### If Supabase

- [ ] Transaction-mode pooler connection string for runtime (not the direct port)
- [ ] Prepared statements disabled in the driver — this is required with the transaction
      pooler and the failure message does not point at the cause
- [ ] Separate direct connection string for migrations, documented so nobody mixes them up
- [ ] Both strings in env, clearly named
- [ ] Confirm the project-count and inactivity-pause limits against current docs before
      committing a client project to the free tier

## 9. Volatile facts — re-verify, do not trust

Everything below was accurate on **2026-07-29** and is recorded only to show the *shape*
of each product's limits. **Re-verify every one before quoting it to a human.**

| Fact | As of 2026-07-29 |
|---|---|
| D1 free: rows read / written per day | 5M / 100k |
| D1 free: max size per database | 500 MB |
| D1 free: databases per account | 10 |
| D1: bound parameters per query | 100 |
| D1: point-in-time recovery window | 30 days |
| D1: request processing | sequential |
| Neon free: storage per project | 0.5 GB |
| Neon free: compute | 100 CU-hours/month, autosuspend ~5 min |
| Neon free: projects | up to 100 |
| Supabase free: database size | 500 MB |
| Supabase free: active projects | 2 |
| Supabase free: idle pause | ~1 week without requests |
| Supabase free: backups | none |

An agent that quotes this table as current fact, without re-checking, has broken the
docs-first rule in `AGENTS.md` §2.
