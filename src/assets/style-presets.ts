/**
 * MotionForge — Master Style & Aesthetic Intelligence
 *
 * Professional typography pairings, 60-30-10 color palettes,
 * broadcast spacing grids, and motion easing standards.
 */

export interface ColorPalette {
  id: string;
  name: string;
  genre: string;
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textMuted: string;
  glow: string;
}

export interface FontPairing {
  id: string;
  name: string;
  vibe: string;
  headlineFont: string;
  bodyFont: string;
  headlineTracking: number; // px
  headlineLineHeight: number;
  bodyTracking: number;
  bodyLineHeight: number;
  googleFontsEmbed: string;
}

export interface SpacingGrid {
  titleSafeMarginX: number;
  titleSafeMarginY: number;
  badgePadding: string;
  cardPadding: string;
  gapSm: number;
  gapMd: number;
  gapLg: number;
  gapXl: number;
}

/**
 * 10 Curated Broadcast-Grade Color Palettes
 */
export const COLOR_PALETTES: Record<string, ColorPalette> = {
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyberpunk Neon Matrix',
    genre: 'Tech / AI / Gaming / Web3',
    background: '#04060E',
    surface: 'rgba(6, 12, 28, 0.75)',
    primary: '#00F0FF',
    secondary: '#7000FF',
    accent: '#FF0055',
    textPrimary: '#FFFFFF',
    textMuted: '#94A3B8',
    glow: '0 0 35px rgba(0, 240, 255, 0.45)',
  },
  'saas-indigo': {
    id: 'saas-indigo',
    name: 'Modern SaaS & Fintech',
    genre: 'B2B SaaS / Product Launch / Metrics',
    background: '#0B0F19',
    surface: 'rgba(17, 24, 39, 0.8)',
    primary: '#6366F1',
    secondary: '#3B82F6',
    accent: '#10B981',
    textPrimary: '#F8FAFC',
    textMuted: '#64748B',
    glow: '0 0 30px rgba(99, 102, 241, 0.35)',
  },
  'viral-hook': {
    id: 'viral-hook',
    name: 'High-Retention Viral Reel',
    genre: 'TikTok / Shorts / Reels / Retention Ads',
    background: '#08080C',
    surface: 'rgba(20, 20, 28, 0.9)',
    primary: '#FFE600',
    secondary: '#FF3366',
    accent: '#00FF9D',
    textPrimary: '#FFFFFF',
    textMuted: '#A1A1AA',
    glow: '0 0 40px rgba(255, 230, 0, 0.5)',
  },
  'minimal-titanium': {
    id: 'minimal-titanium',
    name: 'Apple Titanium Minimalist',
    genre: 'Hardware / Premium Brand / Keynote',
    background: '#000000',
    surface: 'rgba(29, 29, 31, 0.8)',
    primary: '#F5F5F7',
    secondary: '#86868B',
    accent: '#2997FF',
    textPrimary: '#F5F5F7',
    textMuted: '#6E6E73',
    glow: '0 0 25px rgba(255, 255, 255, 0.2)',
  },
  'luxury-bronze': {
    id: 'luxury-bronze',
    name: 'Luxury Bronze & Gold',
    genre: 'High Fashion / Real Estate / Editorial',
    background: '#0C0A09',
    surface: 'rgba(28, 25, 23, 0.85)',
    primary: '#D4AF37',
    secondary: '#E7C875',
    accent: '#C59B27',
    textPrimary: '#FAF7F2',
    textMuted: '#A8A29E',
    glow: '0 0 35px rgba(212, 175, 55, 0.35)',
  },
  'neo-brutalist': {
    id: 'neo-brutalist',
    name: 'Neo-Brutalist Electric',
    genre: 'Gen-Z / Indie Brand / Creative Festival',
    background: '#FFDE59',
    surface: '#FFFFFF',
    primary: '#000000',
    secondary: '#FF1493',
    accent: '#00E5FF',
    textPrimary: '#000000',
    textMuted: '#333333',
    glow: '6px 6px 0px #000000',
  },
  'deep-nebula': {
    id: 'deep-nebula',
    name: 'Deep Nebula Cosmic',
    genre: 'Space / Science / 3D Showreel',
    background: '#030014',
    surface: 'rgba(15, 5, 36, 0.8)',
    primary: '#9D4EDD',
    secondary: '#C77DFF',
    accent: '#E0AAFF',
    textPrimary: '#FFFFFF',
    textMuted: '#7B68EE',
    glow: '0 0 45px rgba(157, 78, 221, 0.5)',
  },
};

