'use client'

import React, { Suspense, lazy, ComponentType } from 'react'
import styled from 'styled-components'
import { LoadingSpinner } from './LoadingSpinner'

interface LazyComponentProps {
  importFn: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ComponentType
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>
  threshold?: number
  rootMargin?: string
  [key: string]: any
}

const LazyContainer = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const RetryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

// Default fallback component
const DefaultFallback: React.FC = () => (
  <LazyContainer>
    <LoadingSpinner size="lg" />
  </LazyContainer>
)

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <ErrorContainer>
    <ErrorTitle>Failed to load component</ErrorTitle>
    <ErrorMessage>{error.message}</ErrorMessage>
    <RetryButton onClick={retry}>
      Try Again
    </RetryButton>
  </ErrorContainer>
)

// Error boundary for lazy components
class LazyErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    fallback: React.ComponentType<{ error: Error; retry: () => void }>
    onRetry: () => void
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyComponent error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry()
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback
      return <FallbackComponent error={this.state.error} retry={this.handleRetry} />
    }

    return this.props.children
  }
}

// Intersection Observer hook for lazy loading
const useIntersectionObserver = (
  threshold = 0.1,
  rootMargin = '100px 0px'
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [hasIntersected, setHasIntersected] = React.useState(false)
  const elementRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element || hasIntersected) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true)
            setHasIntersected(true)
            observer.unobserve(element)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, hasIntersected])

  return { elementRef, isIntersecting, hasIntersected }
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  importFn,
  fallback = DefaultFallback,
  errorFallback = DefaultErrorFallback,
  threshold = 0.1,
  rootMargin = '100px 0px',
  ...props
}) => {
  const { elementRef, hasIntersected } = useIntersectionObserver(threshold, rootMargin)
  const [Component, setComponent] = React.useState<ComponentType<any> | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)

  // Create lazy component when intersection is detected
  React.useEffect(() => {
    if (hasIntersected && !Component) {
      const LazyLoadedComponent = lazy(importFn)
      setComponent(() => LazyLoadedComponent)
    }
  }, [hasIntersected, Component, importFn])

  const handleRetry = React.useCallback(() => {
    setComponent(null)
    setRetryKey(prev => prev + 1)
    // Re-trigger intersection detection
    setTimeout(() => {
      const LazyLoadedComponent = lazy(importFn)
      setComponent(() => LazyLoadedComponent)
    }, 100)
  }, [importFn])

  return (
    <div ref={elementRef}>
      {Component ? (
        <LazyErrorBoundary fallback={errorFallback} onRetry={handleRetry}>
          <Suspense fallback={React.createElement(fallback)}>
            <Component key={retryKey} {...props} />
          </Suspense>
        </LazyErrorBoundary>
      ) : (
        React.createElement(fallback)
      )}
    </div>
  )
}

// HOC for creating lazy components
export const withLazyLoading = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    fallback?: React.ComponentType
    errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>
    threshold?: number
    rootMargin?: string
  }
) => {
  const LazyComponentWrapper = (props: P) => (
    <LazyComponent
      importFn={importFn}
      fallback={options?.fallback}
      errorFallback={options?.errorFallback}
      threshold={options?.threshold}
      rootMargin={options?.rootMargin}
      {...props}
    />
  )
  
  LazyComponentWrapper.displayName = 'LazyComponentWrapper'
  
  return LazyComponentWrapper
}