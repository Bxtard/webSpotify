'use client'

import { useEffect } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import { GlobalStyles } from '@/styles/globalStyles'
import { Button } from '@/components/ui/Button'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.error};
`

const ErrorTitle = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', error)
    }
    
    // In production, you might want to log to an error reporting service
    // Example: Sentry.captureException(error)
  }, [error])

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/search'
  }

  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <ErrorContainer>
            <ErrorIcon>💥</ErrorIcon>
            <ErrorTitle>Application Error</ErrorTitle>
            <ErrorMessage>
              We&apos;re sorry, but something went wrong with the application. 
              This error has been logged and we&apos;re working to fix it.
            </ErrorMessage>
            
            <ButtonGroup>
              <Button variant="primary" onClick={reset}>
                Try Again
              </Button>
              <Button variant="secondary" onClick={handleReload}>
                Reload Page
              </Button>
              <Button variant="ghost" onClick={handleGoHome}>
                Go to Search
              </Button>
            </ButtonGroup>
          </ErrorContainer>
        </ThemeProvider>
      </body>
    </html>
  )
}