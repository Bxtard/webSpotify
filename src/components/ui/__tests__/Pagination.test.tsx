import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { Pagination } from '../Pagination'
import { theme } from '../../../styles/theme'

// Test wrapper with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders pagination with page numbers', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 3')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 4')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 5')).toBeInTheDocument()
    })

    it('renders navigation buttons', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    })

    it('does not render when totalPages is 1 or less', () => {
      const { container } = render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={1}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()
    })

    it('does not render when totalPages is 0', () => {
      const { container } = render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={0}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Active State Highlighting', () => {
    it('highlights current page', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const currentPageButton = screen.getByLabelText('Page 3')
      expect(currentPageButton).toHaveAttribute('aria-current', 'page')
    })

    it('does not highlight non-current pages', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const page1Button = screen.getByLabelText('Page 1')
      const page2Button = screen.getByLabelText('Page 2')
      
      expect(page1Button).not.toHaveAttribute('aria-current', 'page')
      expect(page2Button).not.toHaveAttribute('aria-current', 'page')
    })
  })

  describe('Page Navigation', () => {
    it('calls onPageChange when page number is clicked', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const page3Button = screen.getByLabelText('Page 3')
      fireEvent.click(page3Button)

      expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })

    it('calls onPageChange when previous button is clicked', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const prevButton = screen.getByLabelText('Previous page')
      fireEvent.click(prevButton)

      expect(mockOnPageChange).toHaveBeenCalledWith(2)
    })

    it('calls onPageChange when next button is clicked', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const nextButton = screen.getByLabelText('Next page')
      fireEvent.click(nextButton)

      expect(mockOnPageChange).toHaveBeenCalledWith(4)
    })

    it('does not call onPageChange when current page is clicked', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const currentPageButton = screen.getByLabelText('Page 3')
      fireEvent.click(currentPageButton)

      expect(mockOnPageChange).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('disables previous button on first page', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const prevButton = screen.getByLabelText('Previous page')
      expect(prevButton).toBeDisabled()
    })

    it('disables next button on last page', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={5}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const nextButton = screen.getByLabelText('Next page')
      expect(nextButton).toBeDisabled()
    })

    it('does not call onPageChange when previous is clicked on first page', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const prevButton = screen.getByLabelText('Previous page')
      fireEvent.click(prevButton)

      expect(mockOnPageChange).not.toHaveBeenCalled()
    })

    it('does not call onPageChange when next is clicked on last page', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={5}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const nextButton = screen.getByLabelText('Next page')
      fireEvent.click(nextButton)

      expect(mockOnPageChange).not.toHaveBeenCalled()
    })
  })

  describe('Ellipsis Display', () => {
    it('shows ellipsis when there are many pages', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={5}
            totalPages={20}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const ellipsis = screen.getAllByText('...')
      expect(ellipsis.length).toBeGreaterThan(0)
    })

    it('shows all pages when total pages is less than maxVisiblePages', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
            maxVisiblePages={7}
          />
        </TestWrapper>
      )

      // Should show all 5 pages
      expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 3')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 4')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 5')).toBeInTheDocument()
      
      // Should not show ellipsis
      expect(screen.queryByText('...')).not.toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('disables all buttons when disabled prop is true', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
            disabled={true}
          />
        </TestWrapper>
      )

      const prevButton = screen.getByLabelText('Previous page')
      const nextButton = screen.getByLabelText('Next page')
      const page1Button = screen.getByLabelText('Page 1')
      const page2Button = screen.getByLabelText('Page 2')

      expect(prevButton).toBeDisabled()
      expect(nextButton).toBeDisabled()
      expect(page1Button).toBeDisabled()
      expect(page2Button).toBeDisabled()
    })

    it('does not call onPageChange when disabled', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
            disabled={true}
          />
        </TestWrapper>
      )

      const page1Button = screen.getByLabelText('Page 1')
      fireEvent.click(page1Button)

      expect(mockOnPageChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 3')).toBeInTheDocument()
    })

    it('sets aria-current for current page', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={3}
            totalPages={5}
            onPageChange={mockOnPageChange}
          />
        </TestWrapper>
      )

      const currentPageButton = screen.getByLabelText('Page 3')
      expect(currentPageButton).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('Custom maxVisiblePages', () => {
    it('respects custom maxVisiblePages prop', () => {
      render(
        <TestWrapper>
          <Pagination
            currentPage={1}
            totalPages={10}
            onPageChange={mockOnPageChange}
            maxVisiblePages={3}
          />
        </TestWrapper>
      )

      // With maxVisiblePages=3, should show pages 1, 2, and ellipsis, then 10
      expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Page 10')).toBeInTheDocument()
      expect(screen.getByText('...')).toBeInTheDocument()
    })
  })
})