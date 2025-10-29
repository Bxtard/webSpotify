'use client'

import { useEffect } from 'react'
import styled from 'styled-components'
import { Button } from '@/components/ui/Button'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.error};
`

const ErrorTitle = styled.h1`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Route error:', error)
    }
    
    // In production, you might want to log to an error reporting service
    // Example: Sentry.captureException(error)
  }, [error])

  const handleGoHome = () => {
    window.location.href = '/search'
  }

  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>Something went wrong</ErrorTitle>
      <ErrorMessage>
        This page encountered an error. You can try again or return to the search page.
      </ErrorMessage>
      
      <ButtonGroup>
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
        <Button variant="ghost" onClick={handleGoHome}>
          Go to Search
        </Button>
      </ButtonGroup>
    </ErrorContainer>
  )
}