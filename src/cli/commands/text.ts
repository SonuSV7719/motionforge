/**
 * CLI Command: text
 * Add and manipulate text elements.
 */

import { Command } from 'commander';
import { Project } from '../../core/Project.js';
import type { TextContent, TrackId } from '../../core/types.js';
import { output } from '../output.js';
import { parseTime } from '../helpers.js';
import { detectFontPairing } from '../../assets/font-matcher.js';

export function registerTextCommands(program: Command): void {
  const text = program.command('text').description('Text and typography');

  text
    .command('add <content>')
    .description('Add a text element to the scene')
    .option('--font <name>', 'Font family (auto-detects from context if omitted)')
    .option('--size <px>', 'Font size in px', parseInt, 48)
    .option('--weight <n>', 'Font weight', parseInt, 700)
    .option('--color <hex>', 'Text color', '#ffffff')
    .option('--bg <hex>', 'Background color')
    .option('--align <align>', 'Text alignment (left, center, right)', 'center')
    .option('--pos <position>', 'Position (center, top, bottom, bottom-left, bottom-right, top-left, top-right)', 'center')
    .option('--animate <preset>', 'Animation preset (fade-in, fade-up, slide-in-left, etc.)')
    .option('--at <time>', 'Start time (e.g., 2s, 1500ms)', '0s')
    .option('--duration <time>', 'Duration (e.g., 5s)', '5s')
    .option('--track <id>', 'Target track ID (auto-creates text track if omitted)')
    .option('--line-height <n>', 'Line height multiplier', parseFloat, 1.4)
    .option('--letter-spacing <n>', 'Letter spacing in px', parseFloat)
    .option('--max-width <px>', 'Max width in px', parseInt)
    .option('--padding <px>', 'Padding in px', parseInt)
    .action(async (content: string, opts: Record<string, any>) => {
      const project = await Project.load(process.cwd());

      // Smart Font Auto-Detection if not explicitly supplied
      let resolvedFont = opts.font;
      let resolvedSpacing = opts.letterSpacing;
      if (!resolvedFont) {
        const pairing = detectFontPairing(content, project.scene.metadata?.tags);
        resolvedFont = pairing.headingFont;
        if (resolvedSpacing === undefined) {
          resolvedSpacing = pairing.suggestedLetterSpacing;
        }
      }
      if (resolvedSpacing === undefined) resolvedSpacing = 0;

      // Find or create text track
      let track;
      if (opts.track) {
        track = project.scene.getTrack(opts.track as TrackId);
        if (!track) {
          process.stderr.write(`Track not found: ${opts.track}\n`);
          process.exit(1);
        }
      } else {
        const textTracks = project.scene.getTracksByType('text');
        track = textTracks[0] ?? project.scene.addTrack('text', 'Text');
      }

      const textContent: TextContent = {
        type: 'text',
        text: content,
        fontFamily: resolvedFont,
        fontSize: opts.size,
        fontWeight: opts.weight,
        fontStyle: 'normal',
        color: opts.color,
        backgroundColor: opts.bg,
        textAlign: opts.align,
        lineHeight: opts.lineHeight,
        letterSpacing: resolvedSpacing,
        maxWidth: opts.maxWidth,
        padding: opts.padding,
      };

      const startTime = parseTime(opts.at);
      const duration = parseTime(opts.duration);

      const clip = track.addClip('text', textContent, startTime, duration);

      // Apply position
      const pos = resolvePosition(opts.pos, project.scene.config.width, project.scene.config.height);
      clip.setPosition(pos.x, pos.y);

      // Apply animation
      if (opts.animate) {
        clip.addEffect('animation', opts.animate, 0, Math.min(0.6, duration), {});
      }

      await project.save();

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Text "${content}" added at ${startTime}s for ${duration}s`,
        data: {
          clipId: clip.id,
          trackId: track.id,
          text: content,
          start: startTime,
          duration,
          animation: opts.animate || null,
        },
      });
    });
}

/** Resolve named positions to x,y coordinates */
function resolvePosition(
  pos: string,
  sceneWidth: number,
  sceneHeight: number,
): { x: number; y: number } {
  const margin = 60;
  const positions: Record<string, { x: number; y: number }> = {
    center: { x: sceneWidth / 2, y: sceneHeight / 2 },
    top: { x: sceneWidth / 2, y: margin + 40 },
    bottom: { x: sceneWidth / 2, y: sceneHeight - margin - 40 },
    'bottom-left': { x: margin, y: sceneHeight - margin - 40 },
    'bottom-right': { x: sceneWidth - margin, y: sceneHeight - margin - 40 },
    'top-left': { x: margin, y: margin + 40 },
    'top-right': { x: sceneWidth - margin, y: margin + 40 },
  };
  return positions[pos] ?? positions.center;
}
