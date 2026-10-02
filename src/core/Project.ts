/**
 * MotionForge — Project
 *
 * Top-level container for a MotionForge project.
 * Manages the scene, assets, and project file I/O.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { ProjectData, AssetRef, RenderRecord } from './types.js';
import { Scene } from './Scene.js';

const PROJECT_FILE = 'mf-project.json';
const ENGINE_VERSION = '0.1.0';

export class Project {
  scene: Scene;
  assets: AssetRef[];
  renderHistory: RenderRecord[];
  private projectDir: string;

  constructor(projectDir: string, scene?: Scene) {
    this.projectDir = projectDir;
    this.scene = scene ?? new Scene();
    this.assets = [];
    this.renderHistory = [];
  }

  // ─── File I/O ────────────────────────────────────────────────

  /** Save the project to disk */
  async save(): Promise<string> {
    const filePath = join(this.projectDir, PROJECT_FILE);
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    const data: ProjectData = {
      version: ENGINE_VERSION,
      engine: 'motionforge',
      scene: this.scene.toJSON(),
      assets: this.assets,
      renderHistory: this.renderHistory,
    };

    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return filePath;
  }

  /** Load a project from disk */
  static async load(projectDir: string): Promise<Project> {
    const filePath = join(projectDir, PROJECT_FILE);

    if (!existsSync(filePath)) {
      throw new Error(`Project file not found: ${filePath}`);
    }

    const raw = await readFile(filePath, 'utf-8');
    const data: ProjectData = JSON.parse(raw);

    const scene = Scene.fromJSON(data.scene);
    const project = new Project(projectDir, scene);
    project.assets = data.assets ?? [];
    project.renderHistory = data.renderHistory ?? [];

    return project;
  }

  /** Check if a project file exists in the given directory */
  static exists(projectDir: string): boolean {
    return existsSync(join(projectDir, PROJECT_FILE));
  }

  // ─── Asset Management ────────────────────────────────────────

  /** Register an asset */
  addAsset(asset: AssetRef): void {
    const existing = this.assets.findIndex((a) => a.id === asset.id);
    if (existing >= 0) {
      this.assets[existing] = asset;
    } else {
      this.assets.push(asset);
    }
  }

  /** Get asset by ID */
  getAsset(id: string): AssetRef | undefined {
    return this.assets.find((a) => a.id === id);
  }

  /** Remove asset by ID */
  removeAsset(id: string): boolean {
    const idx = this.assets.findIndex((a) => a.id === id);
    if (idx >= 0) {
      this.assets.splice(idx, 1);
      return true;
    }
    return false;
  }

  // ─── Render History ──────────────────────────────────────────

  /** Record a completed render */
  addRenderRecord(record: RenderRecord): void {
    this.renderHistory.push(record);
  }

  // ─── Project Info ────────────────────────────────────────────

  /** Get project directory */
  get dir(): string {
    return this.projectDir;
  }

  /** Get the project file path */
  get filePath(): string {
    return join(this.projectDir, PROJECT_FILE);
  }

  /** Human-readable project summary */
  getSummary(): string {
    const lines = [
      `Project: ${this.scene.metadata.name}`,
      `Directory: ${this.projectDir}`,
      `Engine: motionforge v${ENGINE_VERSION}`,
      `Assets: ${this.assets.length}`,
      `Renders: ${this.renderHistory.length}`,
      '',
      this.scene.getSummary(),
    ];
    return lines.join('\n');
  }
}
