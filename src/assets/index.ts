/**
 * MotionForge — Asset Manager
 *
 * Handles importing, caching, and probing media assets.
 * Supports images, video, audio, and fonts.
 */

import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { execSync } from 'node:child_process';
import { nanoid } from 'nanoid';
import type { AssetRef, Size, TimeSeconds } from '../core/types.js';

const ASSET_DIR = 'assets';

/** Supported file extensions by type */
const SUPPORTED_EXTENSIONS: Record<string, string[]> = {
  video: ['.mp4', '.mov', '.webm', '.avi', '.mkv'],
  audio: ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'],
  image: ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.bmp'],
  font: ['.ttf', '.otf', '.woff', '.woff2'],
};

export class AssetManager {
  private projectDir: string;
  private assets: Map<string, AssetRef>;

  constructor(projectDir: string) {
    this.projectDir = projectDir;
    this.assets = new Map();
  }

  /** Import a media file into the project */
  async importFile(sourcePath: string, name?: string): Promise<AssetRef> {
    const ext = extname(sourcePath).toLowerCase();
    const type = this.detectType(ext);

    if (!type) {
      throw new Error(`Unsupported file type: ${ext}`);
    }

    // Create asset directory
    const assetDir = join(this.projectDir, ASSET_DIR);
    if (!existsSync(assetDir)) {
      await mkdir(assetDir, { recursive: true });
    }

    // Copy file to project assets
    const id = nanoid(8);
    const fileName = `${id}${ext}`;
    const destPath = join(assetDir, fileName);
    await copyFile(sourcePath, destPath);

    // Probe media metadata
    const metadata = this.probeMedia(destPath);

    const asset: AssetRef = {
      id,
      type,
      src: destPath,
      name: name ?? basename(sourcePath, ext),
      size: metadata.size,
      duration: metadata.duration,
      dimensions: metadata.dimensions,
    };

    this.assets.set(id, asset);
    return asset;
  }

  /** Get asset by ID */
  get(id: string): AssetRef | undefined {
    return this.assets.get(id);
  }

  /** List all assets */
  list(): AssetRef[] {
    return Array.from(this.assets.values());
  }

  /** Probe media file for metadata using ffprobe */
  probeMedia(filePath: string): {
    size?: number;
    duration?: TimeSeconds;
    dimensions?: Size;
  } {
    if (!existsSync(filePath)) {
      return {};
    }
    try {
      const result = execSync(
        `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`,
        { encoding: 'utf-8', timeout: 10000 },
      );
      const probe = JSON.parse(result);

      const videoStream = probe.streams?.find((s: any) => s.codec_type === 'video');

      return {
        size: probe.format?.size ? parseInt(probe.format.size) : undefined,
        duration: probe.format?.duration ? parseFloat(probe.format.duration) : undefined,
        dimensions: videoStream
          ? { width: videoStream.width, height: videoStream.height }
          : undefined,
      };
    } catch {
      return {};
    }
  }

  /** Detect asset type from file extension */
  private detectType(ext: string): AssetRef['type'] | null {
    for (const [type, exts] of Object.entries(SUPPORTED_EXTENSIONS)) {
      if (exts.includes(ext)) return type as AssetRef['type'];
    }
    return null;
  }
}

/**
 * FontManager — Google Fonts auto-download and local font discovery
 */
export class FontManager {
  private fontsDir: string;
  private loadedFonts: Set<string>;

  constructor(projectDir: string) {
    this.fontsDir = join(projectDir, ASSET_DIR, 'fonts');
    this.loadedFonts = new Set();
  }

  /** Get a Google Fonts CSS import URL */
  getGoogleFontURL(family: string, weights: number[] = [400, 700]): string {
    const weightStr = weights.join(';');
    const encoded = encodeURIComponent(family);
    return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weightStr}&display=swap`;
  }

  /** Generate CSS @import for a font */
  getFontImportCSS(family: string, weights?: number[]): string {
    const url = this.getGoogleFontURL(family, weights);
    return `@import url('${url}');`;
  }

  /** Check if a font is loaded */
  isLoaded(family: string): boolean {
    return this.loadedFonts.has(family);
  }

  /** Mark a font as loaded */
  markLoaded(family: string): void {
    this.loadedFonts.add(family);
  }
}
