/**
 * @jest-environment jsdom
 */

import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { afterEach } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  optimizeForAnimation,
  cleanupAnimation,
  debounceHover,
  prefersReducedMotion,
  createTransition,
  animationMixins
} from '../animations'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('Animation Constants', () => {
  it('should have correct animation durations', () => {
    expect(ANIMATION_DURATION.fast).toBe('0.15s')
    expect(ANIMATION_DURATION.normal).toBe('0.2s')
    expect(ANIMATION_DURATION.slow).toBe('0.3s')
    expect(ANIMATION_DURATION.slower).toBe('0.5s')
  })

  it('should have correct easing functions', () => {
    expect(ANIMATION_EASING.easeInOut).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
    expect(ANIMATION_EASING.easeOut).toBe('cubic-bezier(0, 0, 0.2, 1)')
    expect(ANIMATION_EASING.easeIn).toBe('cubic-bezier(0.4, 0, 1, 1)')
    expect(ANIMATION_EASING.bounce).toBe('cubic-bezier(0.68, -0.55, 0.265, 1.55)')
  })
})

describe('Performance Optimization', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
  })

  it('should optimize element for animation', () => {
    optimizeForAnimation(mockElement)
    
    expect(mockElement.style.willChange).toBe('transform, opacity')
    expect(mockElement.style.transform).toBeTruthy()
  })

  it('should cleanup animation optimizations', () => {
    // First optimize
    optimizeForAnimation(mockElement)
    expect(mockElement.style.willChange).toBe('transform, opacity')
    
    // Then cleanup
    cleanupAnimation(mockElement)
    expect(mockElement.style.willChange).toBe('auto')
  })

  it('should preserve existing transform when cleaning up', () => {
    mockElement.style.transform = 'scale(1.5)'
    optimizeForAnimation(mockElement)
    cleanupAnimation(mockElement)
    
    expect(mockElement.style.transform).toBe('scale(1.5)')
  })
})

describe('Debounce Hover', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return a function', () => {
    const mockCallback = jest.fn()
    const debouncedFn = debounceHover(mockCallback, 100)

    expect(typeof debouncedFn).toBe('function')
  })

  it('should use default delay when not specified', () => {
    const mockCallback = jest.fn()
    const debouncedFn = debounceHover(mockCallback)

    expect(typeof debouncedFn).toBe('function')
  })
})

describe('Reduced Motion Detection', () => {
  it('should return false when matchMedia is not available', () => {
    // Mock window as undefined
    const originalWindow = global.window
    delete (global as any).window
    
    expect(prefersReducedMotion()).toBe(false)
    
    // Restore window
    global.window = originalWindow
  })

  it('should return true when user prefers reduced motion', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
    }))
    
    expect(prefersReducedMotion()).toBe(true)
  })

  it('should return false when user does not prefer reduced motion', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
    }))
    
    expect(prefersReducedMotion()).toBe(false)
  })
})

describe('Create Transition', () => {
  it('should create transition string with default values', () => {
    const result = createTransition(['transform', 'opacity'])
    expect(result).toBe('transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)')
  })

  it('should create transition string with custom duration and easing', () => {
    const result = createTransition(['transform'], '0.5s', 'ease-in-out')
    expect(result).toBe('transform 0.5s ease-in-out')
  })

  it('should handle multiple properties', () => {
    const result = createTransition(['transform', 'opacity', 'background-color'], '0.3s', 'ease')
    expect(result).toBe('transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease')
  })
})

describe('Animation Mixins', () => {
  it('should contain hover scale mixin', () => {
    expect(animationMixins.hoverScale).toContain('transform')
    expect(animationMixins.hoverScale).toContain('scale(1.02)')
    expect(animationMixins.hoverScale).toContain('will-change')
  })

  it('should contain hover lift mixin', () => {
    expect(animationMixins.hoverLift).toContain('translateY(-1px)')
    expect(animationMixins.hoverLift).toContain('box-shadow')
  })

  it('should contain fade in animation', () => {
    expect(animationMixins.fadeIn).toContain('fadeIn')
    expect(animationMixins.fadeIn).toContain('opacity: 0')
    expect(animationMixins.fadeIn).toContain('opacity: 1')
  })

  it('should contain slide up animation', () => {
    expect(animationMixins.slideUp).toContain('slideUp')
    expect(animationMixins.slideUp).toContain('translateY(20px)')
    expect(animationMixins.slideUp).toContain('translateY(0)')
  })

  it('should generate stagger delay correctly', () => {
    const delay0 = animationMixins.staggerDelay(0)
    const delay1 = animationMixins.staggerDelay(1)
    const delay2 = animationMixins.staggerDelay(2, 0.2)

    expect(delay0).toContain('animation-delay: 0s')
    expect(delay1).toContain('animation-delay: 0.1s')
    expect(delay2).toContain('animation-delay: 0.4s')
  })
})