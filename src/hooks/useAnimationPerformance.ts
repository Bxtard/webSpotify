import { useEffect, useRef, useCallback, useState } from 'react'
import { debounceHover, optimizeForAnimation, cleanupAnimation } from '../utils/animations'
import { performanceMonitor } from '../utils/performanceMonitor'

/**
 * Enhanced hook for optimizing animation performance
 * Manages will-change properties, debounced hover effects, and performance monitoring
 */
export const useAnimationPerformance = () => {
  const elementRef = useRef<HTMLElement | null>(null)
  const isAnimatingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [performanceScore, setPerformanceScore] = useState(100)
  const [isOptimized, setIsOptimized] = useState(true)

  // Check device capabilities
  const canHandleComplexAnimations = useCallback(() => {
    if (typeof window === 'undefined') return false
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false
    }

    // Check device capabilities
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) return false

    // Check for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) return false

    // Check memory if available
    const memory = (navigator as any).deviceMemory
    if (memory && memory < 4) return false

    return true
  }, [])

  // Get adaptive animation configuration
  const getAnimationConfig = useCallback(() => {
    const metrics = performanceMonitor.getMetrics()
    const summary = performanceMonitor.getPerformanceSummary()
    
    if (summary.overallScore >= 80 && metrics.fps >= 55) {
      return {
        quality: 'high' as const,
        enableComplexAnimations: true,
        enableParallax: true,
        enableBlur: true,
        transitionDuration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    } else if (summary.overallScore >= 60 && metrics.fps >= 45) {
      return {
        quality: 'medium' as const,
        enableComplexAnimations: true,
        enableParallax: false,
        enableBlur: false,
        transitionDuration: 200,
        easing: 'ease-out',
      }
    } else {
      return {
        quality: 'low' as const,
        enableComplexAnimations: false,
        enableParallax: false,
        enableBlur: false,
        transitionDuration: 150,
        easing: 'ease',
      }
    }
  }, [])

  // Monitor performance
  useEffect(() => {
    if (typeof window === 'undefined') return

    performanceMonitor.start()
    
    const checkPerformance = () => {
      const canHandle = canHandleComplexAnimations()
      const summary = performanceMonitor.getPerformanceSummary()
      
      setIsOptimized(canHandle && summary.overallScore >= 60)
      setPerformanceScore(summary.overallScore)

      if (summary.overallScore < 50) {
        console.warn('⚠️ Low performance detected, reducing animation complexity')
      }
    }

    const interval = setInterval(checkPerformance, 3000)
    checkPerformance()

    return () => clearInterval(interval)
  }, [canHandleComplexAnimations])

  // Enhanced optimize element for animations
  const prepareForAnimation = useCallback(() => {
    if (elementRef.current && !isAnimatingRef.current && isOptimized) {
      optimizeForAnimation(elementRef.current)
      isAnimatingRef.current = true
    }
  }, [isOptimized])

  // Enhanced cleanup with performance consideration
  const cleanupAfterAnimation = useCallback(() => {
    if (elementRef.current && isAnimatingRef.current) {
      const config = getAnimationConfig()
      
      timeoutRef.current = setTimeout(() => {
        if (elementRef.current) {
          cleanupAnimation(elementRef.current)
          isAnimatingRef.current = false
        }
      }, config.transitionDuration + 50)
    }
  }, [getAnimationConfig])

  // Performance-aware hover handlers
  const handleMouseEnter = useCallback(
    debounceHover(() => {
      if (isOptimized) {
        prepareForAnimation()
      }
    }, 50),
    [prepareForAnimation, isOptimized]
  )

  const handleMouseLeave = useCallback(
    debounceHover(() => {
      cleanupAfterAnimation()
    }, 100),
    [cleanupAfterAnimation]
  )

  // Measure animation performance
  const measureAnimationPerformance = useCallback((animationName: string, callback: () => void) => {
    const start = performance.now()
    
    requestAnimationFrame(() => {
      callback()
      const end = performance.now()
      
      const duration = end - start
      if (duration > 16.67) {
        console.warn(`⚠️ Slow animation: ${animationName} took ${duration.toFixed(2)}ms`)
      }
    })
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (elementRef.current && isAnimatingRef.current) {
        cleanupAnimation(elementRef.current)
      }
    }
  }, [])

  return {
    elementRef,
    handleMouseEnter,
    handleMouseLeave,
    prepareForAnimation,
    cleanupAfterAnimation,
    measureAnimationPerformance,
    isOptimized,
    performanceScore,
    animationConfig: getAnimationConfig(),
    canHandleComplexAnimations: canHandleComplexAnimations(),
  }
}

/**
 * Hook for managing intersection-based animations
 * Only animates elements when they're visible in viewport
 */
export const useIntersectionAnimation = (threshold = 0.1) => {
  const elementRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is visible, prepare for animation
            optimizeForAnimation(entry.target as HTMLElement)
            entry.target.classList.add('animate-in')
          } else {
            // Element is not visible, cleanup
            cleanupAnimation(entry.target as HTMLElement)
            entry.target.classList.remove('animate-in')
          }
        })
      },
      { threshold }
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold])

  return elementRef
}

/**
 * Hook for managing reduced motion preferences
 */
export const useReducedMotion = () => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  return prefersReducedMotion
}