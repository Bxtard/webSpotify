/**
 * Animation utilities for SPOTIFY APP redesign
 * Provides consistent animation timing, easing, and performance optimizations
 */

// Animation timing constants
export const ANIMATION_DURATION = {
  fast: '0.15s',
  normal: '0.2s',
  slow: '0.3s',
  slower: '0.5s'
} as const

// Easing functions for smooth animations
export const ANIMATION_EASING = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const

// Common transition properties for performance
export const TRANSITION_PROPS = {
  transform: `transform ${ANIMATION_DURATION.normal} ${ANIMATION_EASING.easeOut}`,
  opacity: `opacity ${ANIMATION_DURATION.normal} ${ANIMATION_EASING.easeInOut}`,
  colors: `background-color ${ANIMATION_DURATION.normal} ${ANIMATION_EASING.easeInOut}, color ${ANIMATION_DURATION.normal} ${ANIMATION_EASING.easeInOut}`,
  border: `border-color ${ANIMATION_DURATION.normal} ${ANIMATION_EASING.easeInOut}`,
  shadow: `box-shadow ${ANIMATION_DURATION.normal} ${ANIMATION_EASING.easeOut}`,
  all: `all ${ANIMATION_DURATION.normal} ${ANIMATION_EASING.easeInOut}`
} as const

// Performance optimization utilities
export const optimizeForAnimation = (element: HTMLElement) => {
  element.style.willChange = 'transform, opacity'
  // Force layer creation for better performance
  element.style.transform = element.style.transform || 'translateZ(0)'
}

export const cleanupAnimation = (element: HTMLElement) => {
  element.style.willChange = 'auto'
  // Remove forced layer if it was only for optimization
  if (element.style.transform === 'translateZ(0)') {
    element.style.transform = ''
  }
}

// Debounce utility for hover effects to prevent excessive repaints
export const debounceHover = (callback: () => void, delay: number = 50) => {
  let timeoutId: NodeJS.Timeout
  let rafId: number
  
  return () => {
    clearTimeout(timeoutId)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    
    timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(callback)
    }, delay)
  }
}

// Throttle utility for scroll-based animations
export const throttleAnimation = (callback: () => void, delay: number = 16) => {
  let lastCall = 0
  let rafId: number
  
  return () => {
    const now = Date.now()
    
    if (now - lastCall >= delay) {
      lastCall = now
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      rafId = requestAnimationFrame(callback)
    }
  }
}

// Batch DOM operations for better performance
export const batchDOMOperations = (operations: (() => void)[]) => {
  requestAnimationFrame(() => {
    operations.forEach(operation => operation())
  })
}

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Animation CSS strings for styled-components
export const createTransition = (properties: string[], duration = ANIMATION_DURATION.normal, easing = ANIMATION_EASING.easeInOut) => {
  return properties.map(prop => `${prop} ${duration} ${easing}`).join(', ')
}

// Common animation mixins
export const animationMixins = {
  // Hover scale effect for cards
  hoverScale: `
    transition: ${createTransition(['transform', 'box-shadow'])};
    will-change: transform;
    
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    
    &:active {
      transform: scale(0.98);
    }
  `,
  
  // Hover lift effect for buttons
  hoverLift: `
    transition: ${createTransition(['transform', 'box-shadow'])};
    will-change: transform;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
  `,
  
  // Focus ring animation
  focusRing: `
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      transition: outline-offset ${ANIMATION_DURATION.fast} ${ANIMATION_EASING.easeOut};
    }
  `,
  
  // Fade in animation
  fadeIn: `
    animation: fadeIn ${ANIMATION_DURATION.slow} ${ANIMATION_EASING.easeInOut};
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  
  // Slide up animation
  slideUp: `
    animation: slideUp ${ANIMATION_DURATION.slow} ${ANIMATION_EASING.easeOut};
    
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
  `,
  
  // Stagger animation for lists
  staggerDelay: (index: number, baseDelay = 0.1) => `
    animation-delay: ${index * baseDelay}s;
  `
}

// Page transition utilities
export const pageTransitions = {
  fadeIn: `
    @keyframes pageTransitionFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    animation: pageTransitionFadeIn ${ANIMATION_DURATION.slow} ${ANIMATION_EASING.easeInOut};
  `,
  
  slideFromRight: `
    @keyframes pageTransitionSlideFromRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    animation: pageTransitionSlideFromRight ${ANIMATION_DURATION.slow} ${ANIMATION_EASING.easeOut};
  `
}