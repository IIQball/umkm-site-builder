import { handle } from '@astrojs/cloudflare/handler';
import { gate, TurnstileChallenge } from './turnstile-gate';

export { TurnstileChallenge };
export default {
  fetch(request: Request, env: Parameters<typeof gate>[1], context: Parameters<typeof handle>[2]) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (import.meta.env.DEV && (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.hostname.endsWith('.localhost')) && !env.TURNSTILE_SITE_KEY && !env.TURNSTILE_SECRET_KEY) return handle(request, env, context);
    if (request.method === 'POST' && ['/__astro_static_paths', '/__astro_prerender', '/__astro_static_images', '/__astro_image_transform'].includes(path)) return handle(request, env, context);
    return gate(request, env, next => handle(next, env, context));
  },
};
