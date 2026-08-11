# Memory — Codebase Map

Status: LIVE · Renew whenever a folder, module, entry point, or major flow is added or moved.

The orientation index. A new session reads this instead of crawling the whole repo. If it
is stale it is worse than empty, because it gets trusted.

## 1. Entry points

| Entry | File | Purpose |
|---|---|---|
| app root layout | | |
| home route | | |
| auth setup | | |
| db client | | |

## 2. Folder map

| Path | Holds | Rules |
|---|---|---|
| `src/pages/` | Astro routes | |
| `src/components/public/` | | |
| `src/components/admin/` | | |
| `src/components/shared/` | cross-feature UI | |
| `src/lib/<feature>/` | feature logic | |
| `src/lib/shared/` | cross-feature helpers | |
| `src/services/` | external integrations | |
| `src/types/<feature>/` | all types and interfaces | never declared inline elsewhere |
| `src/db/` | Drizzle schema and client | |
| `tests/` | see testing-strategy | |

## 3. Shared primitives — check here before writing anything new

| Primitive | Location | Does |
|---|---|---|
| response helpers | | unified `{ ok }` shape |
| logger | | tagged server logs |
| auth guard | | session + role + ownership |
| toast | | action-level feedback |

## 4. Major flows — where each one actually lives

| Flow | Path through the code |
|---|---|
| <e.g. sign in> | route -> guard -> service -> db -> response |

## 5. Where to add a new X

| Adding | Goes in | Also update |
|---|---|---|
| a route | `src/pages/` | `tech/api-spec.md` |
| a UI component | `src/components/<scope>/` | `memory/ui-inventory.md` |
| a type | `src/types/<feature>/` | — |
| a token or custom class | `src/styles/` | `memory/css-vars.md` |
| a table | `src/db/` | `tech/data-model-erd.md` |

## 6. Gotchas

Things that surprised a previous session. Each entry saves the next one an hour.

- ...
