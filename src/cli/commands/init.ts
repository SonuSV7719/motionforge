/**
 * CLI Command: init
 * Initialize a new MotionForge project.
 */

import { Command } from 'commander';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Project } from '../../core/Project.js';
import { Scene } from '../../core/Scene.js';
import { output } from '../output.js';

export function registerInitCommand(program: Command): void {
  program
    .command('init [name]')
    .description('Initialize a new MotionForge project')
    .option('--1080p', 'Set resolution to 1920×1080 (default)')
    .option('--4k', 'Set resolution to 3840×2160')
    .option('--vertical', 'Set resolution to 1080×1920 (Stories/Reels)')
    .option('--square', 'Set resolution to 1080×1080 (Instagram Post)')
    .option('--width <n>', 'Custom width', parseInt)
    .option('--height <n>', 'Custom height', parseInt)
    .option('--fps <n>', 'Frames per second', parseInt)
    .option('--duration <n>', 'Duration in seconds', parseFloat)
    .option('--template <id>', 'Initialize from template')
    .action(async (name: string | undefined, opts: Record<string, any>) => {
      const projectName = name || 'my-video';
      const projectDir = resolve(process.cwd(), projectName);

      // Determine resolution
      let width = opts.width || 1920;
      let height = opts.height || 1080;

      if (opts['4k']) { width = 3840; height = 2160; }
      if (opts.vertical) { width = 1080; height = 1920; }
      if (opts.square) { width = 1080; height = 1080; }

      const scene = new Scene(
        {
          width,
          height,
          fps: opts.fps || 30,
          duration: opts.duration || 10,
          background: '#000000',
          name: projectName,
        },
        { name: projectName },
      );

      const project = new Project(projectDir, scene);

      // Create project directories
      const dirs = ['assets', 'output', 'templates'];
      for (const dir of dirs) {
        const dirPath = join(projectDir, dir);
        if (!existsSync(dirPath)) {
          await mkdir(dirPath, { recursive: true });
        }
      }

      await project.save();

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Project "${projectName}" created at ${projectDir}`,
        data: {
          name: projectName,
          dir: projectDir,
          resolution: `${width}×${height}`,
          fps: scene.config.fps,
          duration: scene.config.duration,
        },
      });
    });
}
