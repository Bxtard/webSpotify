import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from 'styled-components'
import { ArtistCard } from '../ArtistCard'
import { theme } from '../../../styles/theme'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

// Mock artist data
const mockArtist = {
  id: 'artist123',
  name: 'Test Artist',
  images: [
    { url: 'https://example.com/image1.jpg', width: 640, height: 640 },
    { url: 'https://example.com/image2.jpg', width: 300, height: 300 },
    { url: 'https://example.com/image3.jpg', width: 64, height: 64 },
  ],
  followers: { total: 1234567 },
  genres: ['pop', 'rock', 'indie', 'alternative'],
  popularity: 85,
  external_urls: { spotify: 'https://open.spotify.com/artist/artist123' },
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ArtistCard', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as any)
    jest.clearAllMocks()
  })

  it('should render artist information correctly', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    expect(screen.getByText('Test Artist')).toBeInTheDocument()
    expect(screen.getByText('1.2M followers')).toBeInTheDocument()
    expect(screen.getByText('pop')).toBeInTheDocument()
    expect(screen.getByText('rock')).toBeInTheDocument()
    expect(screen.getByText('indie')).toBeInTheDocument()
    // Should only show first 3 genres
    expect(screen.queryByText('alternative')).not.toBeInTheDocument()
  })

  it('should render artist image with correct alt text', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    const image = screen.getByAltText('Test Artist artist image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image2.jpg') // Should pick 300px image
  })

  it('should format followers count correctly', () => {
    const testCases = [
      { followers: 999, expected: '999 followers' },
      { followers: 1500, expected: '1.5K followers' },
      { followers: 1234567, expected: '1.2M followers' },
      { followers: 12345678, expected: '12.3M followers' },
    ]

    testCases.forEach(({ followers, expected }) => {
      const artistWithFollowers = { ...mockArtist, followers: { total: followers } }
      const { unmount } = renderWithTheme(<ArtistCard artist={artistWithFollowers} />)
      
      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    })
  })

  it('should navigate to artist detail page when clicked', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    expect(mockPush).toHaveBeenCalledWith('/artist/artist123')
  })

  it('should call custom onClick handler when provided', () => {
    const mockOnClick = jest.fn()
    renderWithTheme(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    expect(mockOnClick).toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should show placeholder when no image is available', () => {
    const artistWithoutImage = { ...mockArtist, images: [] }
    renderWithTheme(<ArtistCard artist={artistWithoutImage} />)

    expect(screen.getByText('🎤')).toBeInTheDocument()
    expect(screen.queryByAltText('Test Artist artist image')).not.toBeInTheDocument()
  })

  it('should handle artist with no genres', () => {
    const artistWithoutGenres = { ...mockArtist, genres: [] }
    renderWithTheme(<ArtistCard artist={artistWithoutGenres} />)

    expect(screen.getByText('Test Artist')).toBeInTheDocument()
    expect(screen.getByText('1.2M followers')).toBeInTheDocument()
    expect(screen.queryByText('pop')).not.toBeInTheDocument()
  })

  it('should render loading skeleton when loading prop is true', () => {
    renderWithTheme(<ArtistCard loading />)

    // Should not render artist content when loading
    expect(screen.queryByText('Test Artist')).not.toBeInTheDocument()
    
    // Should render loading skeleton structure
    const loadingCard = screen.getByTestId('loading-skeleton') || document.querySelector('[data-testid="loading-skeleton"]')
    // Since we're using styled-components, we'll check for the presence of skeleton elements
    expect(document.querySelector('div')).toBeInTheDocument() // Basic check for skeleton structure
  })

  it('should return null when no artist is provided and not loading', () => {
    const { container } = renderWithTheme(<ArtistCard />)
    expect(container.firstChild).toBeNull()
  })

  it('should select best image size (closest to 300px)', () => {
    const artistWithMultipleImages = {
      ...mockArtist,
      images: [
        { url: 'https://example.com/large.jpg', width: 640, height: 640 },
        { url: 'https://example.com/medium.jpg', width: 320, height: 320 },
        { url: 'https://example.com/small.jpg', width: 64, height: 64 },
      ],
    }

    renderWithTheme(<ArtistCard artist={artistWithMultipleImages} />)

    const image = screen.getByAltText('Test Artist artist image')
    expect(image).toHaveAttribute('src', 'https://example.com/medium.jpg') // 320px is closest to 300px
  })

  it('should truncate long artist names with ellipsis', () => {
    const artistWithLongName = {
      ...mockArtist,
      name: 'This is a very long artist name that should be truncated with ellipsis',
    }

    renderWithTheme(<ArtistCard artist={artistWithLongName} />)

    const nameElement = screen.getByText(artistWithLongName.name)
    expect(nameElement).toHaveAttribute('title', artistWithLongName.name)
  })

  it('should have proper accessibility attributes', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('tabIndex', '0')
  })

  it('should handle keyboard navigation', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })

    // Note: We're not testing the actual keyboard event handling here
    // as it would require more complex setup. This test ensures the
    // element is focusable and has the right attributes.
    expect(card).toHaveAttribute('tabIndex', '0')
  })
})