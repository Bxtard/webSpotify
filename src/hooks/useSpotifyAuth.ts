import { useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'
import { spotifyApi } from '../api/spotify'
import { AuthState, SpotifyUser } from '../types/auth'

export function useSpotifyAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    user: null,
    loading: true,
    error: null,
  })

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = authApi.getAccessToken()
        const refreshToken = authApi.getRefreshToken()

        if (!accessToken) {
          setAuthState(prev => ({ ...prev, loading: false }))
          return
        }

        // Check if token is expired
        if (authApi.isTokenExpired() && refreshToken) {
          try {
            const tokenResponse = await authApi.refreshToken(refreshToken)
            authApi.storeTokens(
              tokenResponse.access_token,
              refreshToken,
              tokenResponse.expires_in
            )
            
            // Get user profile with new token
            const user = await spotifyApi.getCurrentUser()
            setAuthState({
              isAuthenticated: true,
              accessToken: tokenResponse.access_token,
              user,
              loading: false,
              error: null,
            })
          } catch (error) {
            // Refresh failed, clear tokens and redirect to login
            authApi.clearTokens()
            setAuthState({
              isAuthenticated: false,
              accessToken: null,
              user: null,
              loading: false,
              error: 'Session expired. Please log in again.',
            })
          }
        } else if (!authApi.isTokenExpired()) {
          // Token is still valid, get user profile
          try {
            const user = await spotifyApi.getCurrentUser()
            setAuthState({
              isAuthenticated: true,
              accessToken,
              user,
              loading: false,
              error: null,
            })
          } catch (error) {
            // Token might be invalid, clear it
            authApi.clearTokens()
            setAuthState({
              isAuthenticated: false,
              accessToken: null,
              user: null,
              loading: false,
              error: 'Authentication failed. Please log in again.',
            })
          }
        } else {
          // Token expired and no refresh token
          authApi.clearTokens()
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        setAuthState({
          isAuthenticated: false,
          accessToken: null,
          user: null,
          loading: false,
          error: 'Authentication error occurred.',
        })
      }
    }

    checkAuthStatus()
  }, [])

  // Handle OAuth callback
  const handleAuthCallback = useCallback(async (code: string, state: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const tokenResponse = await authApi.exchangeCodeForToken(code, state)
      authApi.storeTokens(
        tokenResponse.access_token,
        tokenResponse.refresh_token,
        tokenResponse.expires_in
      )

      // Get user profile
      const user = await spotifyApi.getCurrentUser()
      
      setAuthState({
        isAuthenticated: true,
        accessToken: tokenResponse.access_token,
        user,
        loading: false,
        error: null,
      })

      return true
    } catch (error) {
      console.error('Auth callback error:', error)
      
      // Use the specific error message from the API if available
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Authentication failed. Please try again.'
      
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        user: null,
        loading: false,
        error: errorMessage,
      })
      return false
    }
  }, [])

  // Login function
  const login = useCallback(() => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      authApi.login()
    } catch (error) {
      console.error('Login error:', error)
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to initiate login. Please try again.'
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    authApi.logout()
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      user: null,
      loading: false,
      error: null,
    })
  }, [])

  // Refresh token function
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = authApi.getRefreshToken()
    if (!refreshToken) {
      logout()
      return false
    }

    try {
      const tokenResponse = await authApi.refreshToken(refreshToken)
      authApi.storeTokens(
        tokenResponse.access_token,
        refreshToken,
        tokenResponse.expires_in
      )

      setAuthState(prev => ({
        ...prev,
        accessToken: tokenResponse.access_token,
      }))

      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
      return false
    }
  }, [logout])

  // Clear error function
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...authState,
    login,
    logout,
    handleAuthCallback,
    refreshAccessToken,
    clearError,
  }
}