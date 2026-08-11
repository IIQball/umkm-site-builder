# PROJECT STATE — Live Checkpoint

Status: LIVE · Updated: <YYYY-MM-DD> by <session/agent>

The handoff file between sessions. Read it second, right after `README.md`. Update it at
the end of every session that changed anything — this is part of the definition of done.

Keep it short and current. This is a checkpoint, not a changelog.

---

## Where the work stands

<One paragraph. What exists and works right now. What a fresh session can rely on.>

## Last session did

- <change> — <where> — <evidence it works>

## Next up

1. <the immediate next slice, from planning/roadmap.md>
2. <after that>

## Open threads (unresolved, needs a decision)

| Thread | Blocked on | Raised |
|---|---|---|
| | | |

## Known gaps and deliberate shortcuts

Things that are knowingly incomplete. Each one names its ceiling and the upgrade path, so
nobody mistakes a shortcut for a finished design.

- <shortcut> — ceiling: <what breaks first> — upgrade when: <trigger>

## Do not repeat these mistakes

Traps already hit in this codebase. Cheaper to read than to rediscover.

- <trap and the correct approach>

## Scaffold cleanup

Whether the single-use kickoff files were retired, and how. A new session reads this to
know that a missing file is absent by decision, not by accident.

**Status:** <not yet offered / offered, declined / archived / deleted> · **Date:** <>
**Removed:** <list, or "none">

## Preflight decisions (from kickoff)

| Gate | Decision | Recorded in |
|---|---|---|
| G1 database (D1 / Neon / Supabase) | | tech/architecture.md |
| G2 icon pack | | tech/architecture.md |
| G3 vp / Vite Plus | | tech/architecture.md |
| G4 git mode | | tech/architecture.md |
| G5 auth pools and roles | | tech/permissions-matrix.md |
| G6 never-push list | | .gitignore + tech/security.md |
| G7 media storage (Cloudinary / R2 / R2+Images) | | tech/architecture.md |
