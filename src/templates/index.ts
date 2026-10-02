/**
 * MotionForge — Template Engine
 *
 * Manages template discovery, validation, loading, and application.
 * Templates are HTML/CSS/GSAP compositions with customizable props.
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { TemplateManifest, TemplateCategory } from '../core/types.js';

/** Template directory locations (searched in order) */
const TEMPLATE_SEARCH_PATHS = [
  join(process.cwd(), 'templates'),
  // Built-in templates shipped with the package
];

export class TemplateEngine {
  private templates: Map<string, TemplateManifest>;
  private templateDirs: Map<string, string>;

  constructor() {
    this.templates = new Map();
    this.templateDirs = new Map();
  }

  /** Discover and load all available templates */
  async discover(additionalPaths: string[] = []): Promise<void> {
    const searchPaths = [...TEMPLATE_SEARCH_PATHS, ...additionalPaths];

    for (const basePath of searchPaths) {
      if (!existsSync(basePath)) continue;

      const entries = await readdir(basePath, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const templateDir = join(basePath, entry.name);
        const manifestPath = join(templateDir, 'manifest.json');

        if (!existsSync(manifestPath)) continue;

        try {
          const raw = await readFile(manifestPath, 'utf-8');
          const manifest: TemplateManifest = JSON.parse(raw);
          this.templates.set(manifest.id, manifest);
          this.templateDirs.set(manifest.id, templateDir);
        } catch {
          // Skip invalid templates silently
        }
      }
    }
  }

  /** List all templates, optionally filtered by category */
  list(category?: TemplateCategory): TemplateManifest[] {
    const all = Array.from(this.templates.values());
    if (category) {
      return all.filter((t) => t.category === category);
    }
    return all;
  }

  /** Get a template by ID */
  get(id: string): TemplateManifest | undefined {
    return this.templates.get(id);
  }

  /** Get the template directory path */
  getDir(id: string): string | undefined {
    return this.templateDirs.get(id);
  }

  /** Load template files (HTML, CSS, JS) */
  async loadFiles(id: string): Promise<{ html: string; css: string; js: string } | null> {
    const manifest = this.templates.get(id);
    const dir = this.templateDirs.get(id);

    if (!manifest || !dir) return null;

    const [html, css, js] = await Promise.all([
      readFile(join(dir, manifest.files.composition), 'utf-8').catch(() => ''),
      readFile(join(dir, manifest.files.style), 'utf-8').catch(() => ''),
      readFile(join(dir, manifest.files.animation), 'utf-8').catch(() => ''),
    ]);

    return { html, css, js };
  }

  /** Apply template props to text content (HTML, CSS, JS) */
  applyProps(content: string, props: Record<string, unknown>, manifest: TemplateManifest): string {
    let result = content;

    for (const [key, def] of Object.entries(manifest.props)) {
      const value = props[key] ?? def.default;
      const placeholder = `{{${key}}}`;
      result = result.replaceAll(placeholder, String(value));

      // Support CSS variables: var(--accentColor, default) or var(--accent-color, default)
      const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      const cssVarPattern = new RegExp(`var\\(--(?:mf-)?(?:${key}|${kebabKey})[^)]*\\)`, 'g');
      result = result.replace(cssVarPattern, String(value));
    }

    return result;
  }

  /** Validate props against template manifest */
  validateProps(
    props: Record<string, unknown>,
    manifest: TemplateManifest,
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [key, def] of Object.entries(manifest.props)) {
      if (def.required && !(key in props)) {
        errors.push(`Missing required prop: ${key}`);
      }
      if (key in props) {
        const val = props[key];
        if (def.type === 'enum' && def.values && !def.values.includes(String(val))) {
          errors.push(`Invalid value for ${key}: ${val}. Must be one of: ${def.values.join(', ')}`);
        }
        if (def.type === 'number') {
          const num = Number(val);
          if (isNaN(num)) errors.push(`${key} must be a number`);
          if (def.min !== undefined && num < def.min) errors.push(`${key} must be >= ${def.min}`);
          if (def.max !== undefined && num > def.max) errors.push(`${key} must be <= ${def.max}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /** Get template categories with counts */
  getCategories(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const template of this.templates.values()) {
      counts[template.category] = (counts[template.category] || 0) + 1;
    }
    return counts;
  }

  /** Search templates by keyword */
  search(query: string): TemplateManifest[] {
    const q = query.toLowerCase();
    return Array.from(this.templates.values()).filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
}
