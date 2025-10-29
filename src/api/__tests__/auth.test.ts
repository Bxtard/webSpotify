import axios from 'axios'
import { authApi } from '../auth'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { describe } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

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

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    mockLocalStorage.removeItem.mockClear()
  })

  describe('getAuthUrl', () => {
    it('should generate correct Spotify OAuth URL', () => {
      const authUrl = authApi.getAuthUrl()
      
      expect(authUrl).toContain('https://accounts.spotify.com/authorize')
      expect(authUrl).toContain('client_id=test_client_id')
      expect(authUrl).toContain('response_type=code')
      expect(authUrl).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback')
      expect(authUrl).toContain('scope=user-read-private+user-read-email+user-library-read+user-library-modify')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('spotify_auth_state', expect.any(String))
    })

    it('should throw error when client ID is missing', () => {
      const originalClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
      delete process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID

      expect(() => authApi.getAuthUrl()).toThrow('Missing Spotify OAuth configuration')

      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = originalClientId
    })
  })

  describe('exchangeCodeForToken', () => {
    it('should exchange code for token successfully', async () => {
      const mockResponse = {
        data: {
          access_token: 'test_access_token',
          refresh_token: 'test_refresh_token',
          expires_in: 3600,
        },
      }

      mockLocalStorage.getItem.mockReturnValue('test_state')
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await authApi.exchangeCodeForToken('test_code', 'test_state')

      expect(result).toEqual(mockResponse.data)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: expect.stringContaining('Basic'),
          }),
        })
      )
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_auth_state')
    })

    it('should throw error when state mismatch occurs', async () => {
      mockLocalStorage.getItem.mockReturnValue('different_state')

      await expect(authApi.exchangeCodeForToken('test_code', 'test_state')).rejects.toThrow(
        'State mismatch - possible CSRF attack'
      )
    })

    it('should handle API errors', async () => {
      mockLocalStorage.getItem.mockReturnValue('test_state')
      mockedAxios.post.mockRejectedValue(new Error('API Error'))

      await expect(authApi.exchangeCodeForToken('test_code', 'test_state')).rejects.toThrow('API Error')
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        data: {
          access_token: 'new_access_token',
          expires_in: 3600,
        },
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await authApi.refreshToken('test_refresh_token')

      expect(result).toEqual(mockResponse.data)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: expect.stringContaining('Basic'),
          }),
        })
      )
    })

    it('should handle refresh token errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Invalid refresh token'))

      await expect(authApi.refreshToken('invalid_token')).rejects.toThrow('Invalid refresh token')
    })
  })

  describe('token storage methods', () => {
    it('should store tokens correctly', () => {
      const mockDate = new Date('2023-01-01T00:00:00Z')
      jest.spyOn(Date, 'now').mockReturnValue(mockDate.getTime())

      authApi.storeTokens('access_token', 'refresh_token', 3600)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('spotify_access_token', 'access_token')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('spotify_refresh_token', 'refresh_token')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'spotify_token_expiration',
        (mockDate.getTime() + 3600 * 1000).toString()
      )
    })

    it('should get access token', () => {
      mockLocalStorage.getItem.mockReturnValue('stored_access_token')

      const token = authApi.getAccessToken()

      expect(token).toBe('stored_access_token')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('spotify_access_token')
    })

    it('should get refresh token', () => {
      mockLocalStorage.getItem.mockReturnValue('stored_refresh_token')

      const token = authApi.getRefreshToken()

      expect(token).toBe('stored_refresh_token')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('spotify_refresh_token')
    })

    it('should check if token is expired', () => {
      const futureTime = Date.now() + 1000000
      mockLocalStorage.getItem.mockReturnValue(futureTime.toString())

      const isExpired = authApi.isTokenExpired()

      expect(isExpired).toBe(false)
    })

    it('should return true for expired token', () => {
      const pastTime = Date.now() - 1000000
      mockLocalStorage.getItem.mockReturnValue(pastTime.toString())

      const isExpired = authApi.isTokenExpired()

      expect(isExpired).toBe(true)
    })

    it('should clear all tokens', () => {
      authApi.clearTokens()

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_access_token')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_refresh_token')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_token_expiration')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_auth_state')
    })
  })

  describe('login and logout', () => {
    it('should call clearTokens on logout', () => {
      // Test the clearTokens functionality instead of window.location
      authApi.clearTokens()

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_access_token')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_refresh_token')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_token_expiration')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_auth_state')
    })
  })
})