/**
 * MotionForge — FFmpeg Pipeline
 *
 * Encodes captured PNG frames into video using native FFmpeg process execution.
 * Handles spaces in Windows paths, custom resolutions, and formats (MP4, WebM, GIF).
 */

import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';

export interface AudioTrackInput {
  src: string;
  start: number;
  duration?: number;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface EncodeOptions {
  frameDir: string;
  outputPath: string;
  fps: number;
  width: number;
  height: number;
  codec: string;
  videoBitrate: string;
  pixelFormat: string;
  quality: number;
  format: string;
  audioPath?: string;
  audioTracks?: AudioTrackInput[];
}

/**
 * Encode frames into a video file using FFmpeg.
 */
export function encodeVideo(options: EncodeOptions): Promise<void> {
  const {
    frameDir,
    outputPath,
    fps,
    width,
    height,
    codec,
    videoBitrate,
    pixelFormat,
    quality,
    format,
    audioPath,
    audioTracks = [],
  } = options;

  // Ensure output directory exists
  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Combine audioPath into audioTracks if provided
  const allAudioTracks: AudioTrackInput[] = [...audioTracks];
  if (audioPath && !allAudioTracks.some((t) => t.src === audioPath)) {
    allAudioTracks.push({ src: audioPath, start: 0, volume: 1 });
  }

  return new Promise((resolve, reject) => {
    const framePattern = join(frameDir, 'frame_%06d.png');
    const args: string[] = [
      '-y',
      '-framerate',
      String(fps),
      '-i',
      framePattern,
    ];

    // Add audio inputs
    for (const track of allAudioTracks) {
      args.push('-i', track.src);
    }

    // Audio filter complex for multi-track mixing
    if (allAudioTracks.length === 1) {
      const track = allAudioTracks[0];
      const delayMs = Math.round((track.start || 0) * 1000);
      const vol = track.volume ?? 1.0;
      args.push(
        '-filter_complex',
        `[1:a]adelay=${delayMs}|${delayMs},volume=${vol}[aout]`,
        '-map',
        '0:v',
        '-map',
        '[aout]',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
      );
    } else if (allAudioTracks.length > 1) {
      const filterNodes: string[] = [];
      const mixInputs: string[] = [];

      allAudioTracks.forEach((track, index) => {
        const inputIdx = index + 1;
        const delayMs = Math.round((track.start || 0) * 1000);
        const vol = track.volume ?? 1.0;
        const outLabel = `a${inputIdx}`;
        filterNodes.push(`[${inputIdx}:a]adelay=${delayMs}|${delayMs},volume=${vol}[${outLabel}]`);
        mixInputs.push(`[${outLabel}]`);
      });

      filterNodes.push(`${mixInputs.join('')}amix=inputs=${allAudioTracks.length}:duration=longest:dropout_transition=2[aout]`);

      args.push(
        '-filter_complex',
        filterNodes.join(';'),
        '-map',
        '0:v',
        '-map',
        '[aout]',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
      );
    }

    if (format === 'gif') {
      args.push(
        '-vf',
        `fps=${Math.min(fps, 15)},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
      );
    } else if (format === 'webm') {
      args.push('-c:v', 'libvpx-vp9', '-b:v', `${Math.round(quality * 0.1)}M`);
    } else {
      args.push(
        '-c:v',
        codec || 'libx264',
        '-b:v',
        videoBitrate || '8M',
        '-pix_fmt',
        pixelFormat || 'yuv420p',
        '-movflags',
        '+faststart',
      );
    }

    args.push(outputPath);

    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';

    proc.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}: ${stderr.slice(-500)}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to start FFmpeg: ${err.message}`));
    });
  });
}

/**
 * Check if FFmpeg is available on the system.
 */
export function checkFFmpeg(): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn('ffmpeg', ['-version'], { stdio: 'ignore' });
    proc.on('close', (code) => resolve(code === 0));
    proc.on('error', () => resolve(false));
  });
}
