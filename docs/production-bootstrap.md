# First production release

## Prepare the database

1. Once the reviewed release reaches upstream `main`, use **Sync fork → Update branch** in the production fork. Use `main` as the fork's default branch and enable Actions if prompted. [GitHub fork sync](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/syncing-a-fork)
2. In the new Neon project, create or select an empty database on the production branch. In **Connect**, choose that database and a migration role with schema creation permissions. Turn **Connection pooling** off and copy the direct PostgreSQL URL. [Neon connection options](https://neon.com/docs/connect/connection-pooling)
3. In the production fork, create `production-bootstrap` under **Settings → Environments** and restrict it to the `main` branch. Add these **environment secrets**. Public forks can use environment secrets on GitHub Free. [GitHub environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)

   | Secret | Value |
   | --- | --- |
   | `BOOTSTRAP_DATABASE_URL` | The direct Neon URL from step 2 |
   | `BOOTSTRAP_SUPERADMIN_NAME` | The initial superadmin's display name |
   | `BOOTSTRAP_SUPERADMIN_EMAIL` | The email address used to sign in |
   | `BOOTSTRAP_SUPERADMIN_PASSWORD` | A new password for the initial superadmin |

4. In the fork, open **Actions → Bootstrap production database → Run workflow**, select `main`, and start the run. GitHub runs `bun --no-env-file run db:bootstrap` on its hosted runner. Confirm the run succeeds before enabling production deployment. [Manually run a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)
5. Remove the four one-time environment secrets from `production-bootstrap` after the successful run.

The command applies the checked-in Drizzle migration journal. It then creates the first superadmin, the business and template categories, and the universal template together in one seed transaction. The same credentials can safely retry an interrupted setup. A repeat with matching credentials preserves seeded data. An existing database with a different account needs its normal admin and migration procedures.

The deployment workflow runs `bun run build` using its own settings. Later schema upgrades use the reviewed migration procedure before deploying the matching app release.

## Deploy from the production fork

The standard GitHub-hosted Linux runner is free for the public fork. The deployed app still uses the production Cloudflare account's Workers Free allowance, including 100,000 requests per account per day. [GitHub Actions billing](https://docs.github.com/en/actions/concepts/billing-and-usage) · [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)

1. In the production Cloudflare account, select the Worker that will serve production traffic. If you need a new Worker, create `umkm-web-builder` using the dashboard's Hello World template. Use that Worker's **Settings → Variables and Secrets** to enter the runtime settings from the [environment template](../.env.example). Set `DATABASE_URL` to the initialized database with the app's credentials, set the production auth URL and secret, and configure the [Turnstile widget and bindings](turnstile-gate.md). Wrangler preserves dashboard settings across deploys with `keep_vars: true`, so enter production values directly in the dashboard. Set up the intended hostnames through the Worker dashboard when ready to serve traffic. Leave the Worker disconnected from Workers Builds so GitHub Actions is the only deploy trigger. [Create a Worker](https://developers.cloudflare.com/learning-paths/workers/get-started/first-worker/) · [Workers routes and domains](https://developers.cloudflare.com/workers/configuration/routing/)
2. In the production Cloudflare account, create an account API token with the `Editor` role scoped to that Worker. In the production GitHub fork, go to **Settings → Secrets and variables → Actions**. Add the token as the `CLOUDFLARE_API_TOKEN` repository secret and the production account ID as the `CLOUDFLARE_ACCOUNT_ID` repository secret. GitHub Actions uses these credentials to deploy directly. For a Worker with a different name, add the repository variable `CLOUDFLARE_WORKER_NAME` with its exact name. For example, `pinoka.pinokaofficial.workers.dev` uses the Worker name `pinoka`. With no override, deployment uses `umkm-web-builder` from the Wrangler config. Optionally add `PUBLIC_CONTACT_EMAIL` and `PUBLIC_CONTACT_WA` as repository variables for Astro's public landing-page contact fields. [Workers permissions](https://developers.cloudflare.com/workers/authorization/workers/) · [Cloudflare GitHub Actions setup](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
3. After the database workflow succeeds and the Worker bindings are configured, add the repository variable `PRODUCTION_DEPLOY_ENABLED` with the value `true` in the fork. Go to **Actions → Deploy production Worker → Run workflow**, select `main`, and start the first deploy.
4. Check the Actions run for its commit and Worker version ID. In Cloudflare, open the Worker's **Deployments** tab and confirm the active version matches. The deployment message also contains the Git commit SHA. Verify Turnstile on the production hostname and sign in with the initial superadmin.

Promote changes through `cleanup/` → `dev` → upstream `main`. For each release, sync the production fork's `main`. A push to the enabled fork's `main` triggers the deployment workflow. If no run appears after syncing, dispatch it manually on the fork's `main`.
