/**
 * MotionForge — Smart Font Matcher
 *
 * Provides style-aware font pairings and automatic Google Fonts CDN loading
 * based on visual aesthetics (cyberpunk, luxury, saas, viral, editorial, etc.).
 */

export type FontMood =
  | 'cyberpunk'
  | 'saas'
  | 'viral-bold'
  | 'luxury'
  | 'editorial'
  | 'retro-80s'
  | 'futuristic'
  | 'minimal'
  | 'documentary'
  | 'playful';

export interface FontPairing {
  mood: FontMood;
  headingFont: string;
  bodyFont: string;
  weights: number[];
  suggestedLetterSpacing: number;
  description: string;
}

export const FONT_PAIRINGS: Record<FontMood, FontPairing> = {
  cyberpunk: {
    mood: 'cyberpunk',
    headingFont: 'Orbitron',
    bodyFont: 'Rajdhani',
    weights: [600, 700, 900],
    suggestedLetterSpacing: 6,
    description: 'High-tech, neon, dystopian futuristic display',
  },
  saas: {
    mood: 'saas',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    weights: [500, 600, 700, 800],
    suggestedLetterSpacing: -0.5,
    description: 'Modern, high-converting product and UI presentation',
  },
  'viral-bold': {
    mood: 'viral-bold',
    headingFont: 'Montserrat',
    bodyFont: 'Inter',
    weights: [700, 800, 900],
    suggestedLetterSpacing: 1.5,
    description: 'Ultra-bold high-retention text for TikTok, Reels, Shorts',
  },
  luxury: {
    mood: 'luxury',
    headingFont: 'Playfair Display',
    bodyFont: 'Cormorant Garamond',
    weights: [400, 600, 700],
    suggestedLetterSpacing: 3,
    description: 'Sophisticated, elegant, high-end editorial look',
  },
  editorial: {
    mood: 'editorial',
    headingFont: 'Cinzel',
    bodyFont: 'Lora',
    weights: [500, 700],
    suggestedLetterSpacing: 4,
    description: 'Cinematic title cards, historical, premium documentary',
  },
  'retro-80s': {
    mood: 'retro-80s',
    headingFont: 'Righteous',
    bodyFont: 'Space Grotesk',
    weights: [400, 700],
    suggestedLetterSpacing: 2,
    description: 'Synthwave, outrun, vibrant vintage 80s aesthetic',
  },
  futuristic: {
    mood: 'futuristic',
    headingFont: 'Syne',
    bodyFont: 'Outfit',
    weights: [600, 700, 800],
    suggestedLetterSpacing: 2,
    description: 'Experimental, avant-garde, bleeding-edge design',
  },
  minimal: {
    mood: 'minimal',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    weights: [400, 500, 600],
    suggestedLetterSpacing: 0,
    description: 'Clean, Swiss-style typography with zero distraction',
  },
  documentary: {
    mood: 'documentary',
    headingFont: 'Merriweather',
    bodyFont: 'Open Sans',
    weights: [400, 700, 900],
    suggestedLetterSpacing: 1,
    description: 'Authoritative, readable, journalistic storytelling',
  },
  playful: {
    mood: 'playful',
    headingFont: 'Fredoka',
    bodyFont: 'Nunito',
    weights: [600, 700, 900],
    suggestedLetterSpacing: 0.5,
    description: 'Friendly, rounded, educational and cartoon animations',
  },
};

/**
 * Get recommended font pairing by mood
 */
export function getFontPairing(mood: FontMood): FontPairing {
  return FONT_PAIRINGS[mood] || FONT_PAIRINGS.saas;
}

/**
 * Automatically infer the ideal Google Font pairing from text content, tags, or topic keywords
 */
export function detectFontPairing(text?: string, tags?: string[], mood?: string): FontPairing {
  if (mood && mood in FONT_PAIRINGS) {
    return FONT_PAIRINGS[mood as FontMood];
  }

  const combined = `${text || ''} ${(tags || []).join(' ')}`.toLowerCase();

  if (/cyber|neon|matrix|crypto|hologram|hud|future|game|esport|robot/i.test(combined)) {
    return FONT_PAIRINGS.cyberpunk;
  }
  if (/ai|neural|agent|quantum|next-gen|generative|deep|model/i.test(combined)) {
    return FONT_PAIRINGS.futuristic;
  }
  if (/luxury|perfume|elegance|gold|estate|fashion|watch|jewelry|couture/i.test(combined)) {
    return FONT_PAIRINGS.luxury;
  }
  if (/viral|tiktok|reels|shorts|hook|secret|stop scrolling|hack|craziest/i.test(combined)) {
    return FONT_PAIRINGS['viral-bold'];
  }
  if (/saas|fintech|revenue|metric|arr|mrr|dashboard|b2b|analytics|product/i.test(combined)) {
    return FONT_PAIRINGS.saas;
  }
  if (/retro|80s|synth|wave|vintage|arcade|pixel|nostalgia/i.test(combined)) {
    return FONT_PAIRINGS['retro-80s'];
  }
  if (/code|developer|terminal|cli|git|python|api|typescript|sql/i.test(combined)) {
    return {
      mood: 'minimal',
      headingFont: 'JetBrains Mono',
      bodyFont: 'Fira Code',
      weights: [500, 700, 800],
      suggestedLetterSpacing: -1,
      description: 'Developer / terminal monospace kinetic typography',
    };
  }

  // Default to clean, universally aesthetic tech pairing
  return FONT_PAIRINGS.futuristic;
}

/**
 * Build Google Fonts CSS import for one or more fonts
 */
export function buildGoogleFontsImport(fonts: { family: string; weights?: number[] }[]): string {
  if (fonts.length === 0) return '';
  const params = fonts
    .map((f) => {
      const family = encodeURIComponent(f.family);
      const weights = (f.weights || [400, 700]).join(';');
      return `family=${family}:wght@${weights}`;
    })
    .join('&');

  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

