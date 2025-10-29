// Breakpoints configuration - integrated into main theme for SPOTIFY APP redesign
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px'   // Large desktop
}

// Media query helpers for SPOTIFY APP responsive design
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  
  // Additional helpers for SPOTIFY APP design
  mobile: `@media (max-width: ${breakpoints.md})`,
  tablet: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`
}

// Grid breakpoint configurations for SPOTIFY APP artist cards
export const gridBreakpoints = {
  mobile: {
    columns: 2,
    gap: '16px',
    padding: '16px'
  },
  tablet: {
    columns: 3,
    gap: '20px',
    padding: '24px'
  },
  desktop: {
    columns: 4,
    gap: '24px',
    padding: '32px'
  }
}