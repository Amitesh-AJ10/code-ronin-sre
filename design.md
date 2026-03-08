[2 tools called]

Here’s a `Design.md` you can drop into a new project and follow.

---

## Design.md

### 1. Visual Identity

- **Theme**: Cyberpunk debug dojo (dark, neon, glassy, glitchy).
- **Base Background**: `#050505` (near‑black).
- **Primary Accent**: `#00F3FF` (neon cyan) – primary CTAs, borders, key highlights.
- **Error / Danger**: `#FF003C` (glitch red) – sabotage alerts, errors, high‑threat states.
- **Threat Levels (Difficulty Colors)**
  - **Syntax / Low**: `#22C55E` (emerald green)
  - **Logic / Medium**: `#F59E0B` (amber)
  - **Semantic / High**: `#EF4444` (red)
- **Skill Colors**
  - **Pandas / Data**: `#00F3FF`
  - **OOPS**: `#FF003C`
  - **CP**: `#FFD700` (gold)
  - **Cryptography**: `#9D4EDD` (purple)
- **Neutrals** (text/UI):
  - Primary text: near‑white (`#F9FAFB`)
  - Secondary: `#D1D5DB`
  - Muted: `#9CA3AF` / `#6B7280`

### 2. Typography

- **Headings**: Futuristic square font (e.g. Orbitron‑style).
  - H1: bold, uppercase, wide tracking, ~`text-5xl/6xl`.
  - H2/H3: strong but smaller, all caps or title‑case.
- **Body / UI Text**: Monospace (e.g. JetBrains Mono / system monospace).
  - Used for labels, buttons, and instructional copy to feel “terminal‑like”.
- **Code / Console**: Same monospace; smaller size for dense output.

### 3. Layout & Components

- **Cards / Panels**
  - Background: translucent black (`rgba(0,0,0,0.6–0.8)`).
  - Border: `2px` solid with accent color (usually `#00F3FF`) at ~30% opacity; full opacity on hover.
  - **Corner Brackets**: small 6–8px corner “L” shapes using the accent color on each card corner.
  - Shadow: soft glow, e.g. `0 0 30px rgba(0,243,255,0.15)` for cyan.
  - Optional inner gradient: very subtle top‑to‑bottom dark gradient.

- **Split Layout (Editor + Side Panel)**
  - Horizontal split: editor left ~60%, right panel ~40%, draggable divider.
  - Right panel vertically split into output / tests with another draggable divider.
  - Dividers: `2px` vertical/horizontal line with accent color and slight glow, cursor changes to resize.

- **Status Bars**
  - **Chaos Meter**: horizontal bar at top/bottom of Arena.
    - Track: dark gray (`#111827`).
    - Fill: gradient from `#22C55E` → `#F59E0B` → `#EF4444` as it fills.
  - Threat / difficulty indicators: 3 segments colored with threat colors above.

### 4. Background Effects (suitable for vanilla + three.js)

Use these as layered effects behind all UI:

- **Scanlines**
  - Semi‑transparent repeating horizontal lines overlay.
  - Implementation hint (CSS):
    - background: `linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)` with small `background-size` (e.g. `100% 3px`).
    - Opacity: ~0.2–0.3.

- **Grid**
  - Subtle neon grid behind content.
  - Implementation hint (CSS or a full‑screen canvas plane in three.js):
    - Use two `linear-gradient`s (horizontal + vertical) with `#00F3FF14` lines and `background-size: 4rem 4rem`.

- **Pulsing Orbs**
  - Large blurred circles in corners, e.g.:
    - Top‑left: `#00F3FF` at 5–10% opacity.
    - Bottom‑right: `#FF003C` or `#9D4EDD` at 5–10%.
  - In three.js, this can be emissive spheres with bloom; in CSS, absolutely‑positioned `div` with `border-radius: 9999px` and heavy blur.

- **Floating Particles**
  - 10–20 small dots (1–2px) randomly drifting up/down.
  - Animate `y`, `opacity`, `scale` in loops with random duration and delays.
  - For three.js: small points in a Points/Particles system slowly drifting; for vanilla: absolutely positioned DOM elements with CSS keyframes.

### 5. Animation Guidelines

- **Page / Card Entrance**
  - From below with slight fade:
    - Initial: `opacity: 0`, `translateY: 20px`.
    - Animate to: `opacity: 1`, `translateY: 0` over `0.3–0.5s`.
    - Stagger multiple cards by `0.05–0.15s`.

- **Hover States**
  - Scale up to `1.02–1.05`, border opacity → 1, glow strengthens.
  - Slight rotation (1–3 degrees) or horizontal nudge for “glitchy” cards when appropriate.

- **Glitch Text**
  - Important labels (logo, main title) have multi‑layer glitch:
    - Duplicate text layers offset horizontally in cyan and red.
    - Apply keyframes that:
      - Randomly clip vertical slices (via `clip-path` or mask).
      - Jitter X position a few pixels for 50–150ms bursts.

- **Loading / Scanning Bars**
  - Animated gradient bar for loading:
    - Background: gradient `#00F3FF → #3B82F6 → #00F3FF`.
    - Move gradient position or use a bright “scan line” sweeping across.

### 6. Page‑Type Patterns

- **Landing / Intro**
  - Strong glitch title + tagline.
  - Background: heavier scanlines, particles, maybe three.js scene (e.g. slow‑rotating 3D dojo or wireframe grid).
  - Central card or “terminal” block with animated cursor and typewriter effect.

- **Selection Screens (Skills / Difficulty)**
  - Grid of cards (1 column on mobile, 2–3 on desktop).
  - Each card:
    - Icon within a bordered neon box.
    - Title + one‑line description.
    - Different accent color per skill/difficulty (from palette above).
  - Selected card: accent background tint (e.g. accent color at 10–15% opacity), checkmark overlay, stronger glow.

- **Arena**
  - Full‑screen split as described above.
  - Chaos meter + sabotage alerts (overlayed banner using glitch red).
  - Terminal style:
    - Background: `#020617` or `#000000`.
    - Text: greenish or light gray monospace.
    - Prefix lines with `>` prompts.

### 7. Accessibility & Feel

- **Contrast**
  - Keep text vs background at ≥ 4.5:1; neon on near‑black already satisfies this.
- **Focus**
  - Clear focus ring on all interactive elements:
    - `outline: 2px solid #00F3FF` plus a soft cyan shadow on focus.
- **Motion**
  - Prefer short (≤ 0.4s) ease‑out transitions for most UI; long (3–6s) cycles only for background/ambient effects.

---

You can implement all of this in a vanilla.js + three.js project by:

- Using **three.js** for: grid plane, pulsing orbs, particles, and subtle camera motion.
- Using **plain CSS** (or a tiny utility layer) for: cards, typography, hover/entrance animations, glitch text layers, and layout.
- Keeping all colors and behavior aligned to the hex values and animation patterns described above so the “feel” matches CodeRonin even though the stack/naming is different.