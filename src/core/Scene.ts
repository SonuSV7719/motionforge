/**
 * MotionForge — Scene
 *
 * Root container for a video composition.
 * A Scene holds tracks, which hold clips, which hold keyframes and effects.
 */

import { nanoid } from 'nanoid';
import type {
  SceneId,
  SceneConfig,
  SceneData,
  SceneMetadata,
  TrackData,
  TrackId,
  TrackType,
  TimeSeconds,
} from './types.js';
import { Track } from './Track.js';

/** Default scene configuration */
const DEFAULT_CONFIG: SceneConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 10,
  background: '#000000',
};

export class Scene {
  readonly id: SceneId;
  config: SceneConfig;
  metadata: SceneMetadata;
  private tracks: Map<TrackId, Track>;
  private trackOrder: TrackId[];
  private createdAt: string;
  private updatedAt: string;

  constructor(config?: Partial<SceneConfig>, metadata?: Partial<SceneMetadata>) {
    this.id = nanoid(12) as SceneId;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metadata = {
      name: metadata?.name ?? 'Untitled Scene',
      description: metadata?.description,
      author: metadata?.author,
      version: '1.0.0',
      tags: metadata?.tags ?? [],
    };
    this.tracks = new Map();
    this.trackOrder = [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
  }

  // ─── Track Management ────────────────────────────────────────

  /** Add a new track to the scene */
  addTrack(type: TrackType, name?: string): Track {
    const track = new Track(type, name);
    this.tracks.set(track.id, track);
    this.trackOrder.push(track.id);
    this.touch();
    return track;
  }

  /** Get a track by ID */
  getTrack(id: TrackId): Track | undefined {
    return this.tracks.get(id);
  }

  /** Get all tracks in order */
  getTracks(): Track[] {
    return this.trackOrder
      .map((id) => this.tracks.get(id))
      .filter((t): t is Track => t !== undefined);
  }

  /** Get tracks by type */
  getTracksByType(type: TrackType): Track[] {
    return this.getTracks().filter((t) => t.type === type);
  }

  /** Remove a track */
  removeTrack(id: TrackId): boolean {
    const removed = this.tracks.delete(id);
    if (removed) {
      this.trackOrder = this.trackOrder.filter((tid) => tid !== id);
      this.touch();
    }
    return removed;
  }

  /** Reorder tracks */
  reorderTracks(order: TrackId[]): void {
    this.trackOrder = order.filter((id) => this.tracks.has(id));
    this.touch();
  }

  /** Get the total number of tracks */
  get trackCount(): number {
    return this.tracks.size;
  }

  // ─── Scene Properties ────────────────────────────────────────

  /** Update scene configuration */
  setConfig(updates: Partial<SceneConfig>): void {
    this.config = { ...this.config, ...updates };
    this.touch();
  }

  /** Get scene duration (respects clip overflow) */
  get duration(): TimeSeconds {
    let maxEnd = this.config.duration;
    for (const track of this.tracks.values()) {
      const trackEnd = track.getEnd();
      if (trackEnd > maxEnd) {
        maxEnd = trackEnd;
      }
    }
    return maxEnd;
  }

  /** Get total frame count */
  get totalFrames(): number {
    return Math.ceil(this.duration * this.config.fps);
  }

  /** Get aspect ratio as string */
  get aspectRatio(): string {
    const { width, height } = this.config;
    const gcd = this.gcd(width, height);
    return `${width / gcd}:${height / gcd}`;
  }

  // ─── Serialization ───────────────────────────────────────────

  /** Serialize scene to JSON-compatible data */
  toJSON(): SceneData {
    return {
      id: this.id,
      config: { ...this.config },
      tracks: this.getTracks().map((t) => t.toJSON()),
      metadata: { ...this.metadata },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /** Create a Scene from serialized data */
  static fromJSON(data: SceneData): Scene {
    const scene = new Scene(data.config, data.metadata);
    Object.assign(scene, {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });

    for (const trackData of data.tracks) {
      const track = Track.fromJSON(trackData);
      scene.tracks.set(track.id, track);
      scene.trackOrder.push(track.id);
    }

    return scene;
  }

  /** Export a human-readable summary */
  getSummary(): string {
    const lines: string[] = [
      `Scene: ${this.metadata.name}`,
      `  Resolution: ${this.config.width}×${this.config.height} (${this.aspectRatio})`,
      `  FPS: ${this.config.fps}`,
      `  Duration: ${this.config.duration}s (${this.totalFrames} frames)`,
      `  Background: ${this.config.background}`,
      `  Tracks: ${this.trackCount}`,
    ];

    for (const track of this.getTracks()) {
      lines.push(`    [${track.type}] ${track.name} — ${track.clipCount} clips`);
    }

    return lines.join('\n');
  }

  // ─── Helpers ─────────────────────────────────────────────────

  private touch(): void {
    this.updatedAt = new Date().toISOString();
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }
}
