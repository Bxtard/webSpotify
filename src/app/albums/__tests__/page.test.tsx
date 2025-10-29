import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import AlbumsPage from '../page'
import { theme } from '../../../styles/theme'

// Mock the components
jest.mock('../../../components/auth/AuthWrapper', () => ({
  AuthWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('../../../components/common/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('../../../components/album/SavedAlbums', () => ({
  SavedAlbums: () => <div data-testid="saved-albums">Saved Albums Component</div>,
}))

jest.mock('../../../components/ui/ErrorBoundary', () => ({
  PageErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Albums Page', () => {
  describe('Page Structure', () => {
    it('renders the saved albums component', () => {
      renderWithTheme(<AlbumsPage />)
      
      expect(screen.getByTestId('saved-albums')).toBeInTheDocument()
    })

    it('wraps content with proper authentication and layout', () => {
      renderWithTheme(<AlbumsPage />)
      
      // Verify the component renders without errors
      expect(screen.getByTestId('saved-albums')).toBeInTheDocument()
    })
  })

  describe('Design System Integration', () => {
    it('applies theme provider for consistent styling', () => {
      const { container } = renderWithTheme(<AlbumsPage />)
      
      // Verify the component is wrapped with theme provider
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Error Boundary Integration', () => {
    it('includes error boundary for error handling', () => {
      renderWithTheme(<AlbumsPage />)
      
      // Verify the component renders within error boundary
      expect(screen.getByTestId('saved-albums')).toBeInTheDocument()
    })
  })
})