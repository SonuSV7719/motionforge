/**
 * MotionForge Example 04 — Professional 3D Motion Graphics Showcase
 *
 * Broadcast-grade 3D WebGL motion graphics with:
 * - Proper z-index layering (Text in front of 3D canvas)
 * - School of Motion staggered entrance choreography
 * - Studio lighting on 3D metallic Torus Knot
 * - Optical typography hierarchy with glowing badges and subtitle accents
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Scene, Project, composeHTML } from '../../dist/index.js';

async function main() {
  const exampleDir = join(process.cwd(), 'examples', '04-3d-cyber-galaxy');
  await mkdir(exampleDir, { recursive: true });

  // 1. Create 1920x1080 60fps 6-second Scene
  const scene = new Scene(
    {
      width: 1920,
      height: 1080,
      fps: 60,
      duration: 6,
      background: 'radial-gradient(circle at 50% 45%, #0B132B 0%, #04060E 100%)',
    },
    {
      name: '3D Cyber Matrix Showcase',
      description: 'Broadcast-grade 3D WebGL motion graphics with floating metallic geometry',
      tags: ['3d', 'threejs', 'webgl', 'particles', 'hologram'],
    },
  );

  // 2. Track 0 (Background): 3D WebGL Stage
  const threeTrack = scene.addTrack('three3d', '3D WebGL Stage');
  const threeClip = threeTrack.addClip(
    'three3d',
    {
      type: 'three3d',
      objectType: 'torus-knot',
      color: '#00F0FF',
      wireframe: false,
      particleCount: 1500,
    },
    0,
    6,
  );
  threeClip.setTransform({
    x: 960,
    y: 540,
    width: 1920,
    height: 1080,
    anchorX: 0.5,
    anchorY: 0.5,
  });

  // 3. Track 1 (Foreground): Category Tag Pill
  const pillTrack = scene.addTrack('shape', 'Category Pill');
  const pill = pillTrack.addClip(
    'shape',
    {
      type: 'shape',
      shape: 'rectangle',
      fill: 'rgba(0, 240, 255, 0.12)',
      stroke: '#00F0FF',
      strokeWidth: 1.5,
      borderRadius: 50,
    },
    0.3,
    5.4,
  );
  pill.setTransform({
    x: 960,
    y: 110,
    width: 360,
    height: 44,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  pill.addKeyframe('scaleX', 0, 0, 'ease-out-back');
  pill.addKeyframe('scaleY', 0, 0, 'ease-out-back');
  pill.addKeyframe('scaleX', 0.5, 1, 'ease-out-back');
  pill.addKeyframe('scaleY', 0.5, 1, 'ease-out-back');

  // 4. Track 2 (Foreground): Pill Text
  const tagTrack = scene.addTrack('text', 'Tag Text');
  const tagClip = tagTrack.addClip(
    'text',
    {
      type: 'text',
      text: '✦ REAL-TIME 3D WEBGL ENGINE',
      fontFamily: 'Orbitron',
      fontSize: 14,
      fontWeight: 800,
      fontStyle: 'normal',
      color: '#00F0FF',
      textAlign: 'center',
      lineHeight: 1.0,
      letterSpacing: 3,
    },
    0.4,
    5.3,
  );
  tagClip.setTransform({
    x: 960,
    y: 110,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  tagClip.addKeyframe('opacity', 0, 0, 'ease-out');
  tagClip.addKeyframe('opacity', 0.3, 1, 'ease-out');

  // 5. Track 3 (Foreground): Main Hero Title
  const titleTrack = scene.addTrack('text', 'Hero Title');
  const titleClip = titleTrack.addClip(
    'text',
    {
      type: 'text',
      text: 'GENERATIVE 3D MOTION',
      fontFamily: 'Montserrat',
      fontSize: 64,
      fontWeight: 900,
      fontStyle: 'normal',
      color: '#FFFFFF',
      textAlign: 'center',
      lineHeight: 1.05,
      letterSpacing: 4,
      textShadow: '0 4px 35px rgba(0, 240, 255, 0.45)',
    },
    0.8,
    4.9,
  );
  titleClip.setTransform({
    x: 960,
    y: 770,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  titleClip.addKeyframe('y', 0, 820, 'ease-out-expo');
  titleClip.addKeyframe('y', 0.7, 770, 'ease-out-expo');
  titleClip.addKeyframe('opacity', 0, 0, 'ease-out');
  titleClip.addKeyframe('opacity', 0.4, 1, 'ease-out');

  // 6. Track 4 (Foreground): Subtitle
  const subTrack = scene.addTrack('text', 'Subtitle');
  const subClip = subTrack.addClip(
    'text',
    {
      type: 'text',
      text: 'Studio 3-Point Lighting • Physically Based Materials • 60 FPS Deterministic',
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 500,
      fontStyle: 'normal',
      color: '#94A3B8',
      textAlign: 'center',
      lineHeight: 1.4,
      letterSpacing: 1,
    },
    1.1,
    4.6,
  );
  subClip.setTransform({
    x: 960,
    y: 855,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  subClip.addKeyframe('y', 0, 880, 'ease-out');
  subClip.addKeyframe('y', 0.5, 855, 'ease-out');
  subClip.addKeyframe('opacity', 0, 0, 'ease-out');
  subClip.addKeyframe('opacity', 0.4, 1, 'ease-out');

  // 7. Track 5 (Foreground): Glowing Accent Line
  const lineTrack = scene.addTrack('shape', 'Accent Line');
  const lineClip = lineTrack.addClip(
    'shape',
    {
      type: 'shape',
      shape: 'rectangle',
      fill: '#00F0FF',
      borderRadius: 2,
    },
    1.4,
    4.3,
  );
  lineClip.setTransform({
    x: 960,
    y: 915,
    width: 140,
    height: 3,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  lineClip.addKeyframe('scaleX', 0, 0, 'ease-out-expo');
  lineClip.addKeyframe('scaleX', 0.6, 1, 'ease-out-expo');

  // 8. Save Project & HTML Preview
  const project = new Project(exampleDir, scene);
  await project.save();

  const html = composeHTML(scene.toJSON());
  const previewPath = join(exampleDir, 'preview.html');
  await writeFile(previewPath, html, 'utf-8');

  console.log(`✅ Generated 3D Cyber Matrix Scene!`);
  console.log(`📁 Project saved: ${project.filePath}`);
  console.log(`🌐 Preview HTML: ${previewPath}`);
}

main().catch(console.error);
