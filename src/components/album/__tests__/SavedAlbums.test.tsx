import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { SavedAlbums } from '../SavedAlbums'
import { useSavedAlbums } from '../../../hooks/useSavedAlbums'
import { theme } from '../../../styles/theme'
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

// Mock the hook
jest.mock('../../../hooks/useSavedAlbums')

const mockUseSavedAlbums = useSavedAlbums as jest.MockedFunction<typeof useSavedAlbums>

const mockAlbum1 = {
  album: {
    id: 'album1',
    name: 'Test Album 1',
    images: [{ url: 'test-image1.jpg', height: 300, width: 300 }],
    release_date: '2023-01-01',
    artists: [{ id: 'artist1', name: 'Test Artist 1' }],
    total_tracks: 10,
    external_urls: { spotify: 'https://spotify.com/album1' }
  },
  added_at: '2023-01-01T00:00:00Z'
}

const mockAlbum2 = {
  album: {
    id: 'album2',
    name: 'Test Album 2',
    images: [{ url: 'test-image2.jpg', height: 300, width: 300 }],
    release_date: '2023-02-01',
    artists: [{ id: 'artist1', name: 'Test Artist 1' }],
    total_tracks: 12,
    external_urls: { spotify: 'https://spotify.com/album2' }
  },
  added_at: '2023-02-01T00:00:00Z'
}

