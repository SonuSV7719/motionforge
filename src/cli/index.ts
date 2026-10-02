#!/usr/bin/env node
/**
 * MotionForge CLI — Entry Point
 *
 * The primary interface for both humans and AI coding agents.
 * All output supports --json flag for machine-readable agent parsing.
 */

import { Command } from 'commander';
import { registerSceneCommands } from './commands/scene.js';
import { registerTextCommands } from './commands/text.js';
import { registerTemplateCommands } from './commands/template.js';
import { registerEffectCommands } from './commands/effect.js';
import { registerRenderCommands } from './commands/render.js';
import { registerInitCommand } from './commands/init.js';
import { registerTrackCommands } from './commands/track.js';
import { registerPreviewCommand } from './commands/preview.js';
import { registerAudioCommands } from './commands/audio.js';
import { register3DCommands } from './commands/3d.js';

const program = new Command();

program
  .name('mf')
  .description('MotionForge — Open Source Agentic Motion Graphics & Video Editing Toolkit')
  .version('0.1.0')
  .option('--json', 'Output in JSON format (for AI agent parsing)')
  .option('--verbose', 'Verbose output');

// Register all command groups
registerInitCommand(program);
registerSceneCommands(program);
registerTrackCommands(program);
registerTextCommands(program);
registerTemplateCommands(program);
registerEffectCommands(program);
registerAudioCommands(program);
register3DCommands(program);
registerRenderCommands(program);
registerPreviewCommand(program);

// Status command — quick project info
program
  .command('status')
  .description('Show current project status')
  .action(async () => {
    const { Project } = await import('../core/Project.js');
    try {
      const project = await Project.load(process.cwd());
      const isJson = program.opts().json;
      if (isJson) {
        process.stdout.write(JSON.stringify({
          success: true,
          data: project.scene.toJSON(),
        }));
      } else {
        process.stdout.write(project.getSummary() + '\n');
      }
    } catch {
      process.stderr.write('No MotionForge project found in current directory.\n');
      process.stderr.write('Run `mf init <name>` to create one.\n');
      process.exit(1);
    }
  });

program.parse();
