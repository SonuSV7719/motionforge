---
name: motionforge-video-editing
description: Video editing workflows — import, trim, cut, split, merge, color grade, add subtitles, and export. Load when the user wants to edit existing video files.
---

# MotionForge — Video Editing Skill

## Import & Edit Workflow

```bash
# 1. Create project
mf init edit-project --1080p

# 2. Import media
mf clip add video-track --media ./footage.mp4

# 3. Edit
mf clip trim <clip-id> --start 5s --end 25s
mf clip split <clip-id> --at 15s
mf clip speed <clip-id> --factor 1.5

# 4. Add overlay text
mf text add "Chapter 1" --font Inter --size 48 --animate fade-up --at 0s --duration 3s

# 5. Add transition between clips
mf effect add fade --at 10s --duration 0.5

# 6. Color grade
mf effect add color-grade --preset cinematic --to <clip-id>

# 7. Add subtitles
mf text subtitle --srt ./subtitles.srt

# 8. Render
mf render -o final.mp4 --preset youtube-1080p
```

## Editing Commands

| Command | What It Does |
|---------|-------------|
| `mf clip add <track> --media <file>` | Import video/audio/image |
| `mf clip trim <id> --start --end` | Trim clip to range |
| `mf clip split <id> --at <time>` | Split clip at time |
| `mf clip speed <id> --factor <n>` | Change playback speed |
| `mf clip move <id> --to <time>` | Reposition on timeline |
| `mf audio add <file>` | Add audio track |
| `mf audio volume <id> --level 0.8` | Adjust volume |
| `mf audio fade <id> --in 1s --out 2s` | Audio fades |

## Multi-Platform Export

```bash
mf render --batch youtube-1080p,instagram-reel,tiktok -o ./exports/
```

## Tips

- Always check `mf status` to see current timeline state
- Use `mf track list` to see all tracks and clips
- Add `--json` flag for machine-readable output
