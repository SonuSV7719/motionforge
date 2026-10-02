/**
 * MotionForge — Core Type Definitions
 *
 * All shared types, interfaces, and enums used across the engine.
 * This is the single source of truth for the MotionForge data model.
 */

// ─── Identifiers ─────────────────────────────────────────────────

/** Branded ID type for type-safe references */
export type SceneId = string & { readonly __brand: 'SceneId' };
export type TrackId = string & { readonly __brand: 'TrackId' };
export type ClipId = string & { readonly __brand: 'ClipId' };
export type KeyframeId = string & { readonly __brand: 'KeyframeId' };
export type EffectId = string & { readonly __brand: 'EffectId' };
export type TemplateId = string & { readonly __brand: 'TemplateId' };

// ─── Time & Position ─────────────────────────────────────────────

/** Time in seconds (decimal precision) */
export type TimeSeconds = number;

/** Position on a 2D canvas */
export interface Position {
  x: number;
  y: number;
}

/** Size dimensions */
export interface Size {
  width: number;
  height: number;
}

/** Bounding box */
export interface Rect extends Position, Size {}

/** RGBA color */
export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

// ─── Scene ───────────────────────────────────────────────────────

export interface SceneConfig {
  width: number;
  height: number;
  fps: number;
  duration: TimeSeconds;
  background: string;
  name?: string;
}

