/**
 * MotionForge Example 01 — Cyberpunk Kinetic Intro
 *
 * Generates an electrifying 1080p 60fps futuristic motion graphics video
 * featuring layered neon elements, kinetic typography, and GSAP spring animations.
 *
 * Run: node examples/01-cyberpunk-kinetic-intro/generate.js
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Scene, Project, composeHTML } from '../../dist/index.js';

async function main() {
  const exampleDir = join(process.cwd(), 'examples', '01-cyberpunk-kinetic-intro');
  await mkdir(exampleDir, { recursive: true });

  // 1. Create 1920x1080 60fps 6-second Scene
  const scene = new Scene(
    {
      width: 1920,
      height: 1080,
      fps: 60,
      duration: 6,
      background: '#070913',
    },
    {
      name: 'Cyberpunk Kinetic Intro',
      description: 'Futuristic code-driven cyberpunk motion graphics sequence',
      tags: ['cyberpunk', 'neon', 'intro', 'kinetic', '60fps'],
    },
  );

  // 2. Track 1: Accent Neon Bar (Shape)
  const shapeTrack = scene.addTrack('shape', 'Accent Lines');
  const accentBar = shapeTrack.addClip(
    'shape',
    {
      type: 'shape',
      shape: 'rectangle',
      fill: '#00f0ff',
      stroke: '#00f0ff',
      strokeWidth: 0,
      borderRadius: 4,
    },
    0.3,
    5.4,
  );
  accentBar.setTransform({
    x: 960,
    y: 360,
    width: 280,
    height: 6,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  accentBar.addKeyframe('scaleX', 0, 0, 'ease-out-expo');
  accentBar.addKeyframe('scaleX', 0.8, 1, 'ease-out-expo');
  accentBar.addKeyframe('opacity', 0, 0, 'ease-out');
  accentBar.addKeyframe('opacity', 0.4, 1, 'ease-out');
  accentBar.addEffect('filter', 'glow', 0, 5.4, { blur: 16, color: '#00f0ff' });

  // 3. Track 2: Tagline / Subtitle
  const subTrack = scene.addTrack('text', 'Category Tag');
  const subClip = subTrack.addClip(
    'text',
    {
      type: 'text',
      text: '/// NEXT-GEN AGENTIC VIDEO ENGINE ///',
      fontFamily: 'Inter',
      fontSize: 22,
      fontWeight: 700,
      fontStyle: 'normal',
      color: '#00f0ff',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 6,
    },
    0.6,
    5.2,
  );
  subClip.setTransform({
    x: 960,
    y: 410,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  subClip.addKeyframe('y', 0, 430, 'ease-out-cubic');
  subClip.addKeyframe('y', 0.9, 410, 'ease-out-cubic');
  subClip.addKeyframe('opacity', 0, 0, 'ease-out');
  subClip.addKeyframe('opacity', 0.6, 1, 'ease-out');

  // 4. Track 3: Massive Kinetic Title
  const titleTrack = scene.addTrack('text', 'Hero Title');
  const heroClip = titleTrack.addClip(
    'text',
    {
      type: 'text',
      text: 'MOTIONFORGE',
      fontFamily: 'Inter',
      fontSize: 110,
      fontWeight: 900,
      fontStyle: 'normal',
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1.0,
      letterSpacing: 8,
      textShadow: '0 0 40px rgba(0, 240, 255, 0.6), 0 0 80px rgba(255, 0, 85, 0.4)',
    },
    1.0,
    4.8,
  );
  heroClip.setTransform({
    x: 960,
    y: 520,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  heroClip.addKeyframe('scaleX', 0, 0.7, 'ease-out-back');
  heroClip.addKeyframe('scaleY', 0, 0.7, 'ease-out-back');
  heroClip.addKeyframe('scaleX', 1.0, 1.0, 'ease-out-back');
  heroClip.addKeyframe('scaleY', 1.0, 1.0, 'ease-out-back');
  heroClip.addKeyframe('opacity', 0, 0, 'ease-out');
  heroClip.addKeyframe('opacity', 0.5, 1, 'ease-out');

  // 5. Track 4: Feature Badges (Bottom)
  const badgeTrack = scene.addTrack('text', 'Feature Highlights');
  const badgeClip = badgeTrack.addClip(
    'text',
    {
      type: 'text',
      text: '⚡ 100% CODE-FIRST   •   🤖 AI AGENT NATIVE   •   🚀 60 FPS RENDER',
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 600,
      fontStyle: 'normal',
      color: '#ff0055',
      textAlign: 'center',
      lineHeight: 1.4,
      letterSpacing: 4,
    },
    1.8,
    4.0,
  );
  badgeClip.setTransform({
    x: 960,
    y: 670,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  badgeClip.addKeyframe('opacity', 0, 0, 'ease-out');
  badgeClip.addKeyframe('opacity', 0.7, 1, 'ease-out');

  // 6. Save Project & HTML Preview
  const project = new Project(exampleDir, scene);
  await project.save();

  const html = composeHTML(scene.toJSON());
  const previewPath = join(exampleDir, 'preview.html');
  await writeFile(previewPath, html, 'utf-8');

  console.log(`✅ Generated Cyberpunk Kinetic Intro!`);
  console.log(`📁 Project saved: ${project.filePath}`);
  console.log(`🌐 Preview HTML: ${previewPath}`);
}

main().catch(console.error);
