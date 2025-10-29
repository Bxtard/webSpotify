import { useEffect, useState, useRef, useCallback } from 'react'
import { 
  FocusManager, 
  announceToScreenReader, 
  prefersReducedMotion, 
  prefersHighContrast,
  prefersDarkMode 
} from '../utils/accessibility'

// Hook for managing focus trap
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Set up focus trap
    const cleanup = FocusManager.trapFocus(containerRef.current)

    return () => {
      cleanup()
      // Restore focus when trap is deactivated
      FocusManager.restoreFocus(previousFocusRef.current)
    }
  }, [isActive])

  return containerRef
}

// Hook for screen reader announcements
export const useScreenReader = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }, [])

  return { announce }
}

// Hook for accessibility preferences
export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    darkMode: false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updatePreferences = () => {
      setPreferences({
        reducedMotion: prefersReducedMotion(),
        highContrast: prefersHighContrast(),
        darkMode: prefersDarkMode()
      })
    }

    // Initial check
    updatePreferences()

    // Listen for changes
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)')
    ]

    mediaQueries.forEach(mq => mq.addEventListener('change', updatePreferences))

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updatePreferences))
    }
  }, [])

  return preferences
}

// Hook for keyboard navigation
export const useKeyboardNavigation = (
  handlers: {
    onEnter?: () => void
    onSpace?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
  },
  dependencies: any[] = []
) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          if (handlers.onEnter) {
            event.preventDefault()
            handlers.onEnter()
          }
          break
        case ' ':
          if (handlers.onSpace) {
            event.preventDefault()
            handlers.onSpace()
          }
          break
        case 'Escape':
          if (handlers.onEscape) {
            event.preventDefault()
            handlers.onEscape()
          }
          break
        case 'ArrowUp':
          if (handlers.onArrowUp) {
            event.preventDefault()
            handlers.onArrowUp()
          }
          break
        case 'ArrowDown':
          if (handlers.onArrowDown) {
            event.preventDefault()
            handlers.onArrowDown()
          }
          break
        case 'ArrowLeft':
          if (handlers.onArrowLeft) {
            event.preventDefault()
            handlers.onArrowLeft()
          }
          break
        case 'ArrowRight':
          if (handlers.onArrowRight) {
            event.preventDefault()
            handlers.onArrowRight()
          }
          break
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    return () => element.removeEventListener('keydown', handleKeyDown)
  }, [handlers, ...dependencies])

  return elementRef
}

// Hook for managing ARIA live regions
export const useAriaLiveRegion = () => {
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite')

  const announce = useCallback((newMessage: string, newPriority: 'polite' | 'assertive' = 'polite') => {
    setMessage(newMessage)
    setPriority(newPriority)
    
    // Clear message after announcement
    setTimeout(() => setMessage(''), 100)
  }, [])

  return {
    message,
    priority,
    announce,
    ariaLiveProps: {
      'aria-live': priority,
      'aria-atomic': true,
      className: 'sr-only'
    }
  }
}

// Hook for skip links
export const useSkipLinks = (links: Array<{ id: string; label: string }>) => {
  const skipToContent = useCallback((targetId: string) => {
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return {
    skipToContent,
    skipLinks: links.map(link => ({
      ...link,
      onClick: () => skipToContent(link.id)
    }))
  }
}