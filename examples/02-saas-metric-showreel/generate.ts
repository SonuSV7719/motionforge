/**
 * MotionForge Example 02 — SaaS Metric Showreel
 *
 * Generates a sleek, high-conversion SaaS feature showcase video
 * with glassmorphic cards, floating metric chips, and smooth entrance easing.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Scene } from '../../src/core/Scene.js';
import { Project } from '../../src/core/Project.js';
import { composeHTML } from '../../src/compositor/Compositor.js';

async function main() {
  const exampleDir = join(process.cwd(), 'examples', '02-saas-metric-showreel');
  await mkdir(exampleDir, { recursive: true });

  // 1. Create 1920x1080 60fps 6-second Scene
  const scene = new Scene(
    {
      width: 1920,
      height: 1080,
      fps: 60,
      duration: 6,
      background: '#0B0F19',
    },
    {
      name: 'SaaS Metric Showreel',
      description: 'Ultra-modern SaaS metrics showcase with glassmorphism',
      tags: ['saas', 'product-hunt', 'showreel', 'glassmorphism', 'metrics'],
    },
  );

  // 2. Track 1: Glow Orb / Card Backing
  const cardTrack = scene.addTrack('shape', 'Glass Card');
  const glassCard = cardTrack.addClip(
    'shape',
    {
      type: 'shape',
      shape: 'rectangle',
      fill: 'rgba(255, 255, 255, 0.04)',
      stroke: 'rgba(255, 255, 255, 0.12)',
      strokeWidth: 1,
      borderRadius: 24,
    },
    0.2,
    5.6,
  );
  glassCard.setTransform({
    x: 960,
    y: 540,
    width: 860,
    height: 480,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  glassCard.addKeyframe('scaleX', 0, 0.85, 'ease-out-expo');
  glassCard.addKeyframe('scaleY', 0, 0.85, 'ease-out-expo');
  glassCard.addKeyframe('scaleX', 0.9, 1, 'ease-out-expo');
  glassCard.addKeyframe('scaleY', 0.9, 1, 'ease-out-expo');
  glassCard.addKeyframe('opacity', 0, 0, 'ease-out');
  glassCard.addKeyframe('opacity', 0.5, 1, 'ease-out');

  // 3. Track 2: Product Header
  const headerTrack = scene.addTrack('text', 'Header');
  const headerClip = headerTrack.addClip(
    'text',
    {
      type: 'text',
      text: 'Supercharge Video Production',
      fontFamily: 'Inter',
      fontSize: 44,
      fontWeight: 800,
      fontStyle: 'normal',
      color: '#F8FAFC',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    0.6,
    5.2,
  );
  headerClip.setTransform({
    x: 960,
    y: 380,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  headerClip.addKeyframe('y', 0, 400, 'ease-out-cubic');
  headerClip.addKeyframe('y', 0.8, 380, 'ease-out-cubic');
  headerClip.addKeyframe('opacity', 0, 0, 'ease-out');
  headerClip.addKeyframe('opacity', 0.6, 1, 'ease-out');

  // 4. Track 3: Big Metric ("+480%")
  const metricTrack = scene.addTrack('text', 'Hero Stat');
  const metricClip = metricTrack.addClip(
    'text',
    {
      type: 'text',
      text: '+480% RENDER SPEED',
      fontFamily: 'Inter',
      fontSize: 76,
      fontWeight: 900,
      fontStyle: 'normal',
      color: '#6366F1',
      textAlign: 'center',
      lineHeight: 1.0,
      letterSpacing: 2,
      textShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
    },
    1.2,
    4.6,
  );
  metricClip.setTransform({
    x: 960,
    y: 510,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  metricClip.addKeyframe('scaleX', 0, 0.8, 'ease-out-back');
  metricClip.addKeyframe('scaleY', 0, 0.8, 'ease-out-back');
  metricClip.addKeyframe('scaleX', 0.8, 1.0, 'ease-out-back');
  metricClip.addKeyframe('scaleY', 0.8, 1.0, 'ease-out-back');
  metricClip.addKeyframe('opacity', 0, 0, 'ease-out');
  metricClip.addKeyframe('opacity', 0.4, 1, 'ease-out');

  // 5. Track 4: Supporting Subtext
  const subtextTrack = scene.addTrack('text', 'Subtext');
  const subtextClip = subtextTrack.addClip(
    'text',
    {
      type: 'text',
      text: 'Zero Timeline Bloat • Pure Deterministic Frame Pipelines',
      fontFamily: 'Inter',
      fontSize: 22,
      fontWeight: 500,
      fontStyle: 'normal',
      color: '#94A3B8',
      textAlign: 'center',
      lineHeight: 1.4,
      letterSpacing: 0.5,
    },
    1.8,
    4.0,
  );
  subtextClip.setTransform({
    x: 960,
    y: 630,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  subtextClip.addKeyframe('opacity', 0, 0, 'ease-out');
  subtextClip.addKeyframe('opacity', 0.7, 1, 'ease-out');

  // 6. Save Project & HTML Preview
  const project = new Project(exampleDir, scene);
  await project.save();

  const html = composeHTML(scene.toJSON());
  const previewPath = join(exampleDir, 'preview.html');
  await writeFile(previewPath, html, 'utf-8');

  console.log(`✅ Generated SaaS Metric Showreel!`);
  console.log(`📁 Project saved: ${project.filePath}`);
  console.log(`🌐 Preview HTML: ${previewPath}`);
}

main().catch(console.error);
