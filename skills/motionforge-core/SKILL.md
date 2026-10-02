---
name: motionforge-core
description: Core concepts, CLI reference, and workflow patterns for MotionForge. Load this skill when the user asks you to create motion graphics, edit videos, or produce video content.
---

# MotionForge — Core Skill

## What Is MotionForge

MotionForge is an open-source CLI toolkit for creating motion graphics and editing videos.
You interact with it by running `mf` (or `npx motionforge`) CLI commands.
All commands support `--json` for machine-readable output.

## Quick Start Workflow

```bash
# 1. Init project
mf init my-video --1080p --duration 10

# 2. Add content
mf text add "Hello World" --font Inter --size 72 --color white --animate fade-up --at 1s
mf template apply lower-third-minimal --name "John" --title "CEO" --at 3s

# 3. Render
mf render -o output.mp4 --preset youtube-1080p
```

## Scene Shorthands

| Flag | Resolution |
|------|-----------|
| `--1080p` | 1920×1080 |
| `--4k` | 3840×2160 |
| `--vertical` | 1080×1920 |
| `--square` | 1080×1080 |

## Key Commands

| Command | Purpose |
|---------|---------|
| `mf scene create [options]` | Create scene with resolution/fps/duration |
| `mf scene info` | Show scene details |
| `mf track add <type>` | Add track (video/audio/text/shape/image/three3d) |
| `mf text add "text" [options]` | Add kinetic text with font/color/animation |
| `mf 3d add [options]` | Add 3D WebGL mesh, torus-knot, particles, or device mockup |
| `mf audio add <file> [options]` | Add background music, voiceovers, or SFX |
| `mf template list` | Browse available templates |
| `mf template apply <id> [--props]` | Apply a template |
| `mf effect add <name> [options]` | Add transition/filter/animation |
| `mf effect list` | Show all available effects |
| `mf render -o file --preset name` | Render to broadcast-grade 60 FPS video |
| `mf preview` | Open browser preview |

## 3D WebGL Options (`mf 3d add`)

`--type torus-knot|galaxy|particles|device-iphone|device-laptop|icosahedron`
`--color <hex>` `--wireframe` `--particles <count>` `--at <time>` `--duration <time>` `--pos <center|x,y>`

## Audio Options (`mf audio add`)

`--type music|voiceover|sfx` `--volume <0-1>` `--fade-in <time>` `--fade-out <time>` `--at <time>`

## Time Format

`2s` = 2 seconds, `1500ms` = 1.5 seconds, `1:30` = 90 seconds, `2.5` = 2.5 seconds

## Output Presets

`youtube-1080p` `youtube-4k` `youtube-shorts` `instagram-reel` `tiktok` `twitter-video` `linkedin-video`

## Tips for Token Efficiency

- Use templates instead of building from scratch
- Use presets for output settings
- Use `--json` flag to parse structured responses
- Chain multiple `mf` commands in sequence
- Use `mf effect list --category transitions` to find effect names

## Project State

Project state is saved in `mf-project.json`. You can read this file to understand the current scene state, or modify it directly if needed. Always run `mf status` to check current state.
