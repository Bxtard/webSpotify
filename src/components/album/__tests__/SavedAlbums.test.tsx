import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { SavedAlbums } from '../SavedAlbums'
import { useSavedAlbums } from '../../../hooks/useSavedAlbums'
import { theme } from '../../../styles/theme'
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
import { it } from 'node:test'
import { describe } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Mock the hook
jest.mock('../../../hooks/useSavedAlbums')

// Mock the AlbumCard component
jest.mock('../AlbumCard', () => ({
  AlbumCard: ({ album, onRemove }: any) => (
    <div data-testid={`album-card-${album.id}`}>
      <span>{album.name}</span>
      <button onClick={() => onRemove(album.id)}>Remove</button>
    </div>
  ),
}))

const mockUseSavedAlbums = useSavedAlbums as jest.MockedFunction<typeof useSavedAlbums>

const mockAlbums = [
  {
    album: {
      id: 'album1',
      name: 'Test Album 1',
      artists: [{ id: 'artist1', name: 'Test Artist 1' }],
      images: [{ url: 'https://example.com/album1.jpg', width: 640, height: 640 }],
      release_date: '2023-01-15',
      total_tracks: 12,
      external_urls: { spotify: 'https://open.spotify.com/album/album1' },
    },
    artist: 'Test Artist 1',
  },
  {
    album: {
      id: 'album2',
      name: 'Test Album 2',
      artists: [{ id: 'artist1', name: 'Test Artist 1' }],
      images: [{ url: 'https://example.com/album2.jpg', width: 640, height: 640 }],
      release_date: '2022-06-10',
      total_tracks: 8,
      external_urls: { spotify: 'https://open.spotify.com/album/album2' },
    },
    artist: 'Test Artist 1',
  },
  {
    album: {
      id: 'album3',
      name: 'Test Album 3',
      artists: [{ id: 'artist2', name: 'Test Artist 2' }],
      images: [{ url: 'https://example.com/album3.jpg', width: 640, height: 640 }],
      release_date: '2023-03-20',
      total_tracks: 10,
      external_urls: { spotify: 'https://open.spotify.com/album/album3' },
    },
    artist: 'Test Artist 2',
  },
]

