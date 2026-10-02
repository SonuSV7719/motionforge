/**
 * MotionForge — CSS Generator
 *
 * Generates scoped CSS for clips and scenes.
 */

import type { SceneConfig, ClipData, TextContent } from '../core/types.js';

/** Generate root scene CSS */
export function generateSceneCSS(config: SceneConfig): string {
  return `
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${config.width}px;
      height: ${config.height}px;
      overflow: hidden;
      background: ${config.background};
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    }
    .mf-scene {
      position: relative;
      width: ${config.width}px;
      height: ${config.height}px;
      overflow: hidden;
    }
    .mf-clip {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      visibility: hidden;
    }
    .mf-clip.mf-active {
      visibility: visible;
    }
    .mf-text-inner {
      white-space: pre-wrap;
      word-break: break-word;
    }
  `;
}

/** Generate CSS for a specific clip */
export function generateClipCSS(clip: ClipData, config: SceneConfig): string {
  const id = `clip-${clip.id}`;
  const content = clip.content;

  let css = `#${id} {\n`;

  if (content.type === 'text') {
    const tc = content as TextContent;
    css += `  font-family: '${tc.fontFamily}', sans-serif;\n`;
    css += `  font-size: ${tc.fontSize}px;\n`;
    css += `  font-weight: ${tc.fontWeight};\n`;
    css += `  font-style: ${tc.fontStyle};\n`;
    css += `  color: ${tc.color};\n`;
    css += `  text-align: ${tc.textAlign};\n`;
    css += `  line-height: ${tc.lineHeight};\n`;
    css += `  letter-spacing: ${tc.letterSpacing}px;\n`;
    if (tc.backgroundColor) {
      css += `  background-color: ${tc.backgroundColor};\n`;
    }
    if (tc.textShadow) {
      css += `  text-shadow: ${tc.textShadow};\n`;
    }
    if (tc.maxWidth) {
      css += `  max-width: ${tc.maxWidth}px;\n`;
    }
    if (tc.padding) {
      css += `  padding: ${tc.padding}px;\n`;
    }
  }

  if (content.type === 'shape') {
    css += `  background: ${content.fill};\n`;
    if (content.stroke) {
      css += `  border: ${content.strokeWidth}px solid ${content.stroke};\n`;
    }
    if (content.borderRadius) {
      css += `  border-radius: ${content.borderRadius}px;\n`;
    }
    if (content.shape === 'circle') {
      css += `  border-radius: 50%;\n`;
    }
  }

  css += `}\n`;
  return css;
}
