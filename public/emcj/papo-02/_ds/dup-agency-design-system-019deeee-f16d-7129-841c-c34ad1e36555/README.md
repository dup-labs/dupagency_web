# dup.agency Design System

A boutique technology agency for e-commerce. Specialists in VTEX, Shopify and Nuvemshop. Founded 2021 by Bruno Dup and Larissa Carvalho. Two seniors, no employees, intentionally limited agenda (max 12 simultaneous clients). Digital nomads — they live in different countries on rotation. **All content is in Brazilian Portuguese.**

This design system mirrors the production site at `dup-labs/dupagency_web` (Next.js 15 + Tailwind v4 + GSAP).

## Sources

- **Codebase:** `github.com/dup-labs/dupagency_web` (default branch `main`) — Next.js / Tailwind v4 / GSAP / Phosphor Icons
- **Figma — Design System:** `5lab3dt5A80bprpQ3ZyQQA`
- **Figma — Site:** `qHWzIM2Uf43tOrWFgbDYEM` (Home node `2009:30`)
- **Tokens of record:** `src/app/tokens.css` (mirrored here as `colors_and_type.css`)
- **Live site copy reference:** `public/llms.txt`

Note: a reader may not have access to the Figma files. The codebase + the mirrored `tokens.css` are the single source of truth for everything in this folder.

## Index

| File | Purpose |
|---|---|
| `colors_and_type.css` | All color, type, spacing, radii, shadow tokens + semantic type classes + gradient utilities |
| `fonts/` | Chillax (display) + Synonym (body) — variable + static weights |
| `assets/` | Logos, partner SVGs, founder photos, dup icon |
| `preview/` | Cards rendered in the Design System tab — type, color, spacing, components, brand |
| `ui_kits/site/` | Marketing site UI kit — Hero, Nav, Parceiros, Servicos, CTAFinal, Footer |
| `SKILL.md` | Cross-compatible skill manifest |

## Brand Pillars

Three colors carry the brand: **teal-mint** (`#AFD7D0`), **purple-mid** (`#897BBC`), **purple-vivid** (`#AD61C2`). The signature treatment is **`grad-site-01`** — a soft 165° linear gradient from teal-mint to purple-mid, used for highlighted words in display headlines and for icon fills (always via the `<PhosphorIcon>` mask wrapper).

## Content fundamentals

**Language:** Brazilian Portuguese — always. Never write in English.

**Voice — "papo de café" (coffee chat).** Casual, direct, positive, zero corporate-speak. Treat the reader like a friend. The agency speaks as "a gente" / "nós", talks to the reader as "você".

**Casing.** Display headlines are usually `text-transform: uppercase` (Chillax bold/semibold). Body copy is normal sentence case. Brand mark is `dup.agency`, lowercased — `dup` in Chillax Light, `.agency` in Chillax Medium, no space.

**Concrete copy patterns** (from the live site):

- *"Clareza e segurança para quem precisa de paz operacional"* — hero
- *"parceiros que confiam"*
- *"porque funciona"*
- *"A agenda é limitada. Mas uma conversa produtiva, é irresistível."* — final CTA, where "conversa produtiva" rotates with "criativa", "estratégica", "leve", "eficiente", "honesta"
- *"sem turnover. sem surpresa."*
- *"A gente entra pra organizar, planejar e executar evoluções com clareza, explicando prós, contras, e riscos antes de qualquer decisão"*
- Section labels are short, lowercase: `MANIFESTO`, `PARCEIROS`, `PROCESSO`, `SERVIÇOS`, `CONTATO`. UPPERCASE in nav, but the headline itself is lowercase.

**Tone rules:**
- Honesty over hype. *"sem surpresa no meio do caminho"*, *"a operação fica com a gente, você cuida do negócio"*.
- Concrete over abstract. Talk about lojas, deploys, agendas, migrações — not "synergies" or "verticals".
- The product they're really selling is **paz** (peace), **clareza** (clarity), **segurança** (security). Lead with the feeling, technical specs follow.
- Self-deprecating confidence. *"A gente mergulha fundo no que tá acontecendo"* — not *"We perform deep discovery"*.

**No emoji.** None. The brand uses Phosphor Icons (always gradient-filled) for any iconography need. Bullets and ornaments are typographic (`—`, `01/02/03`, vertical pipes) or absent.

