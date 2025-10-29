/**
 * Enhanced performance monitoring utilities for animations and general app performance
 * Helps track and optimize animation performance, bundle sizes, and loading times
 */

interface PerformanceMetrics {
  fps: number
  frameTime: number
  droppedFrames: number
  memoryUsage?: number
  bundleSize?: number
  loadTime?: number
  renderTime?: number
  interactionTime?: number
}

interface WebVitalsMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  cls?: number // Cumulative Layout Shift
  fid?: number // First Input Delay
  ttfb?: number // Time to First Byte
}

class EnhancedPerformanceMonitor {
  private frameCount = 0
  private lastTime = 0
  private fps = 0
  private frameTime = 0
  private droppedFrames = 0
  private isMonitoring = false
  private rafId: number | null = null
  private webVitals: WebVitalsMetrics = {}
  private observers: PerformanceObserver[] = []
  private bundleSizes: Map<string, number> = new Map()
  private loadTimes: Map<string, number> = new Map()

  start() {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.frameCount = 0
    this.lastTime = performance.now()
    this.monitor()
    this.initWebVitalsMonitoring()
    this.initResourceMonitoring()
  }

  stop() {
    this.isMonitoring = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.cleanup()
  }

  private monitor = () => {
    if (!this.isMonitoring) return

    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastTime

    this.frameCount++
    this.frameTime = deltaTime

    // Calculate FPS every second
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime)
      
      // Count dropped frames (assuming 60fps target)
      const expectedFrames = Math.round(deltaTime / 16.67) // 60fps = 16.67ms per frame
      this.droppedFrames = Math.max(0, expectedFrames - this.frameCount)
      
      this.frameCount = 0
      this.lastTime = currentTime
    }

    this.rafId = requestAnimationFrame(this.monitor)
  }

  // Initialize Web Vitals monitoring
  private initWebVitalsMonitoring() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    try {
      // Monitor paint timing (FCP)
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.webVitals.fcp = entry.startTime
          }
        })
      })
      paintObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(paintObserver)

      // Monitor LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          this.webVitals.lcp = lastEntry.startTime
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // Monitor CLS
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        let cumulativeScore = 0
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            cumulativeScore += (entry as any).value
          }
        })
        this.webVitals.cls = cumulativeScore
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)

      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.webVitals.ttfb = navEntry.responseStart - navEntry.requestStart
          }
        })
      })
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)
    } catch (error) {
      console.warn('Web Vitals monitoring not supported:', error)
    }
  }

  // Initialize resource monitoring
  private initResourceMonitoring() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming
          
          // Track bundle sizes
          if (resourceEntry.initiatorType === 'script' || resourceEntry.initiatorType === 'link') {
            this.bundleSizes.set(resourceEntry.name, resourceEntry.transferSize || 0)
          }

          // Track load times
          const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart
          this.loadTimes.set(resourceEntry.name, loadTime)

          // Log performance warnings
          if (loadTime > 2000) {
            console.warn(`⚠️ Slow resource load: ${resourceEntry.name} took ${loadTime}ms`)
          }
          
          if (resourceEntry.transferSize && resourceEntry.transferSize > 1024 * 1024) {
            console.warn(`⚠️ Large resource: ${resourceEntry.name} is ${(resourceEntry.transferSize / 1024 / 1024).toFixed(2)}MB`)
          }
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    } catch (error) {
      console.warn('Resource monitoring not supported:', error)
    }
  }

  // Cleanup observers
  private cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  getMetrics(): PerformanceMetrics {
    const memoryInfo = (performance as any).memory
    
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      droppedFrames: this.droppedFrames,
      memoryUsage: memoryInfo?.usedJSHeapSize,
      bundleSize: Array.from(this.bundleSizes.values()).reduce((sum, size) => sum + size, 0),
      loadTime: Math.max(...Array.from(this.loadTimes.values()), 0),
    }
  }

  getWebVitals(): WebVitalsMetrics {
    return { ...this.webVitals }
  }

  // Get performance summary with recommendations
  getPerformanceSummary() {
    const metrics = this.getMetrics()
    const vitals = this.getWebVitals()
    
    const recommendations: string[] = []
    
    if (metrics.fps < 55) {
      recommendations.push('Consider reducing animation complexity or enabling performance mode')
    }
    
    if (vitals.fcp && vitals.fcp > 2500) {
      recommendations.push('First Contentful Paint is slow - optimize critical resources')
    }
    
    if (vitals.lcp && vitals.lcp > 4000) {
      recommendations.push('Largest Contentful Paint is slow - optimize images and fonts')
    }
    
    if (vitals.cls && vitals.cls > 0.25) {
      recommendations.push('Cumulative Layout Shift is high - ensure proper image dimensions')
    }
    
    if (metrics.bundleSize && metrics.bundleSize > 1024 * 1024) {
      recommendations.push('Bundle size is large - consider code splitting')
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024) {
      recommendations.push('Memory usage is high - check for memory leaks')
    }

    return {
      metrics,
      vitals,
      recommendations,
      overallScore: this.calculatePerformanceScore(metrics, vitals)
    }
  }

  // Calculate overall performance score (0-100)
  private calculatePerformanceScore(metrics: PerformanceMetrics, vitals: WebVitalsMetrics): number {
    let score = 100
    
    // FPS score (30% weight)
    if (metrics.fps < 30) score -= 30
    else if (metrics.fps < 45) score -= 20
    else if (metrics.fps < 55) score -= 10
    
    // FCP score (20% weight)
    if (vitals.fcp) {
      if (vitals.fcp > 4000) score -= 20
      else if (vitals.fcp > 2500) score -= 15
      else if (vitals.fcp > 1800) score -= 10
    }
    
    // LCP score (20% weight)
    if (vitals.lcp) {
      if (vitals.lcp > 4000) score -= 20
      else if (vitals.lcp > 2500) score -= 15
      else if (vitals.lcp > 1800) score -= 10
    }
    
    // CLS score (15% weight)
    if (vitals.cls) {
      if (vitals.cls > 0.25) score -= 15
      else if (vitals.cls > 0.1) score -= 10
      else if (vitals.cls > 0.05) score -= 5
    }
    
    // Bundle size score (15% weight)
    if (metrics.bundleSize) {
      const sizeMB = metrics.bundleSize / (1024 * 1024)
      if (sizeMB > 2) score -= 15
      else if (sizeMB > 1) score -= 10
      else if (sizeMB > 0.5) score -= 5
    }
    
    return Math.max(0, Math.min(100, score))
  }

  isPerformanceGood(): boolean {
    return this.fps >= 55 && this.droppedFrames < 5
  }
}

