/**
 * CLI Command: 3d
 * Add and configure 3D WebGL scenes, meshes, and particle objects.
 */

import { Command } from 'commander';
import { Project } from '../../core/Project.js';
import { output } from '../output.js';
import { parseTime } from '../helpers.js';

export function register3DCommands(program: Command): void {
  const three = program
    .command('3d')
    .description('Manage 3D WebGL meshes, geometries, and particle scenes');

  three
    .command('add')
    .description('Add a 3D WebGL object to the scene')
    .option('--type <type>', 'Object type: torus-knot, galaxy, particles, device-iphone, device-laptop, icosahedron', 'torus-knot')
    .option('--color <color>', 'Primary emissive/mesh color (hex)', '#00F0FF')
    .option('--wireframe', 'Render as wireframe', false)
    .option('--particles <count>', 'Number of particles (for particle/galaxy types)', parseInt, 1500)
    .option('--track <id>', 'Target track ID')
    .option('--at <time>', 'Start time (e.g., 0, 1.5s)', '0')
    .option('--duration <time>', 'Duration (e.g., 5, 10s)')
    .option('--pos <position>', 'Position (x,y or preset like center)', 'center')
    .action(async (opts: Record<string, any>) => {
      const isJson = program.opts().json;
      try {
        const project = await Project.load(process.cwd());
        const scene = project.scene;

        let track = opts.track ? scene.getTrack(opts.track) : undefined;
        if (!track) {
          track = scene.addTrack('three3d', '3D WebGL Layer');
        }

        const width = scene.config.width;
        const height = scene.config.height;
        const start = parseTime(opts.at);
        const duration = opts.duration ? parseTime(opts.duration) : (scene.config.duration - start);
        const pos = { x: width / 2, y: height / 2 };

        const clip = track.addClip(
          'three3d',
          {
            type: 'three3d',
            objectType: opts.type,
            color: opts.color,
            wireframe: opts.wireframe,
            particleCount: opts.particles,
          },
          start,
          duration,
        );

        clip.setTransform({
          x: pos.x,
          y: pos.y,
          width: width,
          height: height,
          anchorX: 0.5,
          anchorY: 0.5,
        });

        await project.save();

        output(isJson, {
          success: true,
          message: `Added 3D WebGL object (${opts.type}) at ${start}s for ${duration}s`,
          data: { clipId: clip.id, trackId: track.id, type: opts.type },
        });
      } catch (err: any) {
        output(isJson, {
          success: false,
          message: `Failed to add 3D object: ${err.message}`,
          errors: [err.message],
        });
        process.exit(1);
      }
    });
}
