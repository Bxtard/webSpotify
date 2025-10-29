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
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(196, 255, 97, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(196, 255, 97, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing['2xl']};
    margin: ${({ theme }) => theme.spacing.md};
    max-width: 360px;
  }
`

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.brand.fontSize};
  font-weight: ${({ theme }) => theme.typography.brand.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  letter-spacing: ${({ theme }) => theme.typography.brand.letterSpacing};
  line-height: ${({ theme }) => theme.typography.brand.lineHeight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`

const HeroText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`

const SubText = styled.p`
  font-size: ${({ theme }) => theme.typography.subtitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.subtitle.fontWeight};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  line-height: ${({ theme }) => theme.typography.subtitle.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.subtitle.letterSpacing};
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  }
`

const LoginButton = styled(Button)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  height: ${({ theme }) => theme.layout.searchInputHeight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(196, 255, 97, 0.3);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    height: 48px;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.cardMeta.fontSize};
  font-weight: ${({ theme }) => theme.typography.cardMeta.fontWeight};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.cardMeta.lineHeight};
`

const SpotifyIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: 1.3em;
  display: inline-flex;
  align-items: center;
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
        <Logo>SPOTIFY APP</Logo>
        <HeroText>Disfruta de la mejor música</HeroText>
        <SubText>
          Conecta con tu cuenta de Spotify para descubrir artistas,
          explorar álbumes y gestionar tu colección musical con SPOTIFY APP.
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