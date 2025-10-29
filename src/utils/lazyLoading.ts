/**
 * Lazy loading utilities for images and components
 * Optimizes performance by loading resources only when needed
 */

// Intersection Observer for lazy loading
class LazyLoadManager {
  private static instance: LazyLoadManager
  private observer: IntersectionObserver | null = null
  private imageObserver: IntersectionObserver | null = null

  static getInstance(): LazyLoadManager {
    if (!LazyLoadManager.instance) {
      LazyLoadManager.instance = new LazyLoadManager()
    }
    return LazyLoadManager.instance
  }

  // Initialize lazy loading observers
  init() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    // Observer for general lazy loading
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const callback = element.dataset.lazyCallback
            
            if (callback && (window as any)[callback]) {
              (window as any)[callback](element)
            }
            
            this.observer?.unobserve(element)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )

    // Specialized observer for images
    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImage(img)
            this.imageObserver?.unobserve(img)
          }
        })
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    )
  }

  // Observe element for lazy loading
  observe(element: HTMLElement, callback?: string) {
    if (!this.observer) return

    if (callback) {
      element.dataset.lazyCallback = callback
    }
    
    this.observer.observe(element)
  }

  // Observe image for lazy loading
  observeImage(img: HTMLImageElement) {
    if (!this.imageObserver) return
    this.imageObserver.observe(img)
  }

  // Load image with progressive enhancement
  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    const srcset = img.dataset.srcset
    
    if (!src) return

    // Create a new image to preload
    const imageLoader = new Image()
    
    imageLoader.onload = () => {
      // Apply loaded image
      img.src = src
      if (srcset) {
        img.srcset = srcset
      }
      
      // Add loaded class for CSS transitions
      img.classList.add('lazy-loaded')
      
      // Remove loading placeholder
      img.classList.remove('lazy-loading')
    }
    
    imageLoader.onerror = () => {
      // Handle error - show fallback
      img.classList.add('lazy-error')
      img.classList.remove('lazy-loading')
    }
    
    // Start loading
    img.classList.add('lazy-loading')
    imageLoader.src = src
  }

  // Cleanup observers
  cleanup() {
    this.observer?.disconnect()
    this.imageObserver?.disconnect()
    this.observer = null
    this.imageObserver = null
  }
}

// Hook for lazy loading images
export const useLazyImage = (src: string, options?: {
  placeholder?: string
  threshold?: number
  rootMargin?: string
}) => {
  const imgRef = React.useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    const img = imgRef.current
    if (!img || !src) return

    const manager = LazyLoadManager.getInstance()
    manager.init()

    // Set up lazy loading attributes
    img.dataset.src = src
    img.src = options?.placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGNUY1RjUiLz48L3N2Zz4='
    
    // Custom observer for this specific image
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageLoader = new Image()
            
            imageLoader.onload = () => {
              if (img) {
                img.src = src
                setLoaded(true)
              }
            }
            
            imageLoader.onerror = () => {
              setError(true)
            }
            
            imageLoader.src = src
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: options?.rootMargin || '100px 0px',
        threshold: options?.threshold || 0.1
      }
    )

    observer.observe(img)

    return () => {
      observer.disconnect()
    }
  }, [src, options])

  return {
    imgRef,
    loaded,
    error,
    imgProps: {
      ref: imgRef,
      className: `lazy-image ${loaded ? 'lazy-loaded' : ''} ${error ? 'lazy-error' : ''}`,
      loading: 'lazy' as const
    }
  }
}

// Hook for lazy loading components
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const [Component, setComponent] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const loadComponent = React.useCallback(async () => {
    if (Component || loading) return

    setLoading(true)
    setError(null)

    try {
      const componentModule = await importFn()
      setComponent(() => componentModule.default)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [importFn, Component, loading])

  return {
    Component,
    loading,
    error,
    loadComponent,
    LazyWrapper: React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(function LazyWrapper(props, ref) {
      const elementRef = React.useRef<HTMLDivElement>(null)

      React.useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                loadComponent()
                observer.unobserve(element)
              }
            })
          },
          {
            rootMargin: '200px 0px',
            threshold: 0.1
          }
        )

        observer.observe(element)

        return () => {
          observer.disconnect()
        }
      }, [])

      return React.createElement('div', { ref: elementRef },
        Component ? React.createElement(Component, props) :
        loading ? (fallback ? React.createElement(fallback) : React.createElement('div', null, 'Loading...')) :
        error ? React.createElement('div', null, 'Error loading component') :
        React.createElement('div', null, 'Component will load when visible')
      )
    })
  }
}

// Utility for preloading critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// Utility for preloading multiple images
export const preloadImages = async (sources: string[]): Promise<void> => {
  try {
    await Promise.all(sources.map(preloadImage))
  } catch (error) {
    console.warn('Some images failed to preload:', error)
  }
}

// Initialize lazy loading manager
export const initLazyLoading = () => {
  const manager = LazyLoadManager.getInstance()
  manager.init()
  return manager
}

// React import for hooks
import React from 'react'