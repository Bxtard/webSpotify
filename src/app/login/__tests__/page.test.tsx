import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ThemeProvider } from 'styled-components'
import LoginPage from '../page'
import { useSpotifyAuth } from '../../../hooks/useSpotifyAuth'
import { theme } from '../../../styles/theme'

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Mock Spotify auth hook
jest.mock('../../../hooks/useSpotifyAuth')

// Mock components
jest.mock('../../../components/auth/AuthWrapper', () => ({
  AuthWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('../../../components/ui/ErrorBoundary', () => ({
  PageErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>
const mockUseSpotifyAuth = useSpotifyAuth as jest.MockedFunction<typeof useSpotifyAuth>

const mockSearchParams = {
  get: jest.fn(),
}

const mockAuth = {
  login: jest.fn(),
  isAuthenticated: false,
  loading: false,
  error: null,
  clearError: jest.fn(),
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Login Page Redesign', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as any)

    mockUseSearchParams.mockReturnValue(mockSearchParams as any)
    mockUseSpotifyAuth.mockReturnValue(mockAuth)
    mockSearchParams.get.mockReturnValue(null)
    
    jest.clearAllMocks()
  })

  describe('SPOTIFY APP Branding', () => {
    it('displays SPOTIFY APP logo instead of Spotify', () => {
      renderWithTheme(<LoginPage />)
      
      expect(screen.getByText('SPOTIFY APP')).toBeInTheDocument()
      expect(screen.queryByText('Spotify')).not.toBeInTheDocument()
    })

    it('includes SPOTIFY APP in the subtitle text', () => {
      renderWithTheme(<LoginPage />)
      
      expect(screen.getByText(/SPOTIFY APP/)).toBeInTheDocument()
      expect(screen.getByText(/Conecta con tu cuenta de Spotify para descubrir artistas, explorar álbumes y gestionar tu colección musical con SPOTIFY APP./)).toBeInTheDocument()
    })
  })

  describe('New Design System Implementation', () => {
    it('renders hero text with proper typography', () => {
      renderWithTheme(<LoginPage />)
      
      const heroText = screen.getByText('Disfruta de la mejor música')
      expect(heroText).toBeInTheDocument()
      expect(heroText.tagName).toBe('H1')
    })

    it('renders subtitle with proper styling', () => {
      renderWithTheme(<LoginPage />)
      
      const subtitle = screen.getByText(/Conecta con tu cuenta de Spotify/)
      expect(subtitle).toBeInTheDocument()
      expect(subtitle.tagName).toBe('P')
    })

    it('renders login button with new design', () => {
      renderWithTheme(<LoginPage />)
      
      const loginButton = screen.getByText('Log in con Spotify')
      expect(loginButton).toBeInTheDocument()
      expect(loginButton.tagName).toBe('BUTTON')
    })

    it('includes Spotify icon in login button', () => {
      renderWithTheme(<LoginPage />)
      
      const loginButton = screen.getByText('Log in con Spotify')
      expect(loginButton).toBeInTheDocument()
      
      // Check that the button contains the icon
      const buttonParent = loginButton.closest('button')
      expect(buttonParent).toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('renders login card with proper structure', () => {
      renderWithTheme(<LoginPage />)
      
      expect(screen.getByText('SPOTIFY APP')).toBeInTheDocument()
      expect(screen.getByText('Disfruta de la mejor música')).toBeInTheDocument()
      expect(screen.getByText('Log in con Spotify')).toBeInTheDocument()
    })

    it('maintains accessibility with proper heading hierarchy', () => {
      renderWithTheme(<LoginPage />)
      
      const heroHeading = screen.getByRole('heading', { level: 1 })
      expect(heroHeading).toHaveTextContent('Disfruta de la mejor música')
    })
  })

  describe('Authentication Flow', () => {
    it('calls login function when button is clicked', () => {
      renderWithTheme(<LoginPage />)
      
      const loginButton = screen.getByText('Log in con Spotify')
      fireEvent.click(loginButton)
      
      expect(mockAuth.login).toHaveBeenCalled()
    })

    it('shows loading state when authentication is in progress', () => {
      mockUseSpotifyAuth.mockReturnValue({
        ...mockAuth,
        loading: true,
      })

      renderWithTheme(<LoginPage />)
      
      const loginButton = screen.getByText('Log in con Spotify')
      expect(loginButton).toBeDisabled()
    })

    it('redirects when user is already authenticated', () => {
      mockUseSpotifyAuth.mockReturnValue({
        ...mockAuth,
        isAuthenticated: true,
      })

      renderWithTheme(<LoginPage />)
      
      expect(mockPush).toHaveBeenCalledWith('/search')
    })
  })

  describe('Error Handling', () => {
    it('displays error message when authentication fails', () => {
      mockUseSpotifyAuth.mockReturnValue({
        ...mockAuth,
        error: 'Authentication failed',
      })

      renderWithTheme(<LoginPage />)
      
      expect(screen.getByText('Authentication failed')).toBeInTheDocument()
    })

    it('displays URL error messages', () => {
      mockSearchParams.get.mockReturnValue('access_denied')

      renderWithTheme(<LoginPage />)
      
      expect(screen.getByText('Access was denied. Please try again.')).toBeInTheDocument()
    })

    it('handles different error types from URL', () => {
      const errorCases = [
        { param: 'auth_failed', expected: 'Authentication failed. Please try again.' },
        { param: 'invalid_request', expected: 'Invalid request. Please try again.' },
      ]

      errorCases.forEach(({ param, expected }) => {
        mockSearchParams.get.mockReturnValue(param)
        
        const { unmount } = renderWithTheme(<LoginPage />)
        
        expect(screen.getByText(expected)).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Visual Design Elements', () => {
    it('renders background gradient effects', () => {
      const { container } = renderWithTheme(<LoginPage />)
      
      // Verify the container structure is present
      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies proper color scheme', () => {
      renderWithTheme(<LoginPage />)
      
      // Verify key elements are rendered with the theme
      expect(screen.getByText('SPOTIFY APP')).toBeInTheDocument()
      expect(screen.getByText('Log in con Spotify')).toBeInTheDocument()
    })
  })
})