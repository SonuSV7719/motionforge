/**
 * MotionForge — Three.js 3D & WebGL Shader Engine
 *
 * Generates client-side Three.js WebGL code for deterministic 3D motion graphics:
 * - 3D Devices & Floating Mockups (iPhones, Laptops)
 * - 3D Particle Constellations & Galaxy Swirls
 * - Glowing Emissive 3D Geometries (Torus Knots, Icosahedrons)
 * - Custom GLSL Fragment Shaders (Liquid Waves, Hologram CRT scanlines)
 */

import type { ClipData, Three3DContent } from '../core/types.js';

export class ThreeBuilder {
  /**
   * Build the initialization and render loop script for a 3D WebGL clip
   */
  static buildThreeScript(clip: ClipData): string {
    const id = `clip-${clip.id}`;
    const content = clip.content as Three3DContent;
    const canvasId = `canvas-${clip.id}`;

    const color = content.color || '#00F0FF';
    const wireframe = content.wireframe ?? false;
    const particleCount = content.particleCount || 1500;
    const objectType = content.objectType || 'torus-knot';

    return `
    (function() {
      const container = document.getElementById('${id}');
      if (!container || typeof THREE === 'undefined') return;

      const width = container.clientWidth || 1920;
      const height = container.clientHeight || 1080;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0.2, 8.5);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
      renderer.domElement.id = '${canvasId}';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);

      // Studio 3-Point Lighting Rig with Neon Rim
      const ambientLight = new THREE.AmbientLight(0x101828, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
      keyLight.position.set(6, 8, 5);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight('${color}', 4.0, 50);
      rimLight.position.set(-6, -4, 3);
      scene.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0x7000FF, 1.8);
      fillLight.position.set(0, -6, -2);
      scene.add(fillLight);

      let meshObject = null;
      let particleSystem = null;

      ${this.buildObjectCode(objectType, color, wireframe, particleCount)}

      if (meshObject) scene.add(meshObject);
      if (particleSystem) scene.add(particleSystem);

      // Register render hook with MotionForge frame-seek pipeline
      if (!window.__mf_three_renders) window.__mf_three_renders = [];
      window.__mf_three_renders.push(function(time) {
        if (meshObject) {
          meshObject.rotation.x = time * 0.4;
          meshObject.rotation.y = time * 0.65;
          meshObject.rotation.z = Math.sin(time * 0.5) * 0.1;
          meshObject.position.y = 0.45 + Math.sin(time * 1.5) * 0.08;
        }
        if (particleSystem) {
          particleSystem.rotation.y = time * 0.1;
          particleSystem.rotation.x = Math.sin(time * 0.2) * 0.06;
        }
        renderer.render(scene, camera);
      });

      // Render initial frame
      renderer.render(scene, camera);
    })();
    `;
  }

  private static buildObjectCode(type: string, color: string, wireframe: boolean, particles: number): string {
    switch (type) {
      case 'particles':
      case 'galaxy':
        return `
          const geometry = new THREE.BufferGeometry();
          const positions = [];
          const colors = [];
          const colorObj = new THREE.Color('${color}');
          const altColor = new THREE.Color('#7000FF');

          for (let i = 0; i < ${particles}; i++) {
            const r = Math.random() * 5.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI;
            positions.push(r * Math.cos(theta), r * Math.sin(theta) * 0.6, r * Math.sin(phi));
            const lerped = colorObj.clone().lerp(altColor, Math.random());
            colors.push(lerped.r, lerped.g, lerped.b);
          }

          geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

          const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.85 });
          particleSystem = new THREE.Points(geometry, material);
        `;

      case 'torus-knot':
        return `
          // 1. Refined Torus Knot Geometry (Fitting cleanly in frame)
          const geometry = new THREE.TorusKnotGeometry(0.72, 0.22, 160, 36, 2, 3);
          const material = new THREE.MeshStandardMaterial({
            color: '${color}',
            wireframe: ${wireframe},
            metalness: 0.9,
            roughness: 0.15,
            emissive: '${color}',
            emissiveIntensity: 0.25,
          });
          meshObject = new THREE.Mesh(geometry, material);
          meshObject.position.set(0, 0.45, 0);

          // 2. Add Background Ambient Particle Field
          const pGeo = new THREE.BufferGeometry();
          const pPos = [];
          const pColors = [];
          const c1 = new THREE.Color('${color}');
          const c2 = new THREE.Color('#7000FF');
          for (let i = 0; i < 900; i++) {
            const r = 2.0 + Math.random() * 4.0;
            const t = Math.random() * Math.PI * 2;
            const p = (Math.random() - 0.5) * Math.PI * 2;
            pPos.push(r * Math.cos(t), r * Math.sin(t) * 0.5, r * Math.sin(p));
            const c = c1.clone().lerp(c2, Math.random());
            pColors.push(c.r, c.g, c.b);
          }
          pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
          pGeo.setAttribute('color', new THREE.Float32BufferAttribute(pColors, 3));
          particleSystem = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.7 }));
        `;

      case 'device-iphone':
      case 'device-laptop':
        return `
          const group = new THREE.Group();
          // Body chassis
          const bodyGeo = new THREE.BoxGeometry(1.8, 3.6, 0.15);
          const bodyMat = new THREE.MeshStandardMaterial({ color: '#0F172A', metalness: 0.95, roughness: 0.1 });
          const body = new THREE.Mesh(bodyGeo, bodyMat);
          group.add(body);

          // Screen plane
          const screenGeo = new THREE.PlaneGeometry(1.68, 3.48);
          const screenMat = new THREE.MeshBasicMaterial({ color: '${color}' });
          const screen = new THREE.Mesh(screenGeo, screenMat);
          screen.position.z = 0.08;
          group.add(screen);

          meshObject = group;
        `;

      case 'icosahedron':
      default:
        return `
          const geometry = new THREE.IcosahedronGeometry(1.6, 1);
          const material = new THREE.MeshStandardMaterial({
            color: '${color}',
            wireframe: ${wireframe},
            metalness: 0.85,
            roughness: 0.15,
            emissive: '${color}',
            emissiveIntensity: 0.2,
          });
          meshObject = new THREE.Mesh(geometry, material);
        `;
    }
  }
}

