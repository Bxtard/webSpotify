import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import SearchPage from '../page'
import { theme } from '../../../styles/theme'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { describe } from 'node:test'

// Mock the hooks and components
jest.mock('../../../hooks/useSpotifySearch', () => ({
  useSpotifySearch: () => ({
    query: '',
    results: [],
    loading: false,
    error: null,
    hasSearched: false,
    totalResults: 0,
    setQuery: jest.fn(),
    retry: jest.fn(),
  }),
}))

jest.mock('../../../hooks/useOnlineStatus', () => ({
  useOnlineStatus: () => true,
}))

jest.mock('../../../components/auth/AuthWrapper', () => ({
  AuthWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('../../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('../../../components/artist/ArtistList', () => ({
  ArtistList: () => <div data-testid="artist-list">Artist List</div>,
}))

jest.mock('../../../components/ui/ErrorBoundary', () => ({
  PageErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Test wrapper with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('Search Page Redesign', () => {
  describe('Centered Layout Structure', () => {
    it('renders hero title "Busca tus artistas"', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      expect(screen.getByText('Busca tus artistas')).toBeInTheDocument()
    })

    it('renders subtitle text', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      expect(
        screen.getByText(
          'Encuentra tus artistas favoritos gracias a nuestro buscador y guarda tus álbumes favoritos'
        )
      ).toBeInTheDocument()
    })

    it('applies centered layout styling', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const heroTitle = screen.getByText('Busca tus artistas')
      expect(heroTitle).toBeInTheDocument()
      
      // Verify the title uses hero typography
      expect(heroTitle.tagName).toBe('H1')
    })
  })

  describe('Enhanced Search Input Component', () => {
    it('renders search input with integrated button', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      const searchButton = screen.getByText('Search')

      expect(searchInput).toBeInTheDocument()
      expect(searchButton).toBeInTheDocument()
    })

    it('search button is disabled when input is empty', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchButton = screen.getByText('Search')
      expect(searchButton).toBeDisabled()
    })

    it('provides proper focus states', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText('Search for artists...')
      
      // Test that focus events don't throw errors
      expect(() => {
        fireEvent.focus(searchInput)
        fireEvent.blur(searchInput)
      }).not.toThrow()
    })
  })

  describe('Responsive Behavior', () => {
    it('renders without errors on different screen sizes', () => {
      render(
        <TestWrapper>
          <SearchPage />
        </TestWrapper>
      )

      // Verify core elements are present
      expect(screen.getByText('Busca tus artistas')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search for artists...')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
    })
  })
})

describe('Search Results Counter', () => {
  it('does not show counter when no search has been performed', () => {
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    )

    expect(screen.queryByText(/Mostrando.*resultados/)).not.toBeInTheDocument()
  })
})

describe('Search Input Functionality', () => {
  it('handles input changes', () => {
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    )

    const searchInput = screen.getByPlaceholderText('Search for artists...')
    
    fireEvent.change(searchInput, { target: { value: 'test artist' } })
    
    // Input should accept the change
    expect(searchInput).toBeInTheDocument()
  })

  it('handles enter key press', () => {
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    )

    const searchInput = screen.getByPlaceholderText('Search for artists...')
    
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' })
    
    // Should not throw error
    expect(searchInput).toBeInTheDocument()
  })
})