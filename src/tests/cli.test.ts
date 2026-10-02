import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

describe('MotionForge CLI Integration Tests', () => {
  const cliEntry = join(process.cwd(), 'dist', 'cli', 'index.js');

  test('CLI responds to --help', () => {
    const output = execSync(`node "${cliEntry}" --help`, { encoding: 'utf-8' });
    assert.ok(output.includes('MotionForge'));
    assert.ok(output.includes('Usage: mf'));
  });

  test('CLI responds to effect list', () => {
    const output = execSync(`node "${cliEntry}" effect list`, { encoding: 'utf-8' });
    assert.ok(output.includes('fade'));
    assert.ok(output.includes('cinematic'));
  });

  test('CLI responds to template list', () => {
    const output = execSync(`node "${cliEntry}" template list`, { encoding: 'utf-8' });
    assert.ok(output.includes('lower-third-minimal'));
  });
});
