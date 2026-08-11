# Rules — UI and UX

Detail behind `AGENTS.md` §6. This file is the **portable** version of the design
guidance: Claude Code users may also invoke the `frontend-design` skill, but that skill
does not exist on Antigravity or other agents, so this file is the source of truth.

## 1. Order and priority

- Frontend before backend before integration.
- Mobile-first. Design and build the small screen, then add tablet and desktop. Never
  design desktop-first and shrink.
- Every screen needs its states designed, not just the happy one: loading, empty, error,
  partial, permission-denied, and long-content overflow.

## 2. Use the component library — do not hand-roll

- **Read `docs/memory/ui-inventory.md` before building any UI.** It lists which daisyUI
  components are already in use and where.
- Never hand-roll what daisyUI provides: buttons, cards, modals, drawers, tabs, alerts,
  toasts, badges, inputs, selects, tables, skeletons, pagination.
- Confirm unfamiliar markup against current daisyUI docs via context7 before use. Major
  versions change component markup and default styling.
- After using a component for the first time, add a row to `ui-inventory.md`.
- Only add a custom class when daisyUI genuinely has no equivalent — and record it in
  `docs/memory/css-vars.md` with the reason.

## 3. Tokens — never a raw value

- **Never write a raw color.** Colors come from theme tokens or declared CSS variables.
- Same for font families, font sizes, radii, and shadows.
- Every variable and custom class is tracked in `docs/memory/css-vars.md`, with where it
  is defined and where it is used. That file is what makes a theme change safe instead of
  a repo-wide guess.
- Support light and dark if the theme declares both. Do not hardcode one.

## 4. Spacing — one scale, applied consistently

- One scale, 4px multiples: `2`=8, `4`=16, `6`=24, `8`=32. Use `3`=12 and `10`=40 only
  when genuinely needed.
- **The same relationship gets the same value everywhere.** Heading to body, section to
  next section, icon to label, card grid gutters — pick a value per relationship once and
  reuse it.
- No arbitrary one-offs. Mixing `mt-3` and `mt-4` for the same relationship in two
  components is the exact drift this rule exists to stop.

## 5. Typography

- Two families at most: one for display/body, one for UI/mono. More reads as unfinished.
- A restrained size ramp. Every step must have a job; if two steps look the same, delete
  one.
- Weight and size carry hierarchy — not color alone, and never all-caps everywhere.
- Line length around 60-75 characters for body text. Line height looser for body, tighter
  for headings.
- Left-align body text. Centered paragraphs are for one-line statements only.
- Set an explicit hierarchy per screen: one primary element, then secondary, then tertiary.
  If everything is bold, nothing is.

## 6. Layout and hierarchy

- Alignment beats decoration. Establish a grid and keep to it.
- Related things sit closer together than unrelated things. Proximity is the cheapest
  grouping tool; borders are the most expensive.
- Generous whitespace. Cramped UI reads as low quality faster than any color choice.
- One primary action per screen. Secondary actions get visually quieter treatment.
- Touch targets at least 44x44px on mobile.

## 7. Accessibility (not optional)

- Every interactive element is keyboard reachable, in a sensible tab order, with a visible
  focus state. Never remove focus outlines without replacing them.
- Real semantic elements: `<button>` for actions, `<a>` for navigation, real form labels.
  A clickable `<div>` is a bug.
- Text contrast at least 4.5:1 for body, 3:1 for large text.
- Every image has meaningful `alt`, or empty `alt` if decorative.
- Icon-only controls get an `aria-label`. Watch for wrapper elements that swallow an
  input's accessible name.
- Respect `prefers-reduced-motion`.

## 8. Icons and emojis

- One icon pack, decided at preflight (G2), never a second one.
- Verify SSR usage for the chosen pack before adopting it.
- **No emojis anywhere** — not in UI, code, comments, commits, PRs, or docs.

## 9. Motion

- Motion clarifies state change; it does not decorate. 150-250ms for most transitions.
- Animate `transform` and `opacity`. Avoid animating layout properties.
- Nothing that loops forever in the user's peripheral vision.

## 10. Review loop — mandatory before reporting UI work done

Building the UI is half the job. Review it:

1. Open the changed surface in a **real, visible browser** (per the team's browser setup).
   Headless screenshots miss font loading, layout shift, and console noise.
2. Check at mobile width first, then tablet, then desktop.
3. Capture screenshots and actually look at them: spacing consistent, hierarchy readable,
   nothing overflowing, nothing misaligned.
4. Tab through the whole surface. Focus visible at every stop.
5. Browser console: **0 errors, 0 warnings**. A console warning is a defect.
6. Check every state, not just the loaded one.

Only after that is UI work done. If a screenshot shows a spacing or alignment problem, fix
it before reporting — "it renders" is not the bar.
