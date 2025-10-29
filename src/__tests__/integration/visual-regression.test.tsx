/**
 * Visual Regression Tests for SPOTIFY APP redesign
 * Tests to prevent visual regressions and ensure design consistency
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
import { Button } from '../../components/ui/Button'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { describe } from 'node:test'

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
  images: [{ url: 'test-image.jpg', height: 300, width: 300 }],
  followers: { total: 1000000 },
  genres: ['pop', 'rock'],
  popularity: 85,
  external_urls: { spotify: 'https://spotify.com/artist/1' },
}

describe('Visual Regression Tests', () => {
  describe('Component Snapshots', () => {
    it('should maintain Header visual consistency', () => {
      const { container } = render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      // Check key visual elements
      expect(screen.getByText('SPOTIFY APP')).toBeInTheDocument()
      expect(screen.getByText('Buscar')).toBeInTheDocument()
      expect(screen.getByText('Mis álbumes')).toBeInTheDocument()
      expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
      
      // Verify container structure
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain ArtistCard visual consistency', () => {
      const { container } = render(
        <TestWrapper>
          <ArtistCard
            artist={mockArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Check key visual elements
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
      expect(screen.getByText('Followers: 1M')).toBeInTheDocument()
      
      // Verify container structure
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain SearchInput visual consistency', () => {
      const { container } = render(
        <TestWrapper>
          <SearchInput
            value=""
            onChange={jest.fn()}
            onSubmit={jest.fn()}
            placeholder="Search artists..."
          />
        </TestWrapper>
      )

      // Check key visual elements
      expect(screen.getByPlaceholderText('Search artists...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
      
      // Verify container structure
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain Pagination visual consistency', () => {
      const { container } = render(
        <TestWrapper>
          <Pagination
            currentPage={2}
            totalPages={5}
            onPageChange={jest.fn()}
          />
        </TestWrapper>
      )

      // Check key visual elements
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      
      // Verify container structure
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain Button visual consistency', () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
        </TestWrapper>
      )

      // Check key visual elements
      expect(screen.getByText('Primary Button')).toBeInTheDocument()
      expect(screen.getByText('Secondary Button')).toBeInTheDocument()
      
      // Verify container structure
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Layout Consistency', () => {
    it('should maintain grid layout consistency', () => {
      const { container } = render(
        <TestWrapper>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            <ArtistCard artist={mockArtist} onClick={jest.fn()} />
            <ArtistCard artist={mockArtist} onClick={jest.fn()} />
            <ArtistCard artist={mockArtist} onClick={jest.fn()} />
            <ArtistCard artist={mockArtist} onClick={jest.fn()} />
          </div>
        </TestWrapper>
      )

      const cards = screen.getAllByText('Test Artist')
      expect(cards).toHaveLength(4)
      
      // Verify grid layout structure
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain centered layout consistency', () => {
      const { container } = render(
        <TestWrapper>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
            <h1>Busca tus artistas</h1>
            <p>Encuentra tus artistas favoritos gracias a nuestro buscador</p>
            <SearchInput
              value=""
              onChange={jest.fn()}
              onSubmit={jest.fn()}
              placeholder="Search artists..."
            />
          </div>
        </TestWrapper>
      )

      expect(screen.getByText('Busca tus artistas')).toBeInTheDocument()
      expect(screen.getByText(/Encuentra tus artistas favoritos/)).toBeInTheDocument()
      
      // Verify centered layout structure
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Responsive Design Consistency', () => {
    it('should maintain mobile layout consistency', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const { container } = render(
        <TestWrapper>
          <div>
            <Header onLogout={jest.fn()} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
            </div>
          </div>
        </TestWrapper>
      )

      // Verify mobile layout
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain tablet layout consistency', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      const { container } = render(
        <TestWrapper>
          <div>
            <Header onLogout={jest.fn()} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
            </div>
          </div>
        </TestWrapper>
      )

      // Verify tablet layout
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain desktop layout consistency', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      const { container } = render(
        <TestWrapper>
          <div>
            <Header onLogout={jest.fn()} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
              <ArtistCard artist={mockArtist} onClick={jest.fn()} />
            </div>
          </div>
        </TestWrapper>
      )

      // Verify desktop layout
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('State Consistency', () => {
    it('should maintain loading state consistency', () => {
      const { container } = render(
        <TestWrapper>
          <SearchInput
            value=""
            onChange={jest.fn()}
            onSubmit={jest.fn()}
            loading={true}
            placeholder="Search artists..."
          />
        </TestWrapper>
      )

      const searchButton = screen.getByRole('button', { name: 'Search' })
      expect(searchButton).toBeDisabled()
      
      // Verify loading state structure
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain hover state consistency', () => {
      const { container } = render(
        <TestWrapper>
          <ArtistCard
            artist={mockArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      const card = screen.getByText('Test Artist').closest('div')
      
      // Verify hover state structure
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain selected state consistency', () => {
      const { container } = render(
        <TestWrapper>
          <ArtistCard
            artist={mockArtist}
            selected={true}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Verify selected state structure
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Animation Consistency', () => {
    it('should maintain transition consistency', () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <Button variant="primary">Animated Button</Button>
            <ArtistCard artist={mockArtist} onClick={jest.fn()} />
          </div>
        </TestWrapper>
      )

      const button = screen.getByText('Animated Button')
      const card = screen.getByText('Test Artist').closest('div')
      
      // Check transition properties
      const buttonStyle = window.getComputedStyle(button)
      const cardStyle = window.getComputedStyle(card!)
      
      expect(buttonStyle.transition).toBeTruthy()
      expect(cardStyle.transition).toBeTruthy()
      
      // Verify animation structure
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should maintain reduced motion consistency', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      const { container } = render(
        <TestWrapper>
          <ArtistCard
            artist={mockArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Verify reduced motion structure
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Color Scheme Consistency', () => {
    it('should maintain dark theme consistency', () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <Header onLogout={jest.fn()} />
            <ArtistCard artist={mockArtist} onClick={jest.fn()} />
            <Button variant="primary">Primary Button</Button>
          </div>
        </TestWrapper>
      )

      // Check dark theme colors
      const logo = screen.getByText('SPOTIFY APP')
      const card = screen.getByText('Test Artist').closest('div')
      const button = screen.getByText('Primary Button')
      
      const logoStyle = window.getComputedStyle(logo)
      const cardStyle = window.getComputedStyle(card!)
      const buttonStyle = window.getComputedStyle(button)
      
      // Verify dark theme colors are applied
      expect(logoStyle.color).toBeTruthy()
      expect(cardStyle.backgroundColor).toBeTruthy()
      expect(buttonStyle.backgroundColor).toBeTruthy()
      
      // Verify color scheme structure
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Typography Consistency', () => {
    it('should maintain font hierarchy consistency', () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>Hero Title</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Brand Logo</h2>
            <p style={{ fontSize: '1.125rem', fontWeight: 400 }}>Subtitle Text</p>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Card Title</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>Card Meta</span>
          </div>
        </TestWrapper>
      )

      // Check typography hierarchy
      const heroTitle = screen.getByText('Hero Title')
      const brandLogo = screen.getByText('Brand Logo')
      const subtitleText = screen.getByText('Subtitle Text')
      const cardTitle = screen.getByText('Card Title')
      const cardMeta = screen.getByText('Card Meta')
      
      // Verify font styles
      expect(window.getComputedStyle(heroTitle).fontSize).toBe('48px')
      expect(window.getComputedStyle(heroTitle).fontWeight).toBe('700')
      expect(window.getComputedStyle(brandLogo).fontSize).toBe('24px')
      expect(window.getComputedStyle(subtitleText).fontSize).toBe('18px')
      expect(window.getComputedStyle(cardTitle).fontSize).toBe('16px')
      expect(window.getComputedStyle(cardMeta).fontSize).toBe('14px')
      
      // Verify typography structure
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})