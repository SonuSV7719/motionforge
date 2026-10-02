import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  TRANSITIONS,
  ANIMATIONS,
  FILTERS,
  COLOR_GRADES,
  TEXT_EFFECTS,
  getTransition,
  getAnimation,
  getFilter,
  getColorGrade,
  getTextEffect,
} from '../effects/index.js';

describe('MotionForge Effects & Animations Tests', () => {
  describe('Transitions', () => {
    test('provides transition definitions and lookup', () => {
      assert.ok(TRANSITIONS.length >= 10, 'Should have rich transitions library');
      const fade = getTransition('fade');
      assert.ok(fade);
      assert.equal(fade.category, 'basic');
      assert.equal(fade.defaultDuration, 0.5);

      const wipeLeft = getTransition('wipe-left');
      assert.ok(wipeLeft);
      assert.equal(wipeLeft.category, 'directional');
    });
  });

  describe('Animations', () => {
    test('provides animation definitions and lookup', () => {
      assert.ok(ANIMATIONS.length >= 20, 'Should have rich animations library');
      const fadeIn = getAnimation('fade-in');
      assert.ok(fadeIn);
      assert.equal(fadeIn.category, 'fade');

      const pop = getAnimation('pop');
      assert.ok(pop);
      assert.equal(pop.category, 'special');
    });
  });

  describe('Filters & Color Grades', () => {
    test('provides filters with default intensities', () => {
      assert.ok(FILTERS.length >= 8);
      const blur = getFilter('blur');
      assert.ok(blur);
      assert.equal(blur.cssProperty, 'blur');
    });

    test('provides cinematic color grades', () => {
      assert.ok(COLOR_GRADES.length >= 8);
      const cinematic = getColorGrade('cinematic');
      assert.ok(cinematic);
      assert.ok(cinematic.css.filter);

      const cyberpunk = getColorGrade('cyberpunk');
      assert.ok(cyberpunk);
      assert.ok(cyberpunk.css.filter.includes('saturate'));
    });
  });

  describe('Text Effects', () => {
    test('provides kinetic typography effect presets', () => {
      assert.ok(TEXT_EFFECTS.length >= 8);
      const typewriter = getTextEffect('typewriter');
      assert.ok(typewriter);
      assert.equal(typewriter.defaultDuration, 2.0);

      const neon = getTextEffect('neon-flicker');
      assert.ok(neon);
    });
  });
});
