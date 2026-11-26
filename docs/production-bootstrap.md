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

## Deploy from the production fork

The standard GitHub-hosted Linux runner is free for the public fork. The deployed app still uses the production Cloudflare account's Workers Free allowance, including 100,000 requests per account per day. [GitHub Actions billing](https://docs.github.com/en/actions/concepts/billing-and-usage) · [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)

1. In the production Cloudflare account, create a Worker named `umkm-web-builder` using the dashboard's Hello World template. Use **Settings → Variables and Secrets** to enter the runtime settings from the [environment template](../.env.example). Set `DATABASE_URL` to the initialized database with the app's credentials, set the production auth URL and secret, and configure the [Turnstile widget and bindings](turnstile-gate.md). Set up the intended hostnames through the Worker dashboard when ready to serve traffic. Use GitHub Actions as the only deploy trigger by leaving the Worker disconnected from Workers Builds. [Create a Worker](https://developers.cloudflare.com/learning-paths/workers/get-started/first-worker/) · [Workers routes and domains](https://developers.cloudflare.com/workers/configuration/routing/)
2. In the production Cloudflare account, create an account API token with the `Editor` role scoped to `umkm-web-builder`. In the production GitHub fork, go to **Settings → Secrets and variables → Actions** and add the token as the `CLOUDFLARE_API_TOKEN` repository secret. Add the new Cloudflare account ID as the `CLOUDFLARE_ACCOUNT_ID` repository secret. Optionally add `PUBLIC_CONTACT_EMAIL` and `PUBLIC_CONTACT_WA` as repository variables for Astro's public landing-page contact fields. [Workers permissions](https://developers.cloudflare.com/workers/authorization/workers/) · [Cloudflare GitHub Actions setup](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
3. Once the reviewed release reaches upstream `main`, use **Sync fork → Update branch** in the production fork. Enable Actions in the fork if GitHub prompts you. After database and bindings setup is complete, add the repository variable `PRODUCTION_DEPLOY_ENABLED` with the value `true` in the fork. Go to **Actions → Deploy production Worker → Run workflow**, select `main`, and start the first deploy. [GitHub fork sync](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/syncing-a-fork)
4. Check the Actions run for its commit and Worker version ID. In Cloudflare, open the Worker's **Deployments** tab and confirm the active version matches. The deployment message also contains the Git commit SHA. Verify Turnstile on the production hostname and sign in with the initial superadmin.

Promote changes through `cleanup/` → `dev` → upstream `main`. For each release, sync the production fork's `main`. A push to the enabled fork's `main` triggers the deployment workflow. If no run appears after syncing, dispatch it manually on the fork's `main`.
