---
name: motionforge-motion-graphics
description: Motion graphic patterns, template usage, and animation techniques. Load when creating intros, lower thirds, title cards, kinetic typography, or data visualizations.
---

# MotionForge — Motion Graphics Skill

## Common Patterns

### YouTube Intro
```bash
mf init intro --1080p --duration 8 --bg "#0a0a0f"
mf text add "CHANNEL NAME" --font "Montserrat" --size 96 --weight 900 --color white --animate scale-in --at 1s --duration 3
mf text add "Subscribe for more" --font "Inter" --size 24 --color "#aaa" --animate fade-up --at 2.5s --duration 2
mf effect add glitch --at 0.5s --duration 0.3
mf render -o intro.mp4 --preset youtube-1080p
```

### Lower Third
```bash
mf template apply lower-third-minimal --name "Jane Smith" --title "Lead Designer" --accentColor "#FF6B35" --at 2s
```

### Title Card
```bash
mf text add "THE TITLE" --font "Playfair Display" --size 120 --weight 700 --color white --animate fade-up --pos center --at 0.5s
mf text add "A subtitle goes here" --font "Inter" --size 28 --color "#888" --animate fade-up --pos center --at 1.2s
```

### Kinetic Typography
```bash
mf text add "WORD" --font "Impact" --size 200 --color "#FF0" --animate pop --at 0s --duration 1
mf text add "BY" --font "Impact" --size 100 --color "#FFF" --animate pop --at 0.8s --duration 1
mf text add "WORD" --font "Impact" --size 200 --color "#0FF" --animate pop --at 1.6s --duration 1
```

## Animation Presets Quick Reference

| Entrance | Exit | Special |
|----------|------|---------|
| fade-in | fade-out | typewriter |
| fade-up | slide-out-left | pop |
| fade-down | slide-out-right | elastic |
| slide-in-left | scale-out | bounce-in |
| slide-in-right | blur-out | shake |
| scale-in | | glitch |

## Template Categories

`mf template list --category lower-thirds`
`mf template list --category title-cards`
`mf template list --category intros`
`mf template list --category social-media`
`mf template list --category data-viz`

## Color Grades

Apply with: `mf effect add color-grade --preset <name>`

Available: cinematic, vintage, noir, warm, cool, vibrant, muted, cyberpunk, golden-hour, teal-orange

## Pro Tips

- Layer multiple text elements with staggered `--at` times for cinematic reveals
- Use `--bg "rgba(0,0,0,0.5)"` on text for readable overlays on video
- Combine templates + custom text for complex compositions
- Use `mf effect list` to discover all available effects before building
