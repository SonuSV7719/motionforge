/**
 * CLI Command: track
 * Manage timeline tracks.
 */

import { Command } from 'commander';
import { Project } from '../../core/Project.js';
import type { TrackType } from '../../core/types.js';
import { output } from '../output.js';

export function registerTrackCommands(program: Command): void {
  const track = program.command('track').description('Track management');

  track
    .command('add <type>')
    .description('Add a track (types: video, audio, text, shape, image, template)')
    .option('--name <name>', 'Track name')
    .action(async (type: string, opts: Record<string, any>) => {
      const validTypes: TrackType[] = ['video', 'audio', 'text', 'shape', 'image', 'template'];
      if (!validTypes.includes(type as TrackType)) {
        process.stderr.write(`Invalid track type: ${type}. Must be one of: ${validTypes.join(', ')}\n`);
        process.exit(1);
      }

      const project = await Project.load(process.cwd());
      const newTrack = project.scene.addTrack(type as TrackType, opts.name);
      await project.save();

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Track "${newTrack.name}" added (${newTrack.type})`,
        data: { trackId: newTrack.id, type: newTrack.type, name: newTrack.name },
      });
    });

  track
    .command('list')
    .description('List all tracks')
    .action(async () => {
      const project = await Project.load(process.cwd());
      const tracks = project.scene.getTracks();
      const isJson = program.opts().json;

      output(isJson, {
        success: true,
        message: tracks.map((t) => `  [${t.type}] ${t.name} (${t.clipCount} clips)`).join('\n'),
        data: tracks.map((t) => t.toJSON()),
      });
    });

  track
    .command('remove <id>')
    .description('Remove a track by ID')
    .action(async (id: string) => {
      const project = await Project.load(process.cwd());
      const removed = project.scene.removeTrack(id as any);
      if (!removed) {
        process.stderr.write(`Track not found: ${id}\n`);
        process.exit(1);
      }
      await project.save();

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Track ${id} removed`,
      });
    });
}
