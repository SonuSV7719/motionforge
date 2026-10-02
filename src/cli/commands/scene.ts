/**
 * CLI Command: scene
 * Create, inspect, and modify scenes.
 */

import { Command } from 'commander';
import { Project } from '../../core/Project.js';
import { Scene } from '../../core/Scene.js';
import { output } from '../output.js';

export function registerSceneCommands(program: Command): void {
  const scene = program.command('scene').description('Scene management');

  scene
    .command('create')
    .description('Create a new scene in the current project')
    .option('--1080p', '1920×1080')
    .option('--4k', '3840×2160')
    .option('--vertical', '1080×1920')
    .option('--square', '1080×1080')
    .option('--width <n>', 'Width in pixels', parseInt)
    .option('--height <n>', 'Height in pixels', parseInt)
    .option('--fps <n>', 'Frames per second', parseInt)
    .option('--duration <n>', 'Duration in seconds', parseFloat)
    .option('--bg <color>', 'Background color')
    .option('--name <name>', 'Scene name')
    .action(async (opts: Record<string, any>) => {
      let width = opts.width || 1920;
      let height = opts.height || 1080;
      if (opts['4k']) { width = 3840; height = 2160; }
      if (opts.vertical) { width = 1080; height = 1920; }
      if (opts.square) { width = 1080; height = 1080; }

      const newScene = new Scene({
        width,
        height,
        fps: opts.fps || 30,
        duration: opts.duration || 10,
        background: opts.bg || '#000000',
        name: opts.name,
      }, { name: opts.name || 'Untitled Scene' });

      const project = new Project(process.cwd(), newScene);
      await project.save();

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Scene created: ${width}×${height} @ ${newScene.config.fps}fps, ${newScene.config.duration}s`,
        data: { sceneId: newScene.id, ...newScene.config },
      });
    });

  scene
    .command('info')
    .description('Show current scene information')
    .action(async () => {
      const project = await Project.load(process.cwd());
      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: project.scene.getSummary(),
        data: project.scene.toJSON(),
      });
    });

  scene
    .command('set')
    .description('Modify scene properties')
    .option('--duration <n>', 'Duration in seconds', parseFloat)
    .option('--bg <color>', 'Background color')
    .option('--fps <n>', 'FPS', parseInt)
    .option('--name <name>', 'Scene name')
    .action(async (opts: Record<string, any>) => {
      const project = await Project.load(process.cwd());
      const updates: Record<string, any> = {};
      if (opts.duration) updates.duration = opts.duration;
      if (opts.bg) updates.background = opts.bg;
      if (opts.fps) updates.fps = opts.fps;
      if (opts.name) project.scene.metadata.name = opts.name;

      project.scene.setConfig(updates);
      await project.save();

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Scene updated`,
        data: project.scene.config,
      });
    });
}
