/**
 * MotionForge — GSAP Timeline Builder
 *
 * Generates GSAP JavaScript code from the scene's clips, keyframes, and effects.
 * Creates deterministic seekable timelines with full keyframe interpolation and visibility control.
 */

import type { SceneData, ClipData, KeyframeData, EffectData, EasingType } from '../core/types.js';

/**
 * Build the complete GSAP timeline JavaScript for a scene.
 * Returns JS code string to embed in the HTML document.
 */
export function buildGSAPTimeline(scene: SceneData): string {
  const { config, tracks } = scene;
  const totalDuration = config.duration;
  const fps = config.fps;

  const clipAnimations: string[] = [];

  for (const track of tracks) {
    if (!track.visible) continue;
    for (const clip of track.clips) {
      if (!clip.visible) continue;
      clipAnimations.push(buildClipAnimation(clip));
    }
  }

  return `
(function() {
  'use strict';

  const TOTAL_DURATION = ${totalDuration};
  const FPS = ${fps};

  // Master seekable timeline (paused — renderer controls playback)
  const master = gsap.timeline({ paused: true });

  // Update clip visibility and trigger 3D WebGL renders
  function updateVisibility(time) {
    const clips = document.querySelectorAll('.mf-clip');
    clips.forEach(el => {
      const start = parseFloat(el.dataset.start || '0');
      const duration = parseFloat(el.dataset.duration || '0');
      if (time >= start && time < (start + duration)) {
        el.style.visibility = 'visible';
      } else {
        el.style.visibility = 'hidden';
      }
    });

    if (window.__mf_three_renders && Array.isArray(window.__mf_three_renders)) {
      for (let j = 0; j < window.__mf_three_renders.length; j++) {
        try { window.__mf_three_renders[j](time); } catch(e) {}
      }
    }
  }

  // Build clip animations
  ${clipAnimations.join('\n  ')}

  // Hook visibility update to timeline updates
  master.eventCallback('onUpdate', () => updateVisibility(master.time()));

  // Expose timeline for renderer control
  window.__mf_timeline = master;
  window.__mf_totalDuration = TOTAL_DURATION;
  window.__mf_fps = FPS;

  // Frame seek hook called by headless Chrome renderer
  window.__mf_seekToFrame = function(frame) {
    const time = frame / FPS;
    master.seek(time, false);
    updateVisibility(time);
  };

  // Initial state at frame 0
  window.__mf_seekToFrame(0);

  // Auto-play and loop in regular desktop browser preview
  if (typeof window !== 'undefined' && !navigator.userAgent.includes('Headless')) {
    master.repeat(-1);
    master.play();
  }

  // Signal ready
  window.__mf_ready = true;
})();
`;
}

/**
 * Generate GSAP animation code for a single clip.
 */
function buildClipAnimation(clip: ClipData): string {
  const id = `clip-${clip.id}`;
  const lines: string[] = [];

  // Group keyframes by property
  const keyframesByProp = groupKeyframes(clip.keyframes);

  for (const [property, keyframes] of Object.entries(keyframesByProp)) {
    const gsapProp = mapPropertyToGSAP(property);
    
    // Set initial value at clip.start
    lines.push(
      `master.set('#${id}', { ${gsapProp}: ${keyframes[0].value} }, ${clip.start + keyframes[0].time});`,
    );

    if (keyframes.length < 2) continue;

    for (let i = 1; i < keyframes.length; i++) {
      const prev = keyframes[i - 1];
      const curr = keyframes[i];
      const duration = Math.max(0.01, curr.time - prev.time);
      const ease = mapEasingToGSAP(curr.easing);

      lines.push(
        `master.to('#${id}', { ${gsapProp}: ${curr.value}, duration: ${duration}, ease: '${ease}' }, ${clip.start + prev.time});`,
      );
    }
  }

  // Process effects
  for (const effect of clip.effects) {
    lines.push(buildEffectAnimation(id, clip, effect));
  }

  // Default entrance animation if no keyframes/effects
  if (lines.length === 0) {
    lines.push(
      `master.fromTo('#${id}', { opacity: 0 }, { opacity: ${clip.opacity}, duration: 0.3, ease: 'power2.out' }, ${clip.start});`,
    );
  }

  return lines.join('\n  ');
}

/**
 * Generate GSAP code for an effect.
 */
