import axios, { AxiosInstance, AxiosError } from 'axios'
import { SpotifyArtist, SpotifyAlbum, SpotifySearchResponse } from '../types/spotify'

// Enhanced error types
export class SpotifyApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'SpotifyApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string, public retryable: boolean = true) {
    super(message)
    this.name = 'NetworkError'
  }
}

// Retry configuration
interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
}

// Retry utility function
const withRetry = async <T>(
  operation: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig
): Promise<T> => {
  let lastError: Error

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
          config.maxDelay
        )
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on certain errors
      if (error instanceof SpotifyApiError && !error.retryable) {
        throw error
      }
      
      // Don't retry on the last attempt
      if (attempt === config.maxRetries) {
        throw error
      }
    }
  }

  throw lastError!
}

// Spotify API base URL
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1'

// Create Axios instance for Spotify API
const createSpotifyApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: SPOTIFY_API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor to add authorization token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('spotify_access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError) => {
      const status = error.response?.status
      const statusText = error.response?.statusText || 'Unknown Error'
      
      // Handle different types of errors
      if (status === 401) {
        // Token expired or invalid - clear stored token
        localStorage.removeItem('spotify_access_token')
        localStorage.removeItem('spotify_refresh_token')
        // Redirect to login
        window.location.href = '/login'
        throw new SpotifyApiError('Authentication failed. Please log in again.', status, 'AUTH_ERROR', false)
      } else if (status === 403) {
        // Forbidden - user doesn't have required permissions
        throw new SpotifyApiError('Access denied. You may not have the required permissions.', status, 'FORBIDDEN', false)
      } else if (status === 429) {
        // Rate limiting - retryable
        const retryAfter = error.response?.headers['retry-after']
        const message = `Rate limited by Spotify API${retryAfter ? `. Retry after ${retryAfter} seconds.` : ''}`
        throw new SpotifyApiError(message, status, 'RATE_LIMITED', true)
      } else if (status === 404) {
        // Not found - not retryable
        throw new SpotifyApiError('The requested resource was not found.', status, 'NOT_FOUND', false)
      } else if (status && status >= 500) {
        // Server errors - retryable
        throw new SpotifyApiError(`Spotify API server error: ${status} ${statusText}`, status, 'SERVER_ERROR', true)
      } else if (!error.response) {
        // Network errors - retryable
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          throw new NetworkError('Request timeout. Please check your connection and try again.')
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          throw new NetworkError('Network error. Please check your internet connection.')
        } else {
          throw new NetworkError(`Network error: ${error.message}`)
        }
      } else {
        // Other client errors - not retryable
        throw new SpotifyApiError(`Request failed: ${status} ${statusText}`, status, 'CLIENT_ERROR', false)
      }
    }
  )

  return client
}

// Create the API client instance
const apiClient = createSpotifyApiClient()

// Spotify API service methods
export const spotifyApi = {
  // Search for artists
  search: async (query: string, limit: number = 20): Promise<SpotifySearchResponse> => {
    return withRetry(async () => {
      const response = await apiClient.get('/search', {
        params: {
          q: query,
          type: 'artist',
          limit,
        },
      })
      return response.data
    })
  },

  // Get artist by ID
  getArtist: async (artistId: string): Promise<SpotifyArtist> => {
    return withRetry(async () => {
      const response = await apiClient.get(`/artists/${artistId}`)
      return response.data
    })
  },

  // Get artist's albums
  getArtistAlbums: async (artistId: string, limit: number = 50): Promise<{ items: SpotifyAlbum[] }> => {
    return withRetry(async () => {
      const response = await apiClient.get(`/artists/${artistId}/albums`, {
        params: {
          include_groups: 'album,single',
          market: 'US',
          limit,
        },
      })
      return response.data
    })
  },

  // Save album to user's library
  saveAlbum: async (albumId: string): Promise<void> => {
    return withRetry(async () => {
      await apiClient.put('/me/albums', {
        ids: [albumId],
      })
    })
  },

  // Remove album from user's library
  removeAlbum: async (albumId: string): Promise<void> => {
    return withRetry(async () => {
      await apiClient.delete('/me/albums', {
        data: {
          ids: [albumId],
        },
      })
    })
  },

  // Get user's saved albums
  getSavedAlbums: async (limit: number = 50, offset: number = 0): Promise<{ items: Array<{ album: SpotifyAlbum; added_at: string }>; total: number; limit: number; offset: number; next: string | null }> => {
    return withRetry(async () => {
      const response = await apiClient.get('/me/albums', {
        params: {
          limit,
          offset,
        },
      })
      return response.data
    })
  },

  // Check if albums are saved
  checkSavedAlbums: async (albumIds: string[]): Promise<boolean[]> => {
    return withRetry(async () => {
      const response = await apiClient.get('/me/albums/contains', {
        params: {
          ids: albumIds.join(','),
        },
      })
      return response.data
    })
  },

  // Search for artists (alias for search method)
  searchArtists: async (query: string, limit: number = 20): Promise<SpotifySearchResponse> => {
    return spotifyApi.search(query, limit)
  },

  // Check if albums are saved (alias for checkSavedAlbums)
  checkAlbumsSaved: async (albumIds: string[]): Promise<boolean[]> => {
    return spotifyApi.checkSavedAlbums(albumIds)
  },

  // Get current user profile
  getCurrentUser: async (): Promise<any> => {
    return withRetry(async () => {
      const response = await apiClient.get('/me')
      return response.data
    })
  },
}