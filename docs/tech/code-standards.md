# Tech — Code Standards (project-specific)

Status: TODO

The general standards live in `../../.agents/rules/20-code-standards.md` and apply
everywhere. **Do not restate them here.** This file holds only what is specific to this
project — the conventions a new session could not derive from the shared rules.

## 1. Naming

| Thing | Convention | Example |
|---|---|---|
| files | | |
| components | | |
| Zod schemas | | |
| types | | |
| log tags | `[<module>.<operation>]` | `[auth.login]` |

## 2. Log tags in use

| Tag | Module |
|---|---|

Keeping this list means logs stay greppable instead of each session inventing a format.

## 3. Project-specific error codes

Beyond the standard set in `api-spec.md` §2.

| Code | Meaning | Raised by |
|---|---|---|

## 4. Shared primitives

The `lib` and component units every feature is expected to reuse. Check here before
writing something new — reusing what exists is the point of this table.

| Primitive | Location | Use for |
|---|---|---|

## 5. Patterns established

Decisions made once and repeated, with the reason. Deviating from one of these needs a
reason stated in the PR.

| Pattern | Where established | Reason |
|---|---|---|

## 6. Anti-patterns already hit here

Traps this codebase has produced before. Cheaper to read than to rediscover.

| Anti-pattern | What broke | Do this instead |
|---|---|---|
