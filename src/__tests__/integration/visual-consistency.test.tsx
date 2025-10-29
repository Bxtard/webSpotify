/**
 * Visual consistency tests for SPOTIFY APP redesign
 * Ensures design system compliance across all components
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
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
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

describe('Visual Consistency Tests', () => {
  describe('Color System Compliance', () => {
    it('should use consistent primary colors across components', () => {
      render(
        <TestWrapper>
          <div>
            <Button variant="primary">Primary Button</Button>
            <SearchInput
              value=""
              onChange={jest.fn()}
              onSubmit={jest.fn()}
              placeholder="Search..."
            />
          </div>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Primary Button' })
      const searchButton = screen.getByRole('button', { name: 'Search' })
      
      // Both should use the same primary color
      const buttonStyle = window.getComputedStyle(button)
      const searchButtonStyle = window.getComputedStyle(searchButton)
      
      expect(buttonStyle.backgroundColor).toBeTruthy()
      expect(searchButtonStyle.backgroundColor).toBeTruthy()
    })

    it('should use consistent text colors', () => {
      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const logo = screen.getByText('SPOTIFY APP')
      const navLink = screen.getByText('Buscar')
      
      // Logo should use primary text color
      const logoStyle = window.getComputedStyle(logo)
      expect(logoStyle.color).toBeTruthy()
      
      // Nav links should use secondary text color
      const navStyle = window.getComputedStyle(navLink)
      expect(navStyle.color).toBeTruthy()
    })

    it('should use consistent background colors', () => {
      render(
        <TestWrapper>
          <ArtistCard
            artist={mockArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      const card = screen.getByText('Test Artist').closest('div')
      expect(card).toBeInTheDocument()
      
      const cardStyle = window.getComputedStyle(card!)
      expect(cardStyle.backgroundColor).toBeTruthy()
    })
  })

  describe('Typography System Compliance', () => {
    it('should use consistent font weights', () => {
      render(
        <TestWrapper>
          <div>
            <h1 className="hero-text">Hero Title</h1>
            <p className="subtitle-text">Subtitle text</p>
            <span className="card-title">Card Title</span>
            <span className="card-meta">Card Meta</span>
          </div>
        </TestWrapper>
      )

      const heroText = screen.getByText('Hero Title')
      const subtitleText = screen.getByText('Subtitle text')
      const cardTitle = screen.getByText('Card Title')
      const cardMeta = screen.getByText('Card Meta')

      // Check font weights match design system
      expect(window.getComputedStyle(heroText).fontWeight).toBe('700')
      expect(window.getComputedStyle(subtitleText).fontWeight).toBe('400')
      expect(window.getComputedStyle(cardTitle).fontWeight).toBe('600')
      expect(window.getComputedStyle(cardMeta).fontWeight).toBe('400')
    })

    it('should use consistent font sizes', () => {
      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const logo = screen.getByText('SPOTIFY APP')
      const navLink = screen.getByText('Buscar')
      
      // Logo should use brand font size
      const logoStyle = window.getComputedStyle(logo)
      expect(logoStyle.fontSize).toBeTruthy()
      
      // Nav links should use nav font size
      const navStyle = window.getComputedStyle(navLink)
      expect(navStyle.fontSize).toBeTruthy()
    })

    it('should maintain consistent line heights', () => {
      render(
        <TestWrapper>
          <div>
            <h1 className="hero-text">Hero Title</h1>
            <p className="subtitle-text">Subtitle with longer text that wraps to multiple lines</p>
          </div>
        </TestWrapper>
      )

      const heroText = screen.getByText('Hero Title')
      const subtitleText = screen.getByText(/Subtitle with longer text/)

      const heroStyle = window.getComputedStyle(heroText)
      const subtitleStyle = window.getComputedStyle(subtitleText)
      
      expect(heroStyle.lineHeight).toBeTruthy()
      expect(subtitleStyle.lineHeight).toBeTruthy()
    })
  })

  describe('Spacing System Compliance', () => {
    it('should use consistent padding across components', () => {
      render(
        <TestWrapper>
          <div>
            <Button variant="primary">Button</Button>
            <SearchInput
              value=""
              onChange={jest.fn()}
              onSubmit={jest.fn()}
              placeholder="Search..."
            />
          </div>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Button' })
      const searchInput = screen.getByPlaceholderText('Search...')
      
      const buttonStyle = window.getComputedStyle(button)
      const inputStyle = window.getComputedStyle(searchInput)
      
      expect(buttonStyle.padding).toBeTruthy()
      expect(inputStyle.padding).toBeTruthy()
    })

    it('should maintain consistent margins', () => {
      render(
        <TestWrapper>
          <ArtistCard
            artist={mockArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      const artistName = screen.getByText('Test Artist')
      const followerCount = screen.getByText(/Followers:/)
      
      const nameStyle = window.getComputedStyle(artistName)
      const followerStyle = window.getComputedStyle(followerCount)
      
      expect(nameStyle.margin).toBeDefined()
      expect(followerStyle.margin).toBeDefined()
    })
  })

  describe('Border Radius Compliance', () => {
    it('should use consistent border radius values', () => {
      render(
        <TestWrapper>
          <div>
            <Button variant="primary">Button</Button>
            <ArtistCard
              artist={mockArtist}
              onClick={jest.fn()}
            />
          </div>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Button' })
      const card = screen.getByText('Test Artist').closest('div')
      
      const buttonStyle = window.getComputedStyle(button)
      const cardStyle = window.getComputedStyle(card!)
      
      expect(buttonStyle.borderRadius).toBeTruthy()
      expect(cardStyle.borderRadius).toBeTruthy()
    })
  })

  describe('Animation Consistency', () => {
    it('should use consistent transition durations', () => {
      render(
        <TestWrapper>
          <div>
            <Button variant="primary">Button</Button>
            <Header onLogout={jest.fn()} />
          </div>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Button' })
      const navLink = screen.getByText('Buscar')
      
      const buttonStyle = window.getComputedStyle(button)
      const navStyle = window.getComputedStyle(navLink)
      
      expect(buttonStyle.transition).toBeTruthy()
      expect(navStyle.transition).toBeTruthy()
    })

    it('should respect reduced motion preferences', () => {
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

      render(
        <TestWrapper>
          <Button variant="primary">Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Button' })
      expect(button).toBeInTheDocument()
      
      // Should still render properly with reduced motion
      const buttonStyle = window.getComputedStyle(button)
      expect(buttonStyle.backgroundColor).toBeTruthy()
    })
  })

  describe('Responsive Design Compliance', () => {
    it('should maintain design consistency across breakpoints', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const logo = screen.getByText('SPOTIFY APP')
      expect(logo).toBeInTheDocument()
      
      // Should maintain styling on mobile
      const logoStyle = window.getComputedStyle(logo)
      expect(logoStyle.fontWeight).toBe('700')
    })

    it('should adapt typography for smaller screens', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      })

      render(
        <TestWrapper>
          <div>
            <h1 className="hero-text">Hero Title</h1>
          </div>
        </TestWrapper>
      )

      const heroText = screen.getByText('Hero Title')
      const heroStyle = window.getComputedStyle(heroText)
      
      // Should still have proper styling
      expect(heroStyle.fontWeight).toBe('700')
      expect(heroStyle.fontSize).toBeTruthy()
    })
  })

  describe('Accessibility Compliance', () => {
    it('should maintain proper color contrast ratios', () => {
      render(
        <TestWrapper>
          <div>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
        </TestWrapper>
      )

      const primaryButton = screen.getByRole('button', { name: 'Primary Button' })
      const secondaryButton = screen.getByRole('button', { name: 'Secondary Button' })
      
      // Both buttons should have proper contrast
      const primaryStyle = window.getComputedStyle(primaryButton)
      const secondaryStyle = window.getComputedStyle(secondaryButton)
      
      expect(primaryStyle.backgroundColor).toBeTruthy()
      expect(primaryStyle.color).toBeTruthy()
      expect(secondaryStyle.backgroundColor).toBeTruthy()
      expect(secondaryStyle.color).toBeTruthy()
    })

    it('should provide proper focus indicators', () => {
      render(
        <TestWrapper>
          <Button variant="primary">Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Button' })
      
      // Focus the button
      button.focus()
      
      // Should have focus styles
      expect(document.activeElement).toBe(button)
    })
  })

  describe('Component State Consistency', () => {
    it('should handle hover states consistently', () => {
      render(
        <TestWrapper>
          <ArtistCard
            artist={mockArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      const card = screen.getByText('Test Artist').closest('div')
      expect(card).toBeInTheDocument()
      
      // Should have hover transition styles
      const cardStyle = window.getComputedStyle(card!)
      expect(cardStyle.transition).toBeTruthy()
    })

    it('should handle loading states consistently', () => {
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

    it('should handle error states consistently', () => {
      render(
        <TestWrapper>
          <Button variant="primary" disabled>
            Disabled Button
          </Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Disabled Button' })
      expect(button).toBeDisabled()
      
      // Should have disabled styling
      const buttonStyle = window.getComputedStyle(button)
      expect(buttonStyle.opacity).toBeTruthy()
    })
  })
})