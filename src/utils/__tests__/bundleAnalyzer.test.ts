import { initBundleAnalysis, getBundleReport, analyzeBundlePerformance, bundleAnalyzer } from '../bundleAnalyzer'

// Mock PerformanceObserver
const mockPerformanceObserver = jest.fn()
const mockObserve = jest.fn()
const mockDisconnect = jest.fn()

mockPerformanceObserver.mockImplementation((callback) => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  callback,
}))

global.PerformanceObserver = mockPerformanceObserver

// Mock console methods
const mockConsole = {
  warn: jest.fn(),
  log: jest.fn(),
  group: jest.fn(),
  groupEnd: jest.fn(),
}

global.console = mockConsole as any

describe('Bundle Analyzer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    bundleAnalyzer.clear()
  })

  describe('initBundleAnalysis', () => {
    it('should initialize bundle analysis', () => {
      const analyzer = initBundleAnalysis()
      
      expect(analyzer).toBeDefined()
      expect(mockPerformanceObserver).toHaveBeenCalled()
      expect(mockObserve).toHaveBeenCalledWith({ entryTypes: ['resource'] })
    })

    it('should handle missing PerformanceObserver', () => {
      const originalPO = global.PerformanceObserver
      delete (global as any).PerformanceObserver
      
      const analyzer = initBundleAnalysis()
      expect(analyzer).toBeDefined()
      
      global.PerformanceObserver = originalPO
    })
  })

  describe('Bundle Analysis', () => {
    let analyzer: any

    beforeEach(() => {
      analyzer = initBundleAnalysis()
    })

    it('should analyze JavaScript bundles', () => {
      const mockEntry = {
        entryType: 'resource',
        name: 'https://example.com/main.js',
        transferSize: 500000, // 500KB
        encodedBodySize: 500000,
        responseEnd: 2000,
        requestStart: 0,
      }

      // Simulate resource entry
      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => [mockEntry]
      })

      const report = getBundleReport()
      expect(report.largestBundles).toHaveLength(1)
      expect(report.largestBundles[0].name).toBe('main.js')
      expect(report.largestBundles[0].size).toBe(500000)
    })

    it('should analyze CSS bundles', () => {
      const mockEntry = {
        entryType: 'resource',
        name: 'https://example.com/styles.css',
        transferSize: 100000, // 100KB
        encodedBodySize: 100000,
        responseEnd: 1000,
        requestStart: 0,
      }

      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => [mockEntry]
      })

      const report = getBundleReport()
      expect(report.largestBundles).toHaveLength(1)
      expect(report.largestBundles[0].name).toBe('styles.css')
    })

    it('should ignore non-bundle resources', () => {
      const mockEntries = [
        {
          entryType: 'resource',
          name: 'https://example.com/image.jpg',
          transferSize: 1000000,
          responseEnd: 1000,
          requestStart: 0,
        },
        {
          entryType: 'resource',
          name: 'https://cdn.example.com/library.js',
          transferSize: 500000,
          responseEnd: 1000,
          requestStart: 0,
        }
      ]

      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => mockEntries
      })

      const report = getBundleReport()
      expect(report.largestBundles).toHaveLength(0)
    })

    it('should generate warnings for large bundles', () => {
      const mockEntry = {
        entryType: 'resource',
        name: 'https://example.com/large-bundle.js',
        transferSize: 2000000, // 2MB - very large
        encodedBodySize: 2000000,
        responseEnd: 1000,
        requestStart: 0,
      }

      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => [mockEntry]
      })

      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('Large bundle detected')
      )
    })

    it('should generate warnings for slow loading bundles', () => {
      const mockEntry = {
        entryType: 'resource',
        name: 'https://example.com/slow-bundle.js',
        transferSize: 100000,
        encodedBodySize: 100000,
        responseEnd: 3000, // 3 seconds - slow
        requestStart: 0,
      }

      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => [mockEntry]
      })

      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('Slow bundle load')
      )
    })
  })

  describe('Performance Report', () => {
    it('should generate comprehensive report', () => {
      const analyzer = initBundleAnalysis()
      
      // Add some mock bundles
      const mockEntries = [
        {
          entryType: 'resource',
          name: 'https://example.com/main.js',
          transferSize: 800000,
          responseEnd: 1500,
          requestStart: 0,
        },
        {
          entryType: 'resource',
          name: 'https://example.com/vendor.js',
          transferSize: 600000,
          responseEnd: 1200,
          requestStart: 0,
        },
        {
          entryType: 'resource',
          name: 'https://example.com/styles.css',
          transferSize: 50000,
          responseEnd: 500,
          requestStart: 0,
        }
      ]

      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => mockEntries
      })

      const report = getBundleReport()
      
      expect(report.totalBundleSize).toBe(1450000)
      expect(report.largestBundles).toHaveLength(3)
      expect(report.largestBundles[0].name).toBe('main.js') // Largest first
      expect(report.score).toBeGreaterThan(0)
      expect(report.score).toBeLessThanOrEqual(100)
      expect(Array.isArray(report.recommendations)).toBe(true)
    })

    it('should calculate performance score correctly', () => {
      const analyzer = initBundleAnalysis()
      
      // Small, fast bundles should get high score
      const smallBundles = [
        {
          entryType: 'resource',
          name: 'https://example.com/small.js',
          transferSize: 50000, // 50KB
          responseEnd: 500,    // 500ms
          requestStart: 0,
        }
      ]

      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => smallBundles
      })

      const report = getBundleReport()
      expect(report.score).toBeGreaterThan(80)
    })

    it('should provide relevant recommendations', () => {
      const analyzer = initBundleAnalysis()
      
      // Large, slow bundle
      const largeBundles = [
        {
          entryType: 'resource',
          name: 'https://example.com/huge.js',
          transferSize: 3000000, // 3MB
          responseEnd: 5000,     // 5 seconds
          requestStart: 0,
        }
      ]

      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => largeBundles
      })

      const report = getBundleReport()
      expect(report.recommendations).toContain(
        expect.stringContaining('code splitting')
      )
    })
  })

  describe('analyzeBundlePerformance', () => {
    it('should log performance analysis to console', () => {
      analyzeBundlePerformance()
      
      expect(mockConsole.group).toHaveBeenCalledWith('📦 Bundle Performance Report')
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Total Bundle Size')
      )
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Performance Score')
      )
      expect(mockConsole.groupEnd).toHaveBeenCalled()
    })
  })

  describe('Bundle Info', () => {
    it('should get specific bundle information', () => {
      const analyzer = initBundleAnalysis()
      
      const mockEntry = {
        entryType: 'resource',
        name: 'https://example.com/specific-bundle.js',
        transferSize: 200000,
        responseEnd: 1000,
        requestStart: 0,
      }

      const callback = mockPerformanceObserver.mock.calls[0][0]
      callback({
        getEntries: () => [mockEntry]
      })

      const bundleInfo = analyzer.getBundleInfo('specific-bundle')
      expect(bundleInfo).toBeDefined()
      expect(bundleInfo?.name).toBe('specific-bundle.js')
      expect(bundleInfo?.size).toBe(200000)
    })

    it('should return undefined for non-existent bundle', () => {
      const analyzer = initBundleAnalysis()
      const bundleInfo = analyzer.getBundleInfo('non-existent')
      expect(bundleInfo).toBeUndefined()
    })
  })

  describe('Cleanup', () => {
    it('should cleanup observers and data', () => {
      const analyzer = initBundleAnalysis()
      analyzer.cleanup()
      
      expect(mockDisconnect).toHaveBeenCalled()
      
      const report = getBundleReport()
      expect(report.largestBundles).toHaveLength(0)
    })
  })
})