# Project Docs — Read This First

This folder is the source of truth for <PROJECT NAME>.

`../PRD.md` is the raw brief. This folder is the reconciled spec. **Code follows this
folder.** When they disagree, stop and reconcile with the human.

Current code state: <not started / kickoff done / phase N in progress>.

## MANDATORY SESSION PROTOCOL (every session, no exceptions)

Before writing or editing ANY code or doc, in order:

1. **READ** this README, `PROJECT-STATE.md`, and the foundation docs below. Do not act on
   memory alone.
2. **PREVIEW** the current state — what is built vs still `TODO`.
3. **RENEW** — after any change affecting scope, data model, permissions, routing, UI
   tokens, or structure, update the matching doc in the SAME session.
4. **NEVER move on blindly.** If a doc conflicts with the code or with a new request,
   stop and reconcile with the human.

If you are a new session and have not read the files below, you are not ready to work.

## Status legend

- `LOCKED` — decided with the human. Do not change without explicit approval.
- `DRAFT` — written, open to revision.
- `TODO` — not written yet.

## Index

| Doc | Purpose | Status |
|---|---|---|
| `prd/00-overview.md` | Big-picture PRD: scope, goals, non-goals, locked decisions | TODO |
| `prd/personas.md` | Who uses this and what they need | TODO |
| `prd/user-stories.md` | Stories plus acceptance criteria | TODO |
| `prd/user-journeys.md` | End-to-end flows | TODO |
| `prd/features/*.md` | One small PRD per feature | TODO |
| `tech/architecture.md` | Structure, routing, rendering, preflight decisions | TODO |
| `tech/data-model-erd.md` | Tables and relations | TODO |
| `tech/permissions-matrix.md` | Role x action x resource | TODO |
| `tech/api-spec.md` | Routes, methods, Zod contracts, guard order | TODO |
| `tech/security.md` | Threat surface and enforced controls | TODO |
| `tech/code-standards.md` | Project-specific standards on top of `.agents/rules/` | TODO |
| `tech/testing-strategy.md` | Test layers and the CI gate | TODO |
| `planning/roadmap.md` | Foundation, core flow, quality, production | TODO |
| `memory/codebase-map.md` | Where everything lives | LIVE |
| `memory/css-vars.md` | Every token and custom class, and where it is used | LIVE |
| `memory/ui-inventory.md` | daisyUI components in use | LIVE |
| `PROJECT-STATE.md` | Cross-session checkpoint | LIVE |

Update this table's statuses as docs are written. A stale index is worse than none.

## Highest-priority guardrail

<Fill this at kickoff: the one thing that must never break in this project — a data
isolation rule, a payment invariant, a compliance constraint. Name it here so every
session sees it first, and link the doc that enforces it. If there genuinely is none,
write "none identified" rather than leaving this blank.>

## Source

Derived from `../PRD.md` plus decisions made with the human on <DATE>. The PRD stays the
raw brief; these docs are the refined, reconciled spec.
