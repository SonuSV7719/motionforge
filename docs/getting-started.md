# Getting Started with MotionForge

## Prerequisites

- **Node.js** ≥ 20.0 — [Download](https://nodejs.org/)
- **FFmpeg** — [Download](https://ffmpeg.org/download.html)
- **Chrome/Chromium** — Puppeteer downloads automatically if needed

## Installation

```bash
npm install -g motionforge
```

Or use directly without installing:

```bash
npx motionforge --help
```

## Your First Video

```bash
# Create a project
mf init my-first-video --1080p --duration 6

# Navigate to project
cd my-first-video

# Add content
mf text add "My First Video" --font Inter --size 72 --color white --animate fade-up --at 1s

# Preview in browser
mf preview

# Render
mf render -o video.mp4
```

## Using with AI Agents

1. Install the MotionForge skill into your agent
2. Ask naturally: "Create a YouTube intro for my channel TechVibe"
3. The agent reads the skill, generates CLI commands, and renders your video

### Antigravity
```bash
cp -r skills/motionforge-* ~/.gemini/config/skills/
```

### Claude Code
```bash
cp -r skills/motionforge-* .agents/skills/
```

### Cursor / Windsurf
```bash
cp -r skills/motionforge-* .cursor/skills/
```

## Next Steps

- Browse [templates](../templates/) for pre-built motion graphics
- Check [examples](../examples/) for complete walkthroughs
- Read [CLI Reference](../README.md#-cli-reference) for all commands
