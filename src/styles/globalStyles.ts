import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html, body {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    overflow-x: hidden;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  #root, #__next {
    isolation: isolate;
    min-height: 100vh;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textMuted};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textSecondary};
  }

  /* Enhanced focus styles for accessibility */
  :focus {
    outline: none;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    * {
      border-color: ButtonText !important;
    }
    
    button, input, select, textarea {
      border: 1px solid ButtonText !important;
    }
  }

  /* Selection styles */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }

  /* Typography styles */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  /* SPOTIFY APP semantic typography classes */
  .hero-text {
    font-size: ${({ theme }) => theme.typography.hero.fontSize};
    font-weight: ${({ theme }) => theme.typography.hero.fontWeight};
    line-height: ${({ theme }) => theme.typography.hero.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.hero.letterSpacing};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .subtitle-text {
    font-size: ${({ theme }) => theme.typography.subtitle.fontSize};
    font-weight: ${({ theme }) => theme.typography.subtitle.fontWeight};
    line-height: ${({ theme }) => theme.typography.subtitle.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.subtitle.letterSpacing};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .brand-text {
    font-size: ${({ theme }) => theme.typography.brand.fontSize};
    font-weight: ${({ theme }) => theme.typography.brand.fontWeight};
    line-height: ${({ theme }) => theme.typography.brand.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.brand.letterSpacing};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .nav-text {
    font-size: ${({ theme }) => theme.typography.nav.fontSize};
    font-weight: ${({ theme }) => theme.typography.nav.fontWeight};
    line-height: ${({ theme }) => theme.typography.nav.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.nav.letterSpacing};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .card-title {
    font-size: ${({ theme }) => theme.typography.cardTitle.fontSize};
    font-weight: ${({ theme }) => theme.typography.cardTitle.fontWeight};
    line-height: ${({ theme }) => theme.typography.cardTitle.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.cardTitle.letterSpacing};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .card-meta {
    font-size: ${({ theme }) => theme.typography.cardMeta.fontSize};
    font-weight: ${({ theme }) => theme.typography.cardMeta.fontWeight};
    line-height: ${({ theme }) => theme.typography.cardMeta.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.cardMeta.letterSpacing};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  /* Button reset with accessibility */
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    /* Ensure minimum touch target size */
    min-height: 44px;
    min-width: 44px;
  }

  /* List reset */
  ul, ol {
    list-style: none;
    padding: 0;
  }

  /* Form elements */
  input, textarea {
    background-color: transparent;
    border: none;
    outline: none;
  }

  /* Accessibility utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Skip links for keyboard navigation */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    
    &:focus {
      top: 6px;
    }
  }

  /* Lazy loading image states */
  .lazy-image {
    transition: opacity 0.3s ease;
    
    &.lazy-loading {
      opacity: 0.6;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    &.lazy-loaded {
      opacity: 1;
    }
    
    &.lazy-error {
      opacity: 0.5;
      background-color: ${({ theme }) => theme.colors.surface};
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* SPOTIFY APP layout containers */
  .container {
    width: 100%;
    max-width: ${({ theme }) => theme.layout.maxWidth};
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing.lg};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 ${({ theme }) => theme.spacing.xl};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
      padding: 0 ${({ theme }) => theme.spacing['2xl']};
    }
  }

  .container-fluid {
    width: 100%;
    padding: 0 ${({ theme }) => theme.spacing.md};

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing.lg};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 ${({ theme }) => theme.spacing.xl};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
      padding: 0 ${({ theme }) => theme.spacing['2xl']};
    }
  }

  /* SPOTIFY APP centered content container */
  .content-container {
    width: 100%;
    max-width: ${({ theme }) => theme.layout.contentWidth};
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing.lg};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 ${({ theme }) => theme.spacing.xl};
    }
  }

  /* SPOTIFY APP responsive grid */
  .artist-grid {
    display: grid;
    gap: ${({ theme }) => theme.grid.mobile.gap};
    grid-template-columns: repeat(${({ theme }) => theme.grid.mobile.columns}, 1fr);
    padding: ${({ theme }) => theme.grid.mobile.padding};

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      gap: ${({ theme }) => theme.grid.tablet.gap};
      grid-template-columns: repeat(${({ theme }) => theme.grid.tablet.columns}, 1fr);
      padding: ${({ theme }) => theme.grid.tablet.padding};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      gap: ${({ theme }) => theme.grid.desktop.gap};
      grid-template-columns: repeat(${({ theme }) => theme.grid.desktop.columns}, 1fr);
      padding: ${({ theme }) => theme.grid.desktop.padding};
    }
  }

  /* SPOTIFY APP animation utilities */
  .fade-in {
    animation: fadeIn ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.easeInOut};
  }

  .slide-up {
    animation: slideUp ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.easeOut};
  }

  /* Smooth transitions for responsive layouts */
  .responsive-transition {
    transition: all ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.easeInOut};
  }

  /* SPOTIFY APP hover transitions with performance optimization */
  .hover-scale {
    transition: transform ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
    will-change: transform;
    
    &:hover {
      transform: scale(1.02) translateZ(0);
    }
    
    &:not(:hover) {
      will-change: auto;
    }
  }

  .hover-lift {
    transition: transform ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut},
                box-shadow ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
    will-change: transform, box-shadow;
    
    &:hover {
      transform: translateY(-2px) translateZ(0);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    &:not(:hover) {
      will-change: auto;
    }
  }

  /* Performance-optimized animations */
  .gpu-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .animate-in {
    animation: slideUp ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.easeOut};
  }

  /* Enhanced reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    .fade-in,
    .slide-up,
    .animate-in {
      animation: none;
    }
    
    .hover-scale:hover,
    .hover-lift:hover {
      transform: none;
    }
    
    .responsive-transition {
      transition: none;
    }
    
    /* Disable shimmer animation for reduced motion */
    .lazy-image.lazy-loading {
      animation: none;
      background: ${({ theme }) => theme.colors.surface};
    }
  }

  /* Print styles for accessibility */
  @media print {
    * {
      background: white !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    a, a:visited {
      text-decoration: underline;
    }
    
    .sr-only {
      position: static;
      width: auto;
      height: auto;
      margin: 0;
      overflow: visible;
      clip: auto;
      white-space: normal;
    }
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    button, a, [role="button"] {
      min-height: 48px; /* Larger touch targets on mobile */
      min-width: 48px;
    }
  }

  /* SPOTIFY APP button styles */
  .btn-primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }

  .btn-secondary {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
                border-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};

    &:hover {
      background-color: ${({ theme }) => theme.colors.surfaceHover};
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Loading animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`