/**
 * Environment configuration
 * All external service URLs and keys configured here
 */

// `import.meta.env.FOO` is inlined by Vite as a string literal at build time, so a value
// supplied only at runtime (a Cloudflare Worker secret) never reaches it. Reading a bare
// `import.meta.env` gives the whole build-time object, which we fall back to for `astro dev`
// and for tests, where .env files are loaded into it and `process.env` is empty.
//
// `process.env` is checked first because it is the only source that can change without a
// rebuild: on Workers it is populated from vars and secrets by `nodejs_compat`. Same order
// as lib/auth.ts and lib/cloudinary.ts.
const buildTimeEnv = import.meta.env as unknown as Record<string, string | undefined>;

function env(key: string): string {
  const runtime = typeof process !== 'undefined' ? process.env?.[key] : undefined;
  return runtime || buildTimeEnv?.[key] || '';
}

export const config = {
  app: {
    name: 'UMKM Site Builder',
    version: '0.0.1',
    environment: import.meta.env.MODE || 'development',
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
  
  database: {
    url: env('DATABASE_URL'),
  },

  auth: {
    secret: env('BETTER_AUTH_SECRET'),
    googleClientId: env('GOOGLE_CLIENT_ID'),
    googleClientSecret: env('GOOGLE_CLIENT_SECRET'),
  },

  payments: {
    xenditApiKey: env('XENDIT_API_KEY') || env('XENDIT_SECRET_KEY'),
    xenditWebhookSecret: env('XENDIT_WEBHOOK_SECRET'),
  },

  email: {
    host: env('SMTP_HOST'),
    port: Number(env('SMTP_PORT')) || 465,
    user: env('SMTP_USER'),
    pass: env('SMTP_PASS'),
  },

  media: {
    cloudinaryName: env('CLOUDINARY_NAME'),
    cloudinaryApiKey: env('CLOUDINARY_API_KEY'),
    cloudinarySecret: env('CLOUDINARY_SECRET'),
  },

  // Feature flags
  features: {
    enableAutoSave: false, // MVP: save-on-click only
    enableTemplateVersioning: false, // MVP: single version per template
    enableSubdomainReassignment: false, // MVP: immutable after setup
  },
};

// Surface missing secrets in production as one log line. Deliberately does not throw:
// this module is imported at the top of the request path, so throwing here takes the whole
// Worker down with an empty 500 instead of failing the one route that needed the value.
if (config.app.isProd) {
  const missing = [
    ['DATABASE_URL', config.database.url],
    ['BETTER_AUTH_SECRET', config.auth.secret],
    ['XENDIT_API_KEY', config.payments.xenditApiKey],
    ['CLOUDINARY_NAME', config.media.cloudinaryName],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(`[config] missing required environment variables: ${missing.join(', ')}`);
  }
}

export default config;
