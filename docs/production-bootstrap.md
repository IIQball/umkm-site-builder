# First production release

## Prepare the database

Use the release you intend to deploy. Install its dependencies with `bun install --frozen-lockfile`. This command requires Bun 1.4 or newer.

1. In the new Neon project, create or select an empty database on the production branch. In **Connect**, choose that database and a migration role with schema creation permissions. Turn **Connection pooling** off and copy the direct PostgreSQL URL. [Neon connection options](https://neon.com/docs/connect/connection-pooling)
2. From the repository root in Bash, run the block below. Enter the direct URL and a new password for the first superadmin at the prompts. The URL and password inputs are hidden, and the exported variables expire when the block exits.

```bash
(
  set -e
  read -rs -p 'Direct Neon URL: ' BOOTSTRAP_DATABASE_URL
  printf '\n'
  read -r -p 'Superadmin name: ' BOOTSTRAP_SUPERADMIN_NAME
  read -r -p 'Superadmin email: ' BOOTSTRAP_SUPERADMIN_EMAIL
  read -rs -p 'Superadmin password: ' BOOTSTRAP_SUPERADMIN_PASSWORD
  printf '\n'
  export BOOTSTRAP_DATABASE_URL BOOTSTRAP_SUPERADMIN_NAME
  export BOOTSTRAP_SUPERADMIN_EMAIL BOOTSTRAP_SUPERADMIN_PASSWORD
  bun --no-env-file run db:bootstrap
)
```

The command applies the checked-in Drizzle migration journal. It then creates the first superadmin, the business and template categories, and the universal template together in one seed transaction. The same credentials can safely retry an interrupted setup. A repeat with matching credentials preserves seeded data. An existing database with a different account needs its normal admin and migration procedures.

The build command remains `bun run build`. Keep the `BOOTSTRAP_*` values scoped to the setup process. Later schema upgrades use the reviewed migration procedure before deploying the matching app release.

## Launch the Worker

1. Configure the new account's Worker variables and secrets using the [environment template](../.env.example). Set the Worker runtime `DATABASE_URL` for the same initialized database, with the appropriate app credentials. Set the production auth URL and secret and configure the [Turnstile widget and hostnames](turnstile-gate.md). Configure build-time public values separately where required.
2. For the fork setup, connect the new GitHub account's fork to the Worker named `umkm-web-builder`. In **Settings → Build → Branch control**, select `main` as the production branch. Complete database and binding setup before enabling production builds. [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) · [Build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
3. Use **Sync fork → Update branch** on the fork when a reviewed upstream release reaches `main`. A push that advances the connected fork's `main` triggers the configured build and deployment. Check the build result, verify Turnstile on the production hostname, and sign in with the initial superadmin. [GitHub fork sync](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/syncing-a-fork)
