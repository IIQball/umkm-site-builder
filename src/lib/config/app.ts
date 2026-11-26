/**
 * Environment configuration
 * All external service URLs and keys configured here
 */

// The Astro adapter supplies runtime environment values without embedding the env object.
import { readRuntimeEnv, validateRuntimeEnv } from './env-validator';

const env = readRuntimeEnv;

export const config = {
  app: {
    name: 'Pinoka',
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
    cloudinaryName: env('CLOUDINARY_NAME') || env('CLOUDINARY_CLOUD_NAME'),
    cloudinaryApiKey: env('CLOUDINARY_API_KEY'),
    cloudinarySecret: env('CLOUDINARY_SECRET') || env('CLOUDINARY_API_SECRET'),
  },

  ai: {
    openaiApiKey: env('OPENAI_API_KEY'),
  },

  // Feature flags
  features: {
    enableAutoSave: false, // MVP: save-on-click only
    enableTemplateVersioning: false, // MVP: single version per template
    enableSubdomainReassignment: false, // MVP: immutable after setup
  },
};

// Surface missing secrets in production as one structured log entry. Deliberately does not
// throw at module evaluation so unrelated routes stay healthy while DB/API boundaries fail safely.
if (config.app.isProd) {
  validateRuntimeEnv({ strict: false, isProd: true });
}

export default config;
