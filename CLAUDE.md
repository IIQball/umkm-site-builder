# CLAUDE.md

Rules for this repo live in **`AGENTS.md`** at the repo root. Read it before any work.

`AGENTS.md` is canonical for every agent and every tool. This file exists only so Claude
Code loads the same rules. Do not put rules here — edit `AGENTS.md`.

Detail lives in `.agents/rules/`. Workflows live in `.agents/workflows/`. The generated
spec lives in `docs/`.

Claude Code specifics:

- Use the `frontend-design` skill on UI work, on top of `.agents/rules/30-ui-ux.md`.
- Use the `clean-code` skill whenever writing, editing, reviewing, or refactoring code.
- Use `context7` for library docs. Never trained memory.
