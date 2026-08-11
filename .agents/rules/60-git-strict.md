# Rules — Git (STRICT mode)

Use this file **only if the human chose strict mode** at preflight (G4). Otherwise see
`61-git-light.md`. Until the human answers, assume strict.

For teams with a real production deployment. Record the choice in
`docs/tech/architecture.md`.

## Branches

```
main          production. Deploys from here. Protected.
 └── dev      integration. PRs only.
      ├── feat/short-description
      ├── fix/short-description
      └── refactor/short-description
```

Feature and fix branches are cut from `dev`, never from `main`.

## Never

- Never commit directly to `main`.
- Never commit directly to `dev`.
- Never `git push --force` to `main` or `dev`.
- Never skip the PR, however small the change.
- Never merge `dev → main` on your own initiative — that ships to production.
- Never use `--delete-branch` when merging a PR whose head branch is `dev`. That deletes
  the integration branch. The flag is for `feat/*`, `fix/*`, `refactor/*` only.

## ASK BEFORE ANY GITHUB ACTION

Commit, branch, push, PR create, PR merge, PR comment, review, approve, issue open or
close, release, deploy. Every one of them. Show what you intend to do and wait for a yes.

There is no "obvious enough to skip asking".

## Pre-flight before writing code

```bash
git checkout dev
git pull origin dev
git status                                  # must be on dev, clean, up to date
git checkout -b feat/your-feature-name
```

Continuing an existing branch from a previous session:

```bash
git fetch origin
git rebase origin/dev
```

If `git status` shows you on `main` or `dev` with uncommitted changes — **stop.** Report
the repo state to the human and ask how to proceed. Do not stash, reset, or commit your
way out of it.

## Deploying to production (`dev → main`)

This merge ships to real users. It is not an agent decision.

When asked to deploy or merge to `main`, respond:

> "Merging `dev → main` deploys to production. This needs explicit sign-off. Has that been
> confirmed?"

Do not proceed without a clear yes. If in doubt, refuse and say who needs to be consulted.

## Finishing work

```bash
git push origin feat/your-feature-name
# open PR targeting dev  (ask first)
```

## Conflict prevention

Before opening a PR, sync with the latest `dev`:

```bash
git fetch origin
git rebase origin/dev
```

Resolve conflicts before the PR, not after. A branch older than about two days gets
re-synced before pushing.

## After a merge — branch cleanup

Only `main` and `dev` survive.

```bash
git checkout dev
git branch -d feat/your-feature-name
git fetch --prune
# if the remote branch was not auto-deleted:
git push origin --delete feat/your-feature-name
```

## Commits

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- Subject describes the change, not the file touched.
- No emojis. Body only when the "why" is not obvious from the subject.
- Never commit secrets, `.env` values, dumps, or generated artifacts.

## PR checklist

- [ ] Targets `dev`, not `main`
- [ ] Up to date with the latest `dev`
- [ ] Title describes the change
- [ ] No secrets or `.env` values in the diff
- [ ] Quality gates from `50-qa-testing.md` all pass
- [ ] Affected `docs/` renewed
