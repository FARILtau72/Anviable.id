# Design Direction: Anviable.id

> Official visual identity and design tokens for Anviable.id (Platform Kurasi Kompetisi Pelajar Indonesia).
> Built under the `antislop` guidelines to ensure an authentic, designer-crafted experience without generic AI tropes.

---

## 1. Brand Personality & Mission

- **Identity**: Direktori dan kurasi kompetisi akademik, teknologi, sains, dan kejuruan SMK/SMA/MA terpercaya di Indonesia.
- **Tone**: Scholastic, authorative, energetic, and empowering. Terasa seperti gabungan antara kurasi editorial kampus ternama dan platform modern yang ramah pelajar.
- **Anti-Patterns Forbidden**:
  - No generic blue-purple-pink radial glow orbs.
  - No fake AI capsule badges with sparkles or endless pulsing dots.
  - No em dashes (—) in UI copy.
  - No fabricated statistics, testimonials, or claims.
  - No dark-mode container dropped into a light page without purpose.

---

## 2. Dial Settings (Part 3)

| Dial | Level | Implementation Stance |
|---|---|---|
| **ENERGY** | **2 (Balanced)** | Crisp typography, bold editorial headlines, high-contrast readable elements, purposeful visual anchors. |
| **RHYTHM** | **2 (Balanced)** | Varied sectional rhythm: search command hero, horizontal card carousel, discipline catalog, community matchmaking cards, and collegiate organizer callout. |
| **MOTION** | **1 (Calm)** | Micro-interactions and hover states only (`transition-all duration-200`). Zero endless loop pulses or floating blobs. |

---

## 3. Color System (Restrained & High-Contrast)

- **Neutral Base**:
  - Background: `#f8fafc` (Slate 50) and `#ffffff` (Pure White).
  - Borders: `#e2e8f0` (Slate 200, crisp 1px borders) and `#cbd5e1` (Slate 300 on hover).
  - Body Text: `#334155` (Slate 700) for high legibility.
  - Headings: `#0f172a` (Slate 900) for strong editorial weight.
- **Core 1 (Academic Navy / Indigo)**:
  - `#312e81` (Indigo 900) and `#3730a3` (Indigo 800) for brand anchors, primary action buttons, and active tabs.
  - `#eef2ff` (Indigo 50) for subtle categorical tinting.
- **Core 2 (Slate Foundation)**:
  - `#1e293b` (Slate 800) for structural containers, footers, and secondary buttons.
- **Deliberate Accent (High-Intent Warm Amber/Orange)**:
  - `#ea580c` (Orange 600) / `#c2410c` (Orange 700) used strictly at key decision moments:
    - Urgent deadline badges (`Sisa 3 hari`).
    - Verified registration action badges.
    - Primary conversion submit trigger.

---

## 4. Typography Scale

- **Font Family**: Inter, sans-serif (clean geometric humanist, optimized for high legibility on mobile screens).
- **Headings**:
  - H1 Hero: `text-3xl sm:text-5xl font-black tracking-tight text-slate-900` (Solid color, no gradient text).
  - H2 Sections: `text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900`.
  - H3 Cards: `text-base font-bold text-slate-900`.
- **Labels & Micro-copy**:
  - `text-xs font-semibold tracking-normal text-slate-500` (no extreme tracking uppercase).

---

## 5. UI Components & Craftsmanship

- **Elevation & Depth**: Flat cards with subtle `1px` border (`border-slate-200`) and soft `shadow-xs` (`0 1px 2px rgba(0,0,0,0.05)`). Hover lifts slightly with `shadow-md` and `border-slate-300`.
- **Badges**: Functional only. Indicates real verified state, real deadlines, or real category tags.
- **Buttons**: Real actions, minimum tap target 44px, proportional spacing, clear focus indicators for keyboard navigation (`focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2`).