/**
 * 8 Professional Font Pairings for Video & Motion Graphics
 */
export const FONT_PAIRINGS: Record<string, FontPairing> = {
  'tech-syne': {
    id: 'tech-syne',
    name: 'Syne & Inter',
    vibe: 'Futuristic, High-tech, Kinetic',
    headlineFont: 'Syne',
    bodyFont: 'Inter',
    headlineTracking: -1.5,
    headlineLineHeight: 1.05,
    bodyTracking: 0.2,
    bodyLineHeight: 1.45,
    googleFontsEmbed: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Syne:wght@700;800;900&display=swap',
  },
  'cyber-orbitron': {
    id: 'cyber-orbitron',
    name: 'Orbitron & Rajdhani',
    vibe: 'Sci-Fi HUD, Gaming, Cyberpunk',
    headlineFont: 'Orbitron',
    bodyFont: 'Rajdhani',
    headlineTracking: 2.0,
    headlineLineHeight: 1.1,
    bodyTracking: 1.0,
    bodyLineHeight: 1.4,
    googleFontsEmbed: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Rajdhani:wght@500;600;700&display=swap',
  },
  'saas-jakarta': {
    id: 'saas-jakarta',
    name: 'Plus Jakarta Sans & Inter',
    vibe: 'Clean, Modern Tech, B2B SaaS',
    headlineFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    headlineTracking: -1.0,
    headlineLineHeight: 1.1,
    bodyTracking: 0,
    bodyLineHeight: 1.5,
    googleFontsEmbed: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap',
  },
  'bold-montserrat': {
    id: 'bold-montserrat',
    name: 'Montserrat Ultra & Roboto',
    vibe: 'Impactful, Punchy, YouTube/Reels Hook',
    headlineFont: 'Montserrat',
    bodyFont: 'Roboto',
    headlineTracking: -2.0,
    headlineLineHeight: 0.98,
    bodyTracking: 0.5,
    bodyLineHeight: 1.4,
    googleFontsEmbed: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Roboto:wght@400;500;700&display=swap',
  },
  'editorial-playfair': {
    id: 'editorial-playfair',
    name: 'Playfair Display & Plus Jakarta Sans',
    vibe: 'Luxury, Editorial, Storytelling',
    headlineFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    headlineTracking: -0.5,
    headlineLineHeight: 1.15,
    bodyTracking: 0.5,
    bodyLineHeight: 1.5,
    googleFontsEmbed: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap',
  },
  'code-fira': {
    id: 'code-fira',
    name: 'JetBrains Mono & Fira Code',
    vibe: 'Developer Tool, Terminal, CLI showreel',
    headlineFont: 'JetBrains Mono',
    bodyFont: 'Fira Code',
    headlineTracking: -1.0,
    headlineLineHeight: 1.2,
    bodyTracking: 0,
    bodyLineHeight: 1.6,
    googleFontsEmbed: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=JetBrains+Mono:wght@700;800&display=swap',
  },
};

/**
 * Standard Spacing Grid for Broadcast (1920x1080) and Vertical (1080x1920)
 */
export const SPACING_SYSTEM = {
  // 16:9 Standard
  landscape: {
    safeMarginX: 120,
    safeMarginY: 80,
    gapSm: 16,
    gapMd: 32,
    gapLg: 64,
    gapXl: 120,
    titleSize: 76,
    subtitleSize: 28,
    badgeSize: 15,
  },
  // 9:16 Vertical Reel Safe Zones (protecting top header and bottom UI overlays)
  vertical: {
    safeMarginX: 72,
    safeMarginTop: 180, // Safe from profile/status bar
    safeMarginBottom: 280, // Safe from captions/like button/UI
    gapSm: 12,
    gapMd: 24,
    gapLg: 48,
    gapXl: 80,
    titleSize: 64,
    subtitleSize: 24,
    badgeSize: 14,
  },
};
