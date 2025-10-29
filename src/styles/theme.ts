// Theme configuration with complete design tokens
export const theme = {
  colors: {
    primary: '#C4FF61',      // Bright green accent
    secondary: '#1DB954',    // Spotify green
    background: '#121212',   // Dark background
    surface: '#1E1E1E',      // Card/surface background
    surfaceHover: '#2A2A2A', // Hover state
    textPrimary: '#FFFFFF',  // Primary text
    textSecondary: '#B3B3B3', // Secondary text
    textMuted: '#6B6B6B',    // Muted text
    error: '#E22134',        // Error/remove actions
    success: '#1DB954',      // Success states
    border: '#333333',       // Border color
    overlay: 'rgba(0, 0, 0, 0.8)' // Modal overlays
  },
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '2rem',    // 32px
      '4xl': '2.5rem'   // 40px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6
    }
  },
  spacing: {
    xxs: '0.25rem',  // 4px
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },
  breakpoints: {
    sm: '640px',   // Mobile landscape
    md: '768px',   // Tablet
    lg: '1024px',  // Desktop
    xl: '1280px'   // Large desktop
  }
}

export type Theme = typeof theme