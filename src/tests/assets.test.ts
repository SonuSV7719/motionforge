import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { AssetManager, FontManager } from '../assets/index.js';

describe('MotionForge Assets & Font Manager Tests', () => {
  describe('AssetManager', () => {
    test('initializes and manages asset references', () => {
      const manager = new AssetManager('temp/project');
      assert.equal(manager.list().length, 0);

      // Probe media fallback test
      const probe = manager.probeMedia('non-existent-file.mp4');
      assert.deepEqual(probe, {});
    });
  });

  describe('FontManager', () => {
    test('generates Google Fonts embed URLs and CSS import rules', () => {
      const fontManager = new FontManager('temp/project');
      const url = fontManager.getGoogleFontURL('Inter', [400, 600, 700]);
      assert.ok(url.includes('family=Inter:wght@400;600;700'));

      const importCss = fontManager.getFontImportCSS('Outfit', [500, 800]);
      assert.ok(importCss.includes('@import url('));
      assert.ok(importCss.includes('family=Outfit:wght@500;800'));

      assert.equal(fontManager.isLoaded('Inter'), false);
      fontManager.markLoaded('Inter');
      assert.equal(fontManager.isLoaded('Inter'), true);
    });
  });
});
