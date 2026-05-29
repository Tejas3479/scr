/**
 * Cyber-Agri Mobile Theme Configuration
 * React Native styling for Eco Farm gaming aesthetic
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native'

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

  // Text & UI
  text: {
    primary: '#E0E0E0',
    secondary: '#A0A0A0',
    accent: '#00FF41',
    dark: '#1A1A1A',
  },

  // Transparent variants
  transparent: {
    greenGlow: 'rgba(0, 255, 65, 0.1)',
    cyanGlow: 'rgba(0, 240, 255, 0.1)',
    purpleGlow: 'rgba(255, 0, 255, 0.1)',
    orangeGlow: 'rgba(255, 107, 0, 0.1)',
    darkGlass: 'rgba(13, 17, 23, 0.7)',
  },

  // Status colors
  status: {
    success: '#00FF41',
    warning: '#FF6B00',
    error: '#FF006B',
    info: '#00F0FF',
  },
} as const

// ===== TYPOGRAPHY =====
export const FONTS = {
  // Font families
  family: {
    mono: 'JetBrains Mono',
    sans: 'Inter',
  },

  // Font sizes
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
  },

  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing (in percentage of font size)
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 2,
    widest: 4,
  },
} as const

// ===== SPACING & DIMENSIONS =====
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const

// ===== GLASSMORPHISM EFFECTS =====
export const GLASS = {
  card: {
    backgroundColor: COLORS.transparent.darkGlass,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.15)', // Neon Cyan with 15% opacity
    borderRadius: BORDER_RADIUS.md,
  },
  panel: {
    backgroundColor: 'rgba(13, 17, 23, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.2)', // Neon Green with 20% opacity
    borderRadius: BORDER_RADIUS.sm,
  },
  hud: {
    backgroundColor: 'rgba(13, 17, 23, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 65, 0.3)', // Neon Green with 30% opacity
    borderRadius: BORDER_RADIUS.sm,
  },
} as const

// ===== SHADOW EFFECTS =====
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.neon.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: COLORS.neon.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: COLORS.neon.cyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
} as const

// ===== REUSABLE STYLES =====

/**
 * Glass Card Base Style
 */
export const glassCardStyle: ViewStyle = {
  ...GLASS.card,
  padding: SPACING.lg,
  marginBottom: SPACING.md,
}

/**
 * HUD Panel Base Style
 */
export const hudPanelStyle: ViewStyle = {
  ...GLASS.hud,
  padding: SPACING.md,
  marginBottom: SPACING.md,
}

/**
 * Data Display Typography
 * Used for numerical data and HUD elements
 */
export const dataDisplayStyle: TextStyle = {
  fontFamily: FONTS.family.mono,
  fontSize: FONTS.size.base,
  fontWeight: FONTS.weight.bold,
  color: COLORS.neon.green,
  letterSpacing: FONTS.letterSpacing.widest,
}

/**
 * Narrative Text Typography
 * Used for descriptions and body text
 */
export const narrativeTextStyle: TextStyle = {
  fontFamily: FONTS.family.sans,
  fontSize: FONTS.size.base,
  fontWeight: FONTS.weight.regular,
  color: COLORS.text.primary,
  lineHeight: FONTS.size.base * FONTS.lineHeight.normal,
}

/**
 * Heading Typography
 */
export const headingStyle: TextStyle = {
  fontFamily: FONTS.family.sans,
  fontSize: FONTS.size.xl,
  fontWeight: FONTS.weight.bold,
  color: COLORS.neon.cyan,
  marginBottom: SPACING.md,
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get glow color based on type
 */
export function getGlowColor(
  type: 'green' | 'cyan' | 'purple' | 'orange' | 'pink' = 'cyan'
): string {
  return COLORS.neon[type]
}

/**
 * Get glass effect style based on variant
 */
export function getGlassStyle(
  variant: 'card' | 'panel' | 'hud' = 'card'
): ViewStyle {
  return GLASS[variant] as ViewStyle
}

/**
 * Get shadow style based on intensity
 */
export function getShadowStyle(
  intensity: 'sm' | 'md' | 'lg' = 'md'
): ViewStyle {
  return SHADOWS[intensity] as ViewStyle
}

/**
 * Create a text style with specific color and size
 */
export function createTextStyle(
  color: string = COLORS.text.primary,
  fontSize: number = FONTS.size.base,
  fontFamily: 'mono' | 'sans' = 'sans'
): TextStyle {
  return {
    color,
    fontSize,
    fontFamily: FONTS.family[fontFamily],
  }
}

/**
 * Create a glow border style for a color
 */
export function createGlowBorderStyle(
  color: 'green' | 'cyan' | 'purple' | 'orange' | 'pink' = 'cyan'
): ViewStyle {
  const colorValue = COLORS.neon[color]
  return {
    borderWidth: 1,
    borderColor: colorValue,
    shadowColor: colorValue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  }
}

/**
 * Stylesheet for common mobile components
 */
export const StyleGuide = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.dark.bg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Glass elements
  glassCard: glassCardStyle,
  hudPanel: hudPanelStyle,

  // Typography
  dataDisplay: dataDisplayStyle,
  narrativeText: narrativeTextStyle,
  heading: headingStyle,

  // Buttons
  buttonBase: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPrimary: {
    backgroundColor: COLORS.neon.green,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.neon.cyan,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text styles
  buttonText: {
    fontSize: FONTS.size.base,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.dark.bg,
  },

  buttonTextSecondary: {
    fontSize: FONTS.size.base,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.neon.cyan,
  },

  // Borders
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    marginVertical: SPACING.md,
  },

  // Spacing helpers
  gapSmall: {
    gap: SPACING.sm,
  },

  gapMedium: {
    gap: SPACING.md,
  },

  gapLarge: {
    gap: SPACING.lg,
  },
})
