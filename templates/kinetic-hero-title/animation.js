/**
 * GSAP Animation for Kinetic Hero Title
 */
gsap.from('.kht-badge', {
  opacity: 0,
  scale: 0.7,
  y: -20,
  duration: 0.6,
  ease: 'back.out(2)',
});

gsap.from('.kht-title', {
  opacity: 0,
  y: 40,
  scale: 0.92,
  duration: 0.8,
  delay: 0.2,
  ease: 'power3.out',
});

gsap.from('.kht-line', {
  scaleX: 0,
  duration: 0.7,
  delay: 0.5,
  ease: 'expo.out',
});
