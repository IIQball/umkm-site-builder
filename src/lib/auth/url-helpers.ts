import { readRuntimeEnv } from '@/lib/config/env-validator';

const DEV_ORIGINS = [
  'http://localhost:4321',
  'http://localhost:4322',
  'http://127.0.0.1:4321',
  'http://127.0.0.1:4322',
];

export function resolveAuthBaseAndOrigins(): { authBaseUrl: string; trustedOrigins: string[] } {
  // Accept bare host to avoid module-load URL parse crash on unprefixed runtime values
  const rawAuthBaseUrl = (readRuntimeEnv('BETTER_AUTH_URL') || 'http://localhost:4321').trim();
  const authBaseUrl = /^https?:\/\//i.test(rawAuthBaseUrl)
    ? rawAuthBaseUrl
    : `https://${rawAuthBaseUrl}`;

  const primaryOrigin = new URL(authBaseUrl).origin;
  const trustedOrigins = [
    ...new Set(import.meta.env?.PROD ? [primaryOrigin] : [primaryOrigin, ...DEV_ORIGINS]),
  ];
  return { authBaseUrl, trustedOrigins };
}

export function resolveResetCallbackUrl(rawUrl: string, isActivation: boolean): string {
  try {
    const parsedUrl = new URL(rawUrl);
    if (parsedUrl.pathname.includes('/api/auth/reset-password/')) {
      const token = parsedUrl.pathname.split('/').pop();
      const callbackURL = parsedUrl.searchParams.get('callbackURL');
      if (callbackURL && token) {
        const cleanUrl = new URL(callbackURL, parsedUrl.origin);
        cleanUrl.searchParams.set('token', token);
        return cleanUrl.toString();
      }
      if (token) {
        const cleanUrl = new URL(
          isActivation ? '/auth/activation' : '/auth/reset-password',
          parsedUrl.origin
        );
        cleanUrl.searchParams.set('token', token);
        return cleanUrl.toString();
      }
    } else if (parsedUrl.pathname === '/reset-password') {
      parsedUrl.pathname = isActivation ? '/auth/activation' : '/auth/reset-password';
      return parsedUrl.toString();
    }
  } catch {
    // preserve original URL if parsing fails
  }
  return rawUrl;
}

