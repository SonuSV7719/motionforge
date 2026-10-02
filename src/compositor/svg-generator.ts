/**
 * MotionForge — Procedural Vector & SVG Generator
 *
 * Generates lightweight, high-performance resolution-independent SVG elements
 * (Progress rings, Futuristic HUDs, Waveforms, Grids, Badges, Geometric Accents).
 */

export interface SvgRingOptions {
  size: number;
  strokeWidth: number;
  color: string;
  progressPercent: number;
  trackColor?: string;
}

export interface SvgWaveformOptions {
  width: number;
  height: number;
  bars: number;
  color: string;
  seed?: number;
}

export interface SvgGridOptions {
  width: number;
  height: number;
  gridSize: number;
  strokeColor: string;
  glow?: boolean;
}

export interface SvgBadgeOptions {
  text: string;
  icon?: string;
  bgColor: string;
  textColor: string;
  borderRadius?: number;
  paddingX?: number;
  paddingY?: number;
}

export class SvgGenerator {
  /**
   * Generate an animated circular progress ring SVG
   */
  static createProgressRing(options: SvgRingOptions): string {
    const { size, strokeWidth, color, progressPercent, trackColor = 'rgba(255,255,255,0.1)' } = options;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return `<svg class="mf-svg-ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${trackColor}" stroke-width="${strokeWidth}" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"
        stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round"
        style="transform: rotate(-90deg); transform-origin: 50% 50%;" />
    </svg>`;
  }

  /**
   * Generate an audio waveform bar graphic SVG
   */
  static createWaveform(options: SvgWaveformOptions): string {
    const { width, height, bars, color, seed = 42 } = options;
    const barWidth = width / (bars * 1.5);
    const spacing = barWidth * 0.5;

    let barsHtml = '';
    for (let i = 0; i < bars; i++) {
      // Deterministic heights based on trig/seed
      const val = Math.sin((i + seed) * 0.7) * 0.4 + Math.cos((i * 1.3 + seed) * 0.5) * 0.3 + 0.4;
      const barHeight = Math.max(4, Math.min(height, val * height));
      const x = i * (barWidth + spacing);
      const y = (height - barHeight) / 2;

      barsHtml += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="${(barWidth / 2).toFixed(1)}" fill="${color}" opacity="${0.6 + (val * 0.4).toFixed(2)}" />`;
    }

    return `<svg class="mf-svg-waveform" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${barsHtml}
    </svg>`;
  }

  /**
   * Generate a futuristic background grid SVG
   */
  static createGrid(options: SvgGridOptions): string {
    const { width, height, gridSize, strokeColor, glow = false } = options;
    const glowFilter = glow
      ? `<defs><filter id="grid-glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`
      : '';

    return `<svg class="mf-svg-grid" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${glowFilter}
      <defs>
        <pattern id="mf-grid-pattern" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
          <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="${strokeColor}" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mf-grid-pattern)" ${glow ? 'filter="url(#grid-glow)"' : ''} />
    </svg>`;
  }

  /**
   * Generate an animated corner HUD reticle for targeting/framing
   */
  static createCornerReticle(size: number, color: string, strokeWidth = 2): string {
    const len = size * 0.3;
    return `<svg class="mf-svg-reticle" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <!-- Top Left -->
      <path d="M 0 ${len} L 0 0 L ${len} 0" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
      <!-- Top Right -->
      <path d="M ${size - len} 0 L ${size} 0 L ${size} ${len}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
      <!-- Bottom Left -->
      <path d="M 0 ${size - len} L 0 ${size} L ${len} ${size}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
      <!-- Bottom Right -->
      <path d="M ${size - len} ${size} L ${size} ${size} L ${size} ${size - len}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
    </svg>`;
  }
}
