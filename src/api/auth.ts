import axios from 'axios'

// Spotify OAuth configuration
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

// OAuth scopes needed for the application
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
].join(' ')

// Generate a random string for state parameter
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// Authentication API service
export const authApi = {
  // Generate Spotify OAuth URL
  getAuthUrl: (): string => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI
    
    if (!clientId || !redirectUri) {
      throw new Error('Missing Spotify OAuth configuration')
    }

    const state = generateRandomString(16)
    localStorage.setItem('spotify_auth_state', state)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: SCOPES,
      redirect_uri: redirectUri,
      state: state,
    })

    return `${SPOTIFY_AUTH_URL}?${params.toString()}`
  },

  // Exchange authorization code for access token
  exchangeCodeForToken: async (code: string, state: string): Promise<{
    access_token: string
    refresh_token: string
    expires_in: number
  }> => {
    const storedState = localStorage.getItem('spotify_auth_state')
    
    if (state !== storedState) {
      throw new Error('State mismatch - possible CSRF attack')
    }

    try {
      const response = await axios.post('/api/auth/callback', {
        code,
        state
      })

      // Clean up state
      localStorage.removeItem('spotify_auth_state')

      return response.data
    } catch (error) {
      console.error('Error exchanging code for token:', error)
      
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const errorData = error.response?.data
        
        if (status === 400) {
          throw new Error(errorData?.error || 'Invalid request. Please try again.')
        } else if (status === 401) {
          throw new Error('Unauthorized client. Please contact support.')
        } else if (status === 403) {
          throw new Error('Access forbidden. Please contact support.')
        } else if (status && status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
      }
      
      // Network or other errors
      if ((error as any)?.code === 'NETWORK_ERROR' || !navigator.onLine) {
        throw new Error('Network connection error. Please check your internet connection and try again.')
      }
      
      throw new Error('Authentication failed. Please try again.')
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{
    access_token: string
    expires_in: number
  }> => {
    try {
      const response = await axios.post('/api/auth/refresh', {
        refresh_token: refreshToken
      })

      return response.data
    } catch (error) {
      console.error('Error refreshing token:', error)
      
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const errorData = error.response?.data
        
        if (status === 400) {
          throw new Error(errorData?.error || 'Token refresh failed. Please log in again.')
        } else if (status === 401) {
          throw new Error('Unauthorized client. Please contact support.')
        } else if (status && status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
      }
      
      // Network or other errors
      if ((error as any)?.code === 'NETWORK_ERROR' || !navigator.onLine) {
        throw new Error('Network connection error. Please check your internet connection and try again.')
      }
      
      throw new Error('Token refresh failed. Please log in again.')
    }
  },

  // Store tokens in localStorage
  storeTokens: (accessToken: string, refreshToken: string, expiresIn: number): void => {
    const expirationTime = Date.now() + expiresIn * 1000
    
    localStorage.setItem('spotify_access_token', accessToken)
    localStorage.setItem('spotify_refresh_token', refreshToken)
    localStorage.setItem('spotify_token_expiration', expirationTime.toString())
  },

  // Get stored access token
  getAccessToken: (): string | null => {
    return localStorage.getItem('spotify_access_token')
  },

  // Get stored refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem('spotify_refresh_token')
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const expiration = localStorage.getItem('spotify_token_expiration')
    if (!expiration) return true
    
    return Date.now() > parseInt(expiration)
  },

  // Clear all stored tokens
  clearTokens: (): void => {
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_refresh_token')
    localStorage.removeItem('spotify_token_expiration')
    localStorage.removeItem('spotify_auth_state')
  },

  // Initiate login flow
  login: (): void => {
    try {
      const authUrl = authApi.getAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      console.error('Error initiating login:', error)
      throw new Error('Failed to initiate login. Please check your configuration and try again.')
    }
  },

  // Logout user
  logout: (): void => {
    authApi.clearTokens()
    window.location.href = '/login'
  },
}