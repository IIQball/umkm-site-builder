# GEMINI.md

Rules for this repo live in **`AGENTS.md`** at the repo root. Read it before any work.

`AGENTS.md` is canonical for every agent and every tool. This file exists only so
Antigravity and Gemini CLI load the same rules. Do not put rules here — edit `AGENTS.md`.

In Antigravity, `GEMINI.md` takes precedence over `AGENTS.md` on conflict. This file
deliberately declares no rules of its own, so `AGENTS.md` always wins.

Antigravity specifics:

- Workspace rules are read from `.agents/rules/`. Skills are read from `.agents/skills/`.
- The `frontend-design` skill is Claude Code only. Use `.agents/rules/30-ui-ux.md` instead
  — it carries the same substance in portable form.
- Install the required skills per `.agents/skills/README.md` before starting work.
