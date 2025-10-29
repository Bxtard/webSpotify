/**
 * @jest-environment jsdom
 */

import {
  performanceMonitor,
  canHandleComplexAnimations,
  getAnimationQuality,
  getAnimationConfig,
  usePerformanceAwareAnimations
} from '../performanceMonitor'

// Mock performance.now
const mockPerformanceNow = jest.fn()
Object.defineProperty(global, 'performance', {
  value: {
    now: mockPerformanceNow,
  },
})

// Mock requestAnimationFrame
const mockRequestAnimationFrame = jest.fn()
const mockCancelAnimationFrame = jest.fn()
Object.defineProperty(global, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
})
Object.defineProperty(global, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    deviceMemory: 8,
  },
  writable: true,
})

describe('Performance Monitor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPerformanceNow.mockReturnValue(0)
  })

  it('should start monitoring', () => {
    performanceMonitor.start()
    expect(mockRequestAnimationFrame).toHaveBeenCalled()
  })

  it('should stop monitoring', () => {
    performanceMonitor.start()
    performanceMonitor.stop()
    expect(mockCancelAnimationFrame).toHaveBeenCalled()
  })

  it('should not start monitoring if already monitoring', () => {
    performanceMonitor.start()
    const firstCallCount = mockRequestAnimationFrame.mock.calls.length
    
    performanceMonitor.start()
    expect(mockRequestAnimationFrame.mock.calls.length).toBe(firstCallCount)
    
    performanceMonitor.stop()
  })

  it('should return initial metrics', () => {
    const metrics = performanceMonitor.getMetrics()
    expect(metrics).toHaveProperty('fps')
    expect(metrics).toHaveProperty('frameTime')
    expect(metrics).toHaveProperty('droppedFrames')
    expect(typeof metrics.fps).toBe('number')
    expect(typeof metrics.frameTime).toBe('number')
    expect(typeof metrics.droppedFrames).toBe('number')
  })

  it('should determine if performance is good', () => {
    const isGood = performanceMonitor.isPerformanceGood()
    expect(typeof isGood).toBe('boolean')
  })
})

describe('Complex Animation Detection', () => {
  beforeEach(() => {
    // Reset mocks
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
    }))
    
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        deviceMemory: 8,
      },
      writable: true,
    })

    // Mock canvas and WebGL
    const mockCanvas = {
      getContext: jest.fn().mockReturnValue({}),
    }
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return mockCanvas
      }
      return {}
    })
  })

  it('should return false when user prefers reduced motion', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true, // prefers-reduced-motion: reduce
    }))

    expect(canHandleComplexAnimations()).toBe(false)
  })

  it('should return false when WebGL is not available', () => {
    const mockCanvas = {
      getContext: jest.fn().mockReturnValue(null),
    }
    document.createElement = jest.fn().mockReturnValue(mockCanvas)

    expect(canHandleComplexAnimations()).toBe(false)
  })

  it('should return false on mobile devices', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        deviceMemory: 4,
      },
      writable: true,
    })

    expect(canHandleComplexAnimations()).toBe(false)
  })

  it('should return false with low memory', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        deviceMemory: 2, // Less than 4GB
      },
      writable: true,
    })

    expect(canHandleComplexAnimations()).toBe(false)
  })

  it('should return true with good conditions', () => {
    // All conditions are good by default in beforeEach
    expect(canHandleComplexAnimations()).toBe(true)
  })
})

describe('Animation Quality Detection', () => {
  it('should return low quality when complex animations are not supported', () => {
    // Mock canHandleComplexAnimations to return false
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true, // prefers-reduced-motion: reduce
    }))

    expect(getAnimationQuality()).toBe('low')
  })

  it('should return quality based on performance metrics', () => {
    // Mock good performance
    jest.spyOn(performanceMonitor, 'getMetrics').mockReturnValue({
      fps: 60,
      frameTime: 16,
      droppedFrames: 1,
    })

    expect(getAnimationQuality()).toBe('high')
  })
})

describe('Animation Configuration', () => {
  it('should return high quality config for good performance', () => {
    jest.spyOn(performanceMonitor, 'getMetrics').mockReturnValue({
      fps: 60,
      frameTime: 16,
      droppedFrames: 1,
    })

    const config = getAnimationConfig()
    expect(config.enableComplexAnimations).toBe(true)
    expect(config.enableParallax).toBe(true)
    expect(config.enableBlur).toBe(true)
    expect(config.transitionDuration).toBe(300)
  })

  it('should return medium quality config for moderate performance', () => {
    jest.spyOn(performanceMonitor, 'getMetrics').mockReturnValue({
      fps: 50,
      frameTime: 20,
      droppedFrames: 5,
    })

    const config = getAnimationConfig()
    expect(config.enableComplexAnimations).toBe(true)
    expect(config.enableParallax).toBe(false)
    expect(config.enableBlur).toBe(false)
    expect(config.transitionDuration).toBe(200)
  })

  it('should return low quality config for poor performance', () => {
    jest.spyOn(performanceMonitor, 'getMetrics').mockReturnValue({
      fps: 30,
      frameTime: 33,
      droppedFrames: 15,
    })

    const config = getAnimationConfig()
    expect(config.enableComplexAnimations).toBe(false)
    expect(config.staggerDelay).toBe(0)
    expect(config.transitionDuration).toBe(150)
  })
})

describe('Performance Aware Animations Hook', () => {
  it('should return animation configuration', () => {
    const result = usePerformanceAwareAnimations()
    
    expect(result).toHaveProperty('enableComplexAnimations')
    expect(result).toHaveProperty('staggerDelay')
    expect(result).toHaveProperty('transitionDuration')
    expect(result).toHaveProperty('shouldAnimate')
    expect(result).toHaveProperty('reducedMotion')
    
    expect(typeof result.enableComplexAnimations).toBe('boolean')
    expect(typeof result.staggerDelay).toBe('number')
    expect(typeof result.transitionDuration).toBe('number')
    expect(typeof result.shouldAnimate).toBe('boolean')
    expect(typeof result.reducedMotion).toBe('boolean')
  })

  it('should set shouldAnimate based on enableComplexAnimations', () => {
    const result = usePerformanceAwareAnimations()
    expect(result.shouldAnimate).toBe(result.enableComplexAnimations)
  })
})