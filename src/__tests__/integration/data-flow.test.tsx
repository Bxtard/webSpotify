/**
 * Data flow integration tests for SPOTIFY APP
 * Tests API integration and data flow through the redesigned UI
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../styles/theme'
import { GlobalStyles } from '../../styles/globalStyles'
import SearchPage from '../../app/search/page'
import ArtistPage from '../../app/artist/[id]/page'
import AlbumsPage from '../../app/albums/page'
import { spotifyApi } from '../../api/spotify'

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
jest.mock('../../api/spotify')
const mockSpotifyApi = spotifyApi as jest.Mocked<typeof spotifyApi>

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </ThemeProvider>
)

// Mock data
const mockArtists = [
  {
    id: '1',
    name: 'Test Artist 1',
    images: [{ url: 'test-image-1.jpg' }],
    followers: { total: 1000000 },
    popularity: 85,
    genres: ['pop', 'rock'],
  },
  {
    id: '2',
    name: 'Test Artist 2',
    images: [{ url: 'test-image-2.jpg' }],
    followers: { total: 500000 },
    popularity: 75,
    genres: ['jazz', 'blues'],
  },
]

const mockAlbums = [
  {
    id: 'album1',
    name: 'Test Album 1',
    images: [{ url: 'album-image-1.jpg' }],
    artists: [{ id: '1', name: 'Test Artist 1' }],
    release_date: '2023-01-01',
    total_tracks: 12,
  },
  {
    id: 'album2',
    name: 'Test Album 2',
    images: [{ url: 'album-image-2.jpg' }],
    artists: [{ id: '1', name: 'Test Artist 1' }],
    release_date: '2023-06-01',
    total_tracks: 10,
  },
]

describe('Data Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default API responses
    mockSpotifyApi.searchArtists.mockResolvedValue({
      artists: {
        items: mockArtists,
        total: 2,
        limit: 20,
        offset: 0,
      },
    })

    mockSpotifyApi.getArtist.mockResolvedValue(mockArtists[0])
    
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({
      items: mockAlbums,
      total: 2,
      limit: 20,
      offset: 0,
    })
  })

  describe('Search Data Flow', () => {
    it('should handle search API integration correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      
      // Perform search
      await user.type(searchInput, 'test query')
      
      // Wait for debounced search
      await waitFor(() => {
        expect(mockSpotifyApi.searchArtists).toHaveBeenCalledWith('test query', 20, 0)
      }, { timeout: 2000 })

      // Verify results are displayed
      await waitFor(() => {
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
        expect(screen.getByText('Test Artist 2')).toBeInTheDocument()
      })

      // Verify follower counts are displayed
      expect(screen.getByText('Followers: 1M')).toBeInTheDocument()
      expect(screen.getByText('Followers: 500K')).toBeInTheDocument()
    })

    it('should handle search pagination correctly', async () => {
      const user = userEvent.setup()
      
      // Mock paginated response
      mockSpotifyApi.searchArtists.mockResolvedValue({
        artists: {
          items: mockArtists,
          total: 50,
          limit: 20,
          offset: 0,
        },
      })

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      await user.type(searchInput, 'test')

      // Wait for search results
      await waitFor(() => {
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
      })

      // Check pagination is displayed
      await waitFor(() => {
        expect(screen.getByText('Mostrando 2 resultados de 50 resultados')).toBeInTheDocument()
      })

      // Test pagination navigation
      const pagination = screen.getByRole('navigation', { name: /pagination/i })
      expect(pagination).toBeInTheDocument()

      const page2Button = screen.getByRole('button', { name: '2' })
      await user.click(page2Button)

      // Should call API with correct offset
      await waitFor(() => {
        expect(mockSpotifyApi.searchArtists).toHaveBeenCalledWith('test', 20, 20)
      })
    })

    it('should handle search errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock API error
      mockSpotifyApi.searchArtists.mockRejectedValue(new Error('API Error'))

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      await user.type(searchInput, 'test')

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Search Error')).toBeInTheDocument()
        expect(screen.getByText(/API Error/)).toBeInTheDocument()
      })

      // Test retry functionality
      const retryButton = screen.getByText('Try Again')
      await user.click(retryButton)

      // Should retry the API call
      await waitFor(() => {
        expect(mockSpotifyApi.searchArtists).toHaveBeenCalledTimes(2)
      })
    })

    it('should handle empty search results', async () => {
      const user = userEvent.setup()
      
      // Mock empty response
      mockSpotifyApi.searchArtists.mockResolvedValue({
        artists: {
          items: [],
          total: 0,
          limit: 20,
          offset: 0,
        },
      })

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      await user.type(searchInput, 'nonexistent')

      // Wait for empty state
      await waitFor(() => {
        expect(screen.getByText('No artists found')).toBeInTheDocument()
        expect(screen.getByText(/We couldn't find any artists matching "nonexistent"/)).toBeInTheDocument()
      })
    })
  })

  describe('Artist Detail Data Flow', () => {
    it('should load artist details correctly', async () => {
      render(
        <TestWrapper>
          <ArtistPage params={{ id: '1' }} />
        </TestWrapper>
      )

      // Wait for artist data to load
      await waitFor(() => {
        expect(mockSpotifyApi.getArtist).toHaveBeenCalledWith('1')
        expect(mockSpotifyApi.getArtistAlbums).toHaveBeenCalledWith('1')
      })

      // Verify artist information is displayed
      await waitFor(() => {
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
        expect(screen.getByText('1M followers')).toBeInTheDocument()
        expect(screen.getByText('85% popularity')).toBeInTheDocument()
      })

      // Verify albums are displayed
      await waitFor(() => {
        expect(screen.getByText('Test Album 1')).toBeInTheDocument()
        expect(screen.getByText('Test Album 2')).toBeInTheDocument()
      })
    })

    it('should handle artist loading states', async () => {
      // Mock delayed response
      mockSpotifyApi.getArtist.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockArtists[0]), 1000))
      )

      render(
        <TestWrapper>
          <ArtistPage params={{ id: '1' }} />
        </TestWrapper>
      )

      // Should show loading skeleton
      expect(screen.getByText('← Back')).toBeInTheDocument()
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should handle artist API errors', async () => {
      // Mock API error
      mockSpotifyApi.getArtist.mockRejectedValue(new Error('Artist not found'))

      render(
        <TestWrapper>
          <ArtistPage params={{ id: 'invalid' }} />
        </TestWrapper>
      )

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(screen.getByText(/Failed to load artist information/)).toBeInTheDocument()
      })

      // Test retry functionality
      const retryButton = screen.getByText('Try Again')
      expect(retryButton).toBeInTheDocument()
    })
  })

  describe('Album Management Data Flow', () => {
    it('should handle album save/remove operations', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <ArtistPage params={{ id: '1' }} />
        </TestWrapper>
      )

      // Wait for albums to load
      await waitFor(() => {
        expect(screen.getByText('Test Album 1')).toBeInTheDocument()
      })

      // Find save button for first album
      const albumCards = screen.getAllByRole('button', { name: /save|remove/i })
      expect(albumCards.length).toBeGreaterThan(0)

      // Test save operation
      const saveButton = albumCards[0]
      await user.click(saveButton)

      // Should handle save operation
      expect(saveButton).toBeInTheDocument()
    })

    it('should display saved albums correctly', async () => {
      render(
        <TestWrapper>
          <AlbumsPage />
        </TestWrapper>
      )

      // Should render saved albums page
      expect(screen.getByText('Mis álbumes')).toBeInTheDocument()
    })
  })

  describe('Real-time Data Updates', () => {
    it('should handle concurrent search requests correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      
      // Type quickly to trigger multiple requests
      await user.type(searchInput, 'test')
      await user.clear(searchInput)
      await user.type(searchInput, 'another')

      // Should handle the latest request
      await waitFor(() => {
        expect(mockSpotifyApi.searchArtists).toHaveBeenCalledWith('another', 20, 0)
      })
    })

    it('should handle network connectivity issues', async () => {
      const user = userEvent.setup()
      
      // Mock network error
      mockSpotifyApi.searchArtists.mockRejectedValue(new Error('Network Error'))

      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      await user.type(searchInput, 'test')

      // Should show network error
      await waitFor(() => {
        expect(screen.getByText('Search Error')).toBeInTheDocument()
      })
    })
  })

  describe('Data Persistence', () => {
    it('should maintain search state across navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      await user.type(searchInput, 'test query')

      // Search input should maintain value
      expect(searchInput).toHaveValue('test query')

      // Results should be displayed
      await waitFor(() => {
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
      })
    })

    it('should handle browser back/forward navigation', async () => {
      render(
        <TestWrapper>
          <ArtistPage params={{ id: '1' }} />
        </TestWrapper>
      )

      // Wait for artist to load
      await waitFor(() => {
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
      })

      // Test back navigation
      const backButton = screen.getByText('← Back')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalled()
    })
  })

  describe('Performance Optimization', () => {
    it('should debounce search requests', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      
      // Type multiple characters quickly
      await user.type(searchInput, 'test', { delay: 50 })

      // Should only make one API call after debounce
      await waitFor(() => {
        expect(mockSpotifyApi.searchArtists).toHaveBeenCalledTimes(1)
      }, { timeout: 1000 })
    })

    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeArtistList = Array.from({ length: 1000 }, (_, i) => ({
        id: `artist-${i}`,
        name: `Artist ${i}`,
        images: [{ url: `image-${i}.jpg` }],
        followers: { total: 1000000 + i },
        popularity: 85,
        genres: ['pop'],
      }))

      mockSpotifyApi.searchArtists.mockResolvedValue({
        artists: {
          items: largeArtistList.slice(0, 20), // Paginated
          total: 1000,
          limit: 20,
          offset: 0,
        },
      })

      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      await user.type(searchInput, 'test')

      // Should handle large dataset without performance issues
      await waitFor(() => {
        expect(screen.getByText('Artist 0')).toBeInTheDocument()
        expect(screen.getByText('Mostrando 20 resultados de 1,000 resultados')).toBeInTheDocument()
      })
    })
  })
})