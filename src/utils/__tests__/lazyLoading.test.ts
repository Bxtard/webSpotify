import { preloadImage, preloadImages, initLazyLoading } from '../lazyLoading'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

mockIntersectionObserver.mockImplementation((callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback,
}))

global.IntersectionObserver = mockIntersectionObserver

// Mock Image constructor
const mockImage = {
  onload: null as any,
  onerror: null as any,
  src: '',
}

global.Image = jest.fn(() => mockImage) as any

describe('Lazy Loading Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockImage.onload = null
    mockImage.onerror = null
    mockImage.src = ''
  })

  describe('preloadImage', () => {
    it('should preload image successfully', async () => {
      const promise = preloadImage('test.jpg')
      
      // Simulate successful load
      setTimeout(() => {
        if (mockImage.onload) mockImage.onload()
      }, 0)
      
      await expect(promise).resolves.toBeUndefined()
      expect(mockImage.src).toBe('test.jpg')
    })

    it('should handle image load error', async () => {
      const promise = preloadImage('invalid.jpg')
      
      // Simulate error
      setTimeout(() => {
        if (mockImage.onerror) mockImage.onerror(new Error('Load failed'))
      }, 0)
      
      await expect(promise).rejects.toThrow()
    })
  })

  describe('preloadImages', () => {
    it('should preload multiple images', async () => {
      const sources = ['image1.jpg', 'image2.jpg', 'image3.jpg']
      
      // Mock successful loads
      let callCount = 0
      ;(global.Image as jest.Mock).mockImplementation(() => {
        const img = {
          onload: null as any,
          onerror: null as any,
          src: '',
        }
        
        setTimeout(() => {
          if (img.onload) img.onload()
        }, 0)
        
        return img
      })
      
      await expect(preloadImages(sources)).resolves.toBeUndefined()
      expect(global.Image).toHaveBeenCalledTimes(3)
    })

    it('should handle some images failing to load', async () => {
      const sources = ['image1.jpg', 'image2.jpg']
      
      let callCount = 0
      ;(global.Image as jest.Mock).mockImplementation(() => {
        const img = {
          onload: null as any,
          onerror: null as any,
          src: '',
        }
        
        setTimeout(() => {
          if (callCount === 0) {
            if (img.onload) img.onload()
          } else {
            if (img.onerror) img.onerror(new Error('Load failed'))
          }
          callCount++
        }, 0)
        
        return img
      })
      
      // Should not throw even if some images fail
      await expect(preloadImages(sources)).resolves.toBeUndefined()
    })
  })

  describe('initLazyLoading', () => {
    it('should initialize lazy loading manager', () => {
      const manager = initLazyLoading()
      expect(manager).toBeDefined()
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })

    it('should handle missing IntersectionObserver', () => {
      const originalIO = global.IntersectionObserver
      delete (global as any).IntersectionObserver
      
      const manager = initLazyLoading()
      expect(manager).toBeDefined()
      
      global.IntersectionObserver = originalIO
    })
  })

  describe('LazyLoadManager', () => {
    let manager: any

    beforeEach(() => {
      manager = initLazyLoading()
    })

    it('should observe elements for lazy loading', () => {
      const element = document.createElement('div')
      manager.observe(element, 'testCallback')
      
      expect(mockObserve).toHaveBeenCalledWith(element)
      expect(element.dataset.lazyCallback).toBe('testCallback')
    })

    it('should observe images for lazy loading', () => {
      const img = document.createElement('img')
      manager.observeImage(img)
      
      expect(mockObserve).toHaveBeenCalledWith(img)
    })

    it('should cleanup observers', () => {
      manager.cleanup()
      expect(mockDisconnect).toHaveBeenCalled()
    })
  })
})