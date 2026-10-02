import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { Scene } from '../core/Scene.js';
import { Track } from '../core/Track.js';
import { Clip } from '../core/Clip.js';
import { Project } from '../core/Project.js';
import type { TextContent, ShapeContent } from '../core/types.js';

const sampleText: TextContent = {
  type: 'text',
  text: 'Hello MotionForge',
  fontFamily: 'Inter',
  fontSize: 48,
  fontWeight: 700,
  fontStyle: 'normal',
  color: '#ffffff',
  textAlign: 'center',
  lineHeight: 1.2,
  letterSpacing: 0,
};

const sampleShape: ShapeContent = {
  type: 'shape',
  shape: 'rectangle',
  fill: '#ff4b72',
  stroke: '#ffffff',
  strokeWidth: 2,
  borderRadius: 8,
};

describe('MotionForge Core Tests', () => {
  describe('Scene', () => {
    test('creates scene with default configuration', () => {
      const scene = new Scene();
      assert.ok(scene.id, 'Scene should have a unique ID');
      assert.equal(scene.config.width, 1920);
      assert.equal(scene.config.height, 1080);
      assert.equal(scene.config.fps, 30);
      assert.equal(scene.config.duration, 10);
      assert.equal(scene.config.background, '#000000');
    });

    test('creates scene with custom configuration', () => {
      const scene = new Scene(
        {
          width: 1080,
          height: 1920,
          fps: 60,
          duration: 15,
          background: '#1a1a2e',
        },
        {
          name: 'Instagram Reel',
          tags: ['social', 'vertical'],
        },
      );

      assert.equal(scene.config.width, 1080);
      assert.equal(scene.config.height, 1920);
      assert.equal(scene.config.fps, 60);
      assert.equal(scene.config.duration, 15);
      assert.equal(scene.metadata.name, 'Instagram Reel');
      assert.deepEqual(scene.metadata.tags, ['social', 'vertical']);
    });

    test('manages tracks properly (add, get, remove, reorder)', () => {
      const scene = new Scene();
      const textTrack = scene.addTrack('text', 'Main Text');
      const shapeTrack = scene.addTrack('shape', 'Background Shapes');

      assert.equal(scene.getTracks().length, 2);
      assert.equal(scene.getTrack(textTrack.id)?.name, 'Main Text');

      scene.reorderTracks([shapeTrack.id, textTrack.id]);
      const reordered = scene.getTracks();
      assert.equal(reordered[0].id, shapeTrack.id);
      assert.equal(reordered[1].id, textTrack.id);

      const removed = scene.removeTrack(textTrack.id);
      assert.equal(removed, true);
      assert.equal(scene.getTracks().length, 1);
    });

    test('serializes to JSON and restores from JSON correctly', () => {
      const scene = new Scene({ width: 1280, height: 720, fps: 24, duration: 5 });
      const track = scene.addTrack('text', 'Header');
      const clip = track.addClip('text', sampleText, 0, 3);
      clip.setPosition(100, 200);

      const serialized = scene.toJSON();
      assert.equal(serialized.config.width, 1280);
      assert.equal(serialized.tracks.length, 1);
      assert.equal(serialized.tracks[0].clips.length, 1);
      assert.equal(
        (serialized.tracks[0].clips[0].content as TextContent).text,
        'Hello MotionForge',
      );

      const restored = Scene.fromJSON(serialized);
      assert.equal(restored.config.width, 1280);
      assert.equal(restored.config.fps, 24);
      assert.equal(restored.getTracks().length, 1);
      assert.equal(restored.getTracks()[0].getClips().length, 1);
      assert.equal(
        (restored.getTracks()[0].getClips()[0].content as TextContent).text,
        'Hello MotionForge',
      );
    });
  });

  describe('Track & Clip', () => {
    test('creates and manipulates clips', () => {
      const track = new Track('shape', 'Shapes Track');
      const clip = track.addClip('shape', sampleShape, 1, 4);

      assert.equal(clip.type, 'shape');
      assert.equal(clip.start, 1);
      assert.equal(clip.duration, 4);
      assert.equal(clip.end, 5);

      clip.setPosition(500, 300);
      clip.setScale(1.5);
      clip.setTransform({ rotation: 45 });
      clip.opacity = 0.8;

      assert.equal(clip.transform.x, 500);
      assert.equal(clip.transform.y, 300);
      assert.equal(clip.transform.scaleX, 1.5);
      assert.equal(clip.transform.rotation, 45);
      assert.equal(clip.opacity, 0.8);
    });

    test('adds and queries keyframes and effects', () => {
      const clip = new Clip('text', sampleText, 0, 5);
      clip.addKeyframe('opacity', 0, 0, 'ease-in');
      clip.addKeyframe('opacity', 1, 1, 'ease-out');

      const keyframes = clip.getAllKeyframes();
      assert.equal(keyframes.length, 2);
      assert.equal(keyframes[0].value, 0);
      assert.equal(keyframes[1].value, 1);

      const effect = clip.addEffect('filter', 'glow', 0, 3, { blur: 10 });
      assert.equal(clip.getEffects().length, 1);
      assert.equal(effect.name, 'glow');

      clip.removeEffect(effect.id);
      assert.equal(clip.getEffects().length, 0);
    });

    test('splits and trims clips properly', () => {
      const clip = new Clip('text', sampleText, 0, 10);
      const secondHalf = clip.split(4);

      assert.ok(secondHalf, 'Clip should be split successfully');
      assert.equal(clip.duration, 4);
      assert.equal(secondHalf.start, 4);
      assert.equal(secondHalf.duration, 6);
    });
  });

  describe('Project', () => {
    test('creates and manages project with scene', () => {
      const scene = new Scene({ width: 1920, height: 1080, fps: 30 }, { name: 'Demo Project' });
      const project = new Project('temp/test-proj', scene);

      assert.equal(project.scene.metadata.name, 'Demo Project');
      assert.equal(project.dir, 'temp/test-proj');
      assert.ok(project.getSummary().includes('Demo Project'));
    });
  });
});