function buildEffectAnimation(elementId: string, clip: ClipData, effect: EffectData): string {
  const start = clip.start + effect.start;
  const dur = effect.duration;

  switch (effect.name) {
    case 'fade-in':
      return `master.fromTo('#${elementId}', { opacity: 0 }, { opacity: 1, duration: ${dur}, ease: 'power2.out' }, ${start});`;
    case 'fade-out':
      return `master.to('#${elementId}', { opacity: 0, duration: ${dur}, ease: 'power2.in' }, ${start});`;
    case 'fade-up':
      return `master.fromTo('#${elementId}', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: ${dur}, ease: 'power3.out' }, ${start});`;
    case 'fade-down':
      return `master.fromTo('#${elementId}', { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: ${dur}, ease: 'power3.out' }, ${start});`;
    case 'slide-in-left':
      return `master.fromTo('#${elementId}', { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: ${dur}, ease: 'power3.out' }, ${start});`;
    case 'slide-in-right':
      return `master.fromTo('#${elementId}', { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: ${dur}, ease: 'power3.out' }, ${start});`;
    case 'scale-in':
      return `master.fromTo('#${elementId}', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: ${dur}, ease: 'back.out(1.7)' }, ${start});`;
    case 'bounce-in':
      return `master.fromTo('#${elementId}', { scale: 0 }, { scale: 1, duration: ${dur}, ease: 'bounce.out' }, ${start});`;
    case 'pop':
      return `master.fromTo('#${elementId}', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: ${dur}, ease: 'elastic.out(1, 0.5)' }, ${start});`;
    case 'glitch':
      return `master.fromTo('#${elementId}', { skewX: 20, opacity: 0.5 }, { skewX: 0, opacity: 1, duration: ${dur}, ease: 'steps(8)' }, ${start});`;
    default:
      return `master.fromTo('#${elementId}', { opacity: 0 }, { opacity: 1, duration: ${dur} }, ${start});`;
  }
}

/**
 * Group keyframes by property name.
 */
function groupKeyframes(keyframes: KeyframeData[]): Record<string, KeyframeData[]> {
  const groups: Record<string, KeyframeData[]> = {};
  for (const kf of keyframes) {
    if (!groups[kf.property]) {
      groups[kf.property] = [];
    }
    groups[kf.property].push(kf);
  }
  // Sort each group by time
  for (const prop of Object.keys(groups)) {
    groups[prop].sort((a, b) => a.time - b.time);
  }
  return groups;
}

/**
 * Map MotionForge property names to GSAP property names.
 */
function mapPropertyToGSAP(property: string): string {
  const mapping: Record<string, string> = {
    x: 'x',
    y: 'y',
    width: 'width',
    height: 'height',
    rotation: 'rotation',
    scaleX: 'scaleX',
    scaleY: 'scaleY',
    opacity: 'opacity',
    fontSize: 'fontSize',
    letterSpacing: 'letterSpacing',
    borderRadius: 'borderRadius',
  };
  return mapping[property] ?? property;
}

/**
 * Map MotionForge easing names to GSAP easing strings.
 */
function mapEasingToGSAP(easing: EasingType): string {
  const mapping: Record<string, string> = {
    linear: 'none',
    ease: 'power1.inOut',
    'ease-in': 'power2.in',
    'ease-out': 'power2.out',
    'ease-in-out': 'power2.inOut',
    'ease-in-quad': 'power1.in',
    'ease-out-quad': 'power1.out',
    'ease-in-out-quad': 'power1.inOut',
    'ease-in-cubic': 'power2.in',
    'ease-out-cubic': 'power2.out',
    'ease-in-out-cubic': 'power2.inOut',
    'ease-in-quart': 'power3.in',
    'ease-out-quart': 'power3.out',
    'ease-in-out-quart': 'power3.inOut',
    'ease-in-expo': 'power4.in',
    'ease-out-expo': 'power4.out',
    'ease-in-out-expo': 'power4.inOut',
    'ease-in-back': 'back.in(1.7)',
    'ease-out-back': 'back.out(1.7)',
    'ease-in-out-back': 'back.inOut(1.7)',
    'ease-in-elastic': 'elastic.in(1, 0.5)',
    'ease-out-elastic': 'elastic.out(1, 0.5)',
    'ease-in-out-elastic': 'elastic.inOut(1, 0.5)',
    'ease-out-bounce': 'bounce.out',
    spring: 'elastic.out(1, 0.3)',
  };
  return mapping[easing] ?? 'power2.out';
}
