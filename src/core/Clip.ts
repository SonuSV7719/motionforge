/**
 * MotionForge — Clip
 *
 * A clip is a piece of content placed on a track at a specific time.
 * Clips hold content (text, video, image, shape, etc.),
 * a transform (position, rotation, scale), keyframes, and effects.
 */

import { nanoid } from 'nanoid';
import type {
  ClipId,
  ClipType,
  ClipData,
  ClipContent,
  Transform,
  KeyframeData,
  KeyframeId,
  EffectData,
  EffectId,
  EffectType,
  AnimatableProperty,
  EasingType,
  TimeSeconds,
} from './types.js';

/** Default transform (centered, no rotation/scale) */
const DEFAULT_TRANSFORM: Transform = {
  x: 0,
  y: 0,
  width: 'auto',
  height: 'auto',
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  anchorX: 0.5,
  anchorY: 0.5,
  skewX: 0,
  skewY: 0,
};

export class Clip {
  readonly id: ClipId;
  readonly type: ClipType;
  content: ClipContent;
  start: TimeSeconds;
  duration: TimeSeconds;
  transform: Transform;
  keyframes: Map<KeyframeId, KeyframeData>;
  effects: Map<EffectId, EffectData>;
  opacity: number;
  visible: boolean;
  locked: boolean;

  constructor(
    type: ClipType,
    content: ClipContent,
    start: TimeSeconds = 0,
    duration: TimeSeconds = 5,
  ) {
    this.id = nanoid(12) as ClipId;
    this.type = type;
    this.content = content;
    this.start = start;
    this.duration = duration;
    this.transform = { ...DEFAULT_TRANSFORM };
    this.keyframes = new Map();
    this.effects = new Map();
    this.opacity = 1;
    this.visible = true;
    this.locked = false;
  }

  // ─── Timeline ────────────────────────────────────────────────

  /** Get end time of this clip */
  get end(): TimeSeconds {
    return this.start + this.duration;
  }

  /** Move clip to a new start time */
  moveTo(time: TimeSeconds): void {
    this.start = Math.max(0, time);
  }

  /** Trim clip (adjust start/duration) */
  trim(newStart: TimeSeconds, newDuration: TimeSeconds): void {
    this.start = Math.max(0, newStart);
    this.duration = Math.max(0.001, newDuration);
  }

  /** Split clip at a time, returns the new second clip */
  split(atTime: TimeSeconds): Clip | null {
    const relativeTime = atTime - this.start;
    if (relativeTime <= 0 || relativeTime >= this.duration) {
      return null;
    }

    const secondClip = new Clip(
      this.type,
      structuredClone(this.content),
      atTime,
      this.duration - relativeTime,
    );
    secondClip.transform = { ...this.transform };
    secondClip.opacity = this.opacity;

    this.duration = relativeTime;

    return secondClip;
  }

  // ─── Keyframes ───────────────────────────────────────────────

  /** Add a keyframe */
  addKeyframe(
    property: AnimatableProperty,
    time: TimeSeconds,
    value: number,
    easing: EasingType = 'ease-out',
  ): KeyframeData {
    const kf: KeyframeData = {
      id: nanoid(8) as KeyframeId,
      property,
      time,
      value,
      easing,
    };
    this.keyframes.set(kf.id, kf);
    return kf;
  }

  /** Remove a keyframe */
  removeKeyframe(id: KeyframeId): boolean {
    return this.keyframes.delete(id);
  }

  /** Get keyframes for a specific property, sorted by time */
  getKeyframesForProperty(property: AnimatableProperty): KeyframeData[] {
    return Array.from(this.keyframes.values())
      .filter((kf) => kf.property === property)
      .sort((a, b) => a.time - b.time);
  }

  /** Get all keyframes sorted by time */
  getAllKeyframes(): KeyframeData[] {
    return Array.from(this.keyframes.values()).sort((a, b) => a.time - b.time);
  }

  // ─── Effects ─────────────────────────────────────────────────

  /** Add an effect */
  addEffect(
    type: EffectType,
    name: string,
    start: TimeSeconds = 0,
    duration: TimeSeconds = this.duration,
    params: Record<string, unknown> = {},
  ): EffectData {
    const effect: EffectData = {
      id: nanoid(8) as EffectId,
      type,
      name,
      start,
      duration,
      params,
    };
    this.effects.set(effect.id, effect);
    return effect;
  }

  /** Remove an effect */
  removeEffect(id: EffectId): boolean {
    return this.effects.delete(id);
  }

  /** Get all effects */
  getEffects(): EffectData[] {
    return Array.from(this.effects.values());
  }

  // ─── Transform ───────────────────────────────────────────────

  /** Set transform properties */
  setTransform(updates: Partial<Transform>): void {
    this.transform = { ...this.transform, ...updates };
  }

  /** Set position */
  setPosition(x: number, y: number): void {
    this.transform.x = x;
    this.transform.y = y;
  }

  /** Set scale (uniform) */
  setScale(scale: number): void {
    this.transform.scaleX = scale;
    this.transform.scaleY = scale;
  }

  // ─── Serialization ───────────────────────────────────────────

  toJSON(): ClipData {
    return {
      id: this.id,
      type: this.type,
      start: this.start,
      duration: this.duration,
      content: structuredClone(this.content),
      transform: { ...this.transform },
      keyframes: Array.from(this.keyframes.values()),
      effects: Array.from(this.effects.values()),
      opacity: this.opacity,
      visible: this.visible,
      locked: this.locked,
    };
  }

  static fromJSON(data: ClipData): Clip {
    const clip = new Clip(data.type, data.content, data.start, data.duration);
    Object.assign(clip, {
      id: data.id,
      transform: data.transform,
      opacity: data.opacity,
      visible: data.visible,
      locked: data.locked,
    });

    for (const kf of data.keyframes) {
      clip.keyframes.set(kf.id, kf);
    }
    for (const eff of data.effects) {
      clip.effects.set(eff.id, eff);
    }

    return clip;
  }
}
