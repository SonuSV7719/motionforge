import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { Scene } from '../core/Scene.js';
import { composeHTML } from '../compositor/Compositor.js';
import { buildGSAPTimeline } from '../compositor/gsap-builder.js';
import type { TextContent, ShapeContent } from '../core/types.js';

describe('MotionForge Compositor & GSAP Builder Tests', () => {
  test('composes full self-contained HTML document from SceneData', () => {
    const scene = new Scene(
      {
        width: 1920,
        height: 1080,
        fps: 30,
        duration: 5,
        background: '#0d1117',
      },
      {
        name: 'Test Composition',
      },
    );

    const track = scene.addTrack('text', 'Main Title');
    const textContent: TextContent = {
      type: 'text',
      text: 'MotionForge AI Agent',
      fontSize: 64,
      fontFamily: 'Inter',
      fontWeight: 700,
      fontStyle: 'normal',
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 0,
    };
    const clip = track.addClip('text', textContent, 0.5, 4);
    clip.setPosition(960, 540);

    const html = composeHTML(scene.toJSON());

    assert.ok(html.includes('<!DOCTYPE html>'), 'HTML document should contain DOCTYPE');
    assert.ok(html.includes('id="mf-scene"'), 'HTML document should contain scene container');
    assert.ok(html.includes('MotionForge AI Agent'), 'HTML should contain clip text content');
    assert.ok(html.includes('__mf_seekToFrame'), 'HTML should contain frame seeking engine hook');
    assert.ok(html.includes('gsap.min.js'), 'HTML should link to GSAP library');
  });

  test('builds GSAP timeline script for keyframed transforms', () => {
    const scene = new Scene({ duration: 5, fps: 30 });
    const track = scene.addTrack('shape', 'Box');
    const shapeContent: ShapeContent = {
      type: 'shape',
      shape: 'rectangle',
      fill: '#4f46e5',
      stroke: '#ffffff',
      strokeWidth: 2,
    };
    const clip = track.addClip('shape', shapeContent, 0, 5);

    clip.addKeyframe('x', 0, 0, 'linear');
    clip.addKeyframe('x', 2, 500, 'ease-out');

    const timelineScript = buildGSAPTimeline(scene.toJSON());
    assert.ok(timelineScript.includes('gsap.timeline'), 'Should initialize GSAP timeline');
    assert.ok(timelineScript.length > 50, 'Should generate valid JS code');
  });
});
