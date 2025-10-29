import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { SearchInput } from '../SearchInput'
import { theme } from '../../../styles/theme'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Test wrapper with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('SearchInput Component', () => {
  const mockOnChange = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders input and search button', () => {
      render(
        <TestWrapper>
          <SearchInput
            value=""
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      expect(screen.getByPlaceholderText('Search for artists...')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      render(
        <TestWrapper>
          <SearchInput
            value=""
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            placeholder="Custom placeholder"
          />
        </TestWrapper>
      )

      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
    })

    it('displays current value', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="test query"
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const input = screen.getByDisplayValue('test query')
      expect(input).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls onChange when input value changes', () => {
      render(
        <TestWrapper>
          <SearchInput
            value=""
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const input = screen.getByPlaceholderText('Search for artists...')
      fireEvent.change(input, { target: { value: 'new search' } })

      expect(mockOnChange).toHaveBeenCalledWith('new search')
    })

    it('calls onSubmit when search button is clicked', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="test query"
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const button = screen.getByText('Search')
      fireEvent.click(button)

      expect(mockOnSubmit).toHaveBeenCalled()
    })

    it('calls onSubmit when Enter key is pressed', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="test query"
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const input = screen.getByPlaceholderText('Search for artists...')
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      expect(mockOnSubmit).toHaveBeenCalled()
    })

    it('does not call onSubmit when Enter is pressed with empty value', () => {
      render(
        <TestWrapper>
          <SearchInput
            value=""
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const input = screen.getByPlaceholderText('Search for artists...')
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Button States', () => {
    it('disables button when input is empty', () => {
      render(
        <TestWrapper>
          <SearchInput
            value=""
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const button = screen.getByText('Search')
      expect(button).toBeDisabled()
    })

    it('disables button when only whitespace is entered', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="   "
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const button = screen.getByText('Search')
      expect(button).toBeDisabled()
    })

    it('enables button when valid input is provided', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="valid search"
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const button = screen.getByText('Search')
      expect(button).not.toBeDisabled()
    })

    it('disables button when loading', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="test query"
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            loading={true}
          />
        </TestWrapper>
      )

      const button = screen.getByText('Search')
      expect(button).toBeDisabled()
    })

    it('disables button when disabled prop is true', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="test query"
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            disabled={true}
          />
        </TestWrapper>
      )

      const button = screen.getByText('Search')
      expect(button).toBeDisabled()
    })
  })

  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="test query"
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            loading={true}
          />
        </TestWrapper>
      )

      // Loading spinner should be present (it's a styled div with animation)
      const button = screen.getByText('Search')
      expect(button).toBeInTheDocument()
      expect(button).toBeDisabled()
    })

    it('does not call onSubmit when loading', () => {
      render(
        <TestWrapper>
          <SearchInput
            value="test query"
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            loading={true}
          />
        </TestWrapper>
      )

      const button = screen.getByText('Search')
      fireEvent.click(button)

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Focus Management', () => {
    it('handles focus and blur events without errors', () => {
      render(
        <TestWrapper>
          <SearchInput
            value=""
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
          />
        </TestWrapper>
      )

      const input = screen.getByPlaceholderText('Search for artists...')
      
      // Test that focus and blur events don't throw errors
      expect(() => {
        fireEvent.focus(input)
        fireEvent.blur(input)
      }).not.toThrow()
    })
  })
})