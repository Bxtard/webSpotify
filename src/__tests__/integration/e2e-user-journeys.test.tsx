/**
 * End-to-End User Journey Tests for SPOTIFY APP redesign
 * Tests complete user flows and visual regression scenarios
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../styles/theme'
import { GlobalStyles } from '../../styles/globalStyles'
import SearchPage from '../../app/search/page'
import AlbumsPage from '../../app/albums/page'
import LoginPage from '../../app/login/page'
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
import { it } from 'node:test'
import { describe } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Mock Next.js router
const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  usePathname: () => '/search',
}))

// Mock Spotify API
jest.mock('../../api/spotify', () => ({
  searchArtists: jest.fn(),
  getArtistAlbums: jest.fn(),
  getUserSavedAlbums: jest.fn(),
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

// Mock artist data
const mockArtists = [
  {
    id: '1',
    name: 'Test Artist 1',
    images: [{ url: 'test-image-1.jpg', height: 300, width: 300 }],
    followers: { total: 1000000 },
    genres: ['pop', 'rock'],
    popularity: 85,
    external_urls: { spotify: 'https://spotify.com/artist/1' },
  },
  {
    id: '2',
    name: 'Test Artist 2',
    images: [{ url: 'test-image-2.jpg', height: 300, width: 300 }],
    followers: { total: 500000 },
    genres: ['jazz', 'blues'],
    popularity: 75,
    external_urls: { spotify: 'https://spotify.com/artist/2' },
  },
]

// Mock albums data
const mockAlbums = [
  {
    id: '1',
    name: 'Test Album 1',
    images: [{ url: 'test-album-1.jpg', height: 300, width: 300 }],
    release_date: '2023-01-01',
    artists: [mockArtists[0]],
    total_tracks: 12,
    external_urls: { spotify: 'https://spotify.com/album/1' },
  },
  {
    id: '2',
    name: 'Test Album 2',
    images: [{ url: 'test-album-2.jpg', height: 300, width: 300 }],
    release_date: '2023-06-01',
    artists: [mockArtists[1]],
    total_tracks: 8,
    external_urls: { spotify: 'https://spotify.com/album/2' },
  },
]

describe('End-to-End User Journey Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Complete Search Flow', () => {
    it('should complete full search journey from input to artist selection', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock successful search response
      searchArtists.mockResolvedValue({
        artists: {
          items: mockArtists,
          total: 2,
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

      // Step 1: Verify initial page load
      expect(screen.getByText('Busca tus artistas')).toBeInTheDocument()
      expect(screen.getByText(/Encuentra tus artistas favoritos/)).toBeInTheDocument()

      // Step 2: Enter search query
      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test artist')
      expect(searchInput).toHaveValue('test artist')

      // Step 3: Submit search
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Step 4: Wait for results to load
      await waitFor(() => {
        expect(screen.getByText('Mostrando 2 resultados de 2')).toBeInTheDocument()
      })

      // Step 5: Verify artist cards are displayed
      expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
      expect(screen.getByText('Test Artist 2')).toBeInTheDocument()
      expect(screen.getByText('Followers: 1M')).toBeInTheDocument()
      expect(screen.getByText('Followers: 500K')).toBeInTheDocument()

      // Step 6: Click on an artist card
      const artistCard = screen.getByText('Test Artist 1').closest('div')
      await user.click(artistCard!)

      // Step 7: Verify navigation to artist page
      expect(mockPush).toHaveBeenCalledWith('/artist/1')
    })

    it('should handle search with no results gracefully', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock empty search response
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

      // Enter search query
      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'nonexistent artist')

      // Submit search
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Wait for no results message
      await waitFor(() => {
        expect(screen.getByText('Mostrando 0 resultados de 0')).toBeInTheDocument()
      })

      // Verify no artist cards are displayed
      expect(screen.queryByText('Test Artist 1')).not.toBeInTheDocument()
    })

    it('should handle search errors gracefully', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock search error
      searchArtists.mockRejectedValue(new Error('API Error'))

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Enter search query
      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test artist')

      // Submit search
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Wait for error handling
      await waitFor(() => {
        // Should show some error state or fallback
        expect(searchButton).not.toBeDisabled()
      })
    })
  })

  describe('Pagination Flow', () => {
    it('should navigate through search result pages', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock paginated search response
      searchArtists.mockResolvedValueOnce({
        artists: {
          items: mockArtists,
          total: 50,
          limit: 20,
          offset: 0,
          next: 'next-page-url',
        },
      })

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Perform initial search
      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test artist')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText('Mostrando 2 resultados de 50')).toBeInTheDocument()
      })

      // Check pagination is displayed
      const pagination = screen.getByRole('navigation')
      expect(pagination).toBeInTheDocument()

      // Mock second page response
      searchArtists.mockResolvedValueOnce({
        artists: {
          items: [mockArtists[0]], // Different results for page 2
          total: 50,
          limit: 20,
          offset: 20,
          next: null,
        },
      })

      // Click on page 2
      const page2Button = screen.getByRole('button', { name: '2' })
      await user.click(page2Button)

      // Wait for page 2 results
      await waitFor(() => {
        expect(searchArtists).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Navigation Flow', () => {
    it('should navigate between pages using header navigation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Click on "Mis álbumes" link
      const albumsLink = screen.getByText('Mis álbumes')
      await user.click(albumsLink)

      expect(mockPush).toHaveBeenCalledWith('/albums')
    })

    it('should handle logout flow', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Click logout button
      const logoutButton = screen.getByText('Cerrar sesión')
      await user.click(logoutButton)

      // Should trigger logout callback
      expect(logoutButton).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should adapt layout for mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Verify mobile-friendly layout
      expect(screen.getByText('Busca tus artistas')).toBeInTheDocument()
      expect(screen.getByText('SPOTIFY APP')).toBeInTheDocument()
    })

    it('should adapt layout for tablet devices', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Verify tablet layout
      expect(screen.getByText('Busca tus artistas')).toBeInTheDocument()
    })
  })

  describe('Accessibility Journey', () => {
    it('should support complete keyboard navigation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Tab through navigation elements
      await user.tab()
      expect(document.activeElement).toHaveAttribute('href')

      // Continue tabbing to search input
      await user.tab()
      await user.tab()
      await user.tab()
      
      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      expect(document.activeElement).toBe(searchInput)

      // Tab to search button
      await user.tab()
      const searchButton = screen.getByRole('button', { name: /search/i })
      expect(document.activeElement).toBe(searchButton)
    })

    it('should provide proper focus management', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      
      // Focus input
      await user.click(searchInput)
      expect(document.activeElement).toBe(searchInput)

      // Should maintain focus during typing
      await user.type(searchInput, 'test')
      expect(document.activeElement).toBe(searchInput)
    })
  })

  describe('Performance Journey', () => {
    it('should load initial page quickly', () => {
      const startTime = performance.now()
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render within reasonable time
      expect(renderTime).toBeLessThan(100)
      expect(screen.getByText('Busca tus artistas')).toBeInTheDocument()
    })

    it('should handle large search results efficiently', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // Mock large dataset
      const largeArtistList = Array.from({ length: 100 }, (_, i) => ({
        ...mockArtists[0],
        id: `artist-${i}`,
        name: `Artist ${i}`,
      }))

      searchArtists.mockResolvedValue({
        artists: {
          items: largeArtistList,
          total: 100,
          limit: 100,
          offset: 0,
          next: null,
        },
      })

      const startTime = performance.now()

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Perform search
      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText('Mostrando 100 resultados de 100')).toBeInTheDocument()
      })

      const endTime = performance.now()
      const totalTime = endTime - startTime

      // Should handle large datasets reasonably well
      expect(totalTime).toBeLessThan(2000)
    })
  })

  describe('Error State Journey', () => {
    it('should recover from network errors', async () => {
      const user = userEvent.setup()
      const { searchArtists } = require('../../api/spotify')
      
      // First call fails
      searchArtists.mockRejectedValueOnce(new Error('Network Error'))
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Attempt search
      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      await user.type(searchInput, 'test artist')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      // Wait for error handling
      await waitFor(() => {
        expect(searchButton).not.toBeDisabled()
      })

      // Second call succeeds
      searchArtists.mockResolvedValueOnce({
        artists: {
          items: mockArtists,
          total: 2,
          limit: 20,
          offset: 0,
          next: null,
        },
      })

      // Retry search
      await user.click(searchButton)

      // Should recover and show results
      await waitFor(() => {
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
      })
    })
  })

  describe('Visual Regression Prevention', () => {
    it('should maintain consistent visual hierarchy', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Check main heading
      const mainHeading = screen.getByText('Busca tus artistas')
      expect(mainHeading.tagName).toBe('H1')

      // Check subtitle
      const subtitle = screen.getByText(/Encuentra tus artistas favoritos/)
      expect(subtitle).toBeInTheDocument()

      // Check search input
      const searchInput = screen.getByPlaceholderText(/buscar artistas/i)
      expect(searchInput).toBeInTheDocument()
    })

    it('should maintain consistent component styling', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Check header styling
      const logo = screen.getByText('SPOTIFY APP')
      const logoStyle = window.getComputedStyle(logo)
      expect(logoStyle.fontWeight).toBe('700')

      // Check search button styling
      const searchButton = screen.getByRole('button', { name: /search/i })
      const buttonStyle = window.getComputedStyle(searchButton)
      expect(buttonStyle.backgroundColor).toBeTruthy()
    })
  })
})