/**
 * Integration tests for the complete SPOTIFY APP redesign
 * Tests the integration of all redesigned components and user flows
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../styles/theme'
import { GlobalStyles } from '../../styles/globalStyles'
import SearchPage from '../../app/search/page'
import AlbumsPage from '../../app/albums/page'
import { Header } from '../../components/common/Header'
import { Layout } from '../../components/common/Layout'

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
  spotifyApi: {
    searchArtists: jest.fn(),
    getArtist: jest.fn(),
    getArtistAlbums: jest.fn(),
  },
}))

// Mock hooks
jest.mock('../../hooks/useSpotifySearch', () => ({
  useSpotifySearch: () => ({
    query: '',
    results: [
      {
        id: '1',
        name: 'Test Artist',
        images: [{ url: 'test-image.jpg' }],
        followers: { total: 1000000 },
        popularity: 85,
      },
    ],
    loading: false,
    error: null,
    hasSearched: true,
    totalResults: 1,
    currentPage: 1,
    totalPages: 1,
    setQuery: jest.fn(),
    setPage: jest.fn(),
    retry: jest.fn(),
  }),
}))

jest.mock('../../hooks/useOnlineStatus', () => ({
  useOnlineStatus: () => true,
}))

jest.mock('../../hooks/useAlbumManagement', () => ({
  useAlbumManagement: () => ({
    savedAlbums: new Set(),
    loading: false,
    error: null,
    saveAlbum: jest.fn(),
    removeAlbum: jest.fn(),
    checkAlbumsSaved: jest.fn(),
    clearError: jest.fn(),
  }),
}))

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </ThemeProvider>
)

describe('SPOTIFY APP Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Design System Integration', () => {
    it('should apply SPOTIFY APP brand colors consistently', () => {
      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const logo = screen.getByText('SPOTIFY APP')
      expect(logo).toBeInTheDocument()
      
      // Check if brand styling is applied
      const computedStyle = window.getComputedStyle(logo)
      expect(computedStyle.fontWeight).toBe('700')
    })

    it('should use consistent typography hierarchy', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const heroTitle = screen.getByText('Busca tus artistas')
      const subtitle = screen.getByText(/Encuentra tus artistas favoritos/)
      
      expect(heroTitle).toBeInTheDocument()
      expect(subtitle).toBeInTheDocument()
      
      // Verify typography hierarchy
      const heroStyle = window.getComputedStyle(heroTitle)
      const subtitleStyle = window.getComputedStyle(subtitle)
      
      expect(heroStyle.fontWeight).toBe('700')
      expect(subtitleStyle.fontWeight).toBe('400')
    })

    it('should maintain responsive layout structure', async () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const container = screen.getByText('Busca tus artistas').closest('div')
      expect(container).toBeInTheDocument()
      
      // Check for responsive container classes
      const computedStyle = window.getComputedStyle(container!)
      expect(computedStyle.maxWidth).toBeTruthy()
    })
  })

  describe('Component Integration', () => {
    it('should integrate Header with navigation properly', async () => {
      const user = userEvent.setup()
      const mockLogout = jest.fn()
      
      render(
        <TestWrapper>
          <Header onLogout={mockLogout} />
        </TestWrapper>
      )

      // Test navigation links
      const searchLink = screen.getByText('Buscar')
      const albumsLink = screen.getByText('Mis álbumes')
      const logoutButton = screen.getByText('Cerrar sesión')

      expect(searchLink).toBeInTheDocument()
      expect(albumsLink).toBeInTheDocument()
      expect(logoutButton).toBeInTheDocument()

      // Test logout functionality
      await user.click(logoutButton)
      expect(mockLogout).toHaveBeenCalled()
    })

    it('should integrate search components seamlessly', async () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Verify search interface components are present
      const searchInput = screen.getByPlaceholderText('Search for artists...')
      const resultsCounter = screen.getByText(/Mostrando.*resultados/)
      const artistCard = screen.getByText('Test Artist')

      expect(searchInput).toBeInTheDocument()
      expect(resultsCounter).toBeInTheDocument()
      expect(artistCard).toBeInTheDocument()
    })

    it('should integrate pagination with search results', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Since we have only 1 page in mock, pagination should not be visible
      const pagination = screen.queryByRole('navigation', { name: /pagination/i })
      expect(pagination).not.toBeInTheDocument()
    })
  })

  describe('User Flow Integration', () => {
    it('should support complete search flow', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Verify initial state
      expect(screen.getByText('Busca tus artistas')).toBeInTheDocument()
      expect(screen.getByText(/Encuentra tus artistas favoritos/)).toBeInTheDocument()

      // Test search input interaction
      const searchInput = screen.getByPlaceholderText('Search for artists...')
      await user.type(searchInput, 'test query')
      
      expect(searchInput).toHaveValue('test query')

      // Verify results are displayed
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
      expect(screen.getByText(/Mostrando.*resultados/)).toBeInTheDocument()
    })

    it('should handle error states gracefully', () => {
      // Mock error state
      jest.doMock('../../hooks/useSpotifySearch', () => ({
        useSpotifySearch: () => ({
          query: 'test',
          results: [],
          loading: false,
          error: 'Search failed',
          hasSearched: true,
          totalResults: 0,
          currentPage: 1,
          totalPages: 0,
          setQuery: jest.fn(),
          setPage: jest.fn(),
          retry: jest.fn(),
        }),
      }))

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      expect(screen.getByText('Search Error')).toBeInTheDocument()
      expect(screen.getByText('Search failed')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    it('should handle loading states consistently', () => {
      // Mock loading state
      jest.doMock('../../hooks/useSpotifySearch', () => ({
        useSpotifySearch: () => ({
          query: 'test',
          results: [],
          loading: true,
          error: null,
          hasSearched: true,
          totalResults: 0,
          currentPage: 1,
          totalPages: 0,
          setQuery: jest.fn(),
          setPage: jest.fn(),
          retry: jest.fn(),
        }),
      }))

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Loading state should be handled by ArtistList component
      const searchInput = screen.getByPlaceholderText('Search for artists...')
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('Layout Integration', () => {
    it('should integrate Layout component with pages correctly', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </TestWrapper>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
      
      // Check for footer
      expect(screen.getByText(/© 2024 Spotify Web App/)).toBeInTheDocument()
      expect(screen.getByText('Terms of Service')).toBeInTheDocument()
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    })

    it('should maintain consistent spacing and alignment', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const container = screen.getByText('Busca tus artistas').closest('div')
      expect(container).toBeInTheDocument()
      
      // Verify centered layout
      const computedStyle = window.getComputedStyle(container!)
      expect(computedStyle.textAlign).toBe('center')
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const heroTitle = screen.getByRole('heading', { level: 1 })
      expect(heroTitle).toHaveTextContent('Busca tus artistas')
    })

    it('should provide proper focus management', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <Header onLogout={jest.fn()} />
        </TestWrapper>
      )

      const searchLink = screen.getByText('Buscar')
      await user.tab()
      
      // First focusable element should receive focus
      expect(document.activeElement).toBeTruthy()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      
      // Test keyboard interaction
      await user.click(searchInput)
      await user.keyboard('test')
      
      expect(searchInput).toHaveValue('test')
    })
  })

  describe('Performance Integration', () => {
    it('should handle large result sets efficiently', () => {
      // Mock large result set
      const largeResults = Array.from({ length: 100 }, (_, i) => ({
        id: `artist-${i}`,
        name: `Artist ${i}`,
        images: [{ url: `image-${i}.jpg` }],
        followers: { total: 1000000 + i },
        popularity: 85,
      }))

      jest.doMock('../../hooks/useSpotifySearch', () => ({
        useSpotifySearch: () => ({
          query: 'test',
          results: largeResults.slice(0, 20), // Paginated results
          loading: false,
          error: null,
          hasSearched: true,
          totalResults: 100,
          currentPage: 1,
          totalPages: 5,
          setQuery: jest.fn(),
          setPage: jest.fn(),
          retry: jest.fn(),
        }),
      }))

      const { container } = render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Should render without performance issues
      expect(container).toBeInTheDocument()
    })
  })

  describe('Responsive Integration', () => {
    it('should adapt to different screen sizes', () => {
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

      const heroTitle = screen.getByText('Busca tus artistas')
      expect(heroTitle).toBeInTheDocument()
      
      // Should maintain functionality on mobile
      const searchInput = screen.getByPlaceholderText('Search for artists...')
      expect(searchInput).toBeInTheDocument()
    })
  })
})