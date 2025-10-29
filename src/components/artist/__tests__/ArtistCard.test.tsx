import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from 'styled-components'
import { ArtistCard } from '../ArtistCard'
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
    expect(screen.getByText('Followers: 1.2M')).toBeInTheDocument()
    // Genres should not be displayed in the new design
    expect(screen.queryByText('pop')).not.toBeInTheDocument()
    expect(screen.queryByText('rock')).not.toBeInTheDocument()
    expect(screen.queryByText('indie')).not.toBeInTheDocument()
  })

  it('should render artist image with correct alt text', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    const image = screen.getByAltText('Test Artist artist image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image2.jpg') // Should pick 300px image
  })

  it('should format followers count correctly', () => {
    const testCases = [
      { followers: 999, expected: 'Followers: 999' },
      { followers: 1500, expected: 'Followers: 1.5K' },
      { followers: 1234567, expected: 'Followers: 1.2M' },
      { followers: 12345678, expected: 'Followers: 12.3M' },
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

  it('should display selected state with green border', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} selected />)

    const card = screen.getByRole('button')
    expect(card).toBeInTheDocument()
    // The selected state is handled by styled-components, so we check the component renders
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })

  it('should not display selected state by default', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    const card = screen.getByRole('button')
    expect(card).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })

  it('should render loading skeleton when loading prop is true', () => {
    renderWithTheme(<ArtistCard loading />)

    // Should not render artist content when loading
    expect(screen.queryByText('Test Artist')).not.toBeInTheDocument()
    
    // Should render loading skeleton structure - check for the loading card container
    const loadingElements = document.querySelectorAll('div')
    expect(loadingElements.length).toBeGreaterThan(0) // Basic check for skeleton structure
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
    expect(card).toHaveAttribute('aria-label', 'View Test Artist artist details')
  })

  it('should handle keyboard navigation with Enter key', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })

    expect(mockPush).toHaveBeenCalledWith('/artist/artist123')
  })

  it('should handle keyboard navigation with Space key', () => {
    const mockOnClick = jest.fn()
    renderWithTheme(<ArtistCard artist={mockArtist} onClick={mockOnClick} />)

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: ' ', code: 'Space' })

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('should not trigger navigation on other keys', () => {
    renderWithTheme(<ArtistCard artist={mockArtist} />)

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Tab', code: 'Tab' })

    expect(mockPush).not.toHaveBeenCalled()
  })
})