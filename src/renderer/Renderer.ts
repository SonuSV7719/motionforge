/**
 * MotionForge — Renderer
 *
 * Orchestrates the full rendering pipeline:
 * Scene → HTML Composition → Headless Chrome Frame Capture → FFmpeg Encode → Output
 */

import { writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { SceneData, RenderConfig } from '../core/types.js';
import { composeHTML } from '../compositor/Compositor.js';
import { captureFrames } from './frame-capture.js';
import { encodeVideo } from './ffmpeg-pipeline.js';

export interface RenderProgress {
  phase: 'composing' | 'capturing' | 'encoding' | 'done';
  percent: number;
  message: string;
}

export type ProgressCallback = (progress: RenderProgress) => void;

/**
 * Render a scene to a video file.
 */
export async function renderScene(
  scene: SceneData,
  config: RenderConfig,
  onProgress?: ProgressCallback,
): Promise<{ outputPath: string; duration: number; fileSize: number }> {
  const startTime = Date.now();

  // Phase 1: Compose HTML
  onProgress?.({ phase: 'composing', percent: 0, message: 'Building HTML composition...' });
  const html = composeHTML(scene);

  // Create temp directory for frames
  const tmpDir = join(process.cwd(), '.mf-cache', `render-${Date.now()}`);
  if (!existsSync(tmpDir)) {
    await mkdir(tmpDir, { recursive: true });
  }

  // Write HTML to temp file
  const htmlPath = join(tmpDir, 'composition.html');
  await writeFile(htmlPath, html, 'utf-8');

  try {
    // Phase 2: Capture frames
    onProgress?.({ phase: 'capturing', percent: 10, message: 'Capturing frames...' });

    const frameDir = join(tmpDir, 'frames');
    await mkdir(frameDir, { recursive: true });

    const totalFrames = Math.ceil(scene.config.duration * scene.config.fps);

    await captureFrames({
      htmlPath,
      frameDir,
      width: config.width || scene.config.width,
      height: config.height || scene.config.height,
      fps: config.fps || scene.config.fps,
      totalFrames,
      startFrame: config.startTime ? Math.floor(config.startTime * scene.config.fps) : 0,
      endFrame: config.endTime ? Math.ceil(config.endTime * scene.config.fps) : totalFrames,
      onProgress: (captured, total) => {
        const percent = 10 + (captured / total) * 70;
        onProgress?.({
          phase: 'capturing',
          percent,
          message: `Capturing frame ${captured}/${total}`,
        });
      },
    });

    // Phase 3: Encode video & audio
    onProgress?.({ phase: 'encoding', percent: 80, message: 'Encoding video and audio...' });

    // Extract audio clips from scene tracks
    const audioTracks = [];
    for (const track of scene.tracks) {
      if (!track.visible || track.type !== 'audio') continue;
      for (const clip of track.clips) {
        if (!clip.visible) continue;
        const content = clip.content as any;
        if (content && content.src) {
          audioTracks.push({
            src: content.src,
            start: clip.start,
            duration: clip.duration,
            volume: (content.volume ?? 1.0) * track.opacity,
            fadeIn: content.fadeIn,
            fadeOut: content.fadeOut,
          });
        }
      }
    }

    const outputPath = config.output;
    await encodeVideo({
      frameDir,
      outputPath,
      fps: config.fps || scene.config.fps,
      width: config.width || scene.config.width,
      height: config.height || scene.config.height,
      codec: config.codec || 'libx264',
      videoBitrate: config.videoBitrate || '8M',
      pixelFormat: config.pixelFormat || 'yuv420p',
      quality: config.quality || 85,
      format: config.format || 'mp4',
      audioTracks,
    });

    const duration = (Date.now() - startTime) / 1000;

    onProgress?.({
      phase: 'done',
      percent: 100,
      message: `Render complete: ${outputPath} (${duration.toFixed(1)}s)`,
    });

    return {
      outputPath,
      duration,
      fileSize: 0, // Will be updated after file is written
    };
  } finally {
    // Cleanup temp directory
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
