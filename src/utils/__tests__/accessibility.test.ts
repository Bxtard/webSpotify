import {
  calculateContrastRatio,
  isWCAGAACompliant,
  FocusManager,
  announceToScreenReader,
  handleKeyboardNavigation,
  generateId,
  createAriaLabel,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkMode
} from '../accessibility'

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
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
} as any

// Mock window.matchMedia
const mockMatchMedia = jest.fn()

beforeAll(() => {
  global.document = mockDocument
  global.window = {
    matchMedia: mockMatchMedia,
  } as any
})

describe('Accessibility Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({ matches: false })
  })

  describe('calculateContrastRatio', () => {
    it('should calculate correct contrast ratio for black and white', () => {
      const ratio = calculateContrastRatio('#000000', '#ffffff')
      expect(ratio).toBeCloseTo(21, 1)
    })

    it('should calculate correct contrast ratio for same colors', () => {
      const ratio = calculateContrastRatio('#ff0000', '#ff0000')
      expect(ratio).toBe(1)
    })

    it('should handle colors without # prefix', () => {
      const ratio = calculateContrastRatio('000000', 'ffffff')
      expect(ratio).toBeCloseTo(21, 1)
    })
  })

  describe('isWCAGAACompliant', () => {
    it('should return true for compliant color combinations', () => {
      expect(isWCAGAACompliant('#000000', '#ffffff')).toBe(true)
      expect(isWCAGAACompliant('#ffffff', '#000000')).toBe(true)
    })

    it('should return false for non-compliant color combinations', () => {
      expect(isWCAGAACompliant('#ffff00', '#ffffff')).toBe(false)
    })

    it('should use different threshold for large text', () => {
      // This combination might pass for large text but not regular text
      const foreground = '#767676'
      const background = '#ffffff'
      
      expect(isWCAGAACompliant(foreground, background, false)).toBe(false)
      expect(isWCAGAACompliant(foreground, background, true)).toBe(true)
    })
  })

  describe('FocusManager', () => {
    beforeEach(() => {
      mockElement.querySelectorAll.mockReturnValue([
        { focus: jest.fn() },
        { focus: jest.fn() },
        { focus: jest.fn() }
      ])
    })

    describe('getFocusableElements', () => {
      it('should find focusable elements', () => {
        const elements = FocusManager.getFocusableElements(mockElement)
        expect(mockElement.querySelectorAll).toHaveBeenCalledWith(
          expect.stringContaining('a[href]')
        )
        expect(elements).toHaveLength(3)
      })
    })

    describe('trapFocus', () => {
      it('should set up focus trap', () => {
        const cleanup = FocusManager.trapFocus(mockElement)
        
        expect(mockElement.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
        expect(typeof cleanup).toBe('function')
        
        cleanup()
        expect(mockElement.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
      })
    })

    describe('restoreFocus', () => {
      it('should restore focus to element', () => {
        const element = { focus: jest.fn() }
        FocusManager.restoreFocus(element as any)
        expect(element.focus).toHaveBeenCalled()
      })

      it('should handle null element gracefully', () => {
        expect(() => FocusManager.restoreFocus(null)).not.toThrow()
      })
    })
  })

  describe('announceToScreenReader', () => {
    it('should create announcement element', () => {
      announceToScreenReader('Test message')
      
      expect(mockDocument.createElement).toHaveBeenCalledWith('div')
      expect(mockDocument.body.appendChild).toHaveBeenCalled()
    })

    it('should set correct aria attributes', () => {
      announceToScreenReader('Test message', 'assertive')
      
      const element = mockDocument.createElement.mock.results[0].value
      expect(element.setAttribute).toHaveBeenCalledWith('aria-live', 'assertive')
      expect(element.setAttribute).toHaveBeenCalledWith('aria-atomic', 'true')
    })
  })

  describe('handleKeyboardNavigation', () => {
    const mockEvent = {
      key: 'Enter',
      preventDefault: jest.fn(),
    } as any

    const mockHandlers = {
      onEnter: jest.fn(),
      onSpace: jest.fn(),
      onEscape: jest.fn(),
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should handle Enter key', () => {
      mockEvent.key = 'Enter'
      handleKeyboardNavigation(mockEvent, mockHandlers)
      
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockHandlers.onEnter).toHaveBeenCalled()
    })

    it('should handle Space key', () => {
      mockEvent.key = ' '
      handleKeyboardNavigation(mockEvent, mockHandlers)
      
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockHandlers.onSpace).toHaveBeenCalled()
    })

    it('should handle Escape key', () => {
      mockEvent.key = 'Escape'
      handleKeyboardNavigation(mockEvent, mockHandlers)
      
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockHandlers.onEscape).toHaveBeenCalled()
    })

    it('should not call handler for unhandled keys', () => {
      mockEvent.key = 'Tab'
      handleKeyboardNavigation(mockEvent, mockHandlers)
      
      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
      expect(mockHandlers.onEnter).not.toHaveBeenCalled()
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^element-/)
    })

    it('should use custom prefix', () => {
      const id = generateId('custom')
      expect(id).toMatch(/^custom-/)
    })
  })

  describe('createAriaLabel', () => {
    it('should create simple aria label', () => {
      const label = createAriaLabel('Button text')
      expect(label).toBe('Button text')
    })

    it('should create aria label with context', () => {
      const label = createAriaLabel('Delete', 'item 1')
      expect(label).toBe('Delete, item 1')
    })
  })

  describe('Media query preferences', () => {
    it('should detect reduced motion preference', () => {
      mockMatchMedia.mockReturnValue({ matches: true })
      expect(prefersReducedMotion()).toBe(true)
      
      mockMatchMedia.mockReturnValue({ matches: false })
      expect(prefersReducedMotion()).toBe(false)
    })

    it('should detect high contrast preference', () => {
      mockMatchMedia.mockReturnValue({ matches: true })
      expect(prefersHighContrast()).toBe(true)
      
      mockMatchMedia.mockReturnValue({ matches: false })
      expect(prefersHighContrast()).toBe(false)
    })

    it('should detect dark mode preference', () => {
      mockMatchMedia.mockReturnValue({ matches: true })
      expect(prefersDarkMode()).toBe(true)
      
      mockMatchMedia.mockReturnValue({ matches: false })
      expect(prefersDarkMode()).toBe(false)
    })

    it('should handle missing window object', () => {
      const originalWindow = global.window
      delete (global as any).window
      
      expect(prefersReducedMotion()).toBe(false)
      expect(prefersHighContrast()).toBe(false)
      expect(prefersDarkMode()).toBe(false)
      
      global.window = originalWindow
    })
  })
})