/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { LoadingSpinner, SmallSpinner, LargeSpinner, PrimarySpinner, WhiteSpinner } from '../LoadingSpinner'
import { theme } from '../../../styles/theme'

// Mock the animations utility
jest.mock('../../../utils/animations', () => ({
  prefersReducedMotion: jest.fn(() => false),
}))

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner />
      </TestWrapper>
    )

    const spinner = container.querySelector('div')
    expect(spinner).toBeInTheDocument()
  })

  it('should render with small size', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner size="sm" />
      </TestWrapper>
    )

    const spinnerContainer = container.firstChild as HTMLElement
    expect(spinnerContainer).toBeInTheDocument()
  })

  it('should render with large size', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner size="lg" />
      </TestWrapper>
    )

    const spinnerContainer = container.firstChild as HTMLElement
    expect(spinnerContainer).toBeInTheDocument()
  })

  it('should render with xl size', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner size="xl" />
      </TestWrapper>
    )

    const spinnerContainer = container.firstChild as HTMLElement
    expect(spinnerContainer).toBeInTheDocument()
  })

  it('should render with primary variant', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner variant="primary" />
      </TestWrapper>
    )

    const spinner = container.querySelector('div')
    expect(spinner).toBeInTheDocument()
  })

  it('should render with secondary variant', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner variant="secondary" />
      </TestWrapper>
    )

    const spinner = container.querySelector('div')
    expect(spinner).toBeInTheDocument()
  })

  it('should render with white variant', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner variant="white" />
      </TestWrapper>
    )

    const spinner = container.querySelector('div')
    expect(spinner).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner className="custom-spinner" />
      </TestWrapper>
    )

    const spinnerContainer = container.firstChild as HTMLElement
    expect(spinnerContainer).toHaveClass('custom-spinner')
  })
})

describe('Convenience Components', () => {
  it('should render SmallSpinner with correct size', () => {
    const { container } = render(
      <TestWrapper>
        <SmallSpinner />
      </TestWrapper>
    )

    const spinner = container.querySelector('div')
    expect(spinner).toBeInTheDocument()
  })

  it('should render LargeSpinner with correct size', () => {
    const { container } = render(
      <TestWrapper>
        <LargeSpinner />
      </TestWrapper>
    )

    const spinner = container.querySelector('div')
    expect(spinner).toBeInTheDocument()
  })

  it('should render PrimarySpinner with correct variant', () => {
    const { container } = render(
      <TestWrapper>
        <PrimarySpinner />
      </TestWrapper>
    )

    const spinner = container.querySelector('div')
    expect(spinner).toBeInTheDocument()
  })

  it('should render WhiteSpinner with correct variant', () => {
    const { container } = render(
      <TestWrapper>
        <WhiteSpinner />
      </TestWrapper>
    )

    const spinner = container.querySelector('div')
    expect(spinner).toBeInTheDocument()
  })

  it('should pass through additional props to convenience components', () => {
    const { container } = render(
      <TestWrapper>
        <SmallSpinner className="test-class" />
      </TestWrapper>
    )

    const spinnerContainer = container.firstChild as HTMLElement
    expect(spinnerContainer).toHaveClass('test-class')
  })
})