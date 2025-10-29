import { renderHook, act } from '@testing-library/react'
import {
  useFocusTrap,
  useScreenReader,
  useAccessibilityPreferences,
  useKeyboardNavigation,
  useAriaLiveRegion,
  useSkipLinks
} from '../useAccessibility'

// Mock DOM methods
const mockElement = {
  focus: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  querySelectorAll: jest.fn(() => []),
} as any

const mockDocument = {
  createElement: jest.fn(() => mockElement),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
  activeElement: mockElement,
  getElementById: jest.fn(),
} as any

const mockMatchMedia = jest.fn()

beforeAll(() => {
  global.document = mockDocument
  global.window = {
    matchMedia: mockMatchMedia,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  } as any
})

describe('Accessibility Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({ 
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })
  })

  describe('useFocusTrap', () => {
    it('should set up focus trap when active', () => {
      const { result } = renderHook(() => useFocusTrap(true))
      
      expect(result.current.current).toBeDefined()
    })

    it('should not set up focus trap when inactive', () => {
      const { result } = renderHook(() => useFocusTrap(false))
      
      expect(result.current.current).toBeDefined()
    })

    it('should cleanup focus trap on unmount', () => {
      const { unmount } = renderHook(() => useFocusTrap(true))
      
      unmount()
      // Should not throw
    })
  })

  describe('useScreenReader', () => {
    it('should provide announce function', () => {
      const { result } = renderHook(() => useScreenReader())
      
      expect(typeof result.current.announce).toBe('function')
    })

    it('should announce messages', () => {
      const { result } = renderHook(() => useScreenReader())
      
      act(() => {
        result.current.announce('Test message')
      })
      
      expect(mockDocument.createElement).toHaveBeenCalledWith('div')
      expect(mockDocument.body.appendChild).toHaveBeenCalled()
    })

    it('should announce with different priorities', () => {
      const { result } = renderHook(() => useScreenReader())
      
      act(() => {
        result.current.announce('Urgent message', 'assertive')
      })
      
      expect(mockDocument.createElement).toHaveBeenCalled()
    })
  })

  describe('useAccessibilityPreferences', () => {
    it('should return default preferences', () => {
      const { result } = renderHook(() => useAccessibilityPreferences())
      
      expect(result.current).toEqual({
        reducedMotion: false,
        highContrast: false,
        darkMode: false
      })
    })

    it('should detect reduced motion preference', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion'),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }))
      
      const { result } = renderHook(() => useAccessibilityPreferences())
      
      expect(result.current.reducedMotion).toBe(true)
    })

    it('should detect high contrast preference', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query.includes('prefers-contrast'),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }))
      
      const { result } = renderHook(() => useAccessibilityPreferences())
      
      expect(result.current.highContrast).toBe(true)
    })

    it('should detect dark mode preference', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query.includes('prefers-color-scheme'),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }))
      
      const { result } = renderHook(() => useAccessibilityPreferences())
      
      expect(result.current.darkMode).toBe(true)
    })
  })

  describe('useKeyboardNavigation', () => {
    const mockHandlers = {
      onEnter: jest.fn(),
      onSpace: jest.fn(),
      onEscape: jest.fn(),
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return element ref', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation(mockHandlers)
      )
      
      expect(result.current.current).toBeDefined()
    })

    it('should handle keyboard events', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation(mockHandlers)
      )
      
      // Simulate setting the ref
      const mockElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
      
      if (result.current.current) {
        Object.assign(result.current, { current: mockElement })
      }
      
      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })
  })

  describe('useAriaLiveRegion', () => {
    it('should provide announce function and message state', () => {
      const { result } = renderHook(() => useAriaLiveRegion())
      
      expect(typeof result.current.announce).toBe('function')
      expect(result.current.message).toBe('')
      expect(result.current.priority).toBe('polite')
      expect(result.current.ariaLiveProps).toEqual({
        'aria-live': 'polite',
        'aria-atomic': true,
        className: 'sr-only'
      })
    })

    it('should update message when announced', () => {
      const { result } = renderHook(() => useAriaLiveRegion())
      
      act(() => {
        result.current.announce('Test announcement', 'assertive')
      })
      
      expect(result.current.message).toBe('Test announcement')
      expect(result.current.priority).toBe('assertive')
    })

    it('should clear message after timeout', async () => {
      jest.useFakeTimers()
      
      const { result } = renderHook(() => useAriaLiveRegion())
      
      act(() => {
        result.current.announce('Test message')
      })
      
      expect(result.current.message).toBe('Test message')
      
      act(() => {
        jest.advanceTimersByTime(150)
      })
      
      expect(result.current.message).toBe('')
      
      jest.useRealTimers()
    })
  })

  describe('useSkipLinks', () => {
    const mockLinks = [
      { id: 'main-content', label: 'Skip to main content' },
      { id: 'navigation', label: 'Skip to navigation' }
    ]

    beforeEach(() => {
      mockDocument.getElementById.mockImplementation((id) => ({
        focus: jest.fn(),
        scrollIntoView: jest.fn(),
      }))
    })

    it('should provide skip links with click handlers', () => {
      const { result } = renderHook(() => useSkipLinks(mockLinks))
      
      expect(result.current.skipLinks).toHaveLength(2)
      expect(result.current.skipLinks[0]).toEqual({
        id: 'main-content',
        label: 'Skip to main content',
        onClick: expect.any(Function)
      })
    })

    it('should provide skipToContent function', () => {
      const { result } = renderHook(() => useSkipLinks(mockLinks))
      
      expect(typeof result.current.skipToContent).toBe('function')
    })

    it('should focus and scroll to target element', () => {
      const { result } = renderHook(() => useSkipLinks(mockLinks))
      const mockElement = {
        focus: jest.fn(),
        scrollIntoView: jest.fn(),
      }
      
      mockDocument.getElementById.mockReturnValue(mockElement)
      
      act(() => {
        result.current.skipToContent('main-content')
      })
      
      expect(mockDocument.getElementById).toHaveBeenCalledWith('main-content')
      expect(mockElement.focus).toHaveBeenCalled()
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      })
    })

    it('should handle missing target element gracefully', () => {
      const { result } = renderHook(() => useSkipLinks(mockLinks))
      
      mockDocument.getElementById.mockReturnValue(null)
      
      expect(() => {
        act(() => {
          result.current.skipToContent('non-existent')
        })
      }).not.toThrow()
    })
  })
})