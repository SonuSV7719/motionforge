import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getFontPairing, buildGoogleFontsImport, FONT_PAIRINGS } from '../assets/font-matcher.js';
import { SvgGenerator } from '../compositor/svg-generator.js';
import { Scene } from '../core/Scene.js';
import { VideoEditorOps } from '../core/video-editor.js';

describe('MotionForge Pro Modules Tests', () => {
  describe('FontMatcher', () => {
    test('retrieves style-aware font pairings', () => {
      const cyberpunk = getFontPairing('cyberpunk');
      assert.equal(cyberpunk.headingFont, 'Orbitron');
      assert.equal(cyberpunk.bodyFont, 'Rajdhani');

      const saas = getFontPairing('saas');
      assert.equal(saas.headingFont, 'Plus Jakarta Sans');

      const luxury = getFontPairing('luxury');
      assert.equal(luxury.headingFont, 'Playfair Display');
    });

    test('builds multi-font Google Fonts CSS imports', () => {
      const url = buildGoogleFontsImport([
        { family: 'Orbitron', weights: [700, 900] },
        { family: 'Rajdhani', weights: [600] },
      ]);
      assert.ok(url.includes('family=Orbitron:wght@700;900'));
      assert.ok(url.includes('family=Rajdhani:wght@600'));
    });
  });

  describe('SvgGenerator', () => {
    test('generates procedural SVG progress ring', () => {
      const ring = SvgGenerator.createProgressRing({
        size: 120,
        strokeWidth: 8,
        color: '#00F0FF',
        progressPercent: 75,
      });
      assert.ok(ring.includes('<svg class="mf-svg-ring"'));
      assert.ok(ring.includes('stroke-dasharray='));
      assert.ok(ring.includes('stroke="#00F0FF"'));
    });

    test('generates procedural audio waveforms and grid patterns', () => {
      const wave = SvgGenerator.createWaveform({
        width: 300,
        height: 80,
        bars: 20,
        color: '#6366F1',
      });
      assert.ok(wave.includes('<svg class="mf-svg-waveform"'));
      assert.ok(wave.includes('<rect'));

      const grid = SvgGenerator.createGrid({
        width: 1920,
        height: 1080,
        gridSize: 40,
        strokeColor: 'rgba(255,255,255,0.05)',
      });
      assert.ok(grid.includes('<svg class="mf-svg-grid"'));
      assert.ok(grid.includes('pattern id="mf-grid-pattern"'));
    });
  });

  describe('VideoEditorOps', () => {
    test('adds Picture-in-Picture (PiP) video clip to scene', () => {
      const scene = new Scene({ width: 1920, height: 1080, duration: 10 });
      const pipClip = VideoEditorOps.addPictureInPicture(scene, {
        videoSrc: 'footage.mp4',
        start: 1,
        duration: 5,
        position: 'top-right',
      });

      assert.ok(pipClip);
      assert.equal(pipClip.type, 'video');
      assert.equal(pipClip.start, 1);
      assert.equal(pipClip.duration, 5);
      assert.equal(scene.getTracks().length, 1);
    });

    test('creates split-screen composition', () => {
      const scene = new Scene({ width: 1920, height: 1080, duration: 10 });
      const { leftClip, rightClip } = VideoEditorOps.addSplitScreen(scene, {
        leftVideoSrc: 'camA.mp4',
        rightVideoSrc: 'camB.mp4',
        start: 0,
        duration: 8,
      });

      assert.ok(leftClip);
      assert.ok(rightClip);
      assert.equal(scene.getTracks().length, 2);
    });
  });

  describe('AudioMixer', () => {
    test('adds background music, voiceover, and SFX clips', async () => {
      const { AudioMixer } = await import('../core/audio-mixer.js');
      const scene = new Scene({ duration: 10 });

      const musicClip = AudioMixer.addMusic(scene, {
        src: 'ambient-music.mp3',
        start: 0,
        duration: 10,
        volume: 0.5,
        fadeIn: 1.0,
      });
      assert.equal(musicClip.type, 'audio');
      assert.equal((musicClip.content as any).volume, 0.5);

      const voiceClip = AudioMixer.addVoiceover(scene, {
        src: 'voice-intro.mp3',
        start: 1.5,
        duration: 4.0,
        volume: 1.0,
      });
      assert.equal(voiceClip.start, 1.5);

      const audioClips = AudioMixer.extractSceneAudioClips(scene);
      assert.equal(audioClips.length, 2);
      assert.equal(audioClips[0].src, 'ambient-music.mp3');
      assert.equal(audioClips[1].src, 'voice-intro.mp3');
    });
  });

  describe('ThreeBuilder & LottieBuilder', () => {
    test('generates Three.js 3D WebGL initialization script', async () => {
      const { ThreeBuilder } = await import('../compositor/three-builder.js');
      const mockClip: any = {
        id: 'clip3d',
        content: {
          type: 'three3d',
          objectType: 'icosahedron',
          color: '#00F0FF',
          wireframe: true,
        },
      };

      const script = ThreeBuilder.buildThreeScript(mockClip);
      assert.ok(script.includes('new THREE.Scene()'));
      assert.ok(script.includes('new THREE.IcosahedronGeometry'));
      assert.ok(script.includes('__mf_three_renders'));
    });

    test('generates Lottie animation loader script', async () => {
      const { LottieBuilder } = await import('../compositor/lottie-builder.js');
      const mockClip: any = {
        id: 'cliplot',
        start: 1,
        duration: 4,
        content: {
          type: 'lottie',
          src: 'https://assets.example.com/check.json',
          speed: 1.5,
        },
      };

      const script = LottieBuilder.buildLottieScript(mockClip);
      assert.ok(script.includes('lottie.loadAnimation'));
      assert.ok(script.includes('https://assets.example.com/check.json'));
      assert.ok(script.includes('__mf_lottie_anims'));
    });
  });
});