**No exclamation marks** except in the single CTA button: *"QUERO CONVERSAR!"*. Otherwise, periods.

**Numbering style.** Process / list items are `01`, `02`, `03` — two-digit, with a space or em-dash separator before the title.

## Visual foundations

### Color
- **Brand triad:** teal-mint (`#AFD7D0`), purple-mid (`#897BBC`), purple-vivid (`#AD61C2`).
- **Supporting:** pink-rose (`#B792A8`), teal-light (`#86C8D4`), blue-soft (`#7FABED`).
- **Neutrals:** black `#0D0D0D`, white `#FFFFFF`, plus a `neutral-50→900` scale.
- **No flat brand fills on large surfaces** — when teal/purple appear at scale, they appear as a gradient (`grad-site-01`) or as a single-section background (`#897BBC` for Serviços).
- **Backgrounds rotate per section** via a global `BackgroundLayer` (`position: fixed`, `transition: background-color 600ms ease`): white → black → grad-site-04 → white → purple-mid → black. The Nav detects each section and toggles between black and white text automatically.

### Typography
- **Chillax** for display — bold/semibold, ALL CAPS, used for hero, section titles, card titles. Highlighted words inside a headline use the `text-grad-site-01` clip-path utility.
- **Synonym** for body, labels, UI. Regular for prose, bold for emphasis.
- **Sizes** follow the `--text-*` ramp; in practice `clamp(40px, 6vw, 64px)` for display-2xl; `clamp(36px, 5vw, 48px)` for display-xl on the site.
- **Tracking:** body & display are `0em`. Small UI labels (≤12px) use `0.06em` (caption) or `0.10em` (micro). Letter-spacing tween on hover: list items expand from `0em` → `0.05em` over 300ms.

### Spacing
- Token scale `--space-1`..`--space-24` mapped to a 4px base.
- Section vertical rhythm is large: `py-16` to `py-24` (64–96px) with `min-h-screen` on most sections.
- Inter-element gaps are typically `gap-4`/`gap-6`/`gap-8`. Cards use `padding: 28–40px`.

### Backgrounds
- **Section colors are global**, not per-section. Sections themselves never set their own `background`; they sit `position: relative; z-index: 1` above the fixed `BackgroundLayer`.
- **Decorative grids:** Hero, ComoTrabalhamos, CTAFinal, Depoimentos all carry a faint vertical grid (12 columns desktop, 6 mobile) using `rgba(0,0,0,0.05)` on light surfaces or `rgba(255,255,255,0.06)` on dark.
- No raster background images. No noise texture except inside `card-work` (an SVG fractalNoise overlay at `opacity: 0.25`, `mix-blend-mode: overlay`).
- Photography (founder portraits, partner site screenshots) is muted: `mix-blend-mode: luminosity` + `opacity: 0.4` for hero client logos; `0.5` opacity for grid photos. Color is restored on hover.

### Animation
- **GSAP + ScrollTrigger** drives almost every section.
- **Easing:** `power2.out` for entrances, `power2.in` for exits, `back.out(2)` for the rotating CTA word, `none` for scrub timelines, `cubic-bezier(0.32, 0.72, 0, 1)` for bottom sheets.
- **Durations:** 200ms (hover), 300–400ms (small state changes, sheets), 600ms (background color cross-fade), 800ms (entrance fades).
- **Patterns:** scrub-driven manifesto opacity + Y, pin-and-zoom card stack (Como Trabalhamos), bidirectional scrub marquee (Servicos), letter-spacing tween on hover, staggered fade-up on items (`stagger: 0.2`).
- Text reveals fade from `opacity: 0; y: 40` to `opacity: 1; y: 0` on `start: 'top 80%'`.

### Hover & press states
- **Hover:** opacity step-up (`0.4` → `1`), letter-spacing widening on display links (`0em` → `0.05em`), grayscale removal (`grayscale` → `grayscale-0`), gradient text remains gradient. Buttons invert: `border-white text-white` → `bg-white text-black`.
- **Press:** no shrink/scale convention. Color inversion only.
- **Cursor:** custom cursor (`CustomCursor.tsx`) replaces system cursor on `(hover: hover)` devices. The cursor itself shrinks when over hoverable list items.

