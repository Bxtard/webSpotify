'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styled from 'styled-components'

import { AuthWrapper } from '../../../components/auth/AuthWrapper'
import { useSpotifyAuth } from '../../../hooks/useSpotifyAuth'
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton'
import { Button } from '../../../components/ui/Button'
import { PageErrorBoundary } from '../../../components/ui/ErrorBoundary'

const CallbackContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
`

const CallbackCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xl};
    margin: ${({ theme }) => theme.spacing.md};
  }
`

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const LoadingSubText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-align: center;
`

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

const SuccessTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.success};
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`

const SuccessMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
`

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.colors.surface};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

type CallbackState = 'loading' | 'success' | 'error'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleAuthCallback, loading, error } = useSpotifyAuth()
  const [callbackState, setCallbackState] = useState<CallbackState>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const errorParam = searchParams.get('error')

      // Handle OAuth errors from Spotify
      if (errorParam) {
        setCallbackState('error')
        switch (errorParam) {
          case 'access_denied':
            setErrorMessage('You denied access to your Spotify account. Please try again if you want to use the app.')
            break
          case 'invalid_client':
            setErrorMessage('Invalid client configuration. Please contact support.')
            break
          case 'invalid_request':
            setErrorMessage('Invalid request. Please try logging in again.')
            break
          case 'unauthorized_client':
            setErrorMessage('Unauthorized client. Please contact support.')
            break
          case 'unsupported_response_type':
            setErrorMessage('Unsupported response type. Please contact support.')
            break
          case 'invalid_scope':
            setErrorMessage('Invalid scope requested. Please contact support.')
            break
          default:
            setErrorMessage('An error occurred during authentication. Please try again.')
        }
        return
      }

      // Handle missing required parameters
      if (!code || !state) {
        setCallbackState('error')
        setErrorMessage('Missing required authentication parameters. Please try logging in again.')
        return
      }

      try {
        // Process the authentication callback
        const success = await handleAuthCallback(code, state)
        
        if (success) {
          setCallbackState('success')
          // Redirect to search page after a brief success message
          setTimeout(() => {
            router.push('/search')
          }, 2000)
        } else {
          setCallbackState('error')
          setErrorMessage('Authentication failed. Please try again.')
        }
      } catch (err) {
        console.error('Callback processing error:', err)
        setCallbackState('error')
        setErrorMessage('An unexpected error occurred during authentication. Please try again.')
      }
    }

    processCallback()
  }, [searchParams, handleAuthCallback, router])

  const handleRetry = () => {
    router.push('/login')
  }

  const handleGoToSearch = () => {
    router.push('/search')
  }

  return (
    <CallbackContainer>
      <CallbackCard>
        {callbackState === 'loading' && (
          <LoadingContent>
            <SpinnerContainer>
              <Spinner />
            </SpinnerContainer>
            <LoadingText>Completing authentication...</LoadingText>
            <LoadingSubText>
              Please wait while we securely connect your Spotify account.
            </LoadingSubText>
          </LoadingContent>
        )}

        {callbackState === 'success' && (
          <SuccessContent>
            <SuccessTitle>¡Authentication Successful!</SuccessTitle>
            <SuccessMessage>
              Your Spotify account has been connected successfully. 
              Redirecting you to the app...
            </SuccessMessage>
            <Button 
              variant="primary" 
              onClick={handleGoToSearch}
              fullWidth
            >
              Continue to App
            </Button>
          </SuccessContent>
        )}

        {callbackState === 'error' && (
          <ErrorContent>
            <ErrorTitle>Authentication Error</ErrorTitle>
            <ErrorMessage>
              {errorMessage || error || 'An unexpected error occurred during authentication.'}
            </ErrorMessage>
            <Button 
              variant="primary" 
              onClick={handleRetry}
              fullWidth
            >
              Try Again
            </Button>
          </ErrorContent>
        )}
      </CallbackCard>
    </CallbackContainer>
  )
}

export default function AuthCallbackPage() {
  return (
    <PageErrorBoundary>
      <AuthWrapper requireAuth={false}>
        <AuthCallbackContent />
      </AuthWrapper>
    </PageErrorBoundary>
  )
}