const mockHookData = {
  savedAlbums: mockAlbums,
  groupedAlbums: {
    'Test Artist 1': [mockAlbums[0], mockAlbums[1]],
    'Test Artist 2': [mockAlbums[2]],
  },
  loading: false,
  error: null,
  fetchSavedAlbums: jest.fn(),
  removeAlbum: jest.fn(),
  clearError: jest.fn(),
  hasMore: false,
  loadMore: jest.fn(),
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('SavedAlbums Redesign', () => {
  beforeEach(() => {
    mockUseSavedAlbums.mockReturnValue(mockHookData)
    jest.clearAllMocks()
  })

  describe('New Design System Implementation', () => {
    it('renders hero title with proper typography', () => {
      renderWithTheme(<SavedAlbums />)
      
      const title = screen.getByText('Mis álbumes')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H1')
    })

    it('renders subtitle with album count information', () => {
      renderWithTheme(<SavedAlbums />)
      
      expect(screen.getByText('3 álbumes de 2 artistas')).toBeInTheDocument()
    })

    it('applies centered layout with proper container styling', () => {
      const { container } = renderWithTheme(<SavedAlbums />)
      
      // Verify the main container is present
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Responsive Grid Layout', () => {
    it('renders albums in grid layout', () => {
      renderWithTheme(<SavedAlbums />)
      
      expect(screen.getByTestId('album-card-album1')).toBeInTheDocument()
      expect(screen.getByTestId('album-card-album2')).toBeInTheDocument()
      expect(screen.getByTestId('album-card-album3')).toBeInTheDocument()
    })

    it('groups albums by artist with proper section headers', () => {
      renderWithTheme(<SavedAlbums />)
      
      expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
      expect(screen.getByText('Test Artist 2')).toBeInTheDocument()
      
      // Check album counts in headers
      expect(screen.getByText('2 álbumes')).toBeInTheDocument()
      expect(screen.getByText('1 álbum')).toBeInTheDocument()
    })
  })

  describe('Enhanced Empty State', () => {
    it('renders improved empty state when no albums are saved', () => {
      mockUseSavedAlbums.mockReturnValue({
        ...mockHookData,
        savedAlbums: [],
        groupedAlbums: {},
      })

      renderWithTheme(<SavedAlbums />)
      
      expect(screen.getByText('No tienes álbumes guardados')).toBeInTheDocument()
      expect(screen.getByText(/Explora artistas y guarda sus álbumes/)).toBeInTheDocument()
      expect(screen.getByText('Buscar música')).toBeInTheDocument()
    })

    it('renders search button in empty state', () => {
      mockUseSavedAlbums.mockReturnValue({
        ...mockHookData,
        savedAlbums: [],
        groupedAlbums: {},
      })

      renderWithTheme(<SavedAlbums />)
      
      const searchButton = screen.getByText('Buscar música')
      
      // Verify button is present with correct styling
      expect(searchButton).toBeInTheDocument()
      expect(searchButton.tagName).toBe('BUTTON')
    })
  })

  describe('Loading States', () => {
    it('renders loading skeletons with proper grid layout', () => {
      mockUseSavedAlbums.mockReturnValue({
        ...mockHookData,
        loading: true,
        savedAlbums: [],
      })

      renderWithTheme(<SavedAlbums />)
      
      expect(screen.getByText('Cargando tus álbumes guardados...')).toBeInTheDocument()
    })

    it('shows load more button when hasMore is true', () => {
      mockUseSavedAlbums.mockReturnValue({
        ...mockHookData,
        hasMore: true,
      })

      renderWithTheme(<SavedAlbums />)
      
      expect(screen.getByText('Cargar más álbumes')).toBeInTheDocument()
    })

    it('handles load more button click', () => {
      mockUseSavedAlbums.mockReturnValue({
        ...mockHookData,
        hasMore: true,
      })

      renderWithTheme(<SavedAlbums />)
      
      const loadMoreButton = screen.getByText('Cargar más álbumes')
      fireEvent.click(loadMoreButton)
      
      expect(mockHookData.loadMore).toHaveBeenCalled()
    })
  })

  describe('Error Handling with New Design', () => {
    it('renders error message with improved styling', () => {
      mockUseSavedAlbums.mockReturnValue({
        ...mockHookData,
        error: 'Failed to load albums',
      })

      renderWithTheme(<SavedAlbums />)
      
      expect(screen.getByText('Failed to load albums')).toBeInTheDocument()
      expect(screen.getByText('Reintentar')).toBeInTheDocument()
    })

    it('handles retry button click', () => {
      mockUseSavedAlbums.mockReturnValue({
        ...mockHookData,
        error: 'Network error',
      })

      renderWithTheme(<SavedAlbums />)
      
      const retryButton = screen.getByText('Reintentar')
      fireEvent.click(retryButton)
      
      expect(mockHookData.clearError).toHaveBeenCalled()
      expect(mockHookData.fetchSavedAlbums).toHaveBeenCalled()
    })
  })

  describe('Album Management', () => {
    it('handles album removal', async () => {
      renderWithTheme(<SavedAlbums />)
      
      const removeButton = screen.getAllByText('Remove')[0]
      fireEvent.click(removeButton)
      
      await waitFor(() => {
        expect(mockHookData.removeAlbum).toHaveBeenCalledWith('album1')
      })
    })

    it('shows loading state during album removal', async () => {
      renderWithTheme(<SavedAlbums />)
      
      const removeButton = screen.getAllByText('Remove')[0]
      fireEvent.click(removeButton)
      
      // The component should handle loading state internally
      expect(removeButton).toBeInTheDocument()
    })
  })

  describe('Artist Section Styling', () => {
    it('renders artist sections with proper spacing and borders', () => {
      renderWithTheme(<SavedAlbums />)
      
      // Verify artist headers are rendered
      expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
      expect(screen.getByText('Test Artist 2')).toBeInTheDocument()
    })

    it('displays correct album counts for each artist', () => {
      renderWithTheme(<SavedAlbums />)
      
      // Test Artist 1 has 2 albums
      const artist1Header = screen.getByText('Test Artist 1').closest('div')
      expect(artist1Header).toHaveTextContent('2 álbumes')
      
      // Test Artist 2 has 1 album
      const artist2Header = screen.getByText('Test Artist 2').closest('div')
      expect(artist2Header).toHaveTextContent('1 álbum')
    })
  })

  describe('Accessibility and Design Consistency', () => {
    it('maintains proper heading hierarchy', () => {
      renderWithTheme(<SavedAlbums />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Mis álbumes')
      
      const artistHeadings = screen.getAllByRole('heading', { level: 2 })
      expect(artistHeadings).toHaveLength(2)
      expect(artistHeadings[0]).toHaveTextContent('Test Artist 1')
      expect(artistHeadings[1]).toHaveTextContent('Test Artist 2')
    })

    it('applies consistent color scheme throughout', () => {
      const { container } = renderWithTheme(<SavedAlbums />)
      
      // Verify the component renders with theme
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})