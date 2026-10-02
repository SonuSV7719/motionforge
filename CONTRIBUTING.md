# Contributing to MotionForge

Thank you for your interest in contributing to MotionForge! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Template Contributions](#template-contributions)
- [Skill Contributions](#skill-contributions)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### 🎨 Templates
Create new motion graphic templates — the single biggest way to help the community.

### ⚡ Effects
Add new transitions, filters, animations, and easing presets.

### 📝 Skills
Write or improve agent skill files to help AI agents use MotionForge better.

### 🐛 Bug Reports
File issues with clear reproduction steps and expected vs actual behavior.

### 💡 Feature Requests
Open a discussion with your use case and proposed solution.

### 📖 Documentation
Improve docs, add examples, fix typos, clarify instructions.

### 🧪 Tests
Add test coverage for existing and new functionality.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/motionforge/motionforge.git
cd motionforge

# Install dependencies
npm install

# Build
npm run build

# Run in dev mode (watch)
npm run dev

# Run tests
npm run test

# Lint
npm run lint
```

### Prerequisites

- Node.js ≥ 20.0
- FFmpeg installed and on PATH
- Chrome/Chromium (Puppeteer will download if needed)

## Coding Standards

- **Language**: TypeScript (strict mode)
- **Module System**: ESM (`import`/`export`)
- **Formatting**: Prettier (run `npm run format`)
- **Linting**: ESLint (run `npm run lint`)
- **Naming**: `PascalCase` for classes/types, `camelCase` for functions/variables, `kebab-case` for files
- **Comments**: JSDoc for all public APIs
- **Tests**: Required for all new features and bug fixes

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

**Scopes**: `core`, `cli`, `compositor`, `renderer`, `effects`, `templates`, `skills`, `mcp`, `docs`

**Examples**:
```
feat(templates): add cinematic-title template
fix(renderer): handle missing FFmpeg gracefully
docs(skills): improve motion-graphics skill examples
perf(compositor): optimize GSAP timeline generation
```

## Pull Request Process

1. Fork the repository and create your branch from `main`
2. Make your changes with appropriate tests
3. Ensure all tests pass: `npm run test`
4. Ensure linting passes: `npm run lint`
5. Update documentation if needed
6. Submit a PR with a clear description of changes

### PR Title Format

Same as commit message format:
```
feat(templates): add lower-third-corporate template
```

## Template Contributions

Templates are the most impactful contribution. See [Template Authoring Guide](docs/template-authoring.md).

### Template Checklist

- [ ] `manifest.json` with complete metadata and prop schema
- [ ] `composition.html` with semantic, accessible HTML
- [ ] `style.css` with scoped styles (no global leaks)
- [ ] `animation.js` with GSAP timeline (seekable, deterministic)
- [ ] `preview.webp` visual preview (optional but recommended)
- [ ] Works at all supported resolutions (1080p, 4K, vertical, square)
- [ ] Props are well-documented with sensible defaults
- [ ] Added to `templates/catalog.json`

## Skill Contributions

Skills teach AI agents how to use MotionForge. See [Skill Authoring Guide](docs/skill-authoring.md).

### Skill Checklist

- [ ] Clear YAML frontmatter with `name` and `description`
- [ ] Concise — skills should be <2000 tokens to avoid context bloat
- [ ] Includes common patterns and examples
- [ ] Covers error cases and edge cases
- [ ] Tested with at least 2 different agents

---

Thank you for making MotionForge better! 🎬
