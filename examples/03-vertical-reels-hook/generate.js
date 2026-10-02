/**
 * MotionForge Example 03 — Vertical Social Reels Hook
 *
 * Generates an attention-grabbing 1080x1920 9:16 vertical video
 * formatted for Instagram Reels, TikTok, and YouTube Shorts.
 *
 * Run: node examples/03-vertical-reels-hook/generate.js
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Scene, Project, composeHTML } from '../../dist/index.js';

async function main() {
  const exampleDir = join(process.cwd(), 'examples', '03-vertical-reels-hook');
  await mkdir(exampleDir, { recursive: true });

  // 1. Create 1080x1920 60fps 5-second Vertical Scene
  const scene = new Scene(
    {
      width: 1080,
      height: 1920,
      fps: 60,
      duration: 5,
      background: '#0a0a0f',
    },
    {
      name: 'Viral Reels Hook',
      description: '9:16 high-retention social media hook motion graphics',
      tags: ['reels', 'tiktok', 'shorts', 'vertical', 'viral'],
    },
  );

  // 2. Track 1: Accent Pill (Badge)
  const pillTrack = scene.addTrack('shape', 'Header Pill');
  const pill = pillTrack.addClip(
    'shape',
    {
      type: 'shape',
      shape: 'rectangle',
      fill: '#FFE600',
      stroke: '#FFE600',
      strokeWidth: 0,
      borderRadius: 50,
    },
    0.2,
    4.6,
  );
  pill.setTransform({
    x: 540,
    y: 520,
    width: 320,
    height: 52,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  pill.addKeyframe('scaleX', 0, 0, 'ease-out-back');
  pill.addKeyframe('scaleY', 0, 0, 'ease-out-back');
  pill.addKeyframe('scaleX', 0.6, 1, 'ease-out-back');
  pill.addKeyframe('scaleY', 0.6, 1, 'ease-out-back');

  // 3. Track 2: Badge Text
  const badgeTrack = scene.addTrack('text', 'Badge Text');
  const badgeClip = badgeTrack.addClip(
    'text',
    {
      type: 'text',
      text: '⚡ STOP EDITING MANUALLY',
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 900,
      fontStyle: 'normal',
      color: '#000000',
      textAlign: 'center',
      lineHeight: 1.0,
      letterSpacing: 1.5,
    },
    0.3,
    4.5,
  );
  badgeClip.setTransform({
    x: 540,
    y: 520,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  badgeClip.addKeyframe('opacity', 0, 0, 'ease-out');
  badgeClip.addKeyframe('opacity', 0.3, 1, 'ease-out');

  // 4. Track 3: Huge Viral Headline
  const hookTrack = scene.addTrack('text', 'Hook Headline');
  const hookClip = hookTrack.addClip(
    'text',
    {
      type: 'text',
      text: 'Code Motion Graphics With AI Agents',
      fontFamily: 'Inter',
      fontSize: 72,
      fontWeight: 900,
      fontStyle: 'normal',
      color: '#FFFFFF',
      textAlign: 'center',
      lineHeight: 1.15,
      letterSpacing: -1,
      maxWidth: 900,
    },
    0.8,
    4.0,
  );
  hookClip.setTransform({
    x: 540,
    y: 780,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  hookClip.addKeyframe('y', 0, 840, 'ease-out-expo');
  hookClip.addKeyframe('y', 0.8, 780, 'ease-out-expo');
  hookClip.addKeyframe('opacity', 0, 0, 'ease-out');
  hookClip.addKeyframe('opacity', 0.4, 1, 'ease-out');

  // 5. Track 4: Kinetic Callout Box
  const ctaTrack = scene.addTrack('text', 'CTA Callout');
  const ctaClip = ctaTrack.addClip(
    'text',
    {
      type: 'text',
      text: '🤖 Prompt → Timeline → 60 FPS MP4',
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: 700,
      fontStyle: 'normal',
      color: '#00F0FF',
      textAlign: 'center',
      lineHeight: 1.3,
      letterSpacing: 1,
    },
    1.6,
    3.2,
  );
  ctaClip.setTransform({
    x: 540,
    y: 1120,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  ctaClip.addKeyframe('opacity', 0, 0, 'ease-out');
  ctaClip.addKeyframe('opacity', 0.6, 1, 'ease-out');

  // 6. Save Project & HTML Preview
  const project = new Project(exampleDir, scene);
  await project.save();

  const html = composeHTML(scene.toJSON());
  const previewPath = join(exampleDir, 'preview.html');
  await writeFile(previewPath, html, 'utf-8');

  console.log(`✅ Generated Vertical Reels Hook!`);
  console.log(`📁 Project saved: ${project.filePath}`);
  console.log(`🌐 Preview HTML: ${previewPath}`);
}

main().catch(console.error);
