/**
 * MotionForge — Compositor
 *
 * Converts a Scene graph into a self-contained HTML document
 * with embedded CSS, GSAP, Three.js 3D, and Lottie animations for frame-by-frame capture.
 */

import type { SceneData, ClipData, TrackData, TextContent, ShapeContent, ImageContent, SolidContent, Three3DContent, LottieContent, Transform } from '../core/types.js';
import { buildGSAPTimeline } from './gsap-builder.js';
import { generateClipCSS, generateSceneCSS } from './css-generator.js';
import { ThreeBuilder } from './three-builder.js';
import { LottieBuilder } from './lottie-builder.js';

/** CDN URLs */
const GSAP_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
const THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const LOTTIE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';

/**
 * Build a complete HTML document from a Scene for rendering.
 * The document is self-contained with embedded styles and animations.
 */
export function composeHTML(scene: SceneData): string {
  const { config, tracks } = scene;
  const visibleTracks = tracks.filter((t) => t.visible);

  const clipElements = visibleTracks.flatMap((track, trackIdx) =>
    track.clips
      .filter((clip) => clip.visible)
      .map((clip) => buildClipElement(clip, track, trackIdx)),
  );

  const clipStyles = visibleTracks.flatMap((track) =>
    track.clips.filter((clip) => clip.visible).map((clip) => generateClipCSS(clip, config)),
  );

  // Check feature requirements
  const hasThree = visibleTracks.some((t) => t.clips.some((c) => c.content.type === 'three3d'));
  const hasLottie = visibleTracks.some((t) => t.clips.some((c) => c.content.type === 'lottie'));

  const threeScripts = visibleTracks.flatMap((t) =>
    t.clips.filter((c) => c.visible && c.content.type === 'three3d').map((c) => ThreeBuilder.buildThreeScript(c)),
  );

  const lottieScripts = visibleTracks.flatMap((t) =>
    t.clips.filter((c) => c.visible && c.content.type === 'lottie').map((c) => LottieBuilder.buildLottieScript(c)),
  );

  // Extract unique font families used across all tracks
  const uniqueFonts = new Set<string>();
  visibleTracks.forEach((t) => {
    t.clips.forEach((c) => {
      if (c.content.type === 'text' && (c.content as TextContent).fontFamily) {
        uniqueFonts.add((c.content as TextContent).fontFamily);
      }
    });
  });

  const fontParam = Array.from(uniqueFonts)
    .filter((f) => !['Arial', 'Helvetica', 'sans-serif', 'serif', 'monospace', 'system-ui', 'Segoe UI'].includes(f))
    .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900`)
    .join('&');

  const googleFontsEmbed = fontParam
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?${fontParam}&display=swap" rel="stylesheet">`
    : '';

  const gsapCode = buildGSAPTimeline(scene);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${config.width}, height=${config.height}">
  ${googleFontsEmbed}
  <style>
    ${generateSceneCSS(config)}
    ${clipStyles.join('\n    ')}
  </style>
</head>
<body>
  <div id="mf-scene" class="mf-scene">
    ${clipElements.join('\n    ')}
  </div>

  <script src="${GSAP_CDN}"></script>
  ${hasThree ? `<script src="${THREE_CDN}"></script>` : ''}
  ${hasLottie ? `<script src="${LOTTIE_CDN}"></script>` : ''}
  <script>
    ${threeScripts.join('\n')}
    ${lottieScripts.join('\n')}
    ${gsapCode}
  </script>
</body>
</html>`;
}

/**
 * Build the HTML element for a single clip based on its type.
 */
function buildClipElement(clip: ClipData, track: TrackData, trackIdx: number): string {
  const id = `clip-${clip.id}`;
  const zIndex = 10 + trackIdx;
  const content = clip.content;

  switch (content.type) {
    case 'text':
      return buildTextElement(id, clip, content, zIndex);
    case 'shape':
      return buildShapeElement(id, clip, content, zIndex);
    case 'image':
      return buildImageElement(id, clip, content, zIndex);
    case 'solid':
      return buildSolidElement(id, clip, content, zIndex);
    case 'three3d':
      return buildThree3dElement(id, clip, content, zIndex);
    case 'lottie':
      return buildLottieElement(id, clip, content, zIndex);
    case 'template':
      return `<div id="${id}" class="mf-clip mf-template" style="z-index:${zIndex}" data-start="${clip.start}" data-duration="${clip.duration}"></div>`;
    default:
      return `<div id="${id}" class="mf-clip" style="z-index:${zIndex}" data-start="${clip.start}" data-duration="${clip.duration}"></div>`;
  }
}

function buildTextElement(id: string, clip: ClipData, content: TextContent, zIndex: number): string {
  const style = buildTransformStyle(clip.transform, zIndex, clip.opacity);
  return `<div id="${id}" class="mf-clip mf-text" style="${style}" data-start="${clip.start}" data-duration="${clip.duration}">
      <span class="mf-text-inner">${escapeHtml(content.text)}</span>
    </div>`;
}

function buildShapeElement(id: string, clip: ClipData, content: ShapeContent, zIndex: number): string {
  const style = buildTransformStyle(clip.transform, zIndex, clip.opacity);
  return `<div id="${id}" class="mf-clip mf-shape mf-shape-${content.shape}" style="${style}" data-start="${clip.start}" data-duration="${clip.duration}"></div>`;
}

function buildImageElement(id: string, clip: ClipData, content: ImageContent, zIndex: number): string {
  const style = buildTransformStyle(clip.transform, zIndex, clip.opacity);
  return `<div id="${id}" class="mf-clip mf-image" style="${style}" data-start="${clip.start}" data-duration="${clip.duration}">
      <img src="${escapeHtml(content.src)}" style="object-fit:${content.fit};width:100%;height:100%" />
    </div>`;
}

function buildSolidElement(id: string, clip: ClipData, content: SolidContent, zIndex: number): string {
  const style = buildTransformStyle(clip.transform, zIndex, clip.opacity);
  return `<div id="${id}" class="mf-clip mf-solid" style="${style};background:${content.color}" data-start="${clip.start}" data-duration="${clip.duration}"></div>`;
}

function buildThree3dElement(id: string, clip: ClipData, content: Three3DContent, zIndex: number): string {
  const style = buildTransformStyle(clip.transform, zIndex, clip.opacity);
  return `<div id="${id}" class="mf-clip mf-three3d" style="${style}" data-start="${clip.start}" data-duration="${clip.duration}"></div>`;
}

function buildLottieElement(id: string, clip: ClipData, content: LottieContent, zIndex: number): string {
  const style = buildTransformStyle(clip.transform, zIndex, clip.opacity);
  return `<div id="${id}" class="mf-clip mf-lottie" style="${style}" data-start="${clip.start}" data-duration="${clip.duration}"></div>`;
}

function buildTransformStyle(transform: Transform, zIndex: number, opacity: number): string {
  const parts: string[] = [`z-index:${zIndex}`, `opacity:${opacity}`];

  if (transform.x !== 0 || transform.y !== 0) {
    parts.push(`left:${transform.x}px`, `top:${transform.y}px`);
  }
  if (typeof transform.width === 'number') {
    parts.push(`width:${transform.width}px`);
  }
  if (typeof transform.height === 'number') {
    parts.push(`height:${transform.height}px`);
  }

  const transforms: string[] = [];
  if (transform.anchorX === 0.5 && transform.anchorY === 0.5) {
    transforms.push('translate(-50%, -50%)');
  }
  if (transform.rotation !== 0) transforms.push(`rotate(${transform.rotation}deg)`);
  if (transform.scaleX !== 1 || transform.scaleY !== 1) {
    transforms.push(`scale(${transform.scaleX}, ${transform.scaleY})`);
  }
  if (transform.skewX !== 0) transforms.push(`skewX(${transform.skewX}deg)`);
  if (transform.skewY !== 0) transforms.push(`skewY(${transform.skewY}deg)`);

  if (transforms.length > 0) {
    parts.push(`transform:${transforms.join(' ')}`);
    parts.push(`transform-origin:${transform.anchorX * 100}% ${transform.anchorY * 100}%`);
  }

  return parts.join(';');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
