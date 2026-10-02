/**
 * MotionForge — Effects Library
 *
 * Built-in effects definitions: transitions, animations, filters, text effects.
 * Each effect is a data descriptor — the Compositor/GSAP builder interprets them.
 */

import type {
  TransitionName,
  AnimationPreset,
  FilterName,
  TextEffectPreset,
  ColorGradePreset,
} from '../core/types.js';

// ─── Transition Definitions ──────────────────────────────────

export interface TransitionDef {
  name: TransitionName;
  label: string;
  category: 'basic' | 'directional' | 'special';
  defaultDuration: number;
  description: string;
}

export const TRANSITIONS: TransitionDef[] = [
  { name: 'fade',       label: 'Fade',          category: 'basic',       defaultDuration: 0.5, description: 'Simple opacity fade' },
  { name: 'fade-black', label: 'Fade to Black', category: 'basic',       defaultDuration: 0.8, description: 'Fade through black' },
  { name: 'fade-white', label: 'Fade to White', category: 'basic',       defaultDuration: 0.8, description: 'Fade through white' },
  { name: 'dissolve',   label: 'Dissolve',      category: 'basic',       defaultDuration: 1.0, description: 'Cross-dissolve blend' },
  { name: 'wipe-left',  label: 'Wipe Left',     category: 'directional', defaultDuration: 0.6, description: 'Wipe from right to left' },
  { name: 'wipe-right', label: 'Wipe Right',    category: 'directional', defaultDuration: 0.6, description: 'Wipe from left to right' },
  { name: 'wipe-up',    label: 'Wipe Up',       category: 'directional', defaultDuration: 0.6, description: 'Wipe from bottom to top' },
  { name: 'wipe-down',  label: 'Wipe Down',     category: 'directional', defaultDuration: 0.6, description: 'Wipe from top to bottom' },
  { name: 'slide-left', label: 'Slide Left',    category: 'directional', defaultDuration: 0.5, description: 'Slide content from right' },
  { name: 'slide-right',label: 'Slide Right',   category: 'directional', defaultDuration: 0.5, description: 'Slide content from left' },
  { name: 'slide-up',   label: 'Slide Up',      category: 'directional', defaultDuration: 0.5, description: 'Slide content from bottom' },
  { name: 'slide-down', label: 'Slide Down',    category: 'directional', defaultDuration: 0.5, description: 'Slide content from top' },
  { name: 'zoom-in',    label: 'Zoom In',       category: 'special',     defaultDuration: 0.6, description: 'Zoom in reveal' },
  { name: 'zoom-out',   label: 'Zoom Out',      category: 'special',     defaultDuration: 0.6, description: 'Zoom out reveal' },
  { name: 'glitch',     label: 'Glitch',        category: 'special',     defaultDuration: 0.3, description: 'Digital glitch effect' },
  { name: 'morph',      label: 'Morph',         category: 'special',     defaultDuration: 0.8, description: 'Shape morph transition' },
  { name: 'iris',       label: 'Iris',          category: 'special',     defaultDuration: 0.7, description: 'Circular iris wipe' },
  { name: 'clock-wipe', label: 'Clock Wipe',    category: 'special',     defaultDuration: 1.0, description: 'Clockwise wipe' },
];

// ─── Animation Preset Definitions ────────────────────────────

export interface AnimationDef {
  name: AnimationPreset;
  label: string;
  category: 'fade' | 'slide' | 'scale' | 'special';
  defaultDuration: number;
  description: string;
}

