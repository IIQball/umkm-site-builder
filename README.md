# umkm-site-builder

<!-- ABOUT:START -->
<!-- Maintained by the agent. Rewritten from docs/prd/00-overview.md at kickoff and
     whenever product scope changes. Do not hand-edit and expect it to survive. -->

**Status: pre-kickoff.** The seed description below is the human brief, not a spec.

A web builder for UMKM (micro, small, and medium enterprises) in Indonesia — a tool that
lets a business owner with no technical background put a real website online: pick a
starting point, edit their own content, and publish, without touching code, hosting, or a
developer.

The full scope, personas, and acceptance criteria do not exist yet. They get written into
`PRD.md`, and the kickoff workflow turns that into `docs/`. This block is replaced with the
reconciled description at that point.
<!-- ABOUT:END -->

---

## How to work in this repo

This repo ships the [agent-scaffold](https://github.com/IIQball/agent-scaffold): markdown
rules and doc templates so an AI agent can go from brief to code without anyone
re-explaining the standards. **You write `PRD.md`. The agent does the rest.**

1. Fill in `PRD.md`. Rough is fine — write `UNKNOWN` where you do not know. Do not leave a
   section silently empty; empty reads as "no requirement".
2. Install the required skills — see `.agents/skills/README.md`.
3. Tell your agent:

   ```
   Read AGENTS.md, then run .agents/workflows/00-kickoff.md.
   ```

4. Answer its preflight questions. It will not guess on them.
5. Kickoff output: `docs/` holds the full spec, `docs/planning/roadmap.md` holds the build
   order, and the About block above is rewritten to match. Then build one feature at a time:

   ```
   Read AGENTS.md and docs/PROJECT-STATE.md, then run .agents/workflows/10-feature.md
   for <feature>.
   ```

## Layout

| Path | What it is |
|---|---|
| `PRD.md` | the only file a human must write |
| `AGENTS.md` | canonical agent rules. Every agent reads this first |
| `.agents/` | rules, workflows, skills install guide. Scaffold docs in `.agents/README.md` |
| `docs/` | the reconciled spec the agent generates. Source of truth for code |

## Stack

Cloudflare · Astro · Svelte · Vite · Bun · Drizzle · daisyUI · Vitest · Zod · BetterAuth.
Database and media storage are chosen per project at kickoff from approved options.

## Rules of the road

- No GitHub action — commit, branch, PR, merge, issue, comment — without being asked.
- No code before `docs/` exists and has been read.
- No emojis anywhere.
- Full list in `AGENTS.md`.
