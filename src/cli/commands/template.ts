/**
 * CLI Command: template
 * Discover, preview, and apply templates.
 */

import { Command } from 'commander';
import { TemplateEngine } from '../../templates/index.js';
import type { TemplateCategory } from '../../core/types.js';
import { output } from '../output.js';

export function registerTemplateCommands(program: Command): void {
  const template = program.command('template').description('Template management');

  template
    .command('list')
    .description('List all available templates')
    .option('--category <cat>', 'Filter by category')
    .action(async (opts: Record<string, any>) => {
      const engine = new TemplateEngine();
      await engine.discover();

      const templates = engine.list(opts.category as TemplateCategory | undefined);

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: templates.length > 0
          ? templates.map((t) => `  ${t.id} — ${t.name} [${t.category}]`).join('\n')
          : 'No templates found. Add templates to ./templates/',
        data: templates,
      });
    });

  template
    .command('info <id>')
    .description('Show template details and props')
    .action(async (id: string) => {
      const engine = new TemplateEngine();
      await engine.discover();
      const tmpl = engine.get(id);

      if (!tmpl) {
        process.stderr.write(`Template not found: ${id}\n`);
        process.exit(1);
      }

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: [
          `Template: ${tmpl.name}`,
          `Category: ${tmpl.category}`,
          `Duration: ${tmpl.duration}s`,
          `Description: ${tmpl.description}`,
          `Props:`,
          ...Object.entries(tmpl.props).map(
            ([k, v]) => `  --${k} (${v.type}) ${v.required ? '[required]' : `[default: ${v.default}]`} ${v.description || ''}`,
          ),
        ].join('\n'),
        data: tmpl,
      });
    });

  template
    .command('apply <id>')
    .description('Apply a template to the current scene')
    .option('--at <time>', 'Insert at timeline position', '0s')
    .option('--duration <time>', 'Override duration')
    .allowUnknownOption(true)
    .action(async (id: string, opts: Record<string, any>, cmd: Command) => {
      const engine = new TemplateEngine();
      await engine.discover();
      const tmpl = engine.get(id);

      if (!tmpl) {
        process.stderr.write(`Template not found: ${id}\n`);
        process.exit(1);
      }

      // Extract template props from unknown options
      const props: Record<string, unknown> = {};
      const rawArgs = cmd.args;
      for (let i = 0; i < rawArgs.length; i++) {
        const arg = rawArgs[i];
        if (arg.startsWith('--') && arg !== '--at' && arg !== '--duration') {
          const key = arg.replace('--', '');
          const value = rawArgs[i + 1];
          if (value && !value.startsWith('--')) {
            props[key] = value;
            i++;
          }
        }
      }

      // Validate props
      const validation = engine.validateProps(props, tmpl);
      if (!validation.valid) {
        process.stderr.write(`Invalid props:\n${validation.errors.join('\n')}\n`);
        process.exit(1);
      }

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Template "${tmpl.name}" applied with ${Object.keys(props).length} props`,
        data: { templateId: id, props, duration: tmpl.duration },
      });
    });

  template
    .command('search <query>')
    .description('Search templates by keyword')
    .action(async (query: string) => {
      const engine = new TemplateEngine();
      await engine.discover();
      const results = engine.search(query);

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: results.length > 0
          ? results.map((t) => `  ${t.id} — ${t.name}`).join('\n')
          : 'No templates match your search.',
        data: results,
      });
    });
}