### Borders, radii, shadows
- **Radii:** `--radius-sm 4 / md 8 / lg 12 / xl 16 / pill 9999`. Cards are `xl` (16px). Pills are buttons and badges. Sharp corners (no radius) are reserved for full-bleed sections and grid lines.
- **Borders:** hairlines, almost always at `0.5px–1px`, with very low alpha — `rgba(255,255,255,0.07)` between dark cards, `rgba(255,255,255,0.10)` for nav menu items, `rgba(0,0,0,0.08)` for testimonial cards on light. Solid `--neutral-800` (`#3D3D3D`) for the partners list dividers on black.
- **Shadows:** four steps (`sm`, `md`, `lg`, `brand`). `--shadow-brand` (`0 4px 24px rgba(137,123,188,0.25)`) is the only colored shadow — used for purple-tinted floating elements. Most cards rely on a translucent background + subtle dark border instead of shadow.

### Transparency & blur
- Glass surfaces are everywhere: `glass-dark` (10% white, 20% white border), `glass-light` (55% white, 70% white border), `glass-card-dark` (75% black, 12px blur). Nav menu overlay uses `rgba(13,13,13,0.7)` + `blur(12px)`.
- Backdrop-filter is sometimes applied inline `style={}` to dodge a Tailwind v4 cascade quirk noted in `globals.css`.

### Imagery vibe
- **Cool & humid.** Founder photos are slightly desaturated; partner brand colors are kept but the photos themselves never carry warm-orange grading.
- No illustrations, no 3D renders, no AI imagery. Photographic and brand-mark assets only.

### Fixed/sticky behavior
- `Nav` is fixed top, `z-index: 50`, color-aware via context.
- `BackgroundLayer` is fixed full-screen, `z-index: 0`.
- `ComoTrabalhamos` pins via `ScrollTrigger.pin: true` while a 4-card stack zooms in.
- `Servicos` mobile uses a tall wrapper + sticky inner — explicitly avoiding pin-conflict with the global ScrollTrigger.

### Layout rules
- 12-col grid, 24px gutter, 64px outer margin (`--grid-*`). Max width `90rem` / 1440px.
- Mobile breakpoint at `768px`. Desktop nav (lg ≥ 1024px) becomes a side ScrollspyNav; mobile uses a hamburger overlay.

## Iconography

**System:** [Phosphor Icons React 2.1](https://phosphoricons.com), regular weight by default, duotone for emphasis moments. There is **no custom icon font**.

**Mandatory wrapper.** Every Phosphor icon is rendered through `<PhosphorIcon icon={X} size={N} weight="regular|duotone|..." />`, which masks the icon onto a `<linearGradient>` of `--teal-mint` → `--purple-mid` (the `grad-01` gradient). **Never set a `color` or `currentColor` prop on Phosphor icons** — the gradient fill is the brand. See `assets/PhosphorIcon.tsx` (mirrored from `src/components/ui/PhosphorIcon.tsx`).

**Service-marker icons.** The four Servicos cards use bespoke concentric-circle SVGs (Blueprint = 1 circle, Consultoria = 2, Projeto = 3, Evolução = 4). White stroke at 4px on dark cards. These are the only hand-rolled icons.

**Logos & partner marks.** Always SVG when available (`assets/partners/*.svg`), fallback to PNG/WebP. Client home-strip uses small PNGs at 40% opacity + grayscale, color restored on hover.

**Emoji and unicode glyphs.** Not used as icons. Em-dashes (`—`) and pipes (`|`) appear as typographic dividers; that's it.

**On substitution.** If using this skill in an artifact context where the Phosphor React lib isn't available, link Phosphor's CDN SVG sprite (`https://unpkg.com/@phosphor-icons/web/src/regular/style.css`) and apply the gradient via SVG `<mask>` matching the wrapper's behavior.

## Asset substitutions / flags

- **Fonts:** ✅ Chillax + Synonym uploaded by user; both variable and static weights present in `fonts/`. No substitution needed.
- **Phosphor Icons:** loaded from CDN in artifacts (no React npm install).
- **Founder portraits:** only 4 of the 8 photos (front + mid for Dup and Lari) imported into `assets/about-us/` — sufficient for the GlitchGrid mock; pull the remaining `-floor`/`-side` variants from the repo if needed.
- **Client logos:** 5 of ~13 partner SVGs imported. Add more from `dup-labs/dupagency_web/public/images/partners/` as projects require.
