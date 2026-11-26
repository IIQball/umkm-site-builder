import { env } from 'cloudflare:workers';

export function getAuthSecret(): string | undefined {
  return (env as unknown as Record<string, string | undefined>).BETTER_AUTH_SECRET;
}
