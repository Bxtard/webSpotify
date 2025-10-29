import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { ArtistList } from '../ArtistList'
import { theme } from '../../../styles/theme'

// Mock the ArtistCard component
jest.mock('../ArtistCard', () => ({
  ArtistCard: ({ artist, loading, onClick }: any) => {
    if (loading) {
      return <div data-testid="loading-artist-card">Loading...</div>
    }
    
    if (!artist) return null
    
    return (
      <div 
        data-testid={`artist-card-${artist.id}`}
        onClick={onClick ? () => onClick() : undefined}
      >
        {artist.name}
      </div>
    )
  }
}))

// Mock artist data
const mockArtists = [
  {
    id: 'artist1',
    name: 'Artist One',
    images: [{ url: 'https://example.com/image1.jpg', width: 300, height: 300 }],
    followers: { total: 1000000 },
    genres: ['pop'],
    popularity: 80,
    external_urls: { spotify: 'https://open.spotify.com/artist/artist1' },
  },
  {
    id: 'artist2',
    name: 'Artist Two',
    images: [{ url: 'https://example.com/image2.jpg', width: 300, height: 300 }],
    followers: { total: 500000 },
    genres: ['rock'],
    popularity: 70,
    external_urls: { spotify: 'https://open.spotify.com/artist/artist2' },
  },
  {
    id: 'artist3',
    name: 'Artist Three',
    images: [],
    followers: { total: 250000 },
    genres: ['jazz'],
    popularity: 60,
    external_urls: { spotify: 'https://open.spotify.com/artist/artist3' },
  },
]

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ArtistList', () => {
  it('should render all artists in the list', () => {
    renderWithTheme(<ArtistList artists={mockArtists} />)

    expect(screen.getByTestId('artist-card-artist1')).toBeInTheDocument()
    expect(screen.getByTestId('artist-card-artist2')).toBeInTheDocument()
    expect(screen.getByTestId('artist-card-artist3')).toBeInTheDocument()
    
    expect(screen.getByText('Artist One')).toBeInTheDocument()
    expect(screen.getByText('Artist Two')).toBeInTheDocument()
    expect(screen.getByText('Artist Three')).toBeInTheDocument()
  })

  it('should render empty list when no artists provided', () => {
    renderWithTheme(<ArtistList artists={[]} />)

    expect(screen.queryByTestId(/artist-card-/)).not.toBeInTheDocument()
  })

  it('should render loading skeleton cards when loading', () => {
    renderWithTheme(<ArtistList artists={[]} loading />)

    const loadingCards = screen.getAllByTestId('loading-artist-card')
    expect(loadingCards).toHaveLength(8) // Should render 8 loading cards
    
    loadingCards.forEach(card => {
      expect(card).toHaveTextContent('Loading...')
    })
  })

  it('should not render artist cards when loading is true', () => {
    renderWithTheme(<ArtistList artists={mockArtists} loading />)

    // Should not render actual artist cards when loading
    expect(screen.queryByTestId('artist-card-artist1')).not.toBeInTheDocument()
    expect(screen.queryByText('Artist One')).not.toBeInTheDocument()
    
    // Should render loading cards instead
    expect(screen.getAllByTestId('loading-artist-card')).toHaveLength(8)
  })

  it('should call onArtistClick when artist card is clicked', () => {
    const mockOnArtistClick = jest.fn()
    renderWithTheme(
      <ArtistList 
        artists={mockArtists} 
        onArtistClick={mockOnArtistClick}
      />
    )

    const firstArtistCard = screen.getByTestId('artist-card-artist1')
    fireEvent.click(firstArtistCard)

    expect(mockOnArtistClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onArtistClick when not provided', () => {
    // This test ensures no errors occur when onArtistClick is not provided
    renderWithTheme(<ArtistList artists={mockArtists} />)

    const firstArtistCard = screen.getByTestId('artist-card-artist1')
    
    // Should not throw error when clicked
    expect(() => {
      fireEvent.click(firstArtistCard)
    }).not.toThrow()
  })

  it('should handle large number of artists', () => {
    const manyArtists = Array.from({ length: 50 }, (_, index) => ({
      id: `artist${index}`,
      name: `Artist ${index}`,
      images: [{ url: `https://example.com/image${index}.jpg`, width: 300, height: 300 }],
      followers: { total: 1000 * index },
      genres: ['pop'],
      popularity: 50 + index,
      external_urls: { spotify: `https://open.spotify.com/artist/artist${index}` },
    }))

    renderWithTheme(<ArtistList artists={manyArtists} />)

    // Check that all artists are rendered
    manyArtists.forEach(artist => {
      expect(screen.getByTestId(`artist-card-${artist.id}`)).toBeInTheDocument()
    })
  })

  it('should maintain grid layout structure', () => {
    const { container } = renderWithTheme(<ArtistList artists={mockArtists} />)

    // Check that the container has the grid structure
    const gridContainer = container.firstChild
    expect(gridContainer).toBeInTheDocument()
    
    // Verify all artist cards are within the grid
    const artistCards = screen.getAllByTestId(/artist-card-/)
    expect(artistCards).toHaveLength(3)
  })

  it('should handle artists with missing data gracefully', () => {
    const artistsWithMissingData = [
      {
        id: 'artist1',
        name: 'Complete Artist',
        images: [{ url: 'https://example.com/image1.jpg', width: 300, height: 300 }],
        followers: { total: 1000000 },
        genres: ['pop'],
        popularity: 80,
        external_urls: { spotify: 'https://open.spotify.com/artist/artist1' },
      },
      {
        id: 'artist2',
        name: 'Minimal Artist',
        images: [],
        followers: { total: 0 },
        genres: [],
        popularity: 0,
        external_urls: { spotify: 'https://open.spotify.com/artist/artist2' },
      },
    ]

    renderWithTheme(<ArtistList artists={artistsWithMissingData} />)

    expect(screen.getByTestId('artist-card-artist1')).toBeInTheDocument()
    expect(screen.getByTestId('artist-card-artist2')).toBeInTheDocument()
    expect(screen.getByText('Complete Artist')).toBeInTheDocument()
    expect(screen.getByText('Minimal Artist')).toBeInTheDocument()
  })

  it('should pass correct props to ArtistCard components', () => {
    const mockOnArtistClick = jest.fn()
    renderWithTheme(
      <ArtistList 
        artists={[mockArtists[0]]} 
        onArtistClick={mockOnArtistClick}
      />
    )

    const artistCard = screen.getByTestId('artist-card-artist1')
    expect(artistCard).toBeInTheDocument()
    
    // Click to verify onClick is passed correctly
    fireEvent.click(artistCard)
    expect(mockOnArtistClick).toHaveBeenCalled()
  })

  it('should render unique keys for each artist card', () => {
    const { container } = renderWithTheme(<ArtistList artists={mockArtists} />)

    // React should render each card with unique keys (artist.id)
    // This is more of an implementation detail, but we can verify
    // that all cards are rendered without React key warnings
    const artistCards = screen.getAllByTestId(/artist-card-/)
    expect(artistCards).toHaveLength(mockArtists.length)
    
    // Each card should have a unique testid based on artist id
    mockArtists.forEach(artist => {
      expect(screen.getByTestId(`artist-card-${artist.id}`)).toBeInTheDocument()
    })
  })
})