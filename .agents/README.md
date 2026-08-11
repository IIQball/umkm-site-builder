# Agent Scaffold — Astro + Svelte + Cloudflare

> Scaffold's own documentation, kept for reference. For how to work in *this*
> project, read the root `README.md` first.

Drop-in rules and doc templates so an AI agent can take a project from brief to code
without anyone re-explaining the standards each time.

Stack is locked except two decisions — the **database** and the **media storage provider**
— which the agent picks per project from approved options based on what your PRD describes,
then hands to you to confirm.

**You write `PRD.md`. The agent does the rest.**

This scaffold ships markdown only — no `package.json`, no configs, no dependencies. It
does not go stale when Astro or Bun bumps a version.

---

## Quickstart

1. Copy this folder's contents into your new (empty) project repo.
2. Fill in `PRD.md`. Rough is fine; write `UNKNOWN` where you do not know.
3. Install the required skills — see `.agents/skills/README.md`.
4. Tell your agent:

   ```
   Read AGENTS.md, then run .agents/workflows/00-kickoff.md.
   ```

5. Answer the agent's preflight questions. It will not guess on them.
6. When kickoff finishes, `docs/` holds the full spec and `docs/planning/roadmap.md`
   holds the build order. Then:

   ```
   Read AGENTS.md and docs/PROJECT-STATE.md, then run .agents/workflows/10-feature.md
   for <feature>.
   ```

## What is in here

```
AGENTS.md              canonical rules. Self-sufficient. Every agent reads this.
CLAUDE.md              pointer to AGENTS.md (Claude Code)
GEMINI.md              pointer to AGENTS.md (Antigravity / Gemini CLI)
PRD.md                 the only file a human must write

.agents/
  rules/               the detail behind AGENTS.md
    00-stack.md          stack, preflight gates, provider-neutral media rules
    10-process.md        session protocol, docs-first, order of work
    20-code-standards.md response shape, async guards, logging, structure, types
    30-ui-ux.md          mobile-first, daisyUI, tokens, spacing, typography, review loop
    40-security.md       secrets, authz, input, data safety, what never ships
    50-qa-testing.md     test layers, definition of done, bug reporting
    60-git-strict.md     protected main + dev integration + human sign-off
    61-git-light.md      single protected branch, small team
    70-database-selection.md  D1 vs Neon vs Supabase, decided from the PRD
    71-media-selection.md     Cloudinary vs R2 vs R2+Images, decided from the PRD
  skills/README.md     which skills are required and where to get them
  workflows/
    00-kickoff.md        PRD.md -> full docs/ spec. Run once, first.
    01-cleanup.md        retire the single-use scaffolding. Run once, after kickoff.
    10-feature.md        build one feature end to end
    20-review.md         review and QA a change

docs/                  templates the agent fills in. This becomes your source of truth.
  README.md              index + status legend + session protocol
  PROJECT-STATE.md       live checkpoint across sessions
  prd/                   overview, personas, user stories, journeys, per-feature specs
  tech/                  architecture, ERD, API, permissions, code standards, security, testing
  memory/                codebase map, CSS variables, UI component inventory
  planning/roadmap.md    foundation -> core -> quality -> production
```

## Half this scaffold is single-use — retire it after kickoff

The kickoff workflow, the two selection procedures, the skills install guide, and whichever
git-mode file you did not choose exist to produce decisions. Once those decisions live in
`docs/tech/architecture.md`, re-reading them every session costs tokens and buys nothing.

That's roughly **35 KB out of ~80 KB** of agent-facing rules.

After kickoff, your agent will offer `.agents/workflows/01-cleanup.md`. It gives you three
choices and will not act until you pick:

| Option | What happens | Best when |
|---|---|---|
| **Archive** | moved to `.agents/archive/`, which `AGENTS.md` excludes from reading | repo not committed yet |
| **Delete** | actually removed; `git show` recovers them | repo is committed |
| **Keep** | nothing changes | you expect to revisit a decision soon |

`PRD.md` is never deleted — it gets a SUPERSEDED header instead, so it stays as provenance
without being re-read as if it were live.

The agent will not run cleanup on its own, and it will not touch anything under `docs/`.
A new project always starts from a fresh copy of this folder, so cleaning up one project
never affects the next.

## Why the docs folder matters

`PRD.md` is the raw brief. `docs/` is the reconciled spec, and it is what keeps a fresh
agent session from re-reading the whole codebase or re-litigating a settled decision.
The three files in `docs/memory/` do the heavy lifting:

- `codebase-map.md` — where things live, so agents stop hunting.
- `css-vars.md` — every token and custom class plus where it is used, so a color change
  is traceable instead of terrifying.
- `ui-inventory.md` — which daisyUI components are already in use, so agents reuse
  instead of hand-rolling a fourth button.

These only work if agents renew them. That obligation is in `AGENTS.md` §1 and in the
definition of done.

## Tool support

| Tool | Reads | Notes |
|---|---|---|
| Antigravity | `AGENTS.md`, `GEMINI.md`, `.agents/rules/`, `.agents/skills/` | `GEMINI.md` wins on conflict, so it deliberately declares no rules of its own |
| Claude Code | `CLAUDE.md` -> `AGENTS.md` | also has the `frontend-design` skill |
| Cursor / Codex / Gemini CLI | `AGENTS.md` | `.agents/skills/` is the neutral skills path |

`AGENTS.md` is written to stand alone. If a tool does not pick up `.agents/rules/`, every
load-bearing guardrail still applies.

## House rules for this scaffold

- Edit `AGENTS.md` only. `CLAUDE.md` and `GEMINI.md` stay as pointers.
- Rules change by agreement, not by an agent editing them mid-task.
- Review the stack section when a major dependency changes.
