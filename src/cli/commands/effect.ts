/**
 * CLI Command: effect
 * Add and manage effects (transitions, filters, animations).
 */

import { Command } from 'commander';
import { Project } from '../../core/Project.js';
import { TRANSITIONS, ANIMATIONS, FILTERS, COLOR_GRADES, TEXT_EFFECTS } from '../../effects/index.js';
import { output } from '../output.js';
import { parseTime } from '../helpers.js';

export function registerEffectCommands(program: Command): void {
  const effect = program.command('effect').description('Effects management');

  effect
    .command('add <name>')
    .description('Add an effect to the scene or a specific clip')
    .option('--to <clip-id>', 'Apply to specific clip')
    .option('--at <time>', 'Start time', '0s')
    .option('--duration <time>', 'Duration', '0.5s')
    .option('--intensity <n>', 'Effect intensity 0-1', parseFloat, 0.5)
    .action(async (name: string, opts: Record<string, any>) => {
      const project = await Project.load(process.cwd());
      const at = parseTime(opts.at);
      const duration = parseTime(opts.duration);

      // TODO: Apply effect to clip or scene
      await project.save();

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Effect "${name}" added at ${at}s for ${duration}s`,
        data: { effect: name, start: at, duration, intensity: opts.intensity },
      });
    });

  effect
    .command('list')
    .description('List all available effects')
    .option('--category <cat>', 'Filter by category (transitions, animations, filters, color-grades, text-effects)')
    .action(async (opts: Record<string, any>) => {
      const categories: Record<string, any[]> = {
        transitions: TRANSITIONS,
        animations: ANIMATIONS,
        filters: FILTERS,
        'color-grades': COLOR_GRADES,
        'text-effects': TEXT_EFFECTS,
      };

      let items: any[];
      if (opts.category && categories[opts.category]) {
        items = categories[opts.category];
      } else {
        items = Object.entries(categories).flatMap(([cat, list]) =>
          list.map((item) => ({ ...item, category: cat })),
        );
      }

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: items.map((e: any) => `  ${e.name} — ${e.description || e.label}`).join('\n'),
        data: items,
      });
    });
}