export const ANIMATIONS: AnimationDef[] = [
  { name: 'fade-in',        label: 'Fade In',        category: 'fade',    defaultDuration: 0.5, description: 'Fade from transparent' },
  { name: 'fade-out',       label: 'Fade Out',       category: 'fade',    defaultDuration: 0.5, description: 'Fade to transparent' },
  { name: 'fade-up',        label: 'Fade Up',        category: 'fade',    defaultDuration: 0.6, description: 'Fade in + slide up' },
  { name: 'fade-down',      label: 'Fade Down',      category: 'fade',    defaultDuration: 0.6, description: 'Fade in + slide down' },
  { name: 'fade-left',      label: 'Fade Left',      category: 'fade',    defaultDuration: 0.6, description: 'Fade in + slide left' },
  { name: 'fade-right',     label: 'Fade Right',     category: 'fade',    defaultDuration: 0.6, description: 'Fade in + slide right' },
  { name: 'slide-in-left',  label: 'Slide In Left',  category: 'slide',   defaultDuration: 0.5, description: 'Slide from left edge' },
  { name: 'slide-in-right', label: 'Slide In Right', category: 'slide',   defaultDuration: 0.5, description: 'Slide from right edge' },
  { name: 'slide-in-up',    label: 'Slide In Up',    category: 'slide',   defaultDuration: 0.5, description: 'Slide from bottom edge' },
  { name: 'slide-in-down',  label: 'Slide In Down',  category: 'slide',   defaultDuration: 0.5, description: 'Slide from top edge' },
  { name: 'scale-in',       label: 'Scale In',       category: 'scale',   defaultDuration: 0.5, description: 'Scale from zero' },
  { name: 'scale-out',      label: 'Scale Out',      category: 'scale',   defaultDuration: 0.5, description: 'Scale to zero' },
  { name: 'bounce-in',      label: 'Bounce In',      category: 'scale',   defaultDuration: 0.8, description: 'Bouncy entrance' },
  { name: 'bounce-out',     label: 'Bounce Out',     category: 'scale',   defaultDuration: 0.8, description: 'Bouncy exit' },
  { name: 'spin-in',        label: 'Spin In',        category: 'special', defaultDuration: 0.6, description: 'Rotate + scale in' },
  { name: 'flip-x',         label: 'Flip X',         category: 'special', defaultDuration: 0.6, description: 'Flip on X axis' },
  { name: 'flip-y',         label: 'Flip Y',         category: 'special', defaultDuration: 0.6, description: 'Flip on Y axis' },
  { name: 'pop',            label: 'Pop',            category: 'special', defaultDuration: 0.5, description: 'Elastic pop entrance' },
  { name: 'elastic',        label: 'Elastic',        category: 'special', defaultDuration: 0.8, description: 'Elastic spring' },
  { name: 'shake',          label: 'Shake',          category: 'special', defaultDuration: 0.5, description: 'Quick shake' },
  { name: 'typewriter',     label: 'Typewriter',     category: 'special', defaultDuration: 2.0, description: 'Character by character' },
  { name: 'blur-in',        label: 'Blur In',        category: 'special', defaultDuration: 0.6, description: 'Blur to sharp' },
  { name: 'blur-out',       label: 'Blur Out',       category: 'special', defaultDuration: 0.6, description: 'Sharp to blur' },
  { name: 'reveal-left',    label: 'Reveal Left',    category: 'special', defaultDuration: 0.6, description: 'Clip reveal from left' },
  { name: 'reveal-right',   label: 'Reveal Right',   category: 'special', defaultDuration: 0.6, description: 'Clip reveal from right' },
];

// ─── Filter Definitions ──────────────────────────────────────

export interface FilterDef {
  name: FilterName;
  label: string;
  defaultIntensity: number;
  description: string;
  cssProperty: string;
}

export const FILTERS: FilterDef[] = [
  { name: 'blur',                  label: 'Blur',                  defaultIntensity: 0.5, description: 'Gaussian blur',              cssProperty: 'blur' },
  { name: 'brightness',            label: 'Brightness',            defaultIntensity: 0.5, description: 'Adjust brightness',          cssProperty: 'brightness' },
  { name: 'contrast',              label: 'Contrast',              defaultIntensity: 0.5, description: 'Adjust contrast',            cssProperty: 'contrast' },
  { name: 'saturate',              label: 'Saturation',            defaultIntensity: 0.5, description: 'Adjust saturation',          cssProperty: 'saturate' },
  { name: 'grayscale',             label: 'Grayscale',             defaultIntensity: 1.0, description: 'Convert to grayscale',       cssProperty: 'grayscale' },
  { name: 'sepia',                 label: 'Sepia',                 defaultIntensity: 0.8, description: 'Sepia tone',                 cssProperty: 'sepia' },
  { name: 'invert',                label: 'Invert',                defaultIntensity: 1.0, description: 'Invert colors',              cssProperty: 'invert' },
  { name: 'hue-rotate',            label: 'Hue Rotate',            defaultIntensity: 0.5, description: 'Rotate hue',                 cssProperty: 'hue-rotate' },
  { name: 'vignette',              label: 'Vignette',              defaultIntensity: 0.5, description: 'Dark corner vignette',       cssProperty: 'box-shadow' },
  { name: 'film-grain',            label: 'Film Grain',            defaultIntensity: 0.3, description: 'Film grain noise overlay',   cssProperty: 'background-image' },
  { name: 'chromatic-aberration',  label: 'Chromatic Aberration',  defaultIntensity: 0.3, description: 'RGB color split',            cssProperty: 'text-shadow' },
  { name: 'glow',                  label: 'Glow',                  defaultIntensity: 0.5, description: 'Soft glow effect',           cssProperty: 'filter' },
  { name: 'sharpen',               label: 'Sharpen',               defaultIntensity: 0.5, description: 'Sharpen edges',              cssProperty: 'filter' },
  { name: 'pixelate',              label: 'Pixelate',              defaultIntensity: 0.5, description: 'Pixelation effect',          cssProperty: 'image-rendering' },
];

// ─── Color Grade Presets ─────────────────────────────────────

export interface ColorGradeDef {
  name: ColorGradePreset;
  label: string;
  description: string;
  css: Record<string, string>;
}

export const COLOR_GRADES: ColorGradeDef[] = [
  { name: 'cinematic',     label: 'Cinematic',      description: 'Teal shadows + warm highlights', css: { filter: 'contrast(1.1) saturate(0.9)', mixBlendMode: 'normal' } },
  { name: 'vintage',       label: 'Vintage',        description: 'Warm, faded, low contrast',     css: { filter: 'sepia(0.3) contrast(0.9) brightness(1.05)' } },
  { name: 'noir',          label: 'Noir',           description: 'High contrast black and white',  css: { filter: 'grayscale(1) contrast(1.3) brightness(0.9)' } },
  { name: 'warm',          label: 'Warm',           description: 'Warm golden tones',              css: { filter: 'sepia(0.15) saturate(1.2) brightness(1.05)' } },
  { name: 'cool',          label: 'Cool',           description: 'Cool blue tones',                css: { filter: 'saturate(0.9) hue-rotate(10deg) brightness(1.02)' } },
  { name: 'vibrant',       label: 'Vibrant',        description: 'High saturation, punchy',        css: { filter: 'saturate(1.5) contrast(1.1)' } },
  { name: 'muted',         label: 'Muted',          description: 'Low saturation, soft',           css: { filter: 'saturate(0.6) brightness(1.05)' } },
  { name: 'high-contrast', label: 'High Contrast',  description: 'Strong contrast',                css: { filter: 'contrast(1.4) brightness(0.95)' } },
  { name: 'teal-orange',   label: 'Teal & Orange',  description: 'Hollywood blockbuster look',     css: { filter: 'contrast(1.1) saturate(1.3)' } },
  { name: 'cyberpunk',     label: 'Cyberpunk',      description: 'Neon, high sat, purple/pink',    css: { filter: 'saturate(1.6) contrast(1.2) hue-rotate(-10deg)' } },
  { name: 'golden-hour',   label: 'Golden Hour',    description: 'Warm sunset tones',              css: { filter: 'sepia(0.2) saturate(1.3) brightness(1.1)' } },
  { name: 'moonlight',     label: 'Moonlight',      description: 'Cool, desaturated night look',   css: { filter: 'saturate(0.5) brightness(0.85) hue-rotate(20deg)' } },
];

// ─── Text Effect Definitions ─────────────────────────────────

export interface TextEffectDef {
  name: TextEffectPreset;
  label: string;
  defaultDuration: number;
  description: string;
}

export const TEXT_EFFECTS: TextEffectDef[] = [
  { name: 'typewriter',      label: 'Typewriter',      defaultDuration: 2.0, description: 'Character by character typing' },
  { name: 'char-reveal',     label: 'Character Reveal', defaultDuration: 1.5, description: 'Characters fade in one by one' },
  { name: 'word-reveal',     label: 'Word Reveal',     defaultDuration: 2.0, description: 'Words appear one by one' },
  { name: 'line-reveal',     label: 'Line Reveal',     defaultDuration: 1.5, description: 'Lines appear one by one' },
  { name: 'wave',            label: 'Wave',            defaultDuration: 2.0, description: 'Characters wave up and down' },
  { name: 'bounce-letters',  label: 'Bounce Letters',  defaultDuration: 1.5, description: 'Characters bounce in' },
  { name: 'scatter',         label: 'Scatter',         defaultDuration: 1.0, description: 'Characters scatter from random positions' },
  { name: 'glitch-text',     label: 'Glitch Text',     defaultDuration: 0.5, description: 'Digital glitch text effect' },
  { name: 'neon-flicker',    label: 'Neon Flicker',    defaultDuration: 1.5, description: 'Neon sign flickering on' },
  { name: 'gradient-sweep',  label: 'Gradient Sweep',  defaultDuration: 1.5, description: 'Color gradient sweeps across text' },
];

// ─── Lookup Helpers ──────────────────────────────────────────

export function getTransition(name: string): TransitionDef | undefined {
  return TRANSITIONS.find((t) => t.name === name);
}

export function getAnimation(name: string): AnimationDef | undefined {
  return ANIMATIONS.find((a) => a.name === name);
}

export function getFilter(name: string): FilterDef | undefined {
  return FILTERS.find((f) => f.name === name);
}

export function getColorGrade(name: string): ColorGradeDef | undefined {
  return COLOR_GRADES.find((c) => c.name === name);
}

export function getTextEffect(name: string): TextEffectDef | undefined {
  return TEXT_EFFECTS.find((t) => t.name === name);
}
