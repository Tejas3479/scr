/**
 * Cyber-Agri Theme Configuration
 * Centralized color and typography settings for the Eco Farm gaming aesthetic
 */

// ===== COLOR PALETTE =====
export const COLORS = {
  // Core Dark Theme
  dark: {
    primary: '#0D1117', // Deep Space Charcoal
    darker: '#050810',
    bg: '#0D1117',
  },

  // Neon Colors - Primary Data
  neon: {
    green: '#00FF41', // Matrix Green (Yield/Health Data)
    cyan: '#00F0FF', // Neon Cyan (Water/Tech Metrics)
    purple: '#FF00FF', // Neon Purple
    orange: '#FF6B00', // Neon Orange
    pink: '#FF006B', // Neon Pink
  },

  // Semi-transparent variants for UI
  gloss: {
    greenGlow: 'rgba(0, 255, 65, 0.1)',
    cyanGlow: 'rgba(0, 240, 255, 0.1)',
    purpleGlow: 'rgba(255, 0, 255, 0.1)',
    orangeGlow: 'rgba(255, 107, 0, 0.1)',
  },

  // Text & UI
  text: {
    primary: '#E0E0E0',
    secondary: '#A0A0A0',
    accent: '#00FF41',
  },
} as const

// ===== TYPOGRAPHY =====
export const TYPOGRAPHY = {
  // Font families
  fonts: {
    mono: "'JetBrains Mono', monospace", // For numerical data & HUD elements
    sans: "'Inter', sans-serif", // For narrative text
  },

  // Font sizes (in rem)
  sizes: {
    xs: '0.75rem', // 12px - Labels
    sm: '0.875rem', // 14px - Small text
    base: '1rem', // 16px - Body
    lg: '1.125rem', // 18px - Headings
    xl: '1.5rem', // 24px - Large headings
    '2xl': '2rem', // 32px - Hero text
  },

  // Font weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em',
    widest: '0.1em',
  },
} as const

// ===== GLASSMORPHISM EFFECTS =====
export const GLASSMORPHISM = {
  // Backdrop blur values
  blur: {
    light: 'blur(5px)',
    default: 'blur(10px)',
    heavy: 'blur(20px)',
    thick: 'blur(30px)',
  },

  // Common glass configurations
  configs: {
    card: {
      background: 'rgba(13, 17, 23, 0.5)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(0, 240, 255, 0.15)',
    },
    panel: {
      background: 'rgba(13, 17, 23, 0.6)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(0, 255, 65, 0.2)',
    },
    hud: {
      background: 'rgba(13, 17, 23, 0.7)',
      backdropFilter: 'blur(30px) saturate(200%)',
      border: '2px solid rgba(0, 255, 65, 0.3)',
    },
  },
} as const

// ===== SHADOW & GLOW EFFECTS =====
export const EFFECTS = {
  shadows: {
    glowGreen: '0 0 20px rgba(0, 255, 65, 0.5)',
    glowCyan: '0 0 20px rgba(0, 240, 255, 0.5)',
    glowPurple: '0 0 30px rgba(255, 0, 255, 0.4)',
    hudGlow: 'inset 0 0 20px rgba(0, 255, 65, 0.1), 0 0 30px rgba(0, 240, 255, 0.2)',
  },

  textShadows: {
    glowGreen: '0 0 10px rgba(0, 255, 65, 0.6), 0 0 20px rgba(0, 255, 65, 0.3)',
    glowCyan: '0 0 10px rgba(0, 240, 255, 0.6), 0 0 20px rgba(0, 240, 255, 0.3)',
    glowPurple: '0 0 10px rgba(255, 0, 255, 0.6), 0 0 20px rgba(255, 0, 255, 0.3)',
  },
} as const

// ===== ANIMATION TIMING =====
export const ANIMATIONS = {
  duration: {
    fast: '200ms',
    base: '300ms',
    slow: '500ms',
    verySlow: '1000ms',
  },

  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    cubic: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

// ===== UTILITY FUNCTIONS =====

/**
 * Generate a rgba color from hex with opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Get glow color configuration based on type
 */
export function getGlowColor(type: 'green' | 'cyan' | 'purple' | 'orange' | 'pink' = 'cyan') {
  const colorMap = {
    green: {
      color: COLORS.neon.green,
      shadow: EFFECTS.shadows.glowGreen,
      textShadow: EFFECTS.textShadows.glowGreen,
      glowBg: COLORS.gloss.greenGlow,
    },
    cyan: {
      color: COLORS.neon.cyan,
      shadow: EFFECTS.shadows.glowCyan,
      textShadow: EFFECTS.textShadows.glowCyan,
      glowBg: COLORS.gloss.cyanGlow,
    },
    purple: {
      color: COLORS.neon.purple,
      shadow: EFFECTS.shadows.glowPurple,
      textShadow: EFFECTS.textShadows.glowPurple,
      glowBg: COLORS.gloss.purpleGlow,
    },
    orange: {
      color: COLORS.neon.orange,
      shadow: '0 0 20px rgba(255, 107, 0, 0.5)',
      textShadow: '0 0 10px rgba(255, 107, 0, 0.6), 0 0 20px rgba(255, 107, 0, 0.3)',
      glowBg: COLORS.gloss.orangeGlow,
    },
    pink: {
      color: COLORS.neon.pink,
      shadow: '0 0 20px rgba(255, 0, 107, 0.5)',
      textShadow: '0 0 10px rgba(255, 0, 107, 0.6), 0 0 20px rgba(255, 0, 107, 0.3)',
      glowBg: COLORS.gloss.purpleGlow,
    },
  }

  return colorMap[type]
}

/**
 * Get glass effect configuration based on variant
 */
export function getGlassEffect(variant: 'card' | 'panel' | 'hud' = 'card') {
  return GLASSMORPHISM.configs[variant]
}

/**
 * Generate Tailwind class for glow effect
 */
export function getGlowClasses(color: 'green' | 'cyan' = 'cyan'): string {
  const colorClasses = {
    green: 'border-neon-green/30 hover:border-neon-green/60 hover:shadow-neon-green',
    cyan: 'border-neon-cyan/30 hover:border-neon-cyan/60 hover:shadow-neon-cyan',
  }
  return colorClasses[color]
}
