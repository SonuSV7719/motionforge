/**
 * MotionForge — Cinematic Camera & Parallax Motion Controller
 *
 * Implements camera movements: Pan, Tilt, Dolly Zoom, Orbit, and 3D Parallax Depth Layers.
 */

import type { Scene } from '../core/Scene.js';

export type CameraMove =
  | 'dolly-in'
  | 'dolly-out'
  | 'pan-left'
  | 'pan-right'
  | 'tilt-up'
  | 'tilt-down'
  | 'crash-zoom'
  | 'slow-drift'
  | 'subtle-float';

export interface CameraMoveOptions {
  movement: CameraMove;
  start: number;
  duration: number;
  intensity?: number; // 0.1 to 2.0 (1.0 default)
  ease?: string;
}

export class CameraMotion {
  /**
   * Apply cinematic camera movement to the whole scene or stage
   */
  static applyCameraMovement(scene: Scene, options: CameraMoveOptions): string {
    const { movement, start, duration, intensity = 1.0, ease = 'power2.out' } = options;

    switch (movement) {
      case 'dolly-in':
        return `master.fromTo('#mf-scene', { scale: 1 }, { scale: ${1 + 0.15 * intensity}, duration: ${duration}, ease: '${ease}', transformOrigin: '50% 50%' }, ${start});`;
      case 'dolly-out':
        return `master.fromTo('#mf-scene', { scale: ${1 + 0.2 * intensity} }, { scale: 1, duration: ${duration}, ease: '${ease}', transformOrigin: '50% 50%' }, ${start});`;
      case 'pan-left':
        return `master.fromTo('#mf-scene', { x: 0 }, { x: ${-120 * intensity}, duration: ${duration}, ease: '${ease}' }, ${start});`;
      case 'pan-right':
        return `master.fromTo('#mf-scene', { x: 0 }, { x: ${120 * intensity}, duration: ${duration}, ease: '${ease}' }, ${start});`;
      case 'tilt-up':
        return `master.fromTo('#mf-scene', { y: 0 }, { y: ${-80 * intensity}, duration: ${duration}, ease: '${ease}' }, ${start});`;
      case 'tilt-down':
        return `master.fromTo('#mf-scene', { y: 0 }, { y: ${80 * intensity}, duration: ${duration}, ease: '${ease}' }, ${start});`;
      case 'crash-zoom':
        return `master.fromTo('#mf-scene', { scale: 1 }, { scale: ${1 + 0.4 * intensity}, duration: ${Math.min(duration, 0.4)}, ease: 'expo.out' }, ${start});`;
      case 'slow-drift':
        return `master.fromTo('#mf-scene', { scale: 1, rotation: 0 }, { scale: ${1 + 0.05 * intensity}, rotation: ${0.5 * intensity}, duration: ${duration}, ease: 'none' }, ${start});`;
      case 'subtle-float':
        return `master.to('#mf-scene', { y: '+=15', duration: ${duration / 2}, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ${start});`;
      default:
        return '';
    }
  }
}
