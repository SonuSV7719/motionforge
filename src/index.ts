/**
 * MotionForge — Library Entry Point
 *
 * Public API for programmatic use (importing MotionForge as a library).
 */

export { Scene } from './core/Scene.js';
export { Track } from './core/Track.js';
export { Clip } from './core/Clip.js';
export { Project } from './core/Project.js';
export { AudioMixer } from './core/audio-mixer.js';
export { VideoEditorOps } from './core/video-editor.js';

export { composeHTML } from './compositor/Compositor.js';
export { buildGSAPTimeline } from './compositor/gsap-builder.js';
export { SvgGenerator } from './compositor/svg-generator.js';
export { CameraMotion } from './compositor/camera.js';
export { ThreeBuilder } from './compositor/three-builder.js';
export { LottieBuilder } from './compositor/lottie-builder.js';

export { renderScene } from './renderer/Renderer.js';
export { captureFrames } from './renderer/frame-capture.js';
export { encodeVideo, checkFFmpeg } from './renderer/ffmpeg-pipeline.js';

export { TemplateEngine } from './templates/index.js';
export { AssetManager, FontManager } from './assets/index.js';
export { getFontPairing, buildGoogleFontsImport, FONT_PAIRINGS } from './assets/font-matcher.js';
export { MediaIngestor } from './assets/media-ingestor.js';
export { AiConnectors } from './assets/ai-connectors.js';

export * from './effects/index.js';
export type * from './core/types.js';
