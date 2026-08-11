# PRD — UMKM SITE BUILDER

> This is the ONLY file you have to write. Fill it in, then tell your agent:
> "Read AGENTS.md, then run `.agents/workflows/00-kickoff.md`."
> The agent turns this brief into the full `docs/` spec and asks you about anything missing.
>
> Rough is fine. Bullet points are fine. Unknowns are fine — write `UNKNOWN` and the agent
> will ask. Do NOT leave a section silently empty; an empty section reads as "no
> requirement" and the agent will build accordingly.
>
> Delete this block when you are done.

Status: DRAFT · Owner: <NAME> · Last updated: <YYYY-MM-DD>

---

## 1. What is this

One paragraph. What the product is, who it is for, what it replaces or improves.

## 2. Problem

What is broken or missing today. Why it is worth building. Evidence if you have it.

## 3. Goals

- ...

## 4. Non-goals (explicitly out of scope)

Be specific here. This is the cheapest scope control you have.

- ...

## 5. User personas

For each: who they are, their level of technical skill, what they need, what frustrates them.

### Persona A — <name>
- Context:
- Needs:
- Pain:

## 6. User stories

Format: `As a <persona>, I want <capability>, so that <outcome>.`

- ...

## 7. User journeys

The end-to-end path for each main flow. Entry point, each step, where it ends, what can
go wrong along the way.

### Journey — <name>
1. ...

## 8. Acceptance criteria

Testable and binary. "It works" is not acceptance criteria.

- [ ] Given <state>, when <action>, then <observable result>.

## 9. Roles and permissions

Every role, and what each one may do to what. If there is only one role, say so.

| Role | Can | Cannot |
|---|---|---|
| | | |

## 10. Data

The main entities and how they relate. Rough nouns are enough — the agent produces the ERD.

- ...

## 11. Workload shape

The agent picks your database from this section. Rough answers are fine — "no idea" is
also fine, it will ask. Guessing wrong here is cheap; leaving it blank is not, because the
database choice is hard to reverse later.

- **Read-heavy or write-heavy?** What does a user mostly do — browse, or create?
- **Roughly how many records get written on a busy day?** Include logs, view counters,
  and activity trails, not just things users deliberately save.
- **Anything realtime?** Live chat, notifications that push, collaborative editing,
  presence indicators. Or is refresh-to-see-changes fine?
- **Search?** None, simple keyword matching, full-text, or "find me things similar to
  this" (semantic/AI)?
- **Any AI features?** Recommendations, embeddings, semantic similarity.
- **Flexible per-record data?** Fields that differ between records, or user-defined
  attributes, rather than a fixed set of columns.
- **Will this sit idle for weeks between demos or seasons?**
- **How many separate projects will your team run on the same vendor account?**

## 12. Media

Media never goes in the database — it goes to a storage provider, and the agent picks that
provider from this section. Same deal as above: rough answers fine, "no idea" fine.

- **What actually gets uploaded?** Photos, video, PDFs, documents, mixed.
- **Do images need resizing or cropping on the fly** — different sizes for phone vs
  desktop, thumbnails, cover crops? Or are they uploaded already at the right size?
- **Any video?** Does it need to stream properly, or is a plain download link enough?
- **Roughly how much gets viewed per month?** A quiet portfolio and a busy gallery have
  very different costs here.
- **How many sizes of the same image does the design need?** Thumbnail, card, hero,
  social preview.
- **Who uploads** — your team only, or the public?
- **Public, private, or both?**
- **How much storage after a year?**

## 13. Integrations and external services

Payments, email, storage, analytics, third-party APIs. Note which need accounts or keys.

- ...

## 14. Constraints

Deadline, budget, existing systems to interoperate with, compliance, data residency,
languages, accessibility level, browser/device support.

- ...

## 15. Must not be pushed to GitHub

Secrets, env files, dumps, uploaded media, client data, credentials.

- ...

## 16. Open questions

Anything you know you have not decided. The agent will bring these back to you.

- ...
