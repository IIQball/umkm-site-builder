# Workflow — 01 Cleanup (run once, after kickoff)

Kickoff files are scaffolding. Once the decisions they exist to produce are made and
recorded, re-reading them every session is pure token cost with no benefit.

This workflow removes that weight. **It is destructive, so it never runs on your own
initiative and never runs without the preconditions below.**

---

## 1. Preconditions — all of them, verified, not assumed

Do not start until every one is true. Check each by **reading the file**, not by
remembering that you wrote it.

- [ ] Every preflight gate (G1-G7) has a human-confirmed answer
- [ ] `docs/tech/architecture.md` records each decision **with its reasoning and the
      ceiling accepted** — not just the name of the choice
- [ ] `docs/tech/data-model-erd.md` §0 has the schema conventions for the chosen database
- [ ] `docs/PROJECT-STATE.md` gate table is filled in
- [ ] `docs/README.md` index reflects reality

If any is incomplete, **stop and finish it first.** Deleting a procedure before recording
its output is how a team loses both the answer and the method for getting it.

Also check: is the repo git-tracked, and are these files committed?

```bash
git log --oneline -1 -- .agents/ docs/
```

That answer changes the recommendation in §4. Deletion of a committed file is recoverable
from history. Deletion of an uncommitted file is not.

## 2. Safe to remove — one-time use

| File | Why it is done | Approx. size |
|---|---|---|
| `.agents/rules/70-database-selection.md` | G1 decided and recorded | ~11 KB |
| `.agents/rules/71-media-selection.md` | G7 decided and recorded | ~9 KB |
| `.agents/workflows/00-kickoff.md` | runs once, has run | ~6 KB |
| `.agents/skills/README.md` | install guide, done per machine | ~4 KB |
| the **unchosen** git-mode file (`60-git-strict.md` or `61-git-light.md`) | G4 decided; the other mode is dead weight and a live source of confusion | ~3 KB |
| `.agents/workflows/01-cleanup.md` | this file, once it has run | ~5 KB |

Roughly 35-38 KB, most of a session's rules-reading budget.

## 3. Never remove

- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- `.agents/rules/00-stack.md`, `10-process.md`, `20-code-standards.md`, `30-ui-ux.md`,
  `40-security.md`, `50-qa-testing.md`
- The **chosen** git-mode rules file
- `.agents/workflows/10-feature.md`, `20-review.md`
- Anything under `docs/` — that is the whole point of the scaffold
- `docs/prd/features/_template.md` — used again for every new feature
- `PRD.md` — see §5

## 4. Ask the human — three options

Present these and **wait**. Do not pick one yourself.

**Option A — Archive (recommended when the repo is not yet committed)**

Move the files to `.agents/archive/`. `AGENTS.md` §1 already excludes that folder from
session reading, so the token cost goes to zero while the content stays recoverable
without git.

```bash
mkdir -p .agents/archive
git mv .agents/rules/70-database-selection.md .agents/archive/   # or mv if untracked
```

**Option B — Delete (fine when the repo is committed)**

Actually remove them. History holds the content, so recovery is
`git show <commit>:<path>`. Cleanest working tree, nothing to explain to a new team member.

**Option C — Keep everything**

Zero risk, and every session keeps paying to read decisions that are already settled. Only
sensible if the project is likely to revisit its gates soon.

State your recommendation with the reason. Default reasoning: **committed repo → B;
uncommitted → A; gates still shaky → C.**

## 5. PRD.md — stop reading, do not delete

`PRD.md` is the original brief and the provenance for every decision in `docs/`. It stays.

But after kickoff, `docs/` is the source of truth and `PRD.md` is history. Add a header to
it so no session re-reads it as if it were live:

```markdown
> SUPERSEDED — this is the original brief, kept for provenance.
> The reconciled spec is in `docs/`. Do not read this file during normal work.
> Changes to scope go through `docs/`, not here.
```

## 6. Trim in place — needs explicit approval

These are edits to rules files, not deletions, and `README.md` says rules change by
agreement. Ask before doing either.

**`.agents/rules/00-stack.md`** — the "Undecided — DECIDE BEFORE CODE" section is dead
once every gate is answered. Replace the whole section with:

```markdown
## Preflight gates — all resolved

Decided during kickoff and recorded in `docs/tech/architecture.md` with reasoning and
accepted ceilings. Do not re-open a gate without the human's agreement.
```

Keep the locked stack table, the stack tensions, and the media rules. Those stay live.

**`AGENTS.md` §2** — collapse the gate table the same way, leaving the pointer to
`docs/tech/architecture.md` and the standing rule that stack APIs are verified against
current docs rather than memory. **That last sentence must survive** — it is a permanent
rule that happens to live in a section about gates.

## 7. Record it

In `docs/PROJECT-STATE.md`, under "Last session did":

```
Scaffold cleanup: <archived|deleted> <list>. Gates G1-G7 resolved and recorded in
docs/tech/architecture.md. Trimmed 00-stack.md gate section and AGENTS.md §2.
```

A new session must be able to tell that files are absent by decision, not by accident.

## 8. If you need a procedure back

- Archived: it is in `.agents/archive/`.
- Deleted and committed: `git show <commit>:<path>`.
- Deleted and never committed: gone — take a fresh copy from the team's scaffold folder.

A **new project** always starts from a fresh copy of the scaffold. Cleaning up here never
affects that. If *this* project needs to re-open a gate, restore the one file, run it, and
re-clean.

---

## Done means

- [ ] Every precondition in §1 verified by reading, not memory
- [ ] Human chose A, B, or C explicitly
- [ ] Only §2 files touched; nothing from §3
- [ ] `PRD.md` marked superseded, not deleted
- [ ] In-place trims approved separately, and the docs-first rule survived
- [ ] `PROJECT-STATE.md` records what happened
