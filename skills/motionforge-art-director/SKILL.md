---
name: motionforge-art-director
description: Master Art Direction & Motion Design Intelligence Skill. Encodes School of Motion best practices, Disney's 12 Animation Principles for UI/Motion Graphics, Walter Murch's Rule of Six (Eye Trace & Emotion), 60-30-10 Color Harmonies, and Typography Grids to produce world-class, broadcast-grade video output.
---

# MotionForge Art Director — Visual Intelligence & Design Standards

This skill acts as the master visual design brain for MotionForge. When creating or editing any video, apply these exact industry-standard rules to make every frame look handcrafted by an award-winning motion design studio (like Apple, Stripe, Linear, or School of Motion).

---

## 1. The Core 5 Motion Design Pillars (School of Motion Standards)

### Pillar 1: Eye Trace & The "Boss" Hierarchy
- **There must only be ONE "Boss" on screen at any given millisecond.**
- If text, 3D geometry, and background particles all move with equal intensity, the viewer gets fatigued and clicks away.
- **Eye Trace Pathing:** Guide the viewer's gaze deliberately:
  - Top badge enters first (leads eyes to top center)
  - Hero word punches in at center (drags eyes to middle)
  - Accent line/UI card resolves underneath (leads eyes downward to CTA).

### Pillar 2: Easing Physics (Never Use Linear Motion)
- **Entrance Easing:** `ease: 'expo.out'` or `ease: 'power4.out'` — Starts with high velocity and settles with silk-smooth deceleration.
- **Organic Weight / Badges:** `ease: 'back.out(1.7)'` — Provides subtle anticipation and overshoot like physical objects.
- **Exit Transitions:** `ease: 'power2.in'` or `ease: 'expo.in'` — Accelerates off-screen cleanly.
- **Camera Drift:** Continuous slow organic easing (`linear` with 0.05% scale drift or sinusoidal wobble).

### Pillar 3: Stagger Choreography & Micro-Delays
- Never reveal multiple visual elements at timestamp `0.00s`.
- Always cascade elements with **40ms to 80ms offsets**:
  ```javascript
  // Example: 3-Element Stagger
  0.00s: Eyebrow pill pops in (scale 0 -> 1, back.out(2))
  0.15s: Hero headline reveals (y: 40 -> 0, expo.out, duration 0.7s)
  0.35s: Subtitle fades up (y: 15 -> 0, power2.out)
  0.50s: 3D Torus knot / Mesh lights up with neon pulse
  ```

### Pillar 4: Spatial Negative Space & Breathing Room
- Professional motion design breathes. Keep at least **35% - 40% empty/negative space** on the screen.
- Never place text right against canvas edges.

### Pillar 5: Audio-Visual Sync & Rhythm (Walter Murch Rhythm Rule)
- **Beat-Matched Transitions:** Cuts, crash zooms, and text hits must land on drum beats or bass impacts.
- **Riser Buildup:** Place 0.5s – 1.0s audio whooshes before a key reveal.

---

## 2. Typography Mastery & Optical Metrics (1920×1080)

| Type Role | Font Size | Weight | Line Height | Tracking | Purpose |
|---|---|---|---|---|---|
| **Hero Impact Word** | 96px – 130px | 900 (Black) | 0.95 | `-2.5px` | 1–3 word kinetic retention punch |
| **Main Headline** | 64px – 80px | 800 (ExtraBold) | 1.05 | `-1.5px` | Primary value proposition |
| **Subtitle / Explainer** | 24px – 30px | 500 (Medium) | 1.45 | `0px` | Secondary descriptive context |
| **Eyebrow / Pill Badge** | 14px – 16px | 700 (Bold) | 1.0 | `+2.5px` | Uppercase tracking category tag |
| **Metric Statistic** | 84px – 120px | 900 (Black) | 0.95 | `-2px` | High-impact numbers (`+450%`, `$12M+`) |

### 6 Proven Video Font Pairings:
1. **Kinetic Tech & AI:** `Syne` (Headline 900) + `Inter` (Body 500)
2. **Sci-Fi / Cyberpunk:** `Orbitron` (Headline 800) + `Rajdhani` (Body 600)
3. **Clean SaaS & Fintech:** `Plus Jakarta Sans` (Headline 800) + `Inter` (Body 400)
4. **Viral Shorts & Reels:** `Montserrat` (Headline 900) + `Roboto` (Body 600)
5. **Luxury & Editorial:** `Playfair Display` (Headline 700 Italic) + `Plus Jakarta Sans` (Body 500)
6. **Developer & Code:** `JetBrains Mono` (Headline 800) + `Fira Code` (Body 500)

---

## 3. Color Theory: The 60-30-10 Video Balance

Never pick arbitrary colors. Balance every scene across 3 distinct layers:
- **60% Base Atmosphere:** Deep canvas black/obsidian (`#04060E`, `#0B0F19`, `#000000`).
- **30% Structural Depth:** Semi-transparent frosted glass (`rgba(17, 24, 39, 0.75)`), muted secondary typography (`#94A3B8`), subtle grids.
- **10% High-Energy Accent:** High-contrast focal point:
  - Neon Electric Cyan: `#00F0FF`
  - Ultra Violet: `#7000FF`
  - Toxic Lemon (Viral): `#FFE600`
  - Emerald Mint: `#10B981`
  - Imperial Gold: `#D4AF37`

---

## 4. Safe Zones & Aspect Ratios

- **16:9 Landscape (1920×1080):** Keep all vital text within `x: 120px` to `x: 1800px` and `y: 80px` to `y: 1000px`.
- **9:16 Vertical (1080×1920 - Reels/TikTok/Shorts):**
  - **Top Exclusion Zone:** `0` to `180px` (blocks profile / search header).
  - **Bottom Exclusion Zone:** `1640px` to `1920px` (blocks captions, sound titles, like/share icons).
  - **Active Hero Zone:** `y: 320px` to `y: 1550px`.
