/**
 * CLI Command: preview
 * Launch a live preview in the browser.
 */

import { Command } from 'commander';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Project } from '../../core/Project.js';
import { composeHTML } from '../../compositor/Compositor.js';
import { output } from '../output.js';

export function registerPreviewCommand(program: Command): void {
  program
    .command('preview')
    .description('Open live preview in browser')
    .option('--port <n>', 'Preview server port', parseInt, 3456)
    .action(async (opts: Record<string, any>) => {
      const project = await Project.load(process.cwd());
      const scene = project.scene.toJSON();
      const html = composeHTML(scene);

      // Write preview HTML
      const previewDir = join(process.cwd(), '.mf-cache');
      if (!existsSync(previewDir)) {
        await mkdir(previewDir, { recursive: true });
      }
      const previewPath = join(previewDir, 'preview.html');
      await writeFile(previewPath, html, 'utf-8');

      const isJson = program.opts().json;
      output(isJson, {
        success: true,
        message: `Preview saved to ${previewPath}\nOpen in browser to preview your composition.`,
        data: { previewPath, html: previewPath },
      });
    });
}
