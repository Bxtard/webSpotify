'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styled from 'styled-components'

import { AuthWrapper } from '../../components/auth/AuthWrapper'
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth'
import { Button } from '../../components/ui/Button'
import { PageErrorBoundary } from '../../components/ui/ErrorBoundary'

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
`

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xl};
    margin: ${({ theme }) => theme.spacing.md};
  }
`

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`

const HeroText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`

const SubText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`

const LoginButton = styled(Button)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  height: 56px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    height: 48px;
  }
`

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
`

const SpotifyIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing.xs};
  font-size: 1.2em;
`

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, loading, error, clearError } = useSpotifyAuth()

  // Handle error messages from URL params
  const urlError = searchParams.get('error')
  const errorMessage = urlError === 'access_denied' 
    ? 'Access was denied. Please try again.'
    : urlError === 'auth_failed'
    ? 'Authentication failed. Please try again.'
    : urlError === 'invalid_request'
    ? 'Invalid request. Please try again.'
    : error

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/search')
    }
  }, [isAuthenticated, loading, router])

  // Clear errors when component mounts
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [error, clearError])

  const handleLogin = () => {
    try {
      login()
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  // Don't render login page if already authenticated
  if (isAuthenticated && !loading) {
    return null
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>Spotify</Logo>
        <HeroText>Disfruta de la mejor música</HeroText>
        <SubText>
          Conecta con tu cuenta de Spotify para descubrir artistas, 
          explorar álbumes y gestionar tu colección musical.
        </SubText>
        
        {errorMessage && (
          <ErrorMessage>
            {errorMessage}
          </ErrorMessage>
        )}
        
        <LoginButton
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={handleLogin}
        >
          <SpotifyIcon>♪</SpotifyIcon>
          Log in con Spotify
        </LoginButton>
      </LoginCard>
    </LoginContainer>
  )
}

export default function LoginPage() {
  return (
    <PageErrorBoundary>
      <AuthWrapper requireAuth={false}>
        <LoginPageContent />
      </AuthWrapper>
    </PageErrorBoundary>
  )
}