declare module 'cloudflare:workers' {
  export const env: Record<string, unknown>;
}

declare class HTMLRewriter {
  on(selector: string, handlers: { element(element: { append(content: string, options: { html: boolean }): void }): void }): HTMLRewriter;
  transform(response: Response): Response;
}