// Global performance monitor instance
export const performanceMonitor = new EnhancedPerformanceMonitor()

// Utility to check if device can handle complex animations
export const canHandleComplexAnimations = (): boolean => {
  // Check for reduced motion preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  // Check device capabilities
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  // Basic hardware acceleration check
  if (!gl) return false

  // Check for mobile devices (generally less powerful)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (isMobile) return false

  // Check memory (if available)
  const memory = (navigator as any).deviceMemory
  if (memory && memory < 4) return false // Less than 4GB RAM

  return true
}

// Adaptive animation quality based on performance
export const getAnimationQuality = (): 'high' | 'medium' | 'low' => {
  if (!canHandleComplexAnimations()) return 'low'

  const metrics = performanceMonitor.getMetrics()
  
  if (metrics.fps >= 55 && metrics.droppedFrames < 3) return 'high'
  if (metrics.fps >= 45 && metrics.droppedFrames < 8) return 'medium'
  
  return 'low'
}

// Performance-aware animation configuration
export const getAnimationConfig = () => {
  const quality = getAnimationQuality()
  
  switch (quality) {
    case 'high':
      return {
        enableComplexAnimations: true,
        staggerDelay: 100,
        transitionDuration: 300,
        enableParallax: true,
        enableBlur: true,
      }
    case 'medium':
      return {
        enableComplexAnimations: true,
        staggerDelay: 150,
        transitionDuration: 200,
        enableParallax: false,
        enableBlur: false,
      }
    case 'low':
      return {
        enableComplexAnimations: false,
        staggerDelay: 0,
        transitionDuration: 150,
        enableParallax: false,
        enableBlur: false,
      }
  }
}

// Hook for performance-aware animations
export const usePerformanceAwareAnimations = () => {
  const config = getAnimationConfig()
  
  return {
    ...config,
    shouldAnimate: config.enableComplexAnimations,
    reducedMotion: !canHandleComplexAnimations(),
  }
}