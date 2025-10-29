'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import styled from 'styled-components'
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'

interface AuthWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
}

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
`

const LoadingCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading, error } = useSpotifyAuth()

  useEffect(() => {
    // Don't redirect if we're still loading
    if (loading) return

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/auth/callback']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (requireAuth && !isAuthenticated && !isPublicRoute) {
      // Redirect to login if authentication is required but user is not authenticated
      router.push('/login')
    } else if (isAuthenticated && isPublicRoute && pathname !== '/auth/callback') {
      // Redirect authenticated users away from login page
      router.push('/search')
    }
  }, [isAuthenticated, loading, pathname, router, requireAuth])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingCard>
          <Spinner />
          <LoadingText>Loading...</LoadingText>
          <LoadingSubText>
            Checking your authentication status
          </LoadingSubText>
        </LoadingCard>
      </LoadingContainer>
    )
  }

  // Show error state if there's an authentication error
  if (error && requireAuth && !isAuthenticated) {
    return (
      <LoadingContainer>
        <LoadingCard>
          <LoadingText>Authentication Error</LoadingText>
          <LoadingSubText>{error}</LoadingSubText>
        </LoadingCard>
      </LoadingContainer>
    )
  }

  // Don't render protected content if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}