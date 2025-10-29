import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import SearchPage from '../page'
import { theme } from '../../../styles/theme'

// Mock the hooks
jest.mock('../../../hooks/useSpotifySearch')
jest.mock('../../../hooks/useOnlineStatus')

// Mock the components
jest.mock('../../../components/ui/Input', () => ({
  Input: ({ placeholder, value, onChange, loading, fullWidth, type }: any) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
      type={type}
    />
  )
}))

jest.mock('../../../components/artist/ArtistList', () => ({
  ArtistList: ({ artists, loading }: any) => {
    if (loading) {
      return <div data-testid="artist-list-loading">Loading artists...</div>
    }
    return (
      <div data-testid="artist-list">
        {artists.map((artist: any) => (
          <div key={artist.id} data-testid={`artist-${artist.id}`}>
            {artist.name}
          </div>
        ))}
      </div>
    )
  }
}))

import { useSpotifySearch } from '../../../hooks/useSpotifySearch'
import { useOnlineStatus } from '../../../hooks/useOnlineStatus'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

const mockUseSpotifySearch = useSpotifySearch as jest.MockedFunction<typeof useSpotifySearch>
const mockUseOnlineStatus = useOnlineStatus as jest.MockedFunction<typeof useOnlineStatus>

// Mock artist data
const mockArtists = [
  {
    id: 'artist1',
    name: 'Test Artist 1',
    images: [{ url: 'https://example.com/image1.jpg', width: 300, height: 300 }],
    followers: { total: 1000000 },
    genres: ['pop'],
    popularity: 80,
    external_urls: { spotify: 'https://open.spotify.com/artist/artist1' },
  },
  {
    id: 'artist2',
    name: 'Test Artist 2',
    images: [{ url: 'https://example.com/image2.jpg', width: 300, height: 300 }],
    followers: { total: 500000 },
    genres: ['rock'],
    popularity: 70,
    external_urls: { spotify: 'https://open.spotify.com/artist/artist2' },
  },
]

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('SearchPage', () => {
  const mockSetQuery = jest.fn()
  const mockRetry = jest.fn()
  const mockClearError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    mockUseOnlineStatus.mockReturnValue(true)
    mockUseSpotifySearch.mockReturnValue({
      query: '',
      results: [],
      loading: false,
      error: null,
      hasSearched: false,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })
  })

  it('should render search page with title and input', () => {
    renderWithTheme(<SearchPage />)

    expect(screen.getByText('Search Artists')).toBeInTheDocument()
    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search for artists...')).toBeInTheDocument()
  })

  it('should show initial empty state when no search has been performed', () => {
    renderWithTheme(<SearchPage />)

    expect(screen.getByText('🎵')).toBeInTheDocument()
    expect(screen.getByText('Search for artists')).toBeInTheDocument()
    expect(screen.getByText('Start typing to discover your favorite artists and explore their music.')).toBeInTheDocument()
  })

  it('should call setQuery when input value changes', () => {
    renderWithTheme(<SearchPage />)

    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'test query' } })

    expect(mockSetQuery).toHaveBeenCalledWith('test query')
  })

  it('should show loading state', () => {
    mockUseSpotifySearch.mockReturnValue({
      query: 'test',
      results: [],
      loading: true,
      error: null,
      hasSearched: false,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })

    renderWithTheme(<SearchPage />)

    expect(screen.getByTestId('artist-list-loading')).toBeInTheDocument()
    expect(screen.getByText('Loading artists...')).toBeInTheDocument()
  })

  it('should show search results', () => {
    mockUseSpotifySearch.mockReturnValue({
      query: 'test',
      results: mockArtists,
      loading: false,
      error: null,
      hasSearched: true,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })

    renderWithTheme(<SearchPage />)

    expect(screen.getByTestId('artist-list')).toBeInTheDocument()
    expect(screen.getByTestId('artist-artist1')).toBeInTheDocument()
    expect(screen.getByTestId('artist-artist2')).toBeInTheDocument()
    expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
    expect(screen.getByText('Test Artist 2')).toBeInTheDocument()
  })

  it('should show no results state', () => {
    mockUseSpotifySearch.mockReturnValue({
      query: 'nonexistent artist',
      results: [],
      loading: false,
      error: null,
      hasSearched: true,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })

    renderWithTheme(<SearchPage />)

    expect(screen.getByText('🔍')).toBeInTheDocument()
    expect(screen.getByText('No artists found')).toBeInTheDocument()
    expect(screen.getByText('We couldn\'t find any artists matching "nonexistent artist". Try searching with different keywords.')).toBeInTheDocument()
  })

  it('should show error state with retry button', () => {
    mockUseSpotifySearch.mockReturnValue({
      query: 'test',
      results: [],
      loading: false,
      error: 'Failed to search artists. Please try again.',
      hasSearched: true,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })

    renderWithTheme(<SearchPage />)

    expect(screen.getByText('Search Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to search artists. Please try again.')).toBeInTheDocument()
    
    const retryButton = screen.getByText('Try Again')
    expect(retryButton).toBeInTheDocument()
    
    fireEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalled()
  })

  it('should show loading state on retry button when retrying', () => {
    mockUseSpotifySearch.mockReturnValue({
      query: 'test',
      results: [],
      loading: true,
      error: 'Failed to search artists. Please try again.',
      hasSearched: true,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })

    renderWithTheme(<SearchPage />)

    const retryButton = screen.getByText('Retrying...')
    expect(retryButton).toBeInTheDocument()
    expect(retryButton).toBeDisabled()
  })

  it('should show offline state when user is offline', () => {
    mockUseOnlineStatus.mockReturnValue(false)

    renderWithTheme(<SearchPage />)

    expect(screen.getByText('📡')).toBeInTheDocument()
    expect(screen.getByText('You\'re offline')).toBeInTheDocument()
    expect(screen.getByText('Please check your internet connection and try again.')).toBeInTheDocument()
  })

  it('should prioritize offline state over error state', () => {
    mockUseOnlineStatus.mockReturnValue(false)
    mockUseSpotifySearch.mockReturnValue({
      query: 'test',
      results: [],
      loading: false,
      error: 'Some error',
      hasSearched: true,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })

    renderWithTheme(<SearchPage />)

    // Should show offline state, not error state
    expect(screen.getByText('You\'re offline')).toBeInTheDocument()
    expect(screen.queryByText('Search Error')).not.toBeInTheDocument()
  })

  it('should show search input with correct props', () => {
    mockUseSpotifySearch.mockReturnValue({
      query: 'current query',
      results: [],
      loading: true,
      error: null,
      hasSearched: false,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })

    renderWithTheme(<SearchPage />)

    const input = screen.getByTestId('search-input')
    expect(input).toHaveValue('current query')
    expect(input).toHaveAttribute('type', 'search')
    expect(input).toHaveAttribute('placeholder', 'Search for artists...')
    expect(input).toBeDisabled() // Should be disabled when loading
  })

  it('should handle different error messages', () => {
    const errorMessages = [
      'Your session has expired. Please log in again.',
      'Too many requests. Please wait a moment and try again.',
      'Spotify service is temporarily unavailable. Please try again later.',
      'Network error. Please check your connection and try again.',
    ]

    errorMessages.forEach(errorMessage => {
      mockUseSpotifySearch.mockReturnValue({
        query: 'test',
        results: [],
        loading: false,
        error: errorMessage,
        hasSearched: true,
        setQuery: mockSetQuery,
        retry: mockRetry,
        clearError: mockClearError,
        clearSearch: jest.fn(),
      })

      const { unmount } = renderWithTheme(<SearchPage />)

      expect(screen.getByText('Search Error')).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()

      unmount()
    })
  })

  it('should maintain search input focus and functionality during different states', () => {
    const { rerender } = renderWithTheme(<SearchPage />)

    const input = screen.getByTestId('search-input')
    
    // Input should be enabled initially
    expect(input).not.toBeDisabled()

    // Simulate loading state
    mockUseSpotifySearch.mockReturnValue({
      query: 'test',
      results: [],
      loading: true,
      error: null,
      hasSearched: false,
      setQuery: mockSetQuery,
      retry: mockRetry,
      clearError: mockClearError,
      clearSearch: jest.fn(),
    })

    rerender(
      <ThemeProvider theme={theme}>
        <SearchPage />
      </ThemeProvider>
    )

    // Input should be disabled during loading
    expect(screen.getByTestId('search-input')).toBeDisabled()
  })
})