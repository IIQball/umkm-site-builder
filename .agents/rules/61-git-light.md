# Rules — Git (LIGHT mode)

Use this file **only if the human chose light mode** at preflight (G4). Otherwise see
`60-git-strict.md`. Until the human answers, assume strict.

For solo work, prototypes, and small teams without a separate production deployment.
Record the choice in `docs/tech/architecture.md`.

## Branches

```
main          protected. PRs only.
 ├── feat/short-description
 ├── fix/short-description
 └── refactor/short-description
```

Work branches are cut from `main`.

## Never

- Never commit directly to `main`.
- Never `git push --force` to `main`.
- Never skip the PR, however small the change.

## ASK BEFORE ANY GITHUB ACTION

Commit, branch, push, PR create, PR merge, PR comment, review, issue open or close,
release, deploy. Every one of them. Show what you intend to do and wait for a yes.

Lighter process does not mean the agent acts on its own.

## Pre-flight before writing code

```bash
git checkout main
git pull origin main
git status                                  # must be on main, clean, up to date
git checkout -b feat/your-feature-name
```

If `git status` shows you on `main` with uncommitted changes — **stop** and ask.

## Finishing work

```bash
git push origin feat/your-feature-name
# open PR targeting main  (ask first)
```

Sync before opening the PR:

```bash
git fetch origin
git rebase origin/main
```

## After a merge — branch cleanup

Only `main` survives.

```bash
git checkout main
git branch -d feat/your-feature-name
git fetch --prune
# if the remote branch was not auto-deleted:
git push origin --delete feat/your-feature-name
```

## Commits

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- Subject describes the change, not the file touched.
- No emojis. Body only when the "why" is not obvious.
- Never commit secrets, `.env` values, dumps, or generated artifacts.

## PR checklist

- [ ] Up to date with the latest `main`
- [ ] Title describes the change
- [ ] No secrets or `.env` values in the diff
- [ ] Quality gates from `50-qa-testing.md` all pass
- [ ] Affected `docs/` renewed

## When to graduate to strict mode

Move to `60-git-strict.md` once any of these is true: a real production deployment exists,
more than two people commit regularly, or a broken `main` would affect real users.
