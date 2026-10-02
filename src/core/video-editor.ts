/**
 * MotionForge — Video Editor Operations
 *
 * High-level professional video editing operations:
 * - Picture-in-Picture (PiP)
 * - Split Screen (side-by-side / top-bottom)
 * - B-Roll Overlays with transitions
 * - Chroma Key / Green Screen compositing
 * - Speed Ramps and Audio Ducking
 */

import type { Scene } from './Scene.js';
import type { VideoContent, ImageContent } from './types.js';

export interface PipOptions {
  videoSrc: string;
  start: number;
  duration: number;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  width?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
}

export interface SplitScreenOptions {
  leftVideoSrc: string;
  rightVideoSrc: string;
  start: number;
  duration: number;
}

export class VideoEditorOps {
  /**
   * Add a Picture-in-Picture (PiP) video overlay
   */
  static addPictureInPicture(scene: Scene, options: PipOptions) {
    const {
      videoSrc,
      start,
      duration,
      position,
      width = 480,
      height = 270,
      borderRadius = 16,
      borderWidth = 3,
      borderColor = '#00F0FF',
    } = options;

    const track = scene.addTrack('video', 'PiP Overlay');
    const content: VideoContent = {
      type: 'video',
      src: videoSrc,
      trimStart: 0,
      trimEnd: duration,
      speed: 1,
      volume: 0,
      muted: true,
    };

    const clip = track.addClip('video', content, start, duration);

    // Calculate position coordinates
    const margin = 40;
    let x = margin + width / 2;
    let y = margin + height / 2;

    if (position === 'top-right') {
      x = scene.config.width - margin - width / 2;
      y = margin + height / 2;
    } else if (position === 'bottom-right') {
      x = scene.config.width - margin - width / 2;
      y = scene.config.height - margin - height / 2;
    } else if (position === 'bottom-left') {
      x = margin + width / 2;
      y = scene.config.height - margin - height / 2;
    }

    clip.setTransform({
      x,
      y,
      width,
      height,
      anchorX: 0.5,
      anchorY: 0.5,
    });

    clip.addKeyframe('scaleX', 0, 0, 'ease-out-back');
    clip.addKeyframe('scaleY', 0, 0, 'ease-out-back');
    clip.addKeyframe('scaleX', 0.5, 1, 'ease-out-back');
    clip.addKeyframe('scaleY', 0.5, 1, 'ease-out-back');

    return clip;
  }

  /**
   * Create a Split-Screen video layout (Left vs Right)
   */
  static addSplitScreen(scene: Scene, options: SplitScreenOptions) {
    const { leftVideoSrc, rightVideoSrc, start, duration } = options;
    const halfWidth = scene.config.width / 2;
    const height = scene.config.height;

    // Left Video Track
    const leftTrack = scene.addTrack('video', 'Left Split');
    const leftClip = leftTrack.addClip(
      'video',
      {
        type: 'video',
        src: leftVideoSrc,
        trimStart: 0,
        trimEnd: duration,
        speed: 1,
        volume: 1,
        muted: false,
      },
      start,
      duration,
    );
    leftClip.setTransform({
      x: halfWidth / 2,
      y: height / 2,
      width: halfWidth,
      height,
      anchorX: 0.5,
      anchorY: 0.5,
    });

    // Right Video Track
    const rightTrack = scene.addTrack('video', 'Right Split');
    const rightClip = rightTrack.addClip(
      'video',
      {
        type: 'video',
        src: rightVideoSrc,
        trimStart: 0,
        trimEnd: duration,
        speed: 1,
        volume: 0,
        muted: true,
      },
      start,
      duration,
    );
    rightClip.setTransform({
      x: halfWidth + halfWidth / 2,
      y: height / 2,
      width: halfWidth,
      height,
      anchorX: 0.5,
      anchorY: 0.5,
    });

    return { leftClip, rightClip };
  }
}