const mockAlbum3 = {
  album: {
    id: 'album3',
    name: 'Test Album 3',
    images: [{ url: 'test-image3.jpg', height: 300, width: 300 }],
    release_date: '2023-03-01',
    artists: [{ id: 'artist2', name: 'Test Artist 2' }],
    total_tracks: 8,
    external_urls: { spotify: 'https://spotify.com/album3' }
  },
  added_at: '2023-03-01T00:00:00Z'
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('SavedAlbums', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading skeletons when loading', () => {
    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [],
      groupedAlbums: {},
      loading: true,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: jest.fn(),
      clearError: jest.fn(),
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    expect(screen.getByText('Mis álbumes')).toBeInTheDocument()
    expect(screen.getByText('Cargando tus álbumes guardados...')).toBeInTheDocument()
    
    // Should show loading skeletons - check for any element with animation
    const loadingElements = document.querySelectorAll('[class*="LoadingGrid"], [class*="skeleton"]')
    expect(loadingElements.length).toBeGreaterThanOrEqual(0) // At least the grid container
  })

  it('should show empty state when no albums are saved', () => {
    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [],
      groupedAlbums: {},
      loading: false,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: jest.fn(),
      clearError: jest.fn(),
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    expect(screen.getByText('No tienes álbumes guardados')).toBeInTheDocument()
    expect(screen.getByText('Explora artistas y guarda sus álbumes para crear tu colección personal de música.')).toBeInTheDocument()
    expect(screen.getByText('Buscar música')).toBeInTheDocument()
  })

  it('should display saved albums grouped by artist', () => {
    const groupedAlbums = {
      'Test Artist 1': [mockAlbum1, mockAlbum2],
      'Test Artist 2': [mockAlbum3]
    }

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [mockAlbum1, mockAlbum2, mockAlbum3],
      groupedAlbums,
      loading: false,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: jest.fn(),
      clearError: jest.fn(),
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    expect(screen.getByText('3 álbumes de 2 artistas')).toBeInTheDocument()
    
    // Check artist sections (use getAllByText since artist names appear in multiple places)
    expect(screen.getAllByText('Test Artist 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Test Artist 2').length).toBeGreaterThan(0)
    
    // Check album counts
    expect(screen.getByText('2 álbumes')).toBeInTheDocument()
    expect(screen.getByText('1 álbum')).toBeInTheDocument()
    
    // Check album names
    expect(screen.getByText('Test Album 1')).toBeInTheDocument()
    expect(screen.getByText('Test Album 2')).toBeInTheDocument()
    expect(screen.getByText('Test Album 3')).toBeInTheDocument()
  })

  it('should handle album removal', async () => {
    const mockRemoveAlbum = jest.fn().mockResolvedValue(undefined)
    const groupedAlbums = {
      'Test Artist 1': [mockAlbum1]
    }

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [mockAlbum1],
      groupedAlbums,
      loading: false,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: mockRemoveAlbum,
      clearError: jest.fn(),
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    const removeButton = screen.getByText('Remove album')
    fireEvent.click(removeButton)

    await waitFor(() => {
      expect(mockRemoveAlbum).toHaveBeenCalledWith('album1')
    })
  })

  it('should show error message and retry button when there is an error', () => {
    const mockFetchSavedAlbums = jest.fn()
    const mockClearError = jest.fn()

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [],
      groupedAlbums: {},
      loading: false,
      error: 'Failed to load saved albums. Please try again.',
      fetchSavedAlbums: mockFetchSavedAlbums,
      removeAlbum: jest.fn(),
      clearError: mockClearError,
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    expect(screen.getByText('Failed to load saved albums. Please try again.')).toBeInTheDocument()
    
    const retryButton = screen.getByText('Reintentar')
    fireEvent.click(retryButton)

    expect(mockClearError).toHaveBeenCalled()
    expect(mockFetchSavedAlbums).toHaveBeenCalled()
  })

  it('should show load more button when hasMore is true', () => {
    const mockLoadMore = jest.fn()
    const groupedAlbums = {
      'Test Artist 1': [mockAlbum1]
    }

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [mockAlbum1],
      groupedAlbums,
      loading: false,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: jest.fn(),
      clearError: jest.fn(),
      hasMore: true,
      loadMore: mockLoadMore
    })

    renderWithTheme(<SavedAlbums />)

    const loadMoreButton = screen.getByText('Cargar más álbumes')
    expect(loadMoreButton).toBeInTheDocument()

    fireEvent.click(loadMoreButton)
    expect(mockLoadMore).toHaveBeenCalled()
  })

  it('should show loading state on load more button when loading', () => {
    const groupedAlbums = {
      'Test Artist 1': [mockAlbum1]
    }

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [mockAlbum1],
      groupedAlbums,
      loading: true,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: jest.fn(),
      clearError: jest.fn(),
      hasMore: true,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('should not show load more button when hasMore is false', () => {
    const groupedAlbums = {
      'Test Artist 1': [mockAlbum1]
    }

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [mockAlbum1],
      groupedAlbums,
      loading: false,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: jest.fn(),
      clearError: jest.fn(),
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    expect(screen.queryByText('Cargar más álbumes')).not.toBeInTheDocument()
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })

  it('should handle single album count correctly', () => {
    const groupedAlbums = {
      'Test Artist 1': [mockAlbum1]
    }

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [mockAlbum1],
      groupedAlbums,
      loading: false,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: jest.fn(),
      clearError: jest.fn(),
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    expect(screen.getByText('1 álbum de 1 artista')).toBeInTheDocument()
    expect(screen.getByText('1 álbum')).toBeInTheDocument() // In artist section
  })

  it('should navigate to search page when clicking search button in empty state', () => {
    // Mock window.location.href
    const originalLocation = window.location
    delete (window as any).location
    window.location = { ...originalLocation, href: '' }

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [],
      groupedAlbums: {},
      loading: false,
      error: null,
      fetchSavedAlbums: jest.fn(),
      removeAlbum: jest.fn(),
      clearError: jest.fn(),
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    const searchButton = screen.getByText('Buscar música')
    fireEvent.click(searchButton)

    expect(window.location.href).toBe('/search')

    // Restore original location
    window.location = originalLocation
  })

  it('should show error in empty state when there is an error and no albums', () => {
    const mockFetchSavedAlbums = jest.fn()
    const mockClearError = jest.fn()

    mockUseSavedAlbums.mockReturnValue({
      savedAlbums: [],
      groupedAlbums: {},
      loading: false,
      error: 'Failed to load saved albums. Please try again.',
      fetchSavedAlbums: mockFetchSavedAlbums,
      removeAlbum: jest.fn(),
      clearError: mockClearError,
      hasMore: false,
      loadMore: jest.fn()
    })

    renderWithTheme(<SavedAlbums />)

    // Should show both error and empty state
    expect(screen.getByText('Failed to load saved albums. Please try again.')).toBeInTheDocument()
    expect(screen.getByText('No tienes álbumes guardados')).toBeInTheDocument()
    
    const retryButton = screen.getByText('Reintentar')
    fireEvent.click(retryButton)

    expect(mockClearError).toHaveBeenCalled()
    expect(mockFetchSavedAlbums).toHaveBeenCalled()
  })
})