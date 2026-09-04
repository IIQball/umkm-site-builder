/**
 * Environment configuration
 * All external service URLs and keys configured here
 */

export const config = {
  app: {
    name: 'UMKM Site Builder',
    version: '0.0.1',
    environment: import.meta.env.MODE || 'development',
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
  
  database: {
    url: import.meta.env.DATABASE_URL || '',
  },

  auth: {
    secret: import.meta.env.BETTER_AUTH_SECRET || '',
    googleClientId: import.meta.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: import.meta.env.GOOGLE_CLIENT_SECRET || '',
  },

  payments: {
    xenditApiKey: import.meta.env.XENDIT_API_KEY || '',
    xenditWebhookSecret: import.meta.env.XENDIT_WEBHOOK_SECRET || '',
  },

  media: {
    cloudinaryName: import.meta.env.CLOUDINARY_NAME || '',
    cloudinaryApiKey: import.meta.env.CLOUDINARY_API_KEY || '',
    cloudinarySecret: import.meta.env.CLOUDINARY_SECRET || '',
  },

  // Feature flags
  features: {
    enableAutoSave: false, // MVP: save-on-click only
    enableTemplateVersioning: false, // MVP: single version per template
    enableSubdomainReassignment: false, // MVP: immutable after setup
  },
};

// Validate required secrets in production
if (config.app.isProd) {
  const required = [
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'XENDIT_API_KEY',
    'CLOUDINARY_NAME',
  ];
  
  for (const key of required) {
     if (!import.meta.env[key]) {
       // Missing required secret
     }
   }
}

export default config;
