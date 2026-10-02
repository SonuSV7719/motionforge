/**
 * MotionForge — Lottie & Vector Animation Engine
 *
 * Integrates Bodymovin / Lottie JSON vector animations with deterministic frame seeking.
 */

import type { ClipData, LottieContent } from '../core/types.js';

export class LottieBuilder {
  /**
   * Build the Lottie player script for a clip
   */
  static buildLottieScript(clip: ClipData): string {
    const id = `clip-${clip.id}`;
    const content = clip.content as LottieContent;
    const speed = content.speed || 1;

    return `
    (function() {
      const container = document.getElementById('${id}');
      if (!container || typeof lottie === 'undefined') return;

      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '${content.src}',
      });

      if (!window.__mf_lottie_anims) window.__mf_lottie_anims = [];
      window.__mf_lottie_anims.push({
        anim,
        start: ${clip.start},
        duration: ${clip.duration},
        speed: ${speed},
      });
    })();
    `;
  }
}
