/**
 * Bundle analysis utilities for performance optimization
 * Helps identify large bundles and optimize loading strategies
 */

interface BundleInfo {
  name: string
  size: number
  gzipSize?: number
  loadTime: number
  isLarge: boolean
  recommendations: string[]
}

interface PerformanceReport {
  totalBundleSize: number
  largestBundles: BundleInfo[]
  recommendations: string[]
  score: number
}

// Bundle size thresholds (in bytes)
const BUNDLE_THRESHOLDS = {
  SMALL: 50 * 1024,      // 50KB
  MEDIUM: 200 * 1024,    // 200KB
  LARGE: 500 * 1024,     // 500KB
  VERY_LARGE: 1024 * 1024 // 1MB
} as const

class BundleAnalyzer {
  private static instance: BundleAnalyzer
  private bundles: Map<string, BundleInfo> = new Map()
  private observer: PerformanceObserver | null = null

  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer()
    }
    return BundleAnalyzer.instance
  }

  // Initialize bundle monitoring
  init(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            this.analyzeResource(resourceEntry)
          }
        })
      })

      this.observer.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.warn('Bundle analysis not supported:', error)
    }
  }

  // Analyze individual resource
  private analyzeResource(entry: PerformanceResourceTiming): void {
    // Focus on JavaScript and CSS bundles
    if (!this.isBundle(entry.name)) return

    const size = entry.transferSize || entry.encodedBodySize || 0
    const loadTime = entry.responseEnd - entry.requestStart
    const isLarge = size > BUNDLE_THRESHOLDS.LARGE

    const bundleInfo: BundleInfo = {
      name: this.getBundleName(entry.name),
      size,
      loadTime,
      isLarge,
      recommendations: this.generateRecommendations(size, loadTime, entry.name)
    }

    this.bundles.set(entry.name, bundleInfo)

    // Log warnings for large bundles
    if (isLarge) {
      console.warn(`⚠️ Large bundle detected: ${bundleInfo.name} (${this.formatSize(size)})`)
    }

    if (loadTime > 2000) {
      console.warn(`⚠️ Slow bundle load: ${bundleInfo.name} took ${loadTime.toFixed(0)}ms`)
    }
  }

  // Check if resource is a bundle we should analyze
  private isBundle(url: string): boolean {
    return /\.(js|css|mjs)(\?|$)/.test(url) && 
           !url.includes('node_modules') &&
           !url.includes('cdn.')
  }

  // Extract bundle name from URL
  private getBundleName(url: string): string {
    const parts = url.split('/')
    const filename = parts[parts.length - 1]
    return filename.split('?')[0] || 'unknown'
  }

  // Generate optimization recommendations
  private generateRecommendations(size: number, loadTime: number, url: string): string[] {
    const recommendations: string[] = []

    if (size > BUNDLE_THRESHOLDS.VERY_LARGE) {
      recommendations.push('Consider code splitting this bundle')
      recommendations.push('Implement dynamic imports for non-critical code')
    } else if (size > BUNDLE_THRESHOLDS.LARGE) {
      recommendations.push('Consider lazy loading this bundle')
      recommendations.push('Review bundle contents for unused code')
    }

    if (loadTime > 3000) {
      recommendations.push('Enable compression (gzip/brotli)')
      recommendations.push('Consider using a CDN')
    } else if (loadTime > 1500) {
      recommendations.push('Optimize bundle loading priority')
    }

    if (url.includes('vendor') || url.includes('chunk')) {
      recommendations.push('Ensure proper caching headers are set')
    }

    if (size > BUNDLE_THRESHOLDS.MEDIUM && !url.includes('main')) {
      recommendations.push('Consider preloading if critical to user experience')
    }

    return recommendations
  }

  // Format file size for display
  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  // Get performance report
  getReport(): PerformanceReport {
    const bundles = Array.from(this.bundles.values())
    const totalBundleSize = bundles.reduce((sum, bundle) => sum + bundle.size, 0)
    const largestBundles = bundles
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)

    const recommendations = this.generateGlobalRecommendations(bundles, totalBundleSize)
    const score = this.calculatePerformanceScore(bundles, totalBundleSize)

    return {
      totalBundleSize,
      largestBundles,
      recommendations,
      score
    }
  }

  // Generate global recommendations
  private generateGlobalRecommendations(bundles: BundleInfo[], totalSize: number): string[] {
    const recommendations: string[] = []
    const largeBundles = bundles.filter(b => b.isLarge)

    if (totalSize > 2 * 1024 * 1024) { // 2MB
      recommendations.push('Total bundle size is very large - implement aggressive code splitting')
    } else if (totalSize > 1024 * 1024) { // 1MB
      recommendations.push('Consider reducing total bundle size through tree shaking')
    }

    if (largeBundles.length > 3) {
      recommendations.push('Multiple large bundles detected - review bundling strategy')
    }

    const slowBundles = bundles.filter(b => b.loadTime > 2000)
    if (slowBundles.length > 0) {
      recommendations.push('Some bundles are loading slowly - check network optimization')
    }

    if (bundles.length > 20) {
      recommendations.push('Many small bundles detected - consider bundle consolidation')
    }

    return recommendations
  }

  // Calculate performance score (0-100)
  private calculatePerformanceScore(bundles: BundleInfo[], totalSize: number): number {
    let score = 100

    // Penalize large total size
    if (totalSize > 2 * 1024 * 1024) score -= 30
    else if (totalSize > 1024 * 1024) score -= 20
    else if (totalSize > 500 * 1024) score -= 10

    // Penalize large individual bundles
    const largeBundles = bundles.filter(b => b.isLarge)
    score -= largeBundles.length * 10

    // Penalize slow loading bundles
    const slowBundles = bundles.filter(b => b.loadTime > 2000)
    score -= slowBundles.length * 5

    // Penalize too many bundles
    if (bundles.length > 20) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  // Get bundle information
  getBundleInfo(name: string): BundleInfo | undefined {
    return Array.from(this.bundles.values()).find(bundle => 
      bundle.name.includes(name) || name.includes(bundle.name)
    )
  }

  // Clear collected data
  clear(): void {
    this.bundles.clear()
  }

  // Cleanup
  cleanup(): void {
    this.observer?.disconnect()
    this.observer = null
    this.bundles.clear()
  }
}

// Utility functions
export const initBundleAnalysis = (): BundleAnalyzer => {
  const analyzer = BundleAnalyzer.getInstance()
  analyzer.init()
  return analyzer
}

export const getBundleReport = (): PerformanceReport => {
  const analyzer = BundleAnalyzer.getInstance()
  return analyzer.getReport()
}

export const analyzeBundlePerformance = (): void => {
  const report = getBundleReport()
  
  console.group('📦 Bundle Performance Report')
  console.log(`Total Bundle Size: ${formatBytes(report.totalBundleSize)}`)
  console.log(`Performance Score: ${report.score}/100`)
  
  if (report.largestBundles.length > 0) {
    console.group('Largest Bundles:')
    report.largestBundles.slice(0, 5).forEach(bundle => {
      console.log(`${bundle.name}: ${formatBytes(bundle.size)} (${bundle.loadTime.toFixed(0)}ms)`)
    })
    console.groupEnd()
  }
  
  if (report.recommendations.length > 0) {
    console.group('Recommendations:')
    report.recommendations.forEach(rec => console.log(`• ${rec}`))
    console.groupEnd()
  }
  
  console.groupEnd()
}

// Helper function to format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Export the analyzer instance
export const bundleAnalyzer = BundleAnalyzer.getInstance()