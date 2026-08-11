# Memory — CSS Variables and Custom Classes

Status: LIVE · Rule: never use a color, font, radius, or shadow without a variable
(`../../.agents/rules/30-ui-ux.md` §3).

Every variable and every hand-written class is listed here **with where it is used**. That
is what makes a theme change a traceable edit instead of a repo-wide guess.

## 1. Theme tokens

How the daisyUI theme is declared, and which themes exist (light, dark, custom).

```css
/* src/styles/... */
```

If a custom theme overrides a token, list every overridden token here.

| Token | Overridden to | Why |
|---|---|---|

## 2. Typography variables

| Variable | Defined in | Purpose |
|---|---|---|
| `--font-...` | | display / body |
| `--font-...` | | UI / mono |

Two families maximum. Record how they are loaded and why (self-hosted vs CDN, and the
layout-shift consequence).

## 3. Spacing scale in use

One scale, 4px multiples. Record the value chosen per relationship so it stays consistent:

| Relationship | Value |
|---|---|
| heading to body | |
| section to next section | |
| icon to label | |
| card grid gutter | |
| page padding (mobile / desktop) | |

## 4. Local variables

| Variable | Defined in | Purpose | Used by |
|---|---|---|---|

## 5. Base-layer overrides

Systematic restyles of a library component (not new classes). Each needs a reason.

| Selector | Change | Reason |
|---|---|---|

## 6. Custom classes

Only where daisyUI genuinely has no equivalent. Each row needs a reason — an unjustified
row is a hand-rolled component in disguise.

| Class | Defined in | Used by | Why not daisyUI |
|---|---|---|---|

## 7. Open

Unresolved design decisions: brand palette, logo, dark-mode treatment, anything still a
placeholder.

- ...
