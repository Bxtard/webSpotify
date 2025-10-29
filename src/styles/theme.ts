// Theme configuration with complete design tokens for SPOTIFY APP redesign
export const theme = {
  colors: {
    // Primary brand colors
    primary: '#C4FF61',        // Bright green accent (buttons, highlights)
    primaryHover: '#B8F055',   // Hover state for primary
    secondary: '#1DB954',      // Success states (kept for compatibility)
    
    // Background colors
    background: '#1a1a1a',     // Main dark background (updated for SPOTIFY APP)
    surface: '#2a2a2a',        // Card/component backgrounds
    surfaceHover: '#333333',   // Hover states for cards
    
    // Text colors
    textPrimary: '#FFFFFF',    // Main text color
    textSecondary: '#B3B3B3',  // Secondary text (followers, meta)
    textMuted: '#6B6B6B',      // Muted text (placeholders)
    
    // Interactive states
    border: '#404040',         // Default borders
    borderActive: '#C4FF61',   // Active/selected borders
    
    // Status colors
    success: '#1DB954',        // Success states
    error: '#E22134',          // Error states
    warning: '#FFA500',        // Warning states
    
    // Legacy support
    overlay: 'rgba(0, 0, 0, 0.8)' // Modal overlays
  },
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px - Card meta text
      base: '1rem',     // 16px - Card titles, navigation
      lg: '1.125rem',   // 18px - Subtitle text
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px - Brand logo
      '3xl': '2rem',    // 32px
      '4xl': '2.5rem',  // 40px
      '5xl': '3rem'     // 48px - Hero text
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
    },
    // Semantic typography tokens for SPOTIFY APP design
    hero: {
      fontSize: '3rem',        // 48px - "Busca tus artistas"
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    subtitle: {
      fontSize: '1.125rem',    // 18px - Description text
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    brand: {
      fontSize: '1.5rem',      // 24px - "SPOTIFY APP"
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '0.1em'
    },
    nav: {
      fontSize: '1rem',        // 16px - Navigation links
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0'
    },
    cardTitle: {
      fontSize: '1rem',        // 16px - Artist names
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0'
    },
    cardMeta: {
      fontSize: '0.875rem',    // 14px - Followers count
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0'
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
  // Layout tokens for SPOTIFY APP centered design
  layout: {
    // Container widths
    maxWidth: '1200px',        // Maximum content width
    contentWidth: '800px',     // Centered content area
    
    // Grid system
    gridGap: '24px',           // Gap between cards
    cardWidth: '200px',        // Artist card width
    cardHeight: '240px',       // Artist card height
    
    // Header
    headerHeight: '80px',      // Header height
    
    // Search input
    searchInputHeight: '56px', // Search input height
    searchMaxWidth: '600px',   // Maximum search input width
    
    // Pagination
    paginationButtonSize: '40px' // Pagination button dimensions
  },
  // Border radius tokens
  borderRadius: {
    none: '0',
    sm: '8px',               // Small components
    md: '12px',              // Cards
    lg: '16px',              // Large components
    xl: '24px',              // Extra large components
    full: '50%'              // Circular elements
  },
  breakpoints: {
    sm: '640px',   // Mobile landscape
    md: '768px',   // Tablet
    lg: '1024px',  // Desktop
    xl: '1280px'   // Large desktop
  },
  // Responsive grid configurations for SPOTIFY APP design
  grid: {
    mobile: {
      columns: 1,              // 1 column on mobile (iPhone)
      gap: '16px',
      padding: '16px'
    },
    tablet: {
      columns: 2,              // 2 columns on tablet (iPad)
      gap: '32px',             // Increased gap for better spacing
      padding: '24px'
    },
    desktop: {
      columns: 4,              // 4 columns on desktop
      gap: '40px',             // Increased gap for better spacing
      padding: '32px'
    }
  },
  // Animation tokens
  animation: {
    duration: {
      fast: '0.15s',
      normal: '0.2s',
      slow: '0.3s'
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
    }
  }
}

export type Theme = typeof theme