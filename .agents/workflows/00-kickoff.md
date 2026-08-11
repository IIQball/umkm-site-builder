# Workflow — 00 Kickoff (run once, first)

Turns `PRD.md` into the full `docs/` spec. Nothing else runs before this.

**Do not write application code during this workflow.** The output is documents and
decisions. Code starts in `10-feature.md`.

Prerequisites: `AGENTS.md` read, required skills available (`.agents/skills/README.md`),
`PRD.md` filled in by the human.

---

## Phase 1 — Read and reconcile

1. Read `PRD.md` end to end.
2. Read `AGENTS.md` and every file in `.agents/rules/`.
3. Build two lists:
   - **Gaps** — anything a build would need that `PRD.md` does not answer, plus every
     section marked `UNKNOWN` or left empty.
   - **Conflicts** — statements in `PRD.md` that contradict each other, contradict the
     locked stack, or are not technically achievable as written.
4. Do not fill a gap with a guess. Do not quietly resolve a conflict.

## Phase 2 — Ask everything, once

Present gaps, conflicts, and the preflight gates from `AGENTS.md` §2 in a **single pass**.
Group them so the human can answer in one sitting. Do not drip one question per turn.

Include, at minimum:

- G1 database — D1, Neon, or Supabase (see Phase 2b, do this one properly)
- G2 icon pack
- G3 `vp` / Vite Plus — verify before adopting
- G4 git mode: strict or light
- G5 auth pools and exact role list
- G6 what must never be pushed to GitHub
- G7 media storage — Cloudinary, R2, or R2 + Cloudflare Images (see Phase 2c)

For each, state your recommendation and the tradeoff. Then wait. **Do not proceed with an
unanswered gate.**

## Phase 2b — Database selection (G1)

G1 gets its own step because it is the stickiest decision in the project: leaving SQLite
later is a schema and query rewrite, not a dump-and-restore.

Run `.agents/rules/70-database-selection.md` in full:

1. Read current docs for the candidates via context7 — never quote a limit from memory or
   from that rules file's snapshot table.
2. Extract signals S1-S12 from the PRD. Anything the PRD does not answer becomes a
   question for the human, not an assumption.
3. Apply the disqualifiers.
4. Score the survivors.
5. Recommend **one**, with the reasoning tied to specific PRD signals, the ceiling being
   accepted, the runner-up, and what would flip the decision.
6. **Wait for the human to confirm.**

Do not write schema, migrations, or any data-layer code until this is confirmed.

## Phase 2c — Media storage selection (G7)

Run `.agents/rules/71-media-selection.md`. Same shape as G1: read current docs via
context7, extract signals M1-M8 from the PRD, apply disqualifiers, score, recommend one,
wait for confirmation.

Cheaper to reverse than G1, so do not agonize — but it still gets decided before any
upload code exists, and the media reference columns in the schema depend on it.

## Phase 3 — Deep discussion

With the answers in hand, work through with the human:

- Review the requirements as now understood; read them back in your own words.
- Surface trade-offs where a requirement is expensive or risky.
- Make the technical decisions and note the reason for each.
- Flag anything that should be cut or deferred, and say why.

Every decision made here gets recorded with its reasoning. A decision without a recorded
reason gets re-litigated in three weeks.

## Phase 4 — Write the docs

Fill in the templates in `docs/`. Delete the `TEMPLATE` blocks as you go and set an honest
status on each file (`DRAFT` / `LOCKED` / `TODO`).

Order matters — later docs depend on earlier ones:

1. `docs/prd/00-overview.md` — scope, goals, non-goals, locked decisions
2. `docs/prd/personas.md`
3. `docs/prd/user-stories.md` — with acceptance criteria
4. `docs/prd/user-journeys.md`
5. `docs/tech/architecture.md` — including every preflight answer from Phase 2
6. `docs/tech/data-model-erd.md`
7. `docs/tech/permissions-matrix.md` — role x action x resource
8. `docs/tech/api-spec.md` — routes, methods, Zod contracts, guard order
9. `docs/tech/security.md`
10. `docs/tech/code-standards.md` — project-specific additions only; the general rules
    stay in `.agents/rules/20-code-standards.md`
11. `docs/tech/testing-strategy.md`
12. `docs/prd/features/*.md` — one file per feature, from `_template.md`
13. `docs/planning/roadmap.md` — foundation, core flow, quality, production
14. `docs/memory/*` — initialize as empty-but-live trackers
15. `docs/README.md` — update the index table with real statuses
16. `docs/PROJECT-STATE.md` — set the first checkpoint
17. `README.md` — rewrite the block between `<!-- ABOUT:START -->` and `<!-- ABOUT:END -->`
    from `docs/prd/00-overview.md`. Drop the pre-kickoff status line and the human's seed
    brief entirely; they were placeholders. Write 3-6 sentences of plain language for
    someone landing on the repo cold: what the product is, who it is for, what it replaces
    or improves, and where the build currently stands. No roadmap, no feature list, no
    marketing language. Everything outside the markers stays untouched.

**Big picture plus small pieces.** `00-overview.md` is the big-picture PRD; every feature
gets its own small file so progress is trackable per feature instead of one giant document
nobody updates.

## Phase 5 — Gate before code

Present a summary to the human:

- What was decided, and the reasoning for the load-bearing choices.
- What is still `TODO` or `UNKNOWN`.
- The proposed roadmap order and what the first slice is.

Then ask for approval to start building. **Wait for it.**

## Phase 6 — Handoff

Once approved:

1. Confirm `.gitignore` covers everything from G6, before any commit exists.
2. Set `docs/PROJECT-STATE.md` to "kickoff complete, starting <first slice>".
3. **Offer cleanup.** This workflow, both selection procedures, the skills install guide,
   and the unchosen git-mode file have now done their job — roughly 35 KB that every future
   session would otherwise re-read for nothing. Tell the human that, and offer
   `.agents/workflows/01-cleanup.md`, which gives them archive / delete / keep.

   Offer it. Do not run it, and do not delete anything here.
4. Stop. The next session runs `10-feature.md`.

---

## Done means

- [ ] Every preflight gate answered by the human and recorded in `docs/tech/`
- [ ] No section of any doc still contains template placeholder text
- [ ] Every doc has an honest status
- [ ] `docs/README.md` index matches reality
- [ ] `docs/PROJECT-STATE.md` has a first checkpoint
- [ ] `README.md` About block rewritten from the real spec — no seed brief text left
- [ ] `.gitignore` written
- [ ] Human approved the roadmap
- [ ] Cleanup offered (not run)
- [ ] Zero application code written
