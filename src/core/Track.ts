/**
 * MotionForge — Track
 *
 * A track is a horizontal lane on the timeline that holds clips.
 * Tracks have a type (video, audio, text, shape, image, template)
 * and manage the ordering and overlap of their clips.
 */

import { nanoid } from 'nanoid';
import type {
  TrackId,
  TrackType,
  TrackData,
  ClipId,
  ClipType,
  ClipContent,
  TimeSeconds,
  BlendMode,
} from './types.js';
import { Clip } from './Clip.js';

export class Track {
  readonly id: TrackId;
  readonly type: TrackType;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  order: number;
  private clips: Map<ClipId, Clip>;
  private clipOrder: ClipId[];

  constructor(type: TrackType, name?: string) {
    this.id = nanoid(12) as TrackId;
    this.type = type;
    this.name = name ?? `${type.charAt(0).toUpperCase() + type.slice(1)} Track`;
    this.visible = true;
    this.locked = false;
    this.opacity = 1;
    this.blendMode = 'normal';
    this.order = 0;
    this.clips = new Map();
    this.clipOrder = [];
  }

  // ─── Clip Management ─────────────────────────────────────────

  /** Add a new clip to the track */
  addClip(
    type: ClipType,
    content: ClipContent,
    start: TimeSeconds = 0,
    duration: TimeSeconds = 5,
  ): Clip {
    const clip = new Clip(type, content, start, duration);
    this.clips.set(clip.id, clip);
    this.clipOrder.push(clip.id);
    this.sortClips();
    return clip;
  }

  /** Get a clip by ID */
  getClip(id: ClipId): Clip | undefined {
    return this.clips.get(id);
  }

  /** Get all clips sorted by start time */
  getClips(): Clip[] {
    return this.clipOrder
      .map((id) => this.clips.get(id))
      .filter((c): c is Clip => c !== undefined);
  }

  /** Remove a clip */
  removeClip(id: ClipId): boolean {
    const removed = this.clips.delete(id);
    if (removed) {
      this.clipOrder = this.clipOrder.filter((cid) => cid !== id);
    }
    return removed;
  }

  /** Get end time of the last clip in this track */
  getEnd(): TimeSeconds {
    let maxEnd = 0;
    for (const clip of this.clips.values()) {
      const clipEnd = clip.start + clip.duration;
      if (clipEnd > maxEnd) {
        maxEnd = clipEnd;
      }
    }
    return maxEnd;
  }

  /** Get the total duration of content in this track */
  get contentDuration(): TimeSeconds {
    return this.getEnd();
  }

  /** Get the number of clips */
  get clipCount(): number {
    return this.clips.size;
  }

  /** Find clips at a specific time */
  getClipsAtTime(time: TimeSeconds): Clip[] {
    return this.getClips().filter(
      (clip) => time >= clip.start && time < clip.start + clip.duration,
    );
  }

  // ─── Serialization ───────────────────────────────────────────

  toJSON(): TrackData {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      clips: this.getClips().map((c) => c.toJSON()),
      visible: this.visible,
      locked: this.locked,
      opacity: this.opacity,
      blendMode: this.blendMode,
      order: this.order,
    };
  }

  static fromJSON(data: TrackData): Track {
    const track = new Track(data.type, data.name);
    Object.assign(track, {
      id: data.id,
      visible: data.visible,
      locked: data.locked,
      opacity: data.opacity,
      blendMode: data.blendMode,
      order: data.order,
    });

    for (const clipData of data.clips) {
      const clip = Clip.fromJSON(clipData);
      track.clips.set(clip.id, clip);
      track.clipOrder.push(clip.id);
    }

    return track;
  }

  // ─── Helpers ─────────────────────────────────────────────────

  private sortClips(): void {
    this.clipOrder.sort((a, b) => {
      const clipA = this.clips.get(a);
      const clipB = this.clips.get(b);
      if (!clipA || !clipB) return 0;
      return clipA.start - clipB.start;
    });
  }
}
