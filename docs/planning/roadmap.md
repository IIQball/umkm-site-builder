# Planning — Roadmap

Status: TODO

Four phases. A phase does not start until the previous phase's gate is green. Gates exist
so quality does not become the thing that gets cut at the end.

---

## Phase 0 — Foundation

Project boots, decisions locked, nothing is guessed.

- [ ] Every preflight gate answered and recorded (`../tech/architecture.md`)
- [ ] `.gitignore` written before the first commit
- [ ] Project scaffolded: Astro + Svelte + Vite + Bun, daisyUI wired
- [ ] Global tokens and spacing scale defined, recorded in `../memory/css-vars.md`
- [ ] Icon pack installed, SSR path verified
- [ ] Drizzle client and the G1 connection path working against a real database
- [ ] Response helper, logger, and auth guard primitives exist in `lib`
- [ ] `typecheck`, `lint`, `test` commands run clean on an empty project

**GATE 0:** nothing above is a guess, and `bun run verify` passes.

## Phase 1 — Core flow

The shortest path that proves the product works end to end.

- [ ] <the one flow that, if it works, proves the concept>
- [ ] Auth: sign in, session, role, and a protected route that actually denies
- [ ] The primary screens with all states built
- [ ] The primary entities in the database with the ownership column enforced

**GATE 1:** a real user can complete the core flow, and an unauthorized user is denied
server-side (test proves it, not a manual click).

## Phase 2 — Quality

Where the product becomes safe to leave alone.

- [ ] Permission tests generated from the matrix — every row covered
- [ ] Validation tests per endpoint
- [ ] Smoke tests for critical flows
- [ ] Every screen reviewed in a real browser: responsive, focus, clean console
- [ ] Error handling audited: no unguarded async, no leaked server detail
- [ ] `docs/memory/` accurate and current

**GATE 2:** the full definition of done passes on every shipped surface, not just the
last one touched.

## Phase 3 — Production

- [ ] Environments separated; production database is not reachable from local
- [ ] Secrets in the host's secret store, none in the repo
- [ ] Rate limits on auth and anything that costs money
- [ ] Backup and restore procedure written and tested once
- [ ] Logging and error visibility in production
- [ ] Deploy runbook, including rollback
- [ ] Security review recorded in `../tech/security.md` §9

**GATE 3:** a rollback has been rehearsed, not just documented.

---

## Current position

**Phase:** <n> · **Next slice:** <what `10-feature.md` runs next>

Keep this in sync with `../PROJECT-STATE.md`.

## Deferred

Deliberately not now. Each one names what would make it worth doing.

| Item | Deferred because | Revisit when |
|---|---|---|
