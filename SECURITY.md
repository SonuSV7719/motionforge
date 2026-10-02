# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅ Current          |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: security@motionforge.dev
3. Include a detailed description and reproduction steps
4. Allow up to 48 hours for initial response

We will work with you to understand and address the issue before any public disclosure.

## Scope

MotionForge processes user-provided media files and executes rendering commands. Security concerns include:

- **Command injection** via CLI arguments or template props
- **Path traversal** in asset import or output paths
- **Malicious templates** that execute arbitrary code
- **Dependency vulnerabilities** in third-party packages

## Best Practices

- Always use the latest version
- Review third-party templates before use
- Run rendering in sandboxed environments for untrusted input
- Keep FFmpeg and Chrome/Chromium updated
