/**
 * MotionForge — CLI Helper Utilities
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { TimeSeconds } from '../core/types.js';

/**
 * Parse time strings like "2s", "1500ms", "1.5", "0:05" into seconds.
 */
export function parseTime(input: string): TimeSeconds {
  if (!input) return 0;

  // Milliseconds: "1500ms"
  if (input.endsWith('ms')) {
    return parseFloat(input.replace('ms', '')) / 1000;
  }

  // Seconds: "2s" or "2.5s"
  if (input.endsWith('s')) {
    return parseFloat(input.replace('s', ''));
  }

  // MM:SS format: "1:30"
  if (input.includes(':')) {
    const parts = input.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  // Plain number (assume seconds)
  const num = parseFloat(input);
  return isNaN(num) ? 0 : num;
}

/**
 * Format seconds into human-readable time.
 */
export function formatTime(seconds: TimeSeconds): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return `${mins}:${secs.padStart(4, '0')}`;
}

/**
 * Load an output preset from the presets directory.
 */
export async function loadPreset(name: string): Promise<Record<string, unknown>> {
  // Search preset locations
  const locations = [
    join(process.cwd(), 'presets', `${name}.json`),
    resolve(__dirname, '../../presets', `${name}.json`),
  ];

  for (const loc of locations) {
    if (existsSync(loc)) {
      const raw = await readFile(loc, 'utf-8');
      const preset = JSON.parse(raw);
      return preset.config || preset;
    }
  }

  throw new Error(`Preset not found: ${name}`);
}

/**
 * Format file size in human-readable format.
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
