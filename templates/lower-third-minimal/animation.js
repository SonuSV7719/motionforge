// Lower Third Minimal — GSAP Animation Timeline
// Seekable timeline for deterministic frame capture

(function() {
  const tl = gsap.timeline({ paused: true });
  const lt = document.querySelector('.mf-lower-third');
  const bar = document.querySelector('.lt-accent-bar');
  const name = document.querySelector('.lt-name');
  const title = document.querySelector('.lt-title');

  // Entrance (0s - 0.6s)
  tl.to(lt, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0);
  tl.to(bar, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, 0.1);
  tl.from(name, { x: -20, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.2);
  tl.from(title, { x: -15, opacity: 0, duration: 0.3, ease: 'power2.out' }, 0.35);

  // Hold (0.6s - 4.2s) — content visible

  // Exit (4.2s - 5.0s)
  tl.to(title, { opacity: 0, x: -10, duration: 0.2, ease: 'power2.in' }, 4.2);
  tl.to(name, { opacity: 0, x: -15, duration: 0.25, ease: 'power2.in' }, 4.3);
  tl.to(bar, { scaleY: 0, duration: 0.3, ease: 'power2.in' }, 4.4);
  tl.to(lt, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.in' }, 4.5);

  // Register with MotionForge renderer
  if (window.__mf_timeline) {
    window.__mf_timeline.add(tl, 0);
  }
})();
