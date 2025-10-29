import { renderHook, act, waitFor } from '@testing-library/react'
import { useSpotifyAuth } from '../useSpotifyAuth'
import { authApi } from '../../api/auth'
import { spotifyApi } from '../../api/spotify'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Mock the API modules
jest.mock('../../api/auth')
jest.mock('../../api/spotify')

const mockAuthApi = authApi as jest.Mocked<typeof authApi>
const mockSpotifyApi = spotifyApi as jest.Mocked<typeof spotifyApi>

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('useSpotifyAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    mockLocalStorage.removeItem.mockClear()
  })

  it('should initialize with unauthenticated state when no token exists', async () => {
    mockAuthApi.getAccessToken.mockReturnValue(null)

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.accessToken).toBe(null)
    expect(result.current.user).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should authenticate user with valid token', async () => {
    const mockUser = {
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [],
    }

    mockAuthApi.getAccessToken.mockReturnValue('valid_token')
    mockAuthApi.getRefreshToken.mockReturnValue('refresh_token')
    mockAuthApi.isTokenExpired.mockReturnValue(false)
    mockSpotifyApi.getCurrentUser.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.accessToken).toBe('valid_token')
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.error).toBe(null)
  })

  it('should refresh expired token', async () => {
    const mockUser = {
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [],
    }

    mockAuthApi.getAccessToken.mockReturnValue('expired_token')
    mockAuthApi.getRefreshToken.mockReturnValue('refresh_token')
    mockAuthApi.isTokenExpired.mockReturnValue(true)
    mockAuthApi.refreshToken.mockResolvedValue({
      access_token: 'new_token',
      expires_in: 3600,
    })
    mockSpotifyApi.getCurrentUser.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockAuthApi.refreshToken).toHaveBeenCalledWith('refresh_token')
    expect(mockAuthApi.storeTokens).toHaveBeenCalledWith('new_token', 'refresh_token', 3600)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.accessToken).toBe('new_token')
  })

  it('should handle refresh token failure', async () => {
    mockAuthApi.getAccessToken.mockReturnValue('expired_token')
    mockAuthApi.getRefreshToken.mockReturnValue('invalid_refresh_token')
    mockAuthApi.isTokenExpired.mockReturnValue(true)
    mockAuthApi.refreshToken.mockRejectedValue(new Error('Invalid refresh token'))

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockAuthApi.clearTokens).toHaveBeenCalled()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.error).toBe('Session expired. Please log in again.')
  })

  it('should handle authentication callback successfully', async () => {
    const mockUser = {
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [],
    }

    mockAuthApi.getAccessToken.mockReturnValue(null)
    mockAuthApi.exchangeCodeForToken.mockResolvedValue({
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
      expires_in: 3600,
    })
    mockSpotifyApi.getCurrentUser.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    let callbackResult: boolean | undefined

    await act(async () => {
      callbackResult = await result.current.handleAuthCallback('auth_code', 'auth_state')
    })

    expect(callbackResult).toBe(true)
    expect(mockAuthApi.exchangeCodeForToken).toHaveBeenCalledWith('auth_code', 'auth_state')
    expect(mockAuthApi.storeTokens).toHaveBeenCalledWith(
      'new_access_token',
      'new_refresh_token',
      3600
    )
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle authentication callback failure', async () => {
    mockAuthApi.getAccessToken.mockReturnValue(null)
    mockAuthApi.exchangeCodeForToken.mockRejectedValue(new Error('Invalid code'))

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    let callbackResult: boolean | undefined

    await act(async () => {
      callbackResult = await result.current.handleAuthCallback('invalid_code', 'auth_state')
    })

    expect(callbackResult).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.error).toBe('Authentication failed. Please try again.')
  })

  it('should handle login', async () => {
    mockAuthApi.getAccessToken.mockReturnValue(null)

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.login()
    })

    expect(mockAuthApi.login).toHaveBeenCalled()
  })

  it('should handle logout', async () => {
    mockAuthApi.getAccessToken.mockReturnValue('valid_token')
    mockAuthApi.getRefreshToken.mockReturnValue('refresh_token')
    mockAuthApi.isTokenExpired.mockReturnValue(false)
    mockSpotifyApi.getCurrentUser.mockResolvedValue({
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [],
    })

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    act(() => {
      result.current.logout()
    })

    expect(mockAuthApi.logout).toHaveBeenCalled()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.accessToken).toBe(null)
    expect(result.current.user).toBe(null)
  })

  it('should refresh access token manually', async () => {
    mockAuthApi.getAccessToken.mockReturnValue('valid_token')
    mockAuthApi.getRefreshToken.mockReturnValue('refresh_token')
    mockAuthApi.isTokenExpired.mockReturnValue(false)
    mockSpotifyApi.getCurrentUser.mockResolvedValue({
      id: 'user123',
      display_name: 'Test User',
      email: 'test@example.com',
      images: [],
    })

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    mockAuthApi.refreshToken.mockResolvedValue({
      access_token: 'refreshed_token',
      expires_in: 3600,
    })

    let refreshResult: boolean | undefined

    await act(async () => {
      refreshResult = await result.current.refreshAccessToken()
    })

    expect(refreshResult).toBe(true)
    expect(mockAuthApi.refreshToken).toHaveBeenCalledWith('refresh_token')
    expect(result.current.accessToken).toBe('refreshed_token')
  })

  it('should clear error', async () => {
    mockAuthApi.getAccessToken.mockReturnValue(null)

    const { result } = renderHook(() => useSpotifyAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Simulate an error state
    await act(async () => {
      await result.current.handleAuthCallback('invalid_code', 'auth_state')
    })

    expect(result.current.error).toBeTruthy()

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBe(null)
  })
})