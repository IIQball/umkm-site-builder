# Setup — install this before your first session

One-time per machine. Do it before you run the kickoff workflow, not during.

If you already have Node and nothing else, the short version is:

```bash
npm install -g bun
bun --version
```

That is the whole gap for most people. The rest of this file is the detail, the Windows
and WSL traps, and how to check you got it right.

---

## 1. What this project actually needs

| Tool | Why | Needed by |
|---|---|---|
| **Bun** | runtime and package manager. Not optional — `bun` replaces `npm`/`node` for running and installing | everyone |
| **Git** | version control | everyone |
| **GitHub CLI** (`gh`) | this repo is private; `gh` is the least painful way to authenticate and to open PRs | everyone |
| **VS Code** (or your editor) | where you work | everyone |
| **A Cloudflare account** | deploying the app. Free tier is enough | whoever deploys |
| **Agent skills** | context7, ponytail, caveman, clean-code | everyone — see `.agents/skills/README.md` |

Node.js is not required once Bun is installed — Bun is the runtime. Keeping Node around is
harmless and useful (it is the easiest way to install Bun), but nothing in this project
depends on it.

The stack itself is **locked** and documented in `AGENTS.md` §3 and
`.agents/rules/00-stack.md`: Cloudflare, Astro, Svelte, Vite, Bun, Drizzle, daisyUI,
Vitest, Zod, BetterAuth. Database and media storage are the two decisions still open, and
the agent picks them at kickoff from the PRD. You do not install any of these by hand —
they arrive as project dependencies once the first build slice exists.

## 2. Install Bun

Pick the one line that matches where your code lives. Verified against
https://bun.sh/docs/installation.

**Already have Node (most of you) — any OS:**

```bash
npm install -g bun
```

**macOS / Linux / inside WSL:**

```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows, native (PowerShell):**

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Windows with Scoop: `scoop install bun`.

Then verify — in a **new** terminal, because the installer edits your PATH and your current
shell has not reloaded it:

```bash
bun --version
```

If that prints a version, you are done. To update later: `bun upgrade`.

## 3. Windows and WSL — read this one, it bites people

Bun must be installed **on the same side as the code**. Pick one and stay there.

| Your repo lives in | Install Bun with | Run commands from |
|---|---|---|
| WSL (`/home/you/...`) | `curl -fsSL https://bun.sh/install \| bash`, **inside WSL** | the WSL terminal |
| Windows (`C:\Users\you\...`) | the PowerShell one-liner | PowerShell or Windows Terminal |

**Do not mix.** Running Windows `bun.exe` against a repo inside WSL, or the reverse, will
appear to work and then fail in confusing ways: `node_modules` contains
platform-specific binaries, so one side installs artifacts the other cannot execute.
Symptoms are "module not found" for a package you can see on disk, or a native binding
that refuses to load.

Two more Windows notes:

- If the PowerShell installer is blocked by execution policy, use the npm method instead
  (`npm install -g bun`). Do not globally lower your execution policy for this.
- Keep the repo out of a OneDrive-synced folder. File locking during installs causes
  intermittent, unexplainable failures.

## 4. Git and GitHub

```bash
git --version
gh --version
gh auth login
```

This repo is **private**, so an unauthenticated `git clone` will fail with a confusing
"repository not found" rather than a permission error. `gh auth login` sets up the
credential helper and fixes both cloning and PR commands in one step.

Ask the repo owner for access first if `gh repo view IIQball/umkm-site-builder` returns
not-found.

## 5. Editor

Install the **Svelte for VS Code** extension — the project is Astro plus Svelte, and
without it you get no type checking or formatting in `.svelte` files.

If you work in WSL, install the **WSL** extension and open the folder with `code .` from
inside WSL, so the editor's tooling runs on the same side as your code (see §3).

## 6. Cloudflare — only when you deploy

You do not need this to write code. When it is time to deploy:

- A Cloudflare account (free tier is enough for this project).
- `wrangler`, which comes in as a project dependency — do not install it globally.
- `bunx wrangler login` to authenticate.

## 7. Agent skills

Separate install, separate file: **`.agents/skills/README.md`**. It covers context7,
ponytail, caveman, and clean-code, with per-tool instructions.

Do not skip this. `AGENTS.md` is written assuming those are present, and context7 in
particular is what stops your agent from writing code against a library API it half
remembers.

## 8. Verify everything at once

```bash
bun --version
git --version
gh --version
gh repo view IIQball/umkm-site-builder --json name
```

All four should print something. Then, in a fresh agent session, paste:

```
Confirm you have read AGENTS.md, then tell me this project's locked stack and which two
choices are still undecided.
```

It should name the locked list and say the database (G1) and media storage (G7) are
decided at kickoff. If it starts suggesting Next.js or Prisma, it has not read the file —
make it read `AGENTS.md` before you let it write anything.

## 9. There is nothing to install yet

`bun install` will fail right now, and that is correct: this repo is **pre-kickoff**. It
ships markdown only — no `package.json`, no lockfile, no dependencies. That is deliberate,
so the scaffold does not go stale every time Astro or Bun bumps a version.

The dependency tree gets created by the first build slice, after the kickoff workflow turns
`PRD.md` into `docs/`. Until then, the only thing to set up is your machine.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `bun: command not found` right after installing | PATH not reloaded | open a new terminal |
| `bun: command not found` only in VS Code's terminal | VS Code inherited the old environment | fully restart VS Code, not just the terminal panel |
| Module not found for a package you can see in `node_modules` | Windows/WSL mixing | delete `node_modules`, reinstall from the correct side (§3) |
| `repository not found` on clone | private repo, not authenticated | `gh auth login`, then confirm you have been granted access |
| PowerShell blocks the install script | execution policy | use `npm install -g bun` instead |
