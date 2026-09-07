# Rules — Code Standards

Detail behind `AGENTS.md` §4 and §5.

## 1. Unified response shape

One contract for every API route and server action. Defined once in global `lib`, types in
`src/types/`. Never hand-rolled per route.

```ts
// success
{ ok: true, data: T }
// error
{ ok: false, error: { code: string, message: string } }  // message is safe + generic
```

Error codes are a fixed, documented set (`VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`,
`NOT_FOUND`, `CONFLICT`, `INTERNAL`). Add a code deliberately; document it in
`docs/tech/api-spec.md`.

## 2. Every async has try/catch

No unguarded `await`. Catch, log server-side with full detail, return the unified error
shape. No silent failures, no empty catch blocks, no `catch { }` that swallows.

## 3. Logs

Server logs are for the person debugging at 2am:

- Stable context tag per module, so logs are greppable: `[auth.login]`, `[projects.create]`.
- Include the operation and the real error object or stack.
- Full detail server-side only. Never log secrets, tokens, passwords, or full PII.

## 4. Never leak server detail to the client

The browser gets a generic message plus an error code. Never a stack trace, DB error,
internal message, or secret. Map internal errors to safe client messages; detail stays in
the server log.

## 5. Validation at the boundary

Every input crossing a trust boundary is parsed with a Zod schema before use — request
bodies, query params, route params, form data, webhook payloads, external API responses.

- The Zod schema is the single source of truth for that shape; derive the TypeScript type
  from it rather than declaring the type twice.
- Invalid input returns `VALIDATION_ERROR`, never a 500.
- Validation is not authorization. Do both.

## 6. Types

- Types and interfaces live in **`src/types/`**, grouped by feature scope.
- **Never** declare a type or interface inside a page, component, or lib file.
- Exception: a short props/params type used only by that one file, and derived or
  anonymous types in a return signature (`Awaited<ReturnType<typeof x>>`).
- No `any`. If a type is genuinely unknown, use `unknown` and narrow it.

## 7. Structure

```
src/
  components/{public,admin,shared}/   feature-scoped, never one flat dump
  lib/{feature}/                      same split
  services/                           external integrations
  types/{feature}/                    all types and interfaces
```

- Global and reusable only: `lib`, `util`, `services`, components, types.
- Shared or cross-feature code goes in a `shared` scope. Feature-only code stays under its
  feature folder.
- One purpose per file. Many small files beat one big file.
- Pages and components stay under 300 LOC. Approaching it is the signal to extract
  sub-components and move logic to `lib/`.
- No duplication. Extract a shared unit before copy-pasting.

## 8. UI feedback

Action-level outcomes (saved, failed, deleted) go to a **toaster**, not a conditionally
rendered inline `div`. Field-level validation messages stay next to their field.

## 9. Comments

Comment why, not what. No commented-out code left behind. No emojis in comments, code, or terminal console logs. Match the density and
idiom of the surrounding file.

## 10. Canonical Shared Helpers & SSOT

Formatting and common platform integration functions must strictly use Single Source of Truth (SSOT) modules:

- **Currency (`formatIDR`)**: Always import `formatIDR` from `@/lib/currency` (or `formatCurrencyInput` / `parseCurrencyInput`). Never write inline `Intl.NumberFormat('id-ID')` or `value.toLocaleString('id-ID')` in components or pages.
- **Date Formatting (`formatDate`)**: Always import `formatDate` from `@/lib/utils/format`. Never call `new Date().toLocaleDateString('id-ID')` or `new Intl.DateTimeFormat('id-ID')` directly inside UI templates.
- **WhatsApp Integration**: Always import `normalizeWhatsAppNumber`, `buildWhatsAppUrl`, or `generateWhatsAppLink` from `@/lib/whatsapp`. Never write custom regex or manual phone prefix replacements (`08...`, `8...`, `+62...`) in section helpers or components.
- **Primary Color Fallback**: The fallback color for `--theme-primary` must always be `#2563eb` (`var(--theme-primary, #2563eb)`). Never use arbitrary fallbacks like `#4f00ff`.

## 11. Enforcement

These are part of the definition of done. A change that adds an unguarded async, leaks
server detail, hand-rolls a response shape, declares a shared type inline, or copy-pastes
logic already in `lib` is not done, however green the tests are.
