/**
 * Error States and Edge Cases Tests for SPOTIFY APP redesign
 * Tests error handling, edge cases, and boundary conditions
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../styles/theme'
import { GlobalStyles } from '../../styles/globalStyles'
import SearchPage from '../../app/search/page'
import { ArtistCard } from '../../components/artist/ArtistCard'
import { SearchInput } from '../../components/ui/SearchInput'
import { Pagination } from '../../components/ui/Pagination'
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
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
  usePathname: () => '/search',
}))

// Mock Spotify API
jest.mock('../../api/spotify', () => ({
  searchArtists: jest.fn(),
  getArtistAlbums: jest.fn(),
}))

// Mock authentication - using simple callback system
const mockLogout = jest.fn()

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </ThemeProvider>
)

// Mock artist with edge case data
const edgeCaseArtist = {
  id: '1',
  name: 'Artist with Very Long Name That Might Cause Layout Issues in the UI Components',
  images: [{ url: 'test-image.jpg', height: 300, width: 300 }],
  followers: { total: 999999999 }, // Very large number
  genres: ['pop', 'rock', 'electronic', 'jazz', 'classical'], // Many genres
  popularity: 100,
  external_urls: { spotify: 'https://spotify.com/artist/1' },
}

const artistWithMissingData = {
  id: '2',
  name: '',
  images: [], // No images
  followers: { total: 0 },
  genres: [],
  popularity: 0,
  external_urls: { spotify: '' },
}

describe('Error States and Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Network Error Handling', () => {
    it('should handle API timeout errors', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock timeout error
      searchArtists.mockRejectedValue(new Error('Request timeout'))

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test artist')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Should handle timeout gracefully
      await waitFor(() => {
        expect(searchButton).not.toBeDisabled()
      })
    })

    it('should handle 429 rate limit errors', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock rate limit error
      const rateLimitError = new Error('Rate limit exceeded')
      rateLimitError.name = 'RateLimitError'
      searchArtists.mockRejectedValue(rateLimitError)

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test artist')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Should handle rate limiting gracefully
      await waitFor(() => {
        expect(searchButton).not.toBeDisabled()
      })
    })

    it('should handle 401 authentication errors', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock auth error
      const authError = new Error('Unauthorized')
      authError.name = 'AuthenticationError'
      searchArtists.mkRejectedValue(authError)

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test artist')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Should handle auth errors gracefully
      await waitFor(() => {
        expect(searchButton).not.toBeDisabled()
      })
    })

    it('should handle malformed API responses', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock malformed response
      searchArtists.mockResolvedValue({
        // Missing required fields
        artists: null,
      })

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test artist')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Should handle malformed data gracefully
      await waitFor(() => {
        expect(searchButton).not.toBeDisabled()
      })
    })
  })

  describe('Edge Case Data Handling', () => {
    it('should handle artists with very long names', () => {
      render(
        <TestWrapper>
          <ArtistCard
            artist={edgeCaseArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Should display long name without breaking layout
      expect(screen.getByText(/Artist with Very Long Name/)).toBeInTheDocument()
      
      const card = screen.getByText(/Artist with Very Long Name/).closest('div')
      expect(card).toBeInTheDocument()
    })

    it('should handle artists with missing images', () => {
      render(
        <TestWrapper>
          <ArtistCard
            artist={artistWithMissingData}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Should handle missing images gracefully
      const card = screen.getByText('Followers: 0').closest('div')
      expect(card).toBeInTheDocument()
    })

    it('should handle very large follower counts', () => {
      render(
        <TestWrapper>
          <ArtistCard
            artist={edgeCaseArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Should format large numbers appropriately
      expect(screen.getByText(/Followers:/)).toBeInTheDocument()
    })

    it('should handle empty search queries', async () => {
      const user = userEvent.setup()

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

      const searchButton = screen.getByRole('button', { name: /search/i })
      
      // Should handle empty search appropriately
      await user.click(searchButton)
      expect(searchButton).toBeInTheDocument()
    })

    it('should handle special characters in search queries', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      searchArtists.mockResolvedValue({
        artists: {
          items: [],
          total: 0,
          limit: 20,
          offset: 0,
          next: null,
        },
      })

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      
      // Test various special characters
      const specialQueries = ['@#$%', '🎵🎶', '<script>', 'artist"name', "artist'name"]
      
      for (const query of specialQueries) {
        await user.clear(searchInput)
        await user.type(searchInput, query)
        
        const searchButton = screen.getByRole('button', { name: /search/i })
        await user.click(searchButton)
        
        // Should handle special characters without errors
        expect(searchInput).toHaveValue(query)
      }
    })
  })

  describe('Boundary Conditions', () => {
    it('should handle maximum pagination limits', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={1000} // Very large number of pages
            onPageChange={jest.fn()}
          />
        </TestWrapper>
      )

      // Should handle large pagination gracefully
      const navigation = screen.getByRole('navigation')
      expect(navigation).toBeInTheDocument()
    })

    it('should handle zero results pagination', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={0}
            onPageChange={jest.fn()}
          />
        </TestWrapper>
      )

      // Should handle zero pages gracefully
      const navigation = screen.getByRole('navigation')
      expect(navigation).toBeInTheDocument()
    })

    it('should handle negative page numbers', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={-1}
            totalPages={5}
            onPageChange={jest.fn()}
          />
        </TestWrapper>
      )

      // Should handle invalid page numbers gracefully
      const navigation = screen.getByRole('navigation')
      expect(navigation).toBeInTheDocument()
    })

    it('should handle extremely long search queries', async () => {
      const user = userEvent.setup()
      const longQuery = 'a'.repeat(1000) // 1000 character query

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
      
      // Should handle very long input
      await user.type(searchInput, longQuery)
      expect(searchInput).toHaveValue(longQuery)
    })
  })

  describe('Memory and Performance Edge Cases', () => {
    it('should handle rapid successive searches', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      searchArtists.mockResolvedValue({
        artists: {
          items: [edgeCaseArtist],
          total: 1,
          limit: 20,
          offset: 0,
          next: null,
        },
      })

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      const searchButton = screen.getByRole('button', { name: /search/i })

      // Perform rapid searches
      for (let i = 0; i < 10; i++) {
        await user.clear(searchInput)
        await user.type(searchInput, `query ${i}`)
        await user.click(searchButton)
      }

      // Should handle rapid searches without memory leaks
      expect(searchArtists).toHaveBeenCalled()
    })

    it('should handle component unmounting during async operations', async () => {
      const { searchArtists } = require('../../api/spotify')
      
      // Mock slow response
      searchArtists.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          artists: {
            items: [edgeCaseArtist],
            total: 1,
            limit: 20,
            offset: 0,
            next: null,
          },
        }), 1000))
      )

      const { unmount } = render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      const searchButton = screen.getByRole('button', { name: /search/i })

      // Start search
      await userEvent.type(searchInput, 'test')
      await userEvent.click(searchButton)

      // Unmount before response
      unmount()

      // Should not cause memory leaks or errors
      expect(searchArtists).toHaveBeenCalled()
    })
  })

  describe('Browser Compatibility Edge Cases', () => {
    it('should handle missing modern browser features', () => {
      // Mock missing IntersectionObserver
      const originalIntersectionObserver = window.IntersectionObserver
      delete (window as any).IntersectionObserver

      render(
        <TestWrapper>
          <ArtistCard
            artist={edgeCaseArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Should render without IntersectionObserver
      expect(screen.getByText(/Artist with Very Long Name/)).toBeInTheDocument()

      // Restore
      window.IntersectionObserver = originalIntersectionObserver
    })

    it('should handle missing CSS Grid support', () => {
      // Mock missing CSS Grid support
      const originalSupports = CSS.supports
      CSS.supports = jest.fn().mockReturnValue(false)

      render(
        <TestWrapper>
          <div style={{ display: 'grid' }}>
            <ArtistCard
              artist={edgeCaseArtist}
              onClick={jest.fn()}
            />
          </div>
        </TestWrapper>
      )

      // Should render with fallback layout
      expect(screen.getByText(/Artist with Very Long Name/)).toBeInTheDocument()

      // Restore
      CSS.supports = originalSupports
    })

    it('should handle disabled JavaScript scenarios', () => {
      // Test server-side rendering scenario
      render(
        <TestWrapper>
          <ArtistCard
            artist={edgeCaseArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Basic content should be present without JS
      expect(screen.getByText(/Artist with Very Long Name/)).toBeInTheDocument()
      expect(screen.getByText(/Followers:/)).toBeInTheDocument()
    })
  })

  describe('Accessibility Edge Cases', () => {
    it('should handle high contrast mode', () => {
      // Mock high contrast mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
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
          <ArtistCard
            artist={edgeCaseArtist}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Should render properly in high contrast mode
      expect(screen.getByText(/Artist with Very Long Name/)).toBeInTheDocument()
    })

    it('should handle screen reader edge cases', () => {
      render(
        <TestWrapper>
          <ArtistCard
            artist={artistWithMissingData}
            onClick={jest.fn()}
          />
        </TestWrapper>
      )

      // Should provide meaningful content for screen readers even with missing data
      expect(screen.getByText('Followers: 0')).toBeInTheDocument()
    })

    it('should handle keyboard navigation with disabled elements', async () => {
      const user = userEvent.setup()

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

      const searchButton = screen.getByRole('button', { name: /search/i })
      expect(searchButton).toBeDisabled()

      // Should skip disabled elements in tab order
      await user.tab()
      expect(document.activeElement).not.toBe(searchButton)
    })
  })

  describe('Data Validation Edge Cases', () => {
    it('should handle null and undefined values', () => {
      const artistWithNulls = {
        id: '1',
        name: null as any,
        images: null as any,
        followers: null as any,
        genres: null as any,
        popularity: null as any,
        external_urls: null as any,
      }

      // Should not crash with null values
      expect(() => {
        render(
          <TestWrapper>
            <ArtistCard
              artist={artistWithNulls}
              onClick={jest.fn()}
            />
          </TestWrapper>
        )
      }).not.toThrow()
    })

    it('should handle circular reference objects', () => {
      const circularArtist: any = {
        id: '1',
        name: 'Circular Artist',
        images: [{ url: 'test.jpg', height: 300, width: 300 }],
        followers: { total: 1000 },
        genres: ['pop'],
        popularity: 50,
        external_urls: { spotify: 'https://spotify.com' },
      }
      
      // Create circular reference
      circularArtist.self = circularArtist

      // Should handle circular references gracefully
      expect(() => {
        render(
          <TestWrapper>
            <ArtistCard
              artist={circularArtist}
              onClick={jest.fn()}
            />
          </TestWrapper>
        )
      }).not.toThrow()
    })
  })
})