export interface SceneData {
  id: SceneId;
  config: SceneConfig;
  tracks: TrackData[];
  metadata: SceneMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface SceneMetadata {
  name: string;
  description?: string;
  author?: string;
  version: string;
  tags?: string[];
}

// ─── Track ───────────────────────────────────────────────────────

export type TrackType = 'video' | 'audio' | 'text' | 'shape' | 'image' | 'template' | 'three3d' | 'lottie';

export interface TrackData {
  id: TrackId;
  type: TrackType;
  name: string;
  clips: ClipData[];
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  order: number;
}

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';

// ─── Clip ────────────────────────────────────────────────────────

export type ClipType = 'video' | 'audio' | 'text' | 'shape' | 'image' | 'template' | 'solid' | 'three3d' | 'lottie';

export interface ClipData {
  id: ClipId;
  type: ClipType;
  start: TimeSeconds;
  duration: TimeSeconds;
  content: ClipContent;
  transform: Transform;
  keyframes: KeyframeData[];
  effects: EffectData[];
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export type ClipContent =
  | VideoContent
  | AudioContent
  | TextContent
  | ShapeContent
  | ImageContent
  | TemplateContent
  | SolidContent
  | Three3DContent
  | LottieContent;

export type Three3DObjectType =
  | 'particles'
  | 'galaxy'
  | 'device-iphone'
  | 'device-laptop'
  | 'cube-matrix'
  | 'icosahedron'
  | 'torus-knot'
  | 'liquid-mesh'
  | 'custom-mesh';

export interface Three3DContent {
  type: 'three3d';
  objectType: Three3DObjectType;
  color?: string;
  wireframe?: boolean;
  roughness?: number;
  metalness?: number;
  particleCount?: number;
  textureSrc?: string;
  rotationSpeed?: { x?: number; y?: number; z?: number };
  shaderPreset?: 'liquid' | 'crt' | 'hologram' | 'noise';
}

export interface LottieContent {
  type: 'lottie';
  src: string;
  loop?: boolean;
  speed?: number;
}

export interface VideoContent {
  type: 'video';
  src: string;
  trimStart: TimeSeconds;
  trimEnd: TimeSeconds;
  speed: number;
  volume: number;
  muted: boolean;
}

export interface AudioContent {
  type: 'audio';
  src: string;
  trimStart: TimeSeconds;
  trimEnd: TimeSeconds;
  speed: number;
  volume: number;
  fadeIn: TimeSeconds;
  fadeOut: TimeSeconds;
}

export interface TextContent {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  color: string;
  backgroundColor?: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  textShadow?: string;
  maxWidth?: number;
  padding?: number;
}

export interface ShapeContent {
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'ellipse' | 'line' | 'polygon' | 'path';
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius?: number;
  points?: Position[];
  path?: string;
}

export interface ImageContent {
  type: 'image';
  src: string;
  fit: 'cover' | 'contain' | 'fill' | 'none';
}

export interface TemplateContent {
  type: 'template';
  templateId: string;
  props: Record<string, unknown>;
}

export interface SolidContent {
  type: 'solid';
  color: string;
}

// ─── Transform ───────────────────────────────────────────────────

export interface Transform {
  x: number;
  y: number;
  width: number | 'auto';
  height: number | 'auto';
  rotation: number;
  scaleX: number;
  scaleY: number;
  anchorX: number;
  anchorY: number;
  skewX: number;
  skewY: number;
}

// ─── Keyframes ───────────────────────────────────────────────────

export type AnimatableProperty =
  | 'x'
  | 'y'
  | 'width'
  | 'height'
  | 'rotation'
  | 'scaleX'
  | 'scaleY'
  | 'opacity'
  | 'fontSize'
  | 'letterSpacing'
  | 'borderRadius'
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'saturate'
  | 'hue-rotate';

export interface KeyframeData {
  id: KeyframeId;
  property: AnimatableProperty;
  time: TimeSeconds;
  value: number;
  easing: EasingType;
}

export type EasingType =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'ease-in-quad'
  | 'ease-out-quad'
  | 'ease-in-out-quad'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-quart'
  | 'ease-out-quart'
  | 'ease-in-out-quart'
  | 'ease-in-expo'
  | 'ease-out-expo'
  | 'ease-in-out-expo'
  | 'ease-in-back'
  | 'ease-out-back'
  | 'ease-in-out-back'
  | 'ease-in-elastic'
  | 'ease-out-elastic'
  | 'ease-in-out-elastic'
  | 'ease-out-bounce'
  | 'spring';

// ─── Effects ─────────────────────────────────────────────────────

export type EffectType = 'transition' | 'filter' | 'animation' | 'text-effect';

export interface EffectData {
  id: EffectId;
  type: EffectType;
  name: string;
  start: TimeSeconds;
  duration: TimeSeconds;
  params: Record<string, unknown>;
}

// ─── Transition Presets ──────────────────────────────────────────

export type TransitionName =
  | 'fade'
  | 'fade-black'
  | 'fade-white'
  | 'dissolve'
  | 'wipe-left'
  | 'wipe-right'
  | 'wipe-up'
  | 'wipe-down'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'glitch'
  | 'morph'
  | 'iris'
  | 'clock-wipe';

// ─── Animation Presets ───────────────────────────────────────────

export type AnimationPreset =
  | 'fade-in'
  | 'fade-out'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'slide-out-left'
  | 'slide-out-right'
  | 'scale-in'
  | 'scale-out'
  | 'bounce-in'
  | 'bounce-out'
  | 'spin-in'
  | 'flip-x'
  | 'flip-y'
  | 'typewriter'
  | 'reveal-left'
  | 'reveal-right'
  | 'blur-in'
  | 'blur-out'
  | 'pop'
  | 'elastic'
  | 'shake';

// ─── Text Effect Presets ─────────────────────────────────────────

export type TextEffectPreset =
  | 'typewriter'
  | 'char-reveal'
  | 'word-reveal'
  | 'line-reveal'
  | 'wave'
  | 'bounce-letters'
  | 'scatter'
  | 'glitch-text'
  | 'neon-flicker'
  | 'gradient-sweep';

// ─── Filter Presets ──────────────────────────────────────────────

export type FilterName =
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'saturate'
  | 'grayscale'
  | 'sepia'
  | 'invert'
  | 'hue-rotate'
  | 'vignette'
  | 'film-grain'
  | 'chromatic-aberration'
  | 'glow'
  | 'sharpen'
  | 'pixelate';

export type ColorGradePreset =
  | 'cinematic'
  | 'vintage'
  | 'noir'
  | 'warm'
  | 'cool'
  | 'pastel'
  | 'vibrant'
  | 'muted'
  | 'high-contrast'
  | 'low-contrast'
  | 'teal-orange'
  | 'cyberpunk'
  | 'golden-hour'
  | 'moonlight';

// ─── Template ────────────────────────────────────────────────────

export type TemplateCategory =
  | 'lower-thirds'
  | 'title-cards'
  | 'intros'
  | 'outros'
  | 'social-media'
  | 'data-viz'
  | 'infographics'
  | 'transitions'
  | 'backgrounds'
  | 'overlays';

export interface TemplatePropDef {
  type: 'string' | 'number' | 'boolean' | 'color' | 'enum' | 'file';
  required: boolean;
  default: unknown;
  description?: string;
  values?: string[];
  min?: number;
  max?: number;
}

export interface TemplateManifest {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  author?: string;
  version: string;
  duration: TimeSeconds;
  preview?: string;
  tags: string[];
  props: Record<string, TemplatePropDef>;
  files: {
    composition: string;
    style: string;
    animation: string;
  };
}

// ─── Output / Render ─────────────────────────────────────────────

export interface RenderConfig {
  output: string;
  format: 'mp4' | 'mov' | 'webm' | 'gif';
  width: number;
  height: number;
  fps: number;
  codec: string;
  videoBitrate: string;
  audioBitrate: string;
  audioCodec: string;
  quality: number;
  pixelFormat: string;
  startTime?: TimeSeconds;
  endTime?: TimeSeconds;
}

export interface OutputPreset {
  name: string;
  description: string;
  platform: string;
  config: Partial<RenderConfig>;
}

// ─── Project ─────────────────────────────────────────────────────

export interface ProjectData {
  version: string;
  engine: string;
  scene: SceneData;
  assets: AssetRef[];
  renderHistory: RenderRecord[];
}

export interface AssetRef {
  id: string;
  type: 'video' | 'audio' | 'image' | 'font';
  src: string;
  name: string;
  size?: number;
  duration?: TimeSeconds;
  dimensions?: Size;
}

export interface RenderRecord {
  output: string;
  preset: string;
  timestamp: string;
  duration: number;
  fileSize: number;
}

// ─── CLI Output ──────────────────────────────────────────────────

export interface CLIOutput<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
