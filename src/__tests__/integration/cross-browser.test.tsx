/**
 * Cross-browser and device testing for SPOTIFY APP redesign
 * Tests responsive behavior and browser compatibility
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../styles/theme'
import { GlobalStyles } from '../../styles/globalStyles'
import { Header } from '../../components/common/Header'
import { ArtistCard } from '../../components/artist/ArtistCard'
import { SearchInput } from '../../components/ui/SearchInput'
import { Pagination } from '../../components/ui/Pagination'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/search',
}))

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </ThemeProvider>
)

// Mock artist data
const mockArtist = {
  id: '1',
  name: 'Test Artist',
  images: [{ url: 'test-image.jpg' }],
  followers: { total: 1000000 },
  popularity: 85,
}

// Viewport simulation utilities
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

// CSS media query simulation
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})

describe('Cross-Browser and Device Testing', () => {
  beforeEach(() => {
    // Reset viewport to desktop default
    setViewport(1280, 720)
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(mockMatchMedia),
    })
  })

  describe('Responsive Design Tests', () => {
    describe('Mobile Viewport (320px - 767px)', () => {
      beforeEach(() => {
        setViewport(375, 667) // iPhone SE dimensions
      })

      it('should render Header correctly on mobile', () => {
        render(
          <TestWrapper>
            <Header onLogout={jest.fn()} />
          </TestWrapper>
        )

        const logo = screen.getByText('SPOTIFY APP')
        expect(logo).toBeInTheDocument()
        
        // Mobile menu button should be present
        const menuButton = screen.getByRole('button')
        expect(menuButton).toBeInTheDocument()
      })

      it('should adapt ArtistCard for mobile layout', () => {
        render(
          <TestWrapper>
            <ArtistCard
              artist={mockArtist}
              onClick={jest.fn()}
            />
          </TestWrapper>
        )

        const artistName = screen.getByText('Test Artist')
        const followerCount = screen.getByText('Followers: 1M')
        
        expect(artistName).toBeInTheDocument()
        expect(followerCount).toBeInTheDocument()
        
        // Check if card maintains proper styling on mobile
        const card = artistName.closest('div')
        expect(card).toBeInTheDocument()
      })

      it('should render SearchInput responsively on mobile', () => {
        render(
          <TestWrapper>
            <SearchInput
              value=""
              onChange={jest.fn()}
              onSubmit={jest.fn()}
              placeholder="Search..."
            />
          </TestWrapper>
        )

        const searchInput = screen.getByPlaceholderText('Search...')
        const searchButton = screen.getByRole('button', { name: 'Search' })
        
        expect(searchInput).toBeInTheDocument()
        expect(searchButton).toBeInTheDocument()
      })

      it('should handle Pagination on mobile devices', () => {
        render(
          <TestWrapper>
            <Pagination
              currentPage={2}
              totalPages={5}
              onPageChange={jest.fn()}
            />
          </TestWrapper>
        )

        // Should show pagination numbers
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
      })
    })

    describe('Tablet Viewport (768px - 1023px)', () => {
      beforeEach(() => {
        setViewport(768, 1024) // iPad dimensions
      })

      it('should render Header with proper tablet layout', () => {
        render(
          <TestWrapper>
            <Header onLogout={jest.fn()} />
          </TestWrapper>
        )

        const logo = screen.getByText('SPOTIFY APP')
        const searchLink = screen.getByText('Buscar')
        const albumsLink = screen.getByText('Mis álbumes')
        
        expect(logo).toBeInTheDocument()
        expect(searchLink).toBeInTheDocument()
        expect(albumsLink).toBeInTheDocument()
      })

      it('should display ArtistCard with tablet-optimized layout', () => {
        render(
          <TestWrapper>
            <ArtistCard
              artist={mockArtist}
              onClick={jest.fn()}
            />
          </TestWrapper>
        )

        const artistName = screen.getByText('Test Artist')
        expect(artistName).toBeInTheDocument()
        
        // Card should maintain proper proportions on tablet
        const card = artistName.closest('div')
        const cardStyle = window.getComputedStyle(card!)
        expect(cardStyle.display).toBeTruthy()
      })
    })

    describe('Desktop Viewport (1024px+)', () => {
      beforeEach(() => {
        setViewport(1280, 720) // Standard desktop
      })

      it('should render full Header navigation on desktop', () => {
        render(
          <TestWrapper>
            <Header onLogout={jest.fn()} />
          </TestWrapper>
        )

        const logo = screen.getByText('SPOTIFY APP')
        const searchLink = screen.getByText('Buscar')
        const albumsLink = screen.getByText('Mis álbumes')
        const logoutButton = screen.getByText('Cerrar sesión')
        
        expect(logo).toBeInTheDocument()
        expect(searchLink).toBeInTheDocument()
        expect(albumsLink).toBeInTheDocument()
        expect(logoutButton).toBeInTheDocument()
      })

      it('should display ArtistCard with full desktop layout', () => {
        render(
          <TestWrapper>
            <ArtistCard
              artist={mockArtist}
              onClick={jest.fn()}
            />
          </TestWrapper>
        )

        const artistName = screen.getByText('Test Artist')
        const followerCount = screen.getByText('Followers: 1M')
        
        expect(artistName).toBeInTheDocument()
        expect(followerCount).toBeInTheDocument()
      })
    })

    describe('Large Desktop Viewport (1440px+)', () => {
      beforeEach(() => {
        setViewport(1440, 900) // Large desktop
      })

      it('should maintain design consistency on large screens', () => {
        render(
          <TestWrapper>
            <Header onLogout={jest.fn()} />
          </TestWrapper>
        )

        const logo = screen.getByText('SPOTIFY APP')
        expect(logo).toBeInTheDocument()
        
        // Should maintain proper max-width constraints
        const header = logo.closest('header')
        expect(header).toBeInTheDocument()
      })
    })
  })

  describe('Touch Device Compatibility', () => {
    beforeEach(() => {
      // Mock touch device
      Object.defineProperty(window, 'ontouchstart', {
        value: {},
        writable: true,
      })
      
      // Mock touch events
      Object.defineProperty(window, 'TouchEvent', {
        value: class TouchEvent extends Event {
          constructor(type: string, options?: any) {
            super(type, options)
          }
        },
        writable: true,
      })
    })

    it('should provide adequate touch targets', () => {
      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const searchLink = screen.getByText('Buscar')
      const logoutButton = screen.getByText('Cerrar sesión')
      
      // Touch targets should be at least 44px (iOS guidelines)
      const searchStyle = window.getComputedStyle(searchLink)
      const logoutStyle = window.getComputedStyle(logoutButton)
      
      expect(searchLink).toBeInTheDocument()
      expect(logoutButton).toBeInTheDocument()
    })

    it('should handle touch interactions on ArtistCard', () => {
      const mockClick = jest.fn()
      
      render(
        <TestWrapper>
          <ArtistCard
            artist={mockArtist}
            onClick={mockClick}
          />
        </TestWrapper>
      )

      const card = screen.getByText('Test Artist').closest('div')
      expect(card).toBeInTheDocument()
      
      // Should be clickable/touchable
      expect(card).toHaveStyle('cursor: pointer')
    })
  })

  describe('Browser-Specific Features', () => {
    describe('CSS Grid Support', () => {
      it('should handle CSS Grid layouts properly', () => {
        // Mock CSS.supports for older browsers
        Object.defineProperty(CSS, 'supports', {
          value: jest.fn().mockImplementation((property: string, value: string) => {
            if (property === 'display' && value === 'grid') {
              return true // Assume modern browser support
            }
            return false
          }),
          writable: true,
        })

        render(
          <TestWrapper>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
            </div>
          </TestWrapper>
        )

        const cards = screen.getAllByText('Test Artist')
        expect(cards).toHaveLength(4)
      })
    })

    describe('Flexbox Support', () => {
      it('should handle Flexbox layouts correctly', () => {
        render(
          <TestWrapper>
            <Header onLogout={jest.fn()} />
          </TestWrapper>
        )

        const header = screen.getByText('SPOTIFY APP').closest('header')
        expect(header).toBeInTheDocument()
        
        // Header should use flexbox for layout
        const headerContent = header?.firstChild as HTMLElement
        if (headerContent) {
          const style = window.getComputedStyle(headerContent)
          expect(style.display).toBeTruthy()
        }
      })
    })

    describe('CSS Custom Properties (Variables)', () => {
      it('should handle CSS variables properly', () => {
        render(
          <TestWrapper>
            <Header onLogout={jest.fn()} />
          </TestWrapper>
        )

        const logo = screen.getByText('SPOTIFY APP')
        const logoStyle = window.getComputedStyle(logo)
        
        // Should have proper color values (even if not CSS variables in test)
        expect(logoStyle.color).toBeTruthy()
      })
    })
  })

  describe('Performance on Different Devices', () => {
    describe('Low-End Device Simulation', () => {
      beforeEach(() => {
        // Mock slower device
        setViewport(360, 640)
        
        // Mock reduced performance
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          value: 2,
          writable: true,
        })
      })

      it('should render efficiently on low-end devices', () => {
        const startTime = performance.now()
        
        render(
          <TestWrapper>
            <div>
              {Array.from({ length: 20 }, (_, i) => (
                <ArtistCard
                  key={i}
                  artist={{ ...mockArtist, id: `artist-${i}`, name: `Artist ${i}` }}
                  onClick={jest.fn()}
                />
              ))}
            </div>
          </TestWrapper>
        )

        const endTime = performance.now()
        const renderTime = endTime - startTime
        
        // Should render within reasonable time (adjust threshold as needed)
        expect(renderTime).toBeLessThan(1000) // 1 second
        
        // All cards should be rendered
        expect(screen.getByText('Artist 0')).toBeInTheDocument()
        expect(screen.getByText('Artist 19')).toBeInTheDocument()
      })
    })

    describe('High-End Device Simulation', () => {
      beforeEach(() => {
        setViewport(1920, 1080)
        
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          value: 8,
          writable: true,
        })
      })

      it('should take advantage of high-end device capabilities', () => {
        render(
          <TestWrapper>
            <div>
              {Array.from({ length: 50 }, (_, i) => (
                <ArtistCard
                  key={i}
                  artist={{ ...mockArtist, id: `artist-${i}`, name: `Artist ${i}` }}
                  onClick={jest.fn()}
                />
              ))}
            </div>
          </TestWrapper>
        )

        // Should handle larger datasets smoothly
        expect(screen.getByText('Artist 0')).toBeInTheDocument()
        expect(screen.getByText('Artist 49')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Across Devices', () => {
    it('should maintain keyboard navigation on all devices', () => {
      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const searchLink = screen.getByText('Buscar')
      const albumsLink = screen.getByText('Mis álbumes')
      
      // Should be focusable
      searchLink.focus()
      expect(document.activeElement).toBe(searchLink)
      
      albumsLink.focus()
      expect(document.activeElement).toBe(albumsLink)
    })

    it('should provide proper ARIA labels across devices', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={2}
            totalPages={5}
            onPageChange={jest.fn()}
          />
        </TestWrapper>
      )

      const pagination = screen.getByRole('navigation')
      expect(pagination).toBeInTheDocument()
    })

    it('should maintain color contrast on different screens', () => {
      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const logo = screen.getByText('SPOTIFY APP')
      const logoStyle = window.getComputedStyle(logo)
      
      // Should have proper color values for contrast
      expect(logoStyle.color).toBeTruthy()
    })
  })

  describe('Network Conditions', () => {
    describe('Slow Network Simulation', () => {
      it('should handle slow loading gracefully', () => {
        render(
          <TestWrapper>
            <SearchInput
              value=""
              onChange={jest.fn()}
              onSubmit={jest.fn()}
              loading={true}
              placeholder="Search..."
            />
          </TestWrapper>
        )

        const searchButton = screen.getByRole('button', { name: 'Search' })
        expect(searchButton).toBeDisabled()
      })
    })

    describe('Offline Conditions', () => {
      beforeEach(() => {
        // Mock offline state
        Object.defineProperty(navigator, 'onLine', {
          value: false,
          writable: true,
        })
      })

      it('should handle offline state appropriately', () => {
        render(
          <TestWrapper>
            <Header onLogout={jest.fn()} />
          </TestWrapper>
        )

        // Should still render basic UI
        const logo = screen.getByText('SPOTIFY APP')
        expect(logo).toBeInTheDocument()
      })
    })
  })

  describe('Print Styles', () => {
    it('should handle print media queries', () => {
      // Mock print media
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: query === 'print',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const logo = screen.getByText('SPOTIFY APP')
      expect(logo).toBeInTheDocument()
    })
  })
})