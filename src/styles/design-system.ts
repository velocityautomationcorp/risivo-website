/**
 * Risivo Design System
 * Based on requirements document specifications
 */

export const colors = {
  // Primary Colors
  primary: '#667eea',
  primaryDark: '#5568d3',
  secondary: '#764ba2',
  
  // Supporting Colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Neutral Colors
  white: '#ffffff',
  lightGray: '#f5f5f5',
  mediumGray: '#9e9e9e',
  darkGray: '#333333',
  black: '#000000',
  
  // Gradients
  heroGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cardGradient: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
}

export const typography = {
  // Font Family
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  monospaceFontFamily: "'Courier New', monospace",
  
  // Font Sizes
  h1: '3rem',      // 48px - Hero headlines
  h2: '2.25rem',   // 36px - Section headlines
  h3: '1.875rem',  // 30px - Subsection headlines
  h4: '1.5rem',    // 24px - Card titles
  h5: '1.25rem',   // 20px - Small headings
  body: '1rem',    // 16px - Regular text
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
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
  keyframes: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
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
