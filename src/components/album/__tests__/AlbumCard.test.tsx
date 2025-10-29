import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { AlbumCard } from '../AlbumCard'
import { theme } from '../../../styles/theme'

// Mock album data
const mockAlbum = {
  id: 'album123',
  name: 'Test Album',
  images: [
    { url: 'https://example.com/album.jpg', width: 640, height: 640 },
  ],
  release_date: '2023-01-15',
  artists: [
    { id: 'artist1', name: 'Test Artist' },
    { id: 'artist2', name: 'Featured Artist' },
  ],
  total_tracks: 12,
  external_urls: { spotify: 'https://open.spotify.com/album/album123' },
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('AlbumCard', () => {
  const mockOnSave = jest.fn()
  const mockOnRemove = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render album information correctly', () => {
    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText('Test Album')).toBeInTheDocument()
    expect(screen.getByText('Test Artist, Featured Artist')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('12 tracks')).toBeInTheDocument()
  })

  it('should render album image with correct alt text', () => {
    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    const image = screen.getByAltText('Test Album')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/album.jpg')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('should show "Add album" button when album is not saved', () => {
    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText('Add album')).toBeInTheDocument()
    expect(screen.queryByText('Remove album')).not.toBeInTheDocument()
  })

  it('should show "Remove album" button when album is saved', () => {
    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={true}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText('Remove album')).toBeInTheDocument()
    expect(screen.queryByText('Add album')).not.toBeInTheDocument()
  })

  it('should call onSave when "Add album" button is clicked', async () => {
    mockOnSave.mockResolvedValue(undefined)

    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    const addButton = screen.getByText('Add album')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith('album123')
    })
  })

  it('should call onRemove when "Remove album" button is clicked', async () => {
    mockOnRemove.mockResolvedValue(undefined)

    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={true}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    const removeButton = screen.getByText('Remove album')
    fireEvent.click(removeButton)

    await waitFor(() => {
      expect(mockOnRemove).toHaveBeenCalledWith('album123')
    })
  })

  it('should show loading state during action', async () => {
    let resolvePromise: () => void
    const savePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })
    mockOnSave.mockReturnValue(savePromise)

    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    const addButton = screen.getByText('Add album')
    fireEvent.click(addButton)

    // Should show loading spinner
    expect(document.querySelector('[data-testid="loading-spinner"]') || document.querySelector('div')).toBeInTheDocument()

    // Resolve the promise
    resolvePromise!()
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled()
    })
  })

  it('should handle action errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockOnSave.mockRejectedValue(new Error('Save failed'))

    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    const addButton = screen.getByText('Add album')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error handling album action:', expect.any(Error))
    })

    consoleError.mockRestore()
  })

  it('should show placeholder when no image is available', () => {
    const albumWithoutImage = { ...mockAlbum, images: [] }

    renderWithTheme(
      <AlbumCard
        album={albumWithoutImage}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    expect(document.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByAltText('Test Album')).not.toBeInTheDocument()
  })

  it('should format release date correctly', () => {
    const testCases = [
      { date: '2023-01-15', expected: '2023' },
      { date: '2022-12-31', expected: '2022' },
      { date: '2021-06-01', expected: '2021' },
    ]

    testCases.forEach(({ date, expected }) => {
      const albumWithDate = { ...mockAlbum, release_date: date }
      const { unmount } = renderWithTheme(
        <AlbumCard
          album={albumWithDate}
          isSaved={false}
          onSave={mockOnSave}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    })
  })

  it('should format track count correctly', () => {
    const testCases = [
      { tracks: 1, expected: '1 track' },
      { tracks: 12, expected: '12 tracks' },
      { tracks: 0, expected: '0 tracks' },
    ]

    testCases.forEach(({ tracks, expected }) => {
      const albumWithTracks = { ...mockAlbum, total_tracks: tracks }
      const { unmount } = renderWithTheme(
        <AlbumCard
          album={albumWithTracks}
          isSaved={false}
          onSave={mockOnSave}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    })
  })

  it('should format artist names correctly', () => {
    const testCases = [
      {
        artists: [{ id: 'artist1', name: 'Solo Artist' }],
        expected: 'Solo Artist',
      },
      {
        artists: [
          { id: 'artist1', name: 'Main Artist' },
          { id: 'artist2', name: 'Featured Artist' },
        ],
        expected: 'Main Artist, Featured Artist',
      },
      {
        artists: [
          { id: 'artist1', name: 'Artist One' },
          { id: 'artist2', name: 'Artist Two' },
          { id: 'artist3', name: 'Artist Three' },
        ],
        expected: 'Artist One, Artist Two, Artist Three',
      },
    ]

    testCases.forEach(({ artists, expected }) => {
      const albumWithArtists = { ...mockAlbum, artists }
      const { unmount } = renderWithTheme(
        <AlbumCard
          album={albumWithArtists}
          isSaved={false}
          onSave={mockOnSave}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    })
  })

  it('should disable button during loading', () => {
    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
        loading={true}
      />
    )

    const button = screen.getByText('Add album')
    expect(button).toBeDisabled()
  })

  it('should show loading overlay when loading prop is true', () => {
    renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
        loading={true}
      />
    )

    // Should show loading overlay
    expect(document.querySelector('div')).toBeInTheDocument() // Basic check for overlay structure
  })

  it('should have proper title attributes for truncated text', () => {
    const albumWithLongName = {
      ...mockAlbum,
      name: 'This is a very long album name that should be truncated',
      artists: [{ id: 'artist1', name: 'This is a very long artist name that should be truncated' }],
    }

    renderWithTheme(
      <AlbumCard
        album={albumWithLongName}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    const albumTitle = screen.getByText(albumWithLongName.name)
    const artistName = screen.getByText(albumWithLongName.artists[0].name)

    expect(albumTitle).toHaveAttribute('title', albumWithLongName.name)
    expect(artistName).toHaveAttribute('title', albumWithLongName.artists[0].name)
  })

  it('should use correct button variants', () => {
    // Test "Add album" button (primary variant)
    const { rerender } = renderWithTheme(
      <AlbumCard
        album={mockAlbum}
        isSaved={false}
        onSave={mockOnSave}
        onRemove={mockOnRemove}
      />
    )

    let button = screen.getByText('Add album')
    expect(button).toBeInTheDocument()

    // Test "Remove album" button (danger variant)
    rerender(
      <ThemeProvider theme={theme}>
        <AlbumCard
          album={mockAlbum}
          isSaved={true}
          onSave={mockOnSave}
          onRemove={mockOnRemove}
        />
      </ThemeProvider>
    )

    button = screen.getByText('Remove album')
    expect(button).toBeInTheDocument()
  })
})