/**
 * CLI Command: render
 * Render the scene to a video file.
 */

import { Command } from 'commander';
import { resolve } from 'node:path';
import { Project } from '../../core/Project.js';
import { renderScene } from '../../renderer/Renderer.js';
import { loadPreset } from '../helpers.js';
import { output } from '../output.js';

export function registerRenderCommands(program: Command): void {
  program
    .command('render')
    .description('Render the scene to a video file')
    .option('-o, --output <path>', 'Output file path', 'output/video.mp4')
    .option('--preset <name>', 'Output preset (youtube-1080p, tiktok, etc.)')
    .option('--format <fmt>', 'Format: mp4, mov, webm, gif')
    .option('--quality <n>', 'Quality 1-100', parseInt, 85)
    .option('--start <time>', 'Render start time')
    .option('--end <time>', 'Render end time')
    .option('--batch <presets>', 'Batch render for multiple presets (comma-separated)')
    .action(async (opts: Record<string, any>) => {
      const project = await Project.load(process.cwd());
      const scene = project.scene.toJSON();

      // Load preset config
      let presetConfig = {};
      if (opts.preset) {
        presetConfig = await loadPreset(opts.preset);
      }

      const renderConfig = {
        output: resolve(process.cwd(), opts.output),
        format: opts.format || 'mp4',
        width: scene.config.width,
        height: scene.config.height,
        fps: scene.config.fps,
        codec: 'libx264',
        videoBitrate: '8M',
        audioBitrate: '192k',
        audioCodec: 'aac',
        quality: opts.quality,
        pixelFormat: 'yuv420p',
        ...presetConfig,
      };

      const isJson = program.opts().json;

      try {
        const result = await renderScene(scene, renderConfig, (progress) => {
          if (!isJson) {
            process.stdout.write(`\r[${progress.phase}] ${progress.percent.toFixed(0)}% — ${progress.message}`);
          }
        });

        if (!isJson) process.stdout.write('\n');

        output(isJson, {
          success: true,
          message: `Rendered: ${result.outputPath} (${result.duration.toFixed(1)}s)`,
          data: result,
        });
      } catch (err: any) {
        output(isJson, {
          success: false,
          message: `Render failed: ${err.message}`,
          errors: [err.message],
        });
        process.exit(1);
      }
    });
}
