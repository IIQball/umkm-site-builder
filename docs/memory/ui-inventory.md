# Memory — UI Component Inventory

Status: LIVE · Rule: use daisyUI components, never hand-roll what it provides
(`../../.agents/rules/30-ui-ux.md` §2).

**Read this before building any UI.** Add a row the first time you use a component.

## 1. Install model

How daisyUI is wired in this project (plugin declaration, themes enabled, whether there is
any per-component install step). Confirm unfamiliar markup against current daisyUI docs
via context7 before use — major versions change markup and defaults.

```css
/* src/styles/... */
```

## 2. Icon pack (G2)

| Package | SSR import path | Sizing convention | Color source |
|---|---|---|---|
| | | | token only |

One pack. Never a second. No emojis as substitutes.

## 3. In use

| Component | Classes | Where |
|---|---|---|
| | | |

## 4. Established patterns

Composite patterns settled once and reused, so three sessions do not produce three
different cards.

| Pattern | Built from | Used by | Notes |
|---|---|---|---|
| page shell | | | |
| form field | | | |
| data table | | | |
| empty state | | | |
| loading state | | | |
| error state | | | |
| confirm dialog | | | |

## 5. Version gotchas

Markup that differs from what a model would assume from training data. Record each one the
first time it bites.

- ...

## 6. Not yet used

Components available but not yet needed. Move a row up to §3 when introduced.

navbar, modal, tabs, table, tooltip, skeleton, stat, drawer, dropdown, menu, pagination,
alert, toast, badge, avatar, breadcrumbs, steps, accordion.
