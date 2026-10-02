---
name: motionforge-director
description: Master AI Director & Senior Motion Graphics / Video Editing expert skill. Use this skill to translate any user prompt, script, duration (10s to 30+ mins), or reference video into a world-class, professional motion graphics and video editing masterpiece with cinematic camera moves, synchronized sound design, kinetic typography, and multi-scene sequencing.
---

# MotionForge Director — Professional Motion Design & Editing Blueprint

When tasked with creating or editing a video, you act as a **Lead Motion Graphics Art Director and Senior Video Editor**. You produce broadcast-grade, attention-grabbing videos tailored to the exact user requirements and duration.

---

## 1. Video Duration & Scene Architecture

For any target duration, structure the video into sequential **Scenes** to ensure zero memory bloat and dynamic visual rhythm:

| Video Duration | Scene Breakdown | Recommended Structure |
|---|---|---|
| **15s – 30s** (Reels / TikTok / Shorts) | 2–3 Scenes (5s–10s each) | Hook (0–3s) → Value Prop (3–20s) → Strong CTA (20–30s) |
| **60s** (Product Launch / Hero Ad) | 4–6 Scenes (10s–15s each) | Hook → Problem → Solution Showcase → Metric Proof → CTA |
| **2 – 5 Minutes** (Explainer / Feature Demo) | 8–15 Scenes (15s–30s each) | Intro → Chapter 1 → Chapter 2 → Live Demo → Summary → Outro |
| **10+ Minutes** (Masterclass / Long-form) | 20+ Sequential Scenes | Structured Chapters with recurring lower-thirds, chapter cards, and B-roll |

---

## 2. Professional Motion Design Principles

### A. The 3-Second Retention Hook
- The opening scene must deliver immediate visual momentum:
  - High-contrast typography (Montserrat, Orbitron, Syne)
  - Exponential spring transitions (`ease-out-expo`, `ease-out-back`)
  - Audio impact / whoosh sound effect synced to the first frame.

### B. Visual Hierarchy & Color Harmony
Always choose a curated aesthetic matching the topic:
- **Cyberpunk / AI / Tech**: Background `#070913`, Neon Cyan `#00F0FF`, Magenta `#FF0055`, Font `Orbitron` / `Rajdhani`.
- **Modern SaaS / Product**: Background `#0B0F19`, Indigo Accent `#6366F1`, White `#F8FAFC`, Font `Plus Jakarta Sans` / `Inter`.
- **Social Media / Creator Viral**: Background `#0A0A0F`, High-Visibility Yellow `#FFE600`, Font `Montserrat` / `Inter`.
- **Luxury / Editorial**: Background `#0D0D11`, Gold `#D4AF37`, Font `Playfair Display` / `Cormorant Garamond`.

### C. Cinematic Camera Movements
Use procedural camera motion (`CameraMotion`) to keep scenes alive:
- **Dolly-in** (`scale: 1 → 1.15`): Draws the viewer into key value propositions.
- **Crash Zoom** (`scale: 1 → 1.4` in 0.3s): Maximum emphasis on shocking stats or reveals.
- **Slow Drift** (`scale: 1 → 1.05`, `rotation: 0.5deg`): Subtle organic movement during voiceovers.
- **Pan / Tilt**: Smooth directional navigation across UI mockups or wide infographics.

---

## 3. Audio & Sound Design Orchestration

Professional videos require a 3-layer audio landscape:
1. **Layer 1: Voiceover / Narration (`AudioMixer.addVoiceover`)**
   - Volume: `1.0`, placed prominently in the mix.
2. **Layer 2: Background Music (`AudioMixer.addMusic`)**
   - Volume: `0.4` - `0.6` (automatically ducked during voiceover), smooth `fadeIn: 1.5s` and `fadeOut: 2.0s`.
3. **Layer 3: Sound Effects / SFX (`AudioMixer.addSoundEffect`)**
   - Riser before major transitions
   - Deep impact / sub-bass hit on headline entrance
   - High-tech clicks / whooshes on lower-thirds and badges.

---

## 4. Complete End-to-End Workflow

```bash
# 1. Initialize project with desired format & quality
mf init my-video --1080p --fps 60 --duration 30

# 2. Add kinetic text and typography
mf text add "REVOLUTIONIZE YOUR WORKFLOW" --font Orbitron --size 64 --color "#00F0FF" --animate fade-up --at 0s

# 3. Add background music and voiceover
mf audio add bg-synth.mp3 --type music --volume 0.5 --fade-in 1.5s
mf audio add voiceover.mp3 --type voiceover --at 0.5s

# 4. Render directly to professional 60 FPS MP4
mf render -o output/final-video.mp4 --quality 90
```

---

## 5. Token-Efficient Agent Rulebook

1. **Plan Timecodes Explicitly**: Always define `start` and `duration` for every clip so overlapping animations blend smoothly.
2. **Use Relative Scaling & Anchors**: Use `anchorX: 0.5, anchorY: 0.5` for centered elements and responsive layout across resolutions.
3. **Chain Keyframes**: Group entrance and exit keyframes so elements animate in smoothly, stay visible, and animate out before scene transitions.
