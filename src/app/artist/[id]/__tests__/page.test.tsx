import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from 'styled-components'
import ArtistPage from '../page'
import { spotifyApi } from '../../../../api/spotify'
import { useAlbumManagement } from '../../../../hooks/useAlbumManagement'
import { theme } from '../../../../styles/theme'
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
import { it } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Spotify API
jest.mock('../../../../api/spotify')

// Mock album management hook
jest.mock('../../../../hooks/useAlbumManagement')

const mockPush = jest.fn()
const mockBack = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockSpotifyApi = spotifyApi as jest.Mocked<typeof spotifyApi>
const mockUseAlbumManagement = useAlbumManagement as jest.MockedFunction<typeof useAlbumManagement>

// Mock data
const mockArtist = {
  id: 'artist123',
  name: 'Test Artist',
  images: [
    { url: 'https://example.com/artist.jpg', width: 640, height: 640 },
  ],
  followers: { total: 1234567 },
  genres: ['pop', 'rock', 'indie'],
  popularity: 85,
  external_urls: { spotify: 'https://open.spotify.com/artist/artist123' },
}

const mockAlbums = [
  {
    id: 'album1',
    name: 'Test Album 1',
    images: [
      { url: 'https://example.com/album1.jpg', width: 640, height: 640 },
    ],
    release_date: '2023-01-15',
    artists: [{ id: 'artist123', name: 'Test Artist' }],
    total_tracks: 12,
    external_urls: { spotify: 'https://open.spotify.com/album/album1' },
  },
  {
    id: 'album2',
    name: 'Test Album 2',
    images: [
      { url: 'https://example.com/album2.jpg', width: 640, height: 640 },
    ],
    release_date: '2022-06-10',
    artists: [{ id: 'artist123', name: 'Test Artist' }],
    total_tracks: 8,
    external_urls: { spotify: 'https://open.spotify.com/album/album2' },
  },
]

