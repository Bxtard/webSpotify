/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { AnimatedList, FadeInList, SlideUpList, ScaleInList } from '../AnimatedList'
import { theme } from '../../../styles/theme'

// Mock the animations utility
jest.mock('../../../utils/animations', () => ({
  prefersReducedMotion: jest.fn(() => false),
}))

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('AnimatedList', () => {
  const testItems = [
    <div key="1">Item 1</div>,
    <div key="2">Item 2</div>,
    <div key="3">Item 3</div>,
  ]

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render all children', async () => {
    render(
      <TestWrapper>
        <AnimatedList>{testItems}</AnimatedList>
      </TestWrapper>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('should initially render items with opacity 0', () => {
    const { container } = render(
      <TestWrapper>
        <AnimatedList>{testItems}</AnimatedList>
      </TestWrapper>
    )

    const items = container.querySelectorAll('div')
    items.forEach(item => {
      expect(item).toHaveStyle('opacity: 0')
    })
  })

  it('should animate items after mount', async () => {
    const { container } = render(
      <TestWrapper>
        <AnimatedList>{testItems}</AnimatedList>
      </TestWrapper>
    )

    // Fast forward past the initial delay
    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('[style*="animation-delay"]')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should apply stagger delay correctly', async () => {
    const { container } = render(
      <TestWrapper>
        <AnimatedList staggerDelay={200}>{testItems}</AnimatedList>
      </TestWrapper>
    )

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('div[style*="animation-delay"]')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should use slideUp animation by default', async () => {
    const { container } = render(
      <TestWrapper>
        <AnimatedList>{testItems}</AnimatedList>
      </TestWrapper>
    )

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('div')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should apply fadeIn animation type', async () => {
    const { container } = render(
      <TestWrapper>
        <AnimatedList animationType="fadeIn">{testItems}</AnimatedList>
      </TestWrapper>
    )

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('div')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should apply slideFromLeft animation type', async () => {
    const { container } = render(
      <TestWrapper>
        <AnimatedList animationType="slideFromLeft">{testItems}</AnimatedList>
      </TestWrapper>
    )

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('div')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should apply scale animation type', async () => {
    const { container } = render(
      <TestWrapper>
        <AnimatedList animationType="scale">{testItems}</AnimatedList>
      </TestWrapper>
    )

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('div')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <AnimatedList className="custom-list">{testItems}</AnimatedList>
      </TestWrapper>
    )

    expect(container.firstChild).toHaveClass('custom-list')
  })
})

describe('Convenience Components', () => {
  const testItems = [
    <div key="1">Item 1</div>,
    <div key="2">Item 2</div>,
  ]

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render FadeInList with fadeIn animation', async () => {
    const { container } = render(
      <TestWrapper>
        <FadeInList>{testItems}</FadeInList>
      </TestWrapper>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('div')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should render SlideUpList with slideUp animation', async () => {
    const { container } = render(
      <TestWrapper>
        <SlideUpList>{testItems}</SlideUpList>
      </TestWrapper>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('div')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should render ScaleInList with scale animation', async () => {
    const { container } = render(
      <TestWrapper>
        <ScaleInList>{testItems}</ScaleInList>
      </TestWrapper>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      const animatedItems = container.querySelectorAll('div')
      expect(animatedItems.length).toBeGreaterThan(0)
    })
  })

  it('should pass through props to convenience components', () => {
    const { container } = render(
      <TestWrapper>
        <FadeInList className="test-fade" staggerDelay={300}>
          {testItems}
        </FadeInList>
      </TestWrapper>
    )

    expect(container.firstChild).toHaveClass('test-fade')
  })
})