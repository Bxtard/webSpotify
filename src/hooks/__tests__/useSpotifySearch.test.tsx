import { renderHook, act, waitFor } from '@testing-library/react'
import { useSpotifySearch } from '../useSpotifySearch'
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
import { it } from 'node:test'
import { it } from 'node:test'
import { it } from 'node:test'
import { afterEach } from 'node:test'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Mock the Spotify API
jest.mock('../../api/spotify')
const mockSpotifyApi = spotifyApi as jest.Mocked<typeof spotifyApi>

// Mock data
const mockArtists = [
  {
    id: 'artist1',
    name: 'Test Artist 1',
    images: [{ url: 'https://example.com/image1.jpg', width: 300, height: 300 }],
    followers: { total: 1000000 },
    genres: ['pop', 'rock'],
    popularity: 80,
    external_urls: { spotify: 'https://open.spotify.com/artist/artist1' },
  },
  {
    id: 'artist2',
    name: 'Test Artist 2',
    images: [{ url: 'https://example.com/image2.jpg', width: 300, height: 300 }],
    followers: { total: 500000 },
    genres: ['jazz', 'blues'],
    popularity: 70,
    external_urls: { spotify: 'https://open.spotify.com/artist/artist2' },
  },
]

const mockSearchResponse = {
  artists: {
    items: mockArtists,
    total: 2,
    limit: 20,
    offset: 0,
    next: null,
  },
}

describe('useSpotifySearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSpotifySearch())

    expect(result.current.query).toBe('')
    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.hasSearched).toBe(false)
  })

  it('should update query when setQuery is called', () => {
    const { result } = renderHook(() => useSpotifySearch())

    act(() => {
      result.current.setQuery('test query')
    })

    expect(result.current.query).toBe('test query')
  })

  it('should debounce search requests', async () => {
    mockSpotifyApi.search.mockResolvedValue(mockSearchResponse)
    
    const { result } = renderHook(() => useSpotifySearch(500))

    // Set query but don't advance timers yet
    act(() => {
      result.current.setQuery('test')
    })

    expect(mockSpotifyApi.search).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(false)

    // Advance timers to trigger debounced search
    act(() => {
      jest.advanceTimersByTime(500)
    })

    await waitFor(() => {
      expect(mockSpotifyApi.search).toHaveBeenCalledWith('test')
    })

    await waitFor(() => {
      expect(result.current.results).toEqual(mockArtists)
      expect(result.current.loading).toBe(false)
      expect(result.current.hasSearched).toBe(true)
    })
  })

  it('should cancel previous search when query changes quickly', async () => {
    mockSpotifyApi.search.mockResolvedValue(mockSearchResponse)
    
    const { result } = renderHook(() => useSpotifySearch(500))

    // Set first query
    act(() => {
      result.current.setQuery('first')
    })

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(300)
    })

    // Set second query before first search completes
    act(() => {
      result.current.setQuery('second')
    })

    // Advance time to complete debounce
    act(() => {
      jest.advanceTimersByTime(500)
    })

    await waitFor(() => {
      expect(mockSpotifyApi.search).toHaveBeenCalledTimes(1)
      expect(mockSpotifyApi.search).toHaveBeenCalledWith('second')
    })
  })

  it('should clear results when query is empty', () => {
    const { result } = renderHook(() => useSpotifySearch())

    // Set some initial state
    act(() => {
      result.current.setQuery('test')
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Clear query
    act(() => {
      result.current.setQuery('')
    })

    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.hasSearched).toBe(false)
  })

  it('should handle search errors', async () => {
    const errorMessage = 'Network error'
    mockSpotifyApi.search.mockRejectedValue(new Error(errorMessage))
    
    const { result } = renderHook(() => useSpotifySearch(100))

    act(() => {
      result.current.setQuery('test')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Network error. Please check your connection and try again.')
      expect(result.current.results).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.hasSearched).toBe(true)
    })
  })

  it('should handle different API error types', async () => {
    const { result } = renderHook(() => useSpotifySearch(100))

    // Test 401 error
    mockSpotifyApi.search.mockRejectedValue({
      response: { status: 401 }
    })

    act(() => {
      result.current.setQuery('test')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Your session has expired. Please log in again.')
    })

    // Test 429 error
    mockSpotifyApi.search.mockRejectedValue({
      response: { status: 429 }
    })

    act(() => {
      result.current.setQuery('test2')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Too many requests. Please wait a moment and try again.')
    })

    // Test 500 error
    mockSpotifyApi.search.mockRejectedValue({
      response: { status: 500 }
    })

    act(() => {
      result.current.setQuery('test3')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Spotify service is temporarily unavailable. Please try again later.')
    })

    // Test network error
    mockSpotifyApi.search.mockRejectedValue({
      response: null
    })

    act(() => {
      result.current.setQuery('test4')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Network error. Please check your connection and try again.')
    })
  })

  it('should retry search successfully', async () => {
    mockSpotifyApi.search.mockResolvedValue(mockSearchResponse)
    
    const { result } = renderHook(() => useSpotifySearch())

    // Set query first
    act(() => {
      result.current.setQuery('test')
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    await waitFor(() => {
      expect(result.current.results).toEqual(mockArtists)
    })

    // Now test retry
    await act(async () => {
      await result.current.retry()
    })

    expect(mockSpotifyApi.search).toHaveBeenCalledTimes(2)
    expect(mockSpotifyApi.search).toHaveBeenLastCalledWith('test')
  })

  it('should handle retry errors', async () => {
    const { result } = renderHook(() => useSpotifySearch())

    // Set query first
    act(() => {
      result.current.setQuery('test')
    })

    // Mock retry to fail
    mockSpotifyApi.search.mockRejectedValue(new Error('Retry failed'))

    await act(async () => {
      await result.current.retry()
    })

    expect(result.current.error).toBe('Network error. Please check your connection and try again.')
    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('should not retry when query is empty', async () => {
    const { result } = renderHook(() => useSpotifySearch())

    await act(async () => {
      await result.current.retry()
    })

    expect(mockSpotifyApi.search).not.toHaveBeenCalled()
  })

  it('should clear search state', () => {
    const { result } = renderHook(() => useSpotifySearch())

    // Set some state first
    act(() => {
      result.current.setQuery('test')
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Clear search
    act(() => {
      result.current.clearSearch()
    })

    expect(result.current.query).toBe('')
    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.hasSearched).toBe(false)
  })

  it('should clear error state', () => {
    const { result } = renderHook(() => useSpotifySearch())

    // Simulate error state
    mockSpotifyApi.search.mockRejectedValue(new Error('Test error'))

    act(() => {
      result.current.setQuery('test')
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    // Clear error
    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBe(null)
  })

  it('should trim whitespace from search query', async () => {
    mockSpotifyApi.search.mockResolvedValue(mockSearchResponse)
    
    const { result } = renderHook(() => useSpotifySearch(100))

    act(() => {
      result.current.setQuery('  test query  ')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(mockSpotifyApi.search).toHaveBeenCalledWith('test query')
    })
  })
})