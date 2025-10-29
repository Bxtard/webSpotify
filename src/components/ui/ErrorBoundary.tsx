'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import styled from 'styled-components'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  level?: 'global' | 'page' | 'component'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  min-height: 300px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.error};
`

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 500px;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const ErrorDetails = styled.details`
  margin-top: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 600px;
  
  summary {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    
    &:hover {
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
`

const ErrorStack = styled.pre`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to log to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/search'
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { level = 'component' } = this.props
      const { error, errorInfo } = this.state

      // Different error messages based on error boundary level
      const getErrorContent = () => {
        switch (level) {
          case 'global':
            return {
              title: 'Something went wrong',
              message: 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.',
              showReload: true,
              showHome: true,
            }
          case 'page':
            return {
              title: 'Page Error',
              message: 'This page encountered an error. You can try going back to the home page or refreshing the page.',
              showReload: true,
              showHome: true,
            }
          case 'component':
            return {
              title: 'Component Error',
              message: 'A component on this page failed to load. You can try refreshing or continue using other parts of the app.',
              showReload: false,
              showHome: false,
            }
          default:
            return {
              title: 'Error',
              message: 'Something went wrong. Please try again.',
              showReload: false,
              showHome: false,
            }
        }
      }

      const errorContent = getErrorContent()

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>{errorContent.title}</ErrorTitle>
          <ErrorMessage>{errorContent.message}</ErrorMessage>
          
          <ButtonGroup>
            <Button variant="primary" onClick={this.handleRetry}>
              Try Again
            </Button>
            {errorContent.showReload && (
              <Button variant="secondary" onClick={this.handleReload}>
                Refresh Page
              </Button>
            )}
            {errorContent.showHome && (
              <Button variant="ghost" onClick={this.handleGoHome}>
                Go to Search
              </Button>
            )}
          </ButtonGroup>

          {process.env.NODE_ENV === 'development' && error && (
            <ErrorDetails>
              <summary>Error Details (Development Only)</summary>
              <ErrorStack>
                <strong>Error:</strong> {error.message}
                {'\n\n'}
                <strong>Stack:</strong>
                {'\n'}
                {error.stack}
                {errorInfo && (
                  <>
                    {'\n\n'}
                    <strong>Component Stack:</strong>
                    {'\n'}
                    {errorInfo.componentStack}
                  </>
                )}
              </ErrorStack>
            </ErrorDetails>
          )}
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}

// Convenience components for different error boundary levels
export const GlobalErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <ErrorBoundary level="global" {...props} />
)

export const PageErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <ErrorBoundary level="page" {...props} />
)

export const ComponentErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <ErrorBoundary level="component" {...props} />
)