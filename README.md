<div align="center">

# 🎬 MotionForge

### The Open Source Agentic Motion Graphics & Video Editing Engine

*Turn any AI coding agent into an elite motion design studio and broadcast-grade video editor.*

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-≥20.0-339933?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://typescriptlang.org)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20WebGL-black?logo=three.js)](https://threejs.org)
[![60 FPS Broadcast](https://img.shields.io/badge/Render-60%20FPS%20Deterministic-00F0FF)](https://github.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Quick Start](#-quick-start) · [Agent Skills](#-ai-agent-skills) · [3D WebGL Engine](#-3d-webgl--pro-graphics) · [CLI Reference](#-cli-reference) · [Templates](#-templates) · [Architecture](#-architecture)

</div>

---

## 🧠 What is MotionForge?

**MotionForge** is an open-source video engine and CLI toolkit purpose-built for **AI Coding Agents** (Antigravity, Claude Code, Cursor, Copilot, Codex) and human creators. 

Instead of writing complex animation boilerplate or manual timeline editing, you describe your video in plain natural language or single-line CLI commands. The engine handles **scene orchestration, 3D WebGL rendering, kinetic typography with 1,500+ Google Fonts, multi-track audio mixing, and frame-accurate 60 FPS video encoding**.

```bash
# AI Agent or Human runs these simple commands:
mf init my-showreel --1080p --fps 60 --duration 10
mf 3d add --type torus-knot --color "#00F0FF" --particles 1500 --at 0s
mf text add "GENERATIVE 3D MOTION" --font Montserrat --weight 900 --size 64 --color white --animate fade-up --at 0.8s
mf audio add bg-synth.mp3 --type music --volume 0.5 --fade-in 1.5s
mf render -o output/showreel.mp4 --quality 90
```

---

## ✨ Core Superpowers

<table>
<tr>
<td width="50%">

### 🌐 Real-time 3D WebGL Engine
Built-in Three.js PBR pipeline with studio 3-point lighting, metallic/glass materials, 3D device mockups, particle galaxies, and GLSL shaders.

### 🔤 Smart Typography & Google Fonts
Auto-detects context-aware font pairings (`Syne`, `Plus Jakarta Sans`, `Montserrat`, `Orbitron`) and auto-embeds 1,500+ Google Fonts directly in `<head>`.

### 🔊 3-Layer Audio Mixer & Ducking
Multi-track audio engine with voiceovers, background music, auto-ducking, volume fades, and high-impact sound effect synchronization.

</td>
<td width="50%">

### 🎬 Broadcast Video Editing Ops
Import video clips, perform split-screens, Picture-in-Picture (PiP), speed ramps, color grades, and L-cut / J-cut audio transitions.

### ⚡ ~90% Token Efficiency
CLI-first design and JSON scene graphs allow AI agents to generate 10-minute multi-scene videos in a single prompt without blowing token context.

### 🎥 Deterministic 60 FPS Frame Capture
Headless Chromium + GSAP seek hooks capture every single frame with zero timing drift, dropped frames, or stutter.

</td>
</tr>
</table>

---

## 📊 Feature Comparison

| Feature | Remotion | OpenMontage | HyperFrames | **MotionForge** |
|---|:---:|:---:|:---:|:---:|
| **License** | ❌ BSL / Paid | ❌ AGPL | ❌ Closed | ✅ **Apache 2.0 (100% Free)** |
| **Token Efficiency** | ❌ Large React code | ❌ Script heavy | ❌ Complex | ✅ **CLI & Schema (~90% less)** |
| **True 3D WebGL (Three.js)** | ⚠️ Manual setup | ❌ None | ❌ None | ✅ **Built-in Studio Engine** |
| **Google Fonts Auto-Matcher** | ❌ Manual | ❌ None | ❌ None | ✅ **Auto-Inference & CDN** |
| **Multi-Track Audio Ducking** | ⚠️ Custom code | ❌ Basic | ❌ None | ✅ **Automatic Native Ducking** |
| **AI Agent Skills Ready** | ❌ None | ⚠️ Basic | ❌ None | ✅ **Director & Art Director Skills** |
| **Arbitrary Durations (15s–30m)** | ⚠️ Memory bloat | ❌ Short only | ❌ Short only | ✅ **Modular Scene Chunking** |
| **Standalone CLI** | ❌ | ❌ | ❌ | ✅ **Full Interactive CLI** |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.0
- **FFmpeg** installed and on PATH ([download](https://ffmpeg.org/download.html))
- **Chrome/Chromium** (Puppeteer downloads automatically)

### Install

```bash
# Install globally
npm install -g motionforge

# Or use directly with npx (no install needed)
npx motionforge --help
```

### Quick Start — Your First Video in 60 Seconds

```bash
# 1. Initialize a new project
mf init my-video
cd my-video

# 2. Create a scene
mf scene create --1080p --duration 6

# 3. Add a title with animation
mf text add "Hello World" --font "Inter" --size 72 --color white --animate fade-up

# 4. Preview in browser
mf preview

# 5. Render to MP4
mf render -o hello.mp4
```

### Quick Start — With an AI Agent

Just install the skill into your agent and ask:

> *"Create a 10-second YouTube intro with my channel name 'TechVibe', use a cinematic style with dark background and neon accent colors, add a glitch transition, and render it."*

The agent reads the MotionForge skill, generates CLI commands, and delivers your MP4.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AGENT LAYER                              │
│  Any AI Coding Agent (Antigravity, Claude Code, Cursor, etc.)   │
│  Reads: Skills (Markdown)  │  Executes: CLI commands            │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CLI INTERFACE                                │
│  mf scene | mf text | mf template | mf effect | mf render      │
│  JSON output for agent parsing  │  Human-friendly display       │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CORE ENGINE                               │
│  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────────┐  │
│  │  Scene   │ │ Compositor │ │ Effects  │ │   Templates     │  │
│  │  Model   │ │ HTML/CSS/  │ │ Library  │ │   Engine        │  │
│  │(Project, │ │ GSAP Gen   │ │(Trans,   │ │(Registry,       │  │
│  │ Scene,   │ │            │ │ Filters, │ │ Validator,      │  │
│  │ Track,   │ │            │ │ Motion,  │ │ Customizer)     │  │
│  │ Clip,    │ │            │ │ Text)    │ │                 │  │
│  │ Keyframe)│ │            │ │          │ │                 │  │
│  └──────────┘ └────────────┘ └──────────┘ └─────────────────┘  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     RENDER PIPELINE                             │
│  ┌───────────────┐    ┌───────────────┐    ┌────────────────┐  │
│  │ Headless       │    │    FFmpeg      │    │   Output       │  │
│  │ Chrome/        │───▶│   Encoding    │───▶│   MP4/MOV/     │  │
│  │ Puppeteer      │    │   Pipeline    │    │   WebM/GIF     │  │
│  │ (Frame Capture)│    │               │    │                │  │
│  └───────────────┘    └───────────────┘    └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Core Design Principles

1. **HTML/CSS/GSAP Compositions** — Not React, not proprietary. Standard web tech that every LLM already knows.
2. **CLI-First** — Every operation is a CLI command. Agents generate commands, not code. ~90% token savings.
3. **Template-Driven** — Pre-built, tested, customizable templates. One command = professional output.
4. **File-Based State** — Project state lives in `mf-project.json`. Resumable, shareable, diffable.
5. **Deterministic Rendering** — Same input = same output. Always. Frame-by-frame capture ensures it.

---

## 💻 CLI Reference

### Project Management

```bash
mf init <name>                    # Create new project
mf init <name> --template <id>   # Create from template
mf status                         # Show project info
mf export --format json           # Export scene as JSON
```

### Scene Operations

```bash
mf scene create                            # Create with defaults (1080p, 30fps)
mf scene create --width 1920 --height 1080 --fps 30 --duration 10
mf scene create --1080p                    # Shorthand for 1920×1080
mf scene create --4k                       # Shorthand for 3840×2160
mf scene create --vertical                 # 1080×1920 (Stories/Reels)
mf scene create --square                   # 1080×1080 (Instagram Post)
mf scene info                              # Display scene details
mf scene set --duration 15 --bg "#1a1a2e"  # Modify scene properties
```

### Tracks & Clips

```bash
mf track add <type> [--name <n>]             # Types: video, audio, text, shape, image
mf track list                                 # List all tracks
mf track remove <id>                          # Remove track

mf clip add <track-id> --media <path> [--start 2s] [--duration 5s]
mf clip trim <clip-id> --start 1s --end 4s
mf clip split <clip-id> --at 3s
mf clip speed <clip-id> --factor 2.0          # 2x speed
mf clip move <clip-id> --to 5s                # Move on timeline
```

### Text & Typography

```bash
mf text add "Your Text" [options]
  --font <name>          # Google Font name (auto-downloaded)
  --size <px>            # Font size
  --color <hex>          # Text color
  --bg <hex>             # Background color
  --pos <position>       # center, top, bottom, bottom-left, etc.
  --animate <preset>     # fade-in, fade-up, slide-left, typewriter, bounce, etc.
  --at <time>            # Start time (e.g., 2s, 1500ms)
  --duration <time>      # Display duration
  --track <id>           # Target track (auto-creates text track if omitted)

mf text kinetic "Words to animate" --style wave --speed 1.2
mf text subtitle --srt <path>         # Import SRT subtitles
mf text subtitle --vtt <path>         # Import WebVTT subtitles
```

### Templates

```bash
mf template list                              # List all available templates
mf template list --category lower-thirds      # Filter by category
mf template info <template-id>                # Show template details & props
mf template preview <template-id>             # Preview in browser
mf template apply <template-id> [--props]     # Apply to current scene
  --at <time>                                  # Insert at timeline position
  --duration <time>                            # Override template duration

# Example:
mf template apply lower-third-minimal \
  --name "Jane Smith" \
  --title "Lead Designer" \
  --accentColor "#FF6B35" \
  --at 2s
```

### Effects

```bash
mf effect add <effect-name> [options]
  --to <clip-id>         # Apply to specific clip (or scene-wide)
  --at <time>            # Start time
  --duration <time>      # Effect duration
  --intensity <0-1>      # Effect strength

# Transitions
mf effect add fade --at 3s --duration 0.5
mf effect add wipe-left --at 3s --duration 0.8
mf effect add dissolve --at 3s --duration 1.0
mf effect add glitch --at 3s --duration 0.3
mf effect add zoom-in --at 3s --duration 0.6

# Filters
mf effect add blur --to <clip-id> --intensity 0.5
mf effect add color-grade --to <clip-id> --preset cinematic
mf effect add vignette --to <clip-id> --intensity 0.3
mf effect add film-grain --to <clip-id> --intensity 0.2

# List available effects
mf effect list
mf effect list --category transitions
```

### Audio

```bash
mf audio add <path> [--track <id>] [--start 0s]
mf audio volume <clip-id> --level 0.8
mf audio fade <clip-id> --in 1s --out 2s
mf audio duck <clip-id> --under <other-clip-id>  # Auto-duck under voiceover
```

### Rendering

```bash
mf render [options]
  -o, --output <path>       # Output file path
  --preset <name>           # Output preset (youtube-1080p, tiktok, etc.)
  --format <fmt>            # mp4, mov, webm, gif
  --quality <1-100>         # Encoding quality
  --start <time>            # Render range start
  --end <time>              # Render range end

mf render -o video.mp4 --preset youtube-1080p
mf render -o story.mp4 --preset instagram-story
mf render -o clip.gif --format gif --start 0s --end 3s

# Batch render for multiple platforms
mf render --batch youtube-1080p,instagram-reel,tiktok -o ./exports/

mf preview                  # Open live preview in browser
mf preview --port 3333      # Custom port
```

### Output Presets

| Preset | Resolution | FPS | Codec | Use Case |
|--------|-----------|-----|-------|----------|
| `youtube-1080p` | 1920×1080 | 30 | H.264 | YouTube standard |
| `youtube-4k` | 3840×2160 | 30 | H.264 | YouTube 4K |
| `youtube-shorts` | 1080×1920 | 30 | H.264 | YouTube Shorts |
| `instagram-reel` | 1080×1920 | 30 | H.264 | Instagram Reels |
| `instagram-story` | 1080×1920 | 30 | H.264 | Instagram Stories |
| `instagram-post` | 1080×1080 | 30 | H.264 | Instagram Feed |
| `tiktok` | 1080×1920 | 30 | H.264 | TikTok |
| `twitter-video` | 1280×720 | 30 | H.264 | Twitter/X |
| `linkedin-video` | 1920×1080 | 30 | H.264 | LinkedIn |
| `facebook-video` | 1280×720 | 30 | H.264 | Facebook |
| `broadcast-hd` | 1920×1080 | 25 | ProRes | Broadcast TV |

---

## 🎨 Templates

Templates are pre-built, customizable motion graphic compositions. One command = professional output.

### Categories

| Category | Templates | Description |
|----------|-----------|-------------|
| **Lower Thirds** | `lower-third-minimal`, `lower-third-news`, `lower-third-corporate`, `lower-third-creative` | Name/title overlays |
| **Title Cards** | `title-card-cinematic`, `title-card-modern`, `title-card-glitch`, `title-card-gradient` | Full-screen titles |
| **Intros/Outros** | `intro-logo-reveal`, `intro-particles`, `outro-subscribe`, `outro-credits` | Video openers/closers |
| **Social Media** | `social-story`, `social-reel`, `social-quote`, `social-promo` | Platform-optimized content |
| **Data Viz** | `data-bar-chart`, `data-line-chart`, `data-pie-chart`, `data-counter` | Animated data visualizations |
| **Infographics** | `infographic-stats`, `infographic-timeline`, `infographic-comparison` | Animated infographics |
| **Transitions** | `transition-fade`, `transition-wipe`, `transition-glitch`, `transition-morph` | Scene transitions |
| **Backgrounds** | `bg-particles`, `bg-gradient-shift`, `bg-geometric`, `bg-aurora` | Animated backgrounds |

### Creating Custom Templates

```
my-template/
├── manifest.json          # Metadata, props schema, tags
├── composition.html       # HTML structure
├── style.css              # Scoped CSS styling
├── animation.js           # GSAP timeline definition
└── preview.webp           # Visual preview (optional)
```

See [Template Authoring Guide](docs/template-authoring.md) for full documentation.

---

## 🤖 Agent Skills

Skills are compact Markdown files that teach AI coding agents how to use MotionForge efficiently. They're loaded on-demand — zero context bloat.

### Available Skills

| Skill | What It Teaches |
|-------|----------------|
| `motionforge-core` | Scene model, CLI basics, project workflow |
| `motionforge-motion-graphics` | Motion graphic patterns, template usage, animation presets |
| `motionforge-video-editing` | Import, trim, cut, edit, color grade workflows |
| `motionforge-effects` | Full effects library reference |
| `motionforge-kinetic-type` | Kinetic typography techniques |
| `motionforge-data-viz` | Data visualization animation patterns |
| `motionforge-templates` | Template system, customization, authoring |

### Installing Skills

**Antigravity:**
```bash
# Copy skills to your config
cp -r skills/motionforge-* ~/.gemini/config/skills/
```

**Claude Code:**
```bash
# Skills auto-discovered from project .agents/skills/
cp -r skills/motionforge-* .agents/skills/
```

**Cursor / Windsurf / Any Agent:**
```bash
# Copy to your agent's rules/context directory
cp -r skills/motionforge-* .cursor/skills/
```

### Optional: MCP Server

For agents with strong MCP support, an optional MCP wrapper is available:

```json
{
  "motionforge": {
    "command": "npx",
    "args": ["motionforge", "mcp-serve"]
  }
}
```

This wraps the same CLI commands as structured MCP tools — no separate codebase.

---

## 📖 Examples

Each example includes a `README.md`, `scene.json`, and step-by-step agent prompts.

| # | Example | What You'll Learn |
|---|---------|-------------------|
| 01 | [Hello Motion](examples/01-hello-motion/) | Basic scene, text, animation, render |
| 02 | [Lower Thirds](examples/02-lower-thirds/) | Template usage, customization |
| 03 | [Kinetic Typography](examples/03-kinetic-typography/) | Word-by-word animation, text effects |
| 04 | [Data Dashboard](examples/04-data-dashboard/) | Chart animations, data-driven motion |
| 05 | [Video Edit Workflow](examples/05-video-edit-workflow/) | Import, trim, cut, transitions |
| 06 | [Social Media Batch](examples/06-social-media-batch/) | Multi-platform export from one scene |
| 07 | [Full Production](examples/07-full-production/) | Complete video from prompt to MP4 |

---

## 🛠️ Development

### Setup

```bash
git clone https://github.com/motionforge/motionforge.git
cd motionforge
npm install
npm run build
```

### Development Mode

```bash
npm run dev          # Watch mode — auto-rebuild on changes
npm run test         # Run test suite
npm run lint         # Lint source files
```

### Project Structure

```
motionforge/
├── src/
│   ├── core/                 # Scene model (Scene, Track, Clip, Keyframe)
│   ├── compositor/           # HTML/CSS/GSAP composition builder
│   ├── renderer/             # Headless Chrome + FFmpeg pipeline
│   ├── effects/              # Transitions, filters, animations, easing
│   ├── templates/            # Template engine, registry, validator
│   ├── assets/               # Asset manager, font loader, media probe
│   ├── cli/                  # CLI commands and output formatting
│   │   └── commands/         # Individual command implementations
│   ├── mcp/                  # Optional MCP server wrapper
│   │   └── tools/            # MCP tool definitions
│   └── index.ts              # Library entry point
├── templates/                # Built-in template library
├── presets/                  # Output format presets
├── skills/                   # Agent skill files (Markdown)
├── examples/                 # Example projects
├── tests/                    # Test suites
├── docs/                     # Documentation
└── scripts/                  # Build & utility scripts
```

---

## 🤝 Contributing

We welcome contributions of all kinds! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute

- 🎨 **Templates** — Create and share motion graphic templates
- ⚡ **Effects** — Add new transitions, filters, animations
- 📝 **Skills** — Improve agent skill documentation
- 🐛 **Bug Fixes** — Fix issues and improve stability
- 📖 **Docs** — Improve documentation and examples
- 🧪 **Tests** — Add test coverage

---

## 📜 License

Apache 2.0 — see [LICENSE](LICENSE). Use it for anything. No restrictions. No fees. Ever.

---

## 🗺️ Roadmap

- [x] **Phase 1** — Core engine, CLI, basic templates, first skill
- [ ] **Phase 2** — 50+ templates, full effects library, kinetic typography
- [ ] **Phase 3** — Video editing (import, trim, color grade, subtitles)
- [ ] **Phase 4** — AI integrations (image gen, video gen, TTS, music gen)
- [ ] **Phase 5** — Cloud rendering, template marketplace, plugin system

---

<div align="center">

**Built with ❤️ for the AI agent community**

[⭐ Star on GitHub](https://github.com/motionforge/motionforge) · [🐛 Report Bug](https://github.com/motionforge/motionforge/issues) · [💡 Request Feature](https://github.com/motionforge/motionforge/issues)

</div>
