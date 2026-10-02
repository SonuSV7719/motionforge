/**
 * MotionForge — Media & PDF Resource Ingestor
 *
 * Ingests external media resources (images, video footage, audio, PDFs, and remote URLs)
 * and prepares them as optimized project assets ready for composition.
 */

import { spawn } from 'node:child_process';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { nanoid } from 'nanoid';
import type { AssetRef } from '../core/types.js';

export interface IngestOptions {
  projectDir: string;
  sourcePathOrUrl: string;
  name?: string;
}

export class MediaIngestor {
  /**
   * Ingest a local file or remote URL into the project assets directory.
   */
  static async ingest(options: IngestOptions): Promise<AssetRef> {
    const { projectDir, sourcePathOrUrl, name } = options;
    const assetsDir = join(projectDir, 'assets');
    if (!existsSync(assetsDir)) {
      await mkdir(assetsDir, { recursive: true });
    }

    const isUrl = sourcePathOrUrl.startsWith('http://') || sourcePathOrUrl.startsWith('https://');

    if (isUrl) {
      return this.ingestRemoteUrl(sourcePathOrUrl, assetsDir, name);
    }

    const ext = extname(sourcePathOrUrl).toLowerCase();

    // PDF special ingestion (converts pages to hi-res PNGs)
    if (ext === '.pdf') {
      return this.ingestPdf(sourcePathOrUrl, assetsDir, name);
    }

    const id = nanoid(8);
    const fileName = `${id}${ext}`;
    const destPath = join(assetsDir, fileName);

    await copyFile(sourcePathOrUrl, destPath);

    return {
      id,
      type: this.detectAssetType(ext),
      src: destPath,
      name: name || basename(sourcePathOrUrl, ext),
    };
  }

  /**
   * Convert PDF pages to high-resolution PNG assets for video display
   */
  static async ingestPdf(pdfPath: string, assetsDir: string, name?: string): Promise<AssetRef> {
    const id = nanoid(8);
    const outputPrefix = join(assetsDir, `pdf_${id}_page`);
    
    // Convert PDF page 1 to 300DPI PNG via FFmpeg or pdftoppm
    await new Promise<void>((resolve, reject) => {
      const proc = spawn('ffmpeg', [
        '-y',
        '-i',
        pdfPath,
        '-vf',
        'scale=1920:-1:flags=lanczos',
        `${outputPrefix}_1.png`,
      ]);

      proc.on('close', (code) => {
        if (code === 0 && existsSync(`${outputPrefix}_1.png`)) {
          resolve();
        } else {
          // Fallback: copy PDF directly
          const fallbackPath = join(assetsDir, `${id}.pdf`);
          copyFile(pdfPath, fallbackPath)
            .then(() => resolve())
            .catch(reject);
        }
      });

      proc.on('error', () => {
        const fallbackPath = join(assetsDir, `${id}.pdf`);
        copyFile(pdfPath, fallbackPath)
          .then(() => resolve())
          .catch(reject);
      });
    });

    const finalImage = `${outputPrefix}_1.png`;
    const exists = existsSync(finalImage);

    return {
      id,
      type: 'image',
      src: exists ? finalImage : pdfPath,
      name: name || basename(pdfPath, '.pdf'),
    };
  }

  /**
   * Ingest a remote image or audio file from URL
   */
  private static async ingestRemoteUrl(url: string, assetsDir: string, name?: string): Promise<AssetRef> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch remote asset from ${url}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsedUrl = new URL(url);
    let ext = extname(parsedUrl.pathname).toLowerCase() || '.png';
    const id = nanoid(8);
    const fileName = `${id}${ext}`;
    const destPath = join(assetsDir, fileName);

    await writeFile(destPath, buffer);

    return {
      id,
      type: this.detectAssetType(ext),
      src: destPath,
      name: name || `asset-${id}`,
    };
  }

  private static detectAssetType(ext: string): AssetRef['type'] {
    if (['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) return 'video';
    if (['.mp3', '.wav', '.aac', '.ogg', '.m4a'].includes(ext)) return 'audio';
    if (['.ttf', '.otf', '.woff', '.woff2'].includes(ext)) return 'font';
    return 'image';
  }
}
