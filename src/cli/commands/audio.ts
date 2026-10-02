/**
 * CLI Command: audio
 * Manage background music, voiceover tracks, and sound effects (SFX).
 */

import { Command } from 'commander';
import { Project } from '../../core/Project.js';
import { parseTime } from '../helpers.js';
import { output } from '../output.js';
import type { AudioContent } from '../../core/types.js';

export function registerAudioCommands(program: Command): void {
  const audio = program.command('audio').description('Manage audio tracks, music, voiceovers, and SFX');

  // mf audio add <file>
  audio
    .command('add <file>')
    .description('Add an audio track (music, voiceover, sfx)')
    .option('--type <type>', 'Type: music, voiceover, sfx', 'music')
    .option('--name <name>', 'Track name')
    .option('--at <time>', 'Start time (e.g. 0, 1.5s)', '0')
    .option('--duration <time>', 'Duration (default: whole audio or scene duration)')
    .option('--volume <n>', 'Volume (0.0 to 2.0)', parseFloat, 1.0)
    .option('--fade-in <time>', 'Fade-in duration in seconds', parseFloat, 0)
    .option('--fade-out <time>', 'Fade-out duration in seconds', parseFloat, 0)
    .action(async (file: string, opts: Record<string, any>) => {
      const project = await Project.load(process.cwd());
      const scene = project.scene;
      const isJson = program.opts().json;

      const trackName = opts.name || (opts.type === 'voiceover' ? 'Voiceover' : opts.type === 'sfx' ? 'SFX' : 'Music');
      const track = scene.addTrack('audio', trackName);

      const start = parseTime(opts.at);
      const duration = opts.duration ? parseTime(opts.duration) : scene.config.duration - start;

      const audioContent: AudioContent = {
        type: 'audio',
        src: file,
        trimStart: 0,
        trimEnd: duration,
        speed: 1,
        volume: opts.volume ?? 1.0,
        fadeIn: opts.fadeIn ?? 0,
        fadeOut: opts.fadeOut ?? 0,
      };

      const clip = track.addClip('audio', audioContent, start, duration);
      await project.save();

      output(isJson, {
        success: true,
        message: `Added audio clip (${opts.type}) at ${start}s for ${duration}s (volume: ${opts.volume})`,
        data: {
          trackId: track.id,
          clipId: clip.id,
          src: file,
          start,
          duration,
          volume: opts.volume,
        },
      });
    });

  // mf audio list
  audio
    .command('list')
    .description('List all audio tracks and clips')
    .action(async () => {
      const project = await Project.load(process.cwd());
      const scene = project.scene;
      const isJson = program.opts().json;

      const audioTracks = scene.getTracks().filter((t) => t.type === 'audio');
      const clips = audioTracks.flatMap((t) =>
        t.getClips().map((c) => ({
          trackId: t.id,
          trackName: t.name,
          clipId: c.id,
          start: c.start,
          duration: c.duration,
          src: (c.content as AudioContent).src,
          volume: (c.content as AudioContent).volume,
        })),
      );

      output(isJson, {
        success: true,
        message: `Found ${clips.length} audio clip(s)`,
        data: clips,
      });
    });
}
