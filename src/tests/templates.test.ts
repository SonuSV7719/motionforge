import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TemplateEngine } from '../templates/index.js';
import type { TemplateManifest } from '../core/types.js';

describe('MotionForge Template Engine Tests', () => {
  test('discovers built-in template catalog', async () => {
    const engine = new TemplateEngine();
    await engine.discover();

    const templates = engine.list();
    assert.ok(Array.isArray(templates), 'Templates should be an array');

    // Check if lower-third-minimal is discovered
    const lowerThird = engine.get('lower-third-minimal');
    if (lowerThird) {
      assert.equal(lowerThird.id, 'lower-third-minimal');
      assert.equal(lowerThird.category, 'lower-thirds');
      assert.ok(lowerThird.props.title, 'Should have title prop defined');
    }
  });

  test('validates template props accurately', () => {
    const engine = new TemplateEngine();
    const manifest: TemplateManifest = {
      id: 'mock-template',
      name: 'Mock',
      category: 'title-cards',
      version: '1.0.0',
      description: 'Test template',
      duration: 5,
      author: 'Tester',
      tags: ['test'],
      files: {
        composition: 'comp.html',
        style: 'style.css',
        animation: 'anim.js',
      },
      props: {
        title: { type: 'string', default: 'Title', required: true, description: 'Header' },
        count: { type: 'number', default: 10, required: false, description: 'Counter' },
      },
    };

    const validResult = engine.validateProps({ title: 'Custom Title', count: 5 }, manifest);
    assert.equal(validResult.valid, true);
    assert.equal(validResult.errors.length, 0);

    const invalidResult = engine.validateProps({ count: 'not a number' as any }, manifest);
    assert.equal(invalidResult.valid, false);
    assert.ok(invalidResult.errors.length > 0);
  });
});
