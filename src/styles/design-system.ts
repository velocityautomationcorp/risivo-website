/**
 * Risivo Design System
 * Based on OFFICIAL Brand Guidelines (Dec 2025)
 * 
 * CRITICAL: These colors, fonts, and styles must match the official brand
 * guidelines used across all platforms (social media, marketing, etc.)
 * 
 * Official Brand Colors:
 * - Purple: #683FE9
 * - Coral: #ED632F
 * - Light Purple: #7C3AED
 * 
 * Official Font: JOST (all weights)
 */

export const colors = {
  // PRIMARY BRAND COLORS (OFFICIAL - From Brand Guidelines Dec 2025)
  primary: '#683FE9',      // Risivo Purple (OFFICIAL)
  primaryLight: '#7C3AED', // Light Purple (OFFICIAL)
  secondary: '#ED632F',    // Coral/Pink Accent (OFFICIAL)
  primaryDark: '#5530C7',  // Darker purple (derived)
  
  // Supporting Colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // NEUTRAL COLORS (OFFICIAL - From Brand Guidelines)
  white: '#ffffff',
  lightGray: '#f8fafc',      // Background Light (OFFICIAL)
  mediumGray: '#6b7280',     // Text Gray (OFFICIAL)
  darkGray: '#1f2937',       // Text Dark (OFFICIAL)
  black: '#000000',
  border: 'rgba(107, 114, 128, 0.2)',  // Derived from text gray
  
  // GRADIENTS (Using Official Brand Colors)
  heroGradient: 'linear-gradient(135deg, #683FE9 0%, #7C3AED 100%)',  // Purple gradient
  buttonGradient: 'linear-gradient(135deg, #683FE9 0%, #ED632F 100%)', // Purple to coral
  accentGradient: 'linear-gradient(135deg, #7C3AED 0%, #ED632F 100%)', // Light purple to coral
  cardGradient: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
}

export const typography = {
  // FONT FAMILY (OFFICIAL - From Brand Guidelines)
  fontFamily: "'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  monospaceFontFamily: "'Courier New', monospace",
  
  // FONT SIZES (Aligned with Brand Guidelines)
  h1: '2rem',      // 32px - Jost Bold (OFFICIAL)
  h2: '1.5rem',    // 24px - Jost Semibold (OFFICIAL)
  h3: '1.25rem',   // 20px - Jost Medium (OFFICIAL)
  h4: '1.125rem',  // 18px - Card titles
  h5: '1rem',      // 16px - Small headings
  body: '1rem',    // 16px - Jost Regular (OFFICIAL, line-height 1.5)
  small: '0.875rem', // 14px - Captions, labels
  tiny: '0.75rem', // 12px - Fine print
  
  // Font Weights
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  
  // Line Heights
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
}

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
}

export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
}

export const borderRadius = {
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  full: '9999px',
}

export const animations = {
  transition: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
    verySlow: '800ms ease-in-out',
  },
  keyframes: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,
    fadeInUp: `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,
    fadeInLeft: `
      @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `,
    fadeInRight: `
      @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `,
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
    `,
    floatBob: `
      @keyframes floatBob {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(1deg); }
        50% { transform: translateY(-15px) rotate(0deg); }
        75% { transform: translateY(-10px) rotate(-1deg); }
      }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    slideUp: `
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,
    scaleIn: `
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `,
    spin: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
  }
}

// Button variants
export const buttons = {
  primary: {
    bg: colors.primary,
    color: colors.white,
    hover: colors.primaryDark,
  },
  secondary: {
    bg: colors.white,
    color: colors.primary,
    border: colors.primary,
  },
  outline: {
    bg: 'transparent',
    color: colors.primary,
    border: colors.primary,
  },
  text: {
    bg: 'transparent',
    color: colors.primary,
  },
  sizes: {
    sm: { height: '32px', padding: '0 16px', fontSize: typography.small },
    md: { height: '40px', padding: '0 24px', fontSize: typography.body },
    lg: { height: '48px', padding: '0 32px', fontSize: typography.h5 },
  }
}

// Export default design system
export const designSystem = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  animations,
  buttons,
}

export default designSystem
