# Skill Authoring Guide

## What Are Skills?

Skills are compact Markdown files that teach AI coding agents how to use MotionForge.
They are loaded on-demand by the agent — NOT always in context — which saves tokens.

## Skill Structure

```markdown
---
name: motionforge-my-skill
description: Brief description of what this skill teaches.
---

# Skill Title

## Section 1
Content...

## Section 2
Content...
```

## Guidelines

### Keep It Under 2000 Tokens
Skills should be concise references, NOT full documentation. Include:
- Common patterns and workflows
- Command syntax quick reference
- Tips and best practices
- Edge cases to watch for

### Don't Duplicate CLI Help
The agent can always run `mf <command> --help`. Your skill should teach:
- **When** to use a command (not just **how**)
- **Why** certain patterns work better
- **Combinations** that produce professional results

### Include Runnable Examples
Every pattern should be a `bash` code block the agent can execute directly.

### Test With Multiple Agents
Ensure the skill works well with at least 2 different coding agents (e.g., Antigravity + Claude Code).

## Installation Paths

| Agent | Path |
|-------|------|
| Antigravity | `~/.gemini/config/skills/` |
| Claude Code | `.agents/skills/` |
| Cursor | `.cursor/skills/` |
| Windsurf | `.windsurf/skills/` |
| Generic | Project root `skills/` directory |

## Existing Skills

| Skill | Focus |
|-------|-------|
| `motionforge-core` | CLI reference, project workflow |
| `motionforge-motion-graphics` | Motion graphic patterns, templates |
| `motionforge-video-editing` | Import, edit, export workflows |
| `motionforge-effects` | Effects library reference |
| `motionforge-kinetic-type` | Kinetic typography |
| `motionforge-data-viz` | Data visualization animations |
| `motionforge-templates` | Template system and customization |
