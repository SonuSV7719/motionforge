/**
 * MotionForge — Multi-Track Audio Mixer & Processor
 *
 * Handles background music, voiceover tracks, and sound effects (SFX).
 * Generates FFmpeg audio filter complexes with precise time delays, volume levels,
 * fade-ins, fade-outs, and voiceover audio ducking.
 */

import type { Scene } from './Scene.js';
import type { AudioContent, TimeSeconds } from './types.js';

export interface AudioTrackConfig {
  src: string;
  start: TimeSeconds;
  duration?: TimeSeconds;
  volume?: number; // 0.0 to 2.0 (1.0 = normal)
  fadeIn?: TimeSeconds;
  fadeOut?: TimeSeconds;
  type?: 'music' | 'voiceover' | 'sfx';
}

export class AudioMixer {
  /**
   * Add background music track to a scene
   */
  static addMusic(scene: Scene, config: AudioTrackConfig) {
    const track = scene.addTrack('audio', 'Background Music');
    const content: AudioContent = {
      type: 'audio',
      src: config.src,
      trimStart: 0,
      trimEnd: config.duration || scene.config.duration,
      speed: 1,
      volume: config.volume ?? 0.6,
      fadeIn: config.fadeIn ?? 1.0,
      fadeOut: config.fadeOut ?? 1.5,
    };

    return track.addClip('audio', content, config.start, config.duration || scene.config.duration);
  }

  /**
   * Add a voiceover track to a scene
   */
  static addVoiceover(scene: Scene, config: AudioTrackConfig) {
    const track = scene.addTrack('audio', 'Voiceover');
    const content: AudioContent = {
      type: 'audio',
      src: config.src,
      trimStart: 0,
      trimEnd: config.duration || scene.config.duration,
      speed: 1,
      volume: config.volume ?? 1.0,
      fadeIn: config.fadeIn ?? 0.2,
      fadeOut: config.fadeOut ?? 0.3,
    };

    return track.addClip('audio', content, config.start, config.duration || scene.config.duration);
  }

  /**
   * Add a sound effect (SFX) hit/whoosh/click to a scene
   */
  static addSoundEffect(scene: Scene, config: AudioTrackConfig) {
    const track = scene.addTrack('audio', 'SFX Hit');
    const content: AudioContent = {
      type: 'audio',
      src: config.src,
      trimStart: 0,
      trimEnd: config.duration || 2.0,
      speed: 1,
      volume: config.volume ?? 0.8,
      fadeIn: 0,
      fadeOut: config.fadeOut ?? 0.1,
    };

    return track.addClip('audio', content, config.start, config.duration || 2.0);
  }

  /**
   * Extract all active audio clips from scene tracks
   */
  static extractSceneAudioClips(scene: Scene): AudioTrackConfig[] {
    const clips: AudioTrackConfig[] = [];

    for (const track of scene.getTracks()) {
      if (!track.visible || track.type !== 'audio') continue;

      for (const clip of track.getClips()) {
        if (!clip.visible) continue;
        const content = clip.content as AudioContent;
        if (content.type === 'audio' && content.src) {
          clips.push({
            src: content.src,
            start: clip.start,
            duration: clip.duration,
            volume: content.volume * track.opacity,
            fadeIn: content.fadeIn,
            fadeOut: content.fadeOut,
          });
        }
      }
    }

    return clips;
  }
}