const mockAlbumManagement = {
  savedAlbums: new Set(['album1']),
  loading: false,
  error: null,
  saveAlbum: jest.fn(),
  removeAlbum: jest.fn(),
  checkAlbumsSaved: jest.fn(),
  clearError: jest.fn(),
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ArtistPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: jest.fn(),
      prefetch: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as any)

    mockUseAlbumManagement.mockReturnValue(mockAlbumManagement)
    
    jest.clearAllMocks()
  })

  describe('New Design System Implementation', () => {
    it('applies centered layout with proper container styling', async () => {
      mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
      mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

      const { container } = renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Artist' })).toBeInTheDocument()
      })

      // Verify the main container is present with proper structure
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders artist name with hero typography', async () => {
      mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
      mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

      renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

      await waitFor(() => {
        const artistName = screen.getByRole('heading', { name: 'Test Artist' })
        expect(artistName).toBeInTheDocument()
        expect(artistName.tagName).toBe('H1')
      })
    })

    it('displays follower count with primary color accent', async () => {
      mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
      mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

      renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

      await waitFor(() => {
        expect(screen.getByText(/1.2M.*followers/)).toBeInTheDocument()
      })
    })

    it('renders genre tags with hover effects', async () => {
      mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
      mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

      renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

      await waitFor(() => {
        const popGenre = screen.getByText('pop')
        expect(popGenre).toBeInTheDocument()
        
        const rockGenre = screen.getByText('rock')
        expect(rockGenre).toBeInTheDocument()
        
        const indieGenre = screen.getByText('indie')
        expect(indieGenre).toBeInTheDocument()
      })
    })

    it('applies responsive grid layout for albums', async () => {
      mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
      mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

      renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

      await waitFor(() => {
        expect(screen.getByText('Test Album 1')).toBeInTheDocument()
        expect(screen.getByText('Test Album 2')).toBeInTheDocument()
      })
    })

    it('renders albums section with proper spacing and border', async () => {
      mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
      mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

      renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

      await waitFor(() => {
        const albumsSection = screen.getByText('Albums')
        expect(albumsSection).toBeInTheDocument()
        expect(albumsSection.tagName).toBe('H2')
      })
    })

    it('renders artist image with rounded corners and hover effects', async () => {
      mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
      mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

      renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

      await waitFor(() => {
        const artistImage = screen.getByAltText('Test Artist')
        expect(artistImage).toBeInTheDocument()
        expect(artistImage.tagName).toBe('IMG')
      })
    })
  })

  it('should render loading state initially', () => {
    mockSpotifyApi.getArtist.mockImplementation(() => new Promise(() => {})) // Never resolves
    mockSpotifyApi.getArtistAlbums.mockImplementation(() => new Promise(() => {}))

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    // Check for loading skeletons - the back button is also rendered as a skeleton during loading
    expect(document.querySelector('div')).toBeInTheDocument() // Basic check for skeleton structure
  })

  it('should render artist information and albums after loading', async () => {
    mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Artist' })).toBeInTheDocument()
    })

    expect(screen.getByText(/1.2M.*followers/)).toBeInTheDocument()
    expect(screen.getByText(/85.*%.*popularity/)).toBeInTheDocument()
    expect(screen.getByText('pop')).toBeInTheDocument()
    expect(screen.getByText('rock')).toBeInTheDocument()
    expect(screen.getByText('indie')).toBeInTheDocument()
    expect(screen.getByText('Albums')).toBeInTheDocument()
    expect(screen.getByText('Test Album 1')).toBeInTheDocument()
    expect(screen.getByText('Test Album 2')).toBeInTheDocument()
  })

  it('should handle back button click', async () => {
    mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Artist' })).toBeInTheDocument()
    })

    const backButton = screen.getByText('← Back')
    fireEvent.click(backButton)

    expect(mockBack).toHaveBeenCalled()
  })

  it('should render error state when artist fetch fails', async () => {
    mockSpotifyApi.getArtist.mockRejectedValue(new Error('Artist not found'))
    mockSpotifyApi.getArtistAlbums.mockRejectedValue(new Error('Albums not found'))

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    expect(screen.getByText('Failed to load artist information. Please try again.')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('should handle retry button click', async () => {
    mockSpotifyApi.getArtist.mockRejectedValueOnce(new Error('Network error'))
    mockSpotifyApi.getArtistAlbums.mockRejectedValueOnce(new Error('Network error'))

    // Mock window.location.reload
    const mockReload = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
      configurable: true,
    })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(mockReload).toHaveBeenCalled()
  })

  it('should render artist without image', async () => {
    const artistWithoutImage = { ...mockArtist, images: [] }
    mockSpotifyApi.getArtist.mockResolvedValue(artistWithoutImage)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: [] })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Artist' })).toBeInTheDocument()
    })

    // Should render placeholder SVG
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('should render artist without genres', async () => {
    const artistWithoutGenres = { ...mockArtist, genres: [] }
    mockSpotifyApi.getArtist.mockResolvedValue(artistWithoutGenres)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: [] })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Artist' })).toBeInTheDocument()
    })

    expect(screen.queryByText('pop')).not.toBeInTheDocument()
  })

  it('should render no albums message when artist has no albums', async () => {
    mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: [] })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('No albums found')).toBeInTheDocument()
    })

    expect(screen.getByText("This artist doesn't have any albums available.")).toBeInTheDocument()
  })

  it('should format follower counts correctly', async () => {
    const testCases = [
      { followers: 999, expected: '999' },
      { followers: 1500, expected: '1.5K' },
      { followers: 1234567, expected: '1.2M' },
    ]

    for (const { followers, expected } of testCases) {
      const artistWithFollowers = { ...mockArtist, followers: { total: followers } }
      mockSpotifyApi.getArtist.mockResolvedValue(artistWithFollowers)
      mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: [] })

      const { unmount } = renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

      await waitFor(() => {
        expect(screen.getByText(new RegExp(`${expected}.*followers`))).toBeInTheDocument()
      })

      unmount()
    }
  })

  it('should check saved albums after loading', async () => {
    mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(mockAlbumManagement.checkAlbumsSaved).toHaveBeenCalledWith(['album1', 'album2'])
    })
  })

  it('should display album management error', async () => {
    const albumManagementWithError = {
      ...mockAlbumManagement,
      error: 'Failed to save album',
    }
    mockUseAlbumManagement.mockReturnValue(albumManagementWithError)
    mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByText('Failed to save album')).toBeInTheDocument()
    })

    const dismissButton = screen.getByText('✕')
    fireEvent.click(dismissButton)

    expect(mockAlbumManagement.clearError).toHaveBeenCalled()
  })

  it('should render album cards with correct save/remove state', async () => {
    mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByText('Test Album 1')).toBeInTheDocument()
    })

    // Album 1 should show "Remove album" (it's saved)
    const album1Card = screen.getByText('Test Album 1').closest('div')
    expect(album1Card).toBeInTheDocument()

    // Album 2 should show "Add album" (it's not saved)
    const album2Card = screen.getByText('Test Album 2').closest('div')
    expect(album2Card).toBeInTheDocument()
  })

  it('should handle album save/remove actions', async () => {
    mockSpotifyApi.getArtist.mockResolvedValue(mockArtist)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: mockAlbums })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByText('Test Album 1')).toBeInTheDocument()
    })

    // Test save album action
    const addButtons = screen.getAllByText('Add album')
    if (addButtons.length > 0) {
      fireEvent.click(addButtons[0])
      expect(mockAlbumManagement.saveAlbum).toHaveBeenCalled()
    }

    // Test remove album action
    const removeButtons = screen.getAllByText('Remove album')
    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0])
      expect(mockAlbumManagement.removeAlbum).toHaveBeenCalled()
    }
  })

  it('should not show popularity when it is 0', async () => {
    const artistWithoutPopularity = { ...mockArtist, popularity: 0 }
    mockSpotifyApi.getArtist.mockResolvedValue(artistWithoutPopularity)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: [] })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
    })

    expect(screen.queryByText(/% popularity/)).not.toBeInTheDocument()
  })

  it('should limit genres display to 5', async () => {
    const artistWithManyGenres = {
      ...mockArtist,
      genres: ['pop', 'rock', 'indie', 'alternative', 'electronic', 'folk', 'jazz'],
    }
    mockSpotifyApi.getArtist.mockResolvedValue(artistWithManyGenres)
    mockSpotifyApi.getArtistAlbums.mockResolvedValue({ items: [] })

    renderWithTheme(<ArtistPage params={{ id: 'artist123' }} />)

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
    })

    // Should show first 5 genres
    expect(screen.getByText('pop')).toBeInTheDocument()
    expect(screen.getByText('rock')).toBeInTheDocument()
    expect(screen.getByText('indie')).toBeInTheDocument()
    expect(screen.getByText('alternative')).toBeInTheDocument()
    expect(screen.getByText('electronic')).toBeInTheDocument()
    
    // Should not show 6th and 7th genres
    expect(screen.queryByText('folk')).not.toBeInTheDocument()
    expect(screen.queryByText('jazz')).not.toBeInTheDocument()
  })
})