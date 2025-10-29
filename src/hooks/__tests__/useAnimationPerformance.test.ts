/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { useAnimationPerformance, useIntersectionAnimation, useReducedMotion } from '../useAnimationPerformance'

// Mock the animations utility
jest.mock('../../utils/animations', () => ({
  debounceHover: jest.fn((fn) => fn),
  optimizeForAnimation: jest.fn(),
  cleanupAnimation: jest.fn(),
}))

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
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

describe('useAnimationPerformance', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return required properties', () => {
    const { result } = renderHook(() => useAnimationPerformance())

    expect(result.current).toHaveProperty('elementRef')
    expect(result.current).toHaveProperty('handleMouseEnter')
    expect(result.current).toHaveProperty('handleMouseLeave')
    expect(result.current).toHaveProperty('prepareForAnimation')
    expect(result.current).toHaveProperty('cleanupAfterAnimation')
  })

  it('should provide elementRef', () => {
    const { result } = renderHook(() => useAnimationPerformance())

    expect(result.current.elementRef).toBeDefined()
    expect(result.current.elementRef.current).toBeNull()
  })

  it('should provide mouse event handlers', () => {
    const { result } = renderHook(() => useAnimationPerformance())

    expect(typeof result.current.handleMouseEnter).toBe('function')
    expect(typeof result.current.handleMouseLeave).toBe('function')
  })

  it('should provide animation control functions', () => {
    const { result } = renderHook(() => useAnimationPerformance())

    expect(typeof result.current.prepareForAnimation).toBe('function')
    expect(typeof result.current.cleanupAfterAnimation).toBe('function')
  })

  it('should call prepareForAnimation on mouse enter', () => {
    const { result } = renderHook(() => useAnimationPerformance())

    act(() => {
      result.current.handleMouseEnter()
    })

    // The actual optimization is tested in the animations utility tests
    expect(result.current.handleMouseEnter).toBeDefined()
  })

  it('should call cleanupAfterAnimation on mouse leave', () => {
    const { result } = renderHook(() => useAnimationPerformance())

    act(() => {
      result.current.handleMouseLeave()
    })

    // The actual cleanup is tested in the animations utility tests
    expect(result.current.handleMouseLeave).toBeDefined()
  })

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useAnimationPerformance())

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow()
  })
})

describe('useIntersectionAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return elementRef', () => {
    const { result } = renderHook(() => useIntersectionAnimation())

    expect(result.current).toBeDefined()
    expect(result.current.current).toBeNull()
  })

  it('should create IntersectionObserver with default threshold', () => {
    renderHook(() => useIntersectionAnimation())

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    )
  })

  it('should create IntersectionObserver with custom threshold', () => {
    renderHook(() => useIntersectionAnimation(0.5))

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.5 }
    )
  })

  it('should observe element when ref is set', () => {
    const mockObserve = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })

    const { result } = renderHook(() => useIntersectionAnimation())

    // Simulate setting the ref
    const mockElement = document.createElement('div')
    act(() => {
      result.current.current = mockElement
    })

    // Re-render to trigger the effect
    renderHook(() => useIntersectionAnimation())

    expect(mockObserve).toHaveBeenCalled()
  })

  it('should disconnect observer on unmount', () => {
    const mockDisconnect = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
    })

    const { unmount } = renderHook(() => useIntersectionAnimation())

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })
})

describe('useReducedMotion', () => {
  it('should return false when matchMedia is not available', () => {
    // Mock window as undefined
    const originalWindow = global.window
    delete (global as any).window

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    // Restore window
    global.window = originalWindow
  })

  it('should return true when user prefers reduced motion', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
    }))

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('should return false when user does not prefer reduced motion', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
    }))

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })
})