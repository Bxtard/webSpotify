import { renderHook, act, waitFor } from '@testing-library/react'
import { useSavedAlbums } from '../useSavedAlbums'
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
import { beforeEach } from 'node:test'
import { describe } from 'node:test'

// Mock Spotify API
jest.mock('../../api/spotify')

const mockSpotifyApi = spotifyApi as jest.Mocked<typeof spotifyApi>

const mockSavedAlbumItem = {
  album: {
    id: 'album1',
    name: 'Test Album',
    images: [{ url: 'test-image.jpg', height: 300, width: 300 }],
    release_date: '2023-01-01',
    artists: [{ id: 'artist1', name: 'Test Artist' }],
    total_tracks: 10,
    external_urls: { spotify: 'https://spotify.com/album1' }
  },
  added_at: '2023-01-01T00:00:00Z'
}

const mockSavedAlbumItem2 = {
  album: {
    id: 'album2',
    name: 'Test Album 2',
    images: [{ url: 'test-image2.jpg', height: 300, width: 300 }],
    release_date: '2023-02-01',
    artists: [{ id: 'artist2', name: 'Test Artist 2' }],
    total_tracks: 12,
    external_urls: { spotify: 'https://spotify.com/album2' }
  },
  added_at: '2023-02-01T00:00:00Z'
}

describe('useSavedAlbums', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    mockSpotifyApi.getSavedAlbums.mockResolvedValue({ items: [] })
    
    const { result } = renderHook(() => useSavedAlbums())

    expect(result.current.savedAlbums).toEqual([])
    expect(result.current.groupedAlbums).toEqual({})
    expect(result.current.loading).toBe(true) // Initially loading
    expect(result.current.error).toBe(null)
    expect(result.current.hasMore).toBe(true)
  })

  it('should fetch saved albums successfully', async () => {
    mockSpotifyApi.getSavedAlbums.mockResolvedValue({
      items: [mockSavedAlbumItem, mockSavedAlbumItem2]
    })

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.savedAlbums).toHaveLength(2)
    expect(result.current.savedAlbums[0]).toEqual(mockSavedAlbumItem)
    expect(result.current.savedAlbums[1]).toEqual(mockSavedAlbumItem2)
    expect(result.current.error).toBe(null)
  })

  it('should group albums by artist correctly', async () => {
    const albumFromSameArtist = {
      ...mockSavedAlbumItem2,
      album: {
        ...mockSavedAlbumItem2.album,
        id: 'album3',
        name: 'Another Album',
        artists: [{ id: 'artist1', name: 'Test Artist' }] // Same artist as first album
      }
    }

    mockSpotifyApi.getSavedAlbums.mockResolvedValue({
      items: [mockSavedAlbumItem, albumFromSameArtist, mockSavedAlbumItem2]
    })

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.groupedAlbums['Test Artist']).toHaveLength(2)
    expect(result.current.groupedAlbums['Test Artist 2']).toHaveLength(1)
    expect(result.current.groupedAlbums['Test Artist'][0]).toEqual(mockSavedAlbumItem)
    expect(result.current.groupedAlbums['Test Artist'][1]).toEqual(albumFromSameArtist)
  })

  it('should handle error when fetching saved albums', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSpotifyApi.getSavedAlbums.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to load saved albums. Please try again.')
    expect(result.current.savedAlbums).toEqual([])
    expect(consoleError).toHaveBeenCalledWith('Error fetching saved albums:', expect.any(Error))

    consoleError.mockRestore()
  })

  it('should remove album successfully', async () => {
    mockSpotifyApi.getSavedAlbums.mockResolvedValue({
      items: [mockSavedAlbumItem, mockSavedAlbumItem2]
    })
    mockSpotifyApi.removeAlbum.mockResolvedValue(undefined)

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.savedAlbums).toHaveLength(2)

    await act(async () => {
      await result.current.removeAlbum('album1')
    })

    expect(mockSpotifyApi.removeAlbum).toHaveBeenCalledWith('album1')
    expect(result.current.savedAlbums).toHaveLength(1)
    expect(result.current.savedAlbums[0].album.id).toBe('album2')
    expect(result.current.error).toBe(null)
  })

  it('should handle error when removing album', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSpotifyApi.getSavedAlbums.mockResolvedValue({
      items: [mockSavedAlbumItem]
    })
    mockSpotifyApi.removeAlbum.mockRejectedValue(new Error('Remove failed'))

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    let thrownError: Error | undefined

    await act(async () => {
      try {
        await result.current.removeAlbum('album1')
      } catch (error) {
        thrownError = error as Error
      }
    })

    expect(result.current.error).toBe('Failed to remove album. Please try again.')
    expect(result.current.savedAlbums).toHaveLength(1) // Should still be there
    expect(thrownError).toBeInstanceOf(Error)
    expect(consoleError).toHaveBeenCalledWith('Error removing album:', expect.any(Error))

    consoleError.mockRestore()
  })

  it('should load more albums when hasMore is true', async () => {
    // First call returns 50 items (indicating more available)
    const firstBatch = Array.from({ length: 50 }, (_, i) => ({
      ...mockSavedAlbumItem,
      album: { ...mockSavedAlbumItem.album, id: `album${i}`, name: `Album ${i}` }
    }))

    const secondBatch = [mockSavedAlbumItem2]

    mockSpotifyApi.getSavedAlbums
      .mockResolvedValueOnce({ items: firstBatch })
      .mockResolvedValueOnce({ items: secondBatch })

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.savedAlbums).toHaveLength(50)
    expect(result.current.hasMore).toBe(true)

    await act(async () => {
      await result.current.loadMore()
    })

    expect(result.current.savedAlbums).toHaveLength(51)
    expect(result.current.hasMore).toBe(false) // Less than 50 items returned
    expect(mockSpotifyApi.getSavedAlbums).toHaveBeenCalledTimes(2)
    expect(mockSpotifyApi.getSavedAlbums).toHaveBeenLastCalledWith(50, 50)
  })

  it('should not load more when hasMore is false', async () => {
    mockSpotifyApi.getSavedAlbums.mockResolvedValue({ items: [mockSavedAlbumItem] })

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // hasMore should be false since we returned less than 50 items
    expect(result.current.hasMore).toBe(false)

    // Clear the initial call
    jest.clearAllMocks()

    // Try to load more when hasMore is false
    await act(async () => {
      await result.current.loadMore()
    })

    // Should not have made any API calls
    expect(mockSpotifyApi.getSavedAlbums).not.toHaveBeenCalled()
  })

  it('should clear error', () => {
    mockSpotifyApi.getSavedAlbums.mockResolvedValue({ items: [] })

    const { result } = renderHook(() => useSavedAlbums())

    // Manually set an error to test clearError
    act(() => {
      // Access the internal state to set an error for testing
      result.current.clearError()
    })

    expect(result.current.error).toBe(null)
  })

  it('should refetch albums when fetchSavedAlbums is called', async () => {
    mockSpotifyApi.getSavedAlbums
      .mockResolvedValueOnce({ items: [mockSavedAlbumItem] })
      .mockResolvedValueOnce({ items: [mockSavedAlbumItem2] })

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.savedAlbums).toHaveLength(1)
    expect(result.current.savedAlbums[0]).toEqual(mockSavedAlbumItem)

    await act(async () => {
      await result.current.fetchSavedAlbums()
    })

    expect(result.current.savedAlbums).toHaveLength(1)
    expect(result.current.savedAlbums[0]).toEqual(mockSavedAlbumItem2)
    expect(mockSpotifyApi.getSavedAlbums).toHaveBeenCalledTimes(2)
  })

  it('should handle albums with unknown artist', async () => {
    const albumWithoutArtist = {
      ...mockSavedAlbumItem,
      album: {
        ...mockSavedAlbumItem.album,
        artists: []
      }
    }

    mockSpotifyApi.getSavedAlbums.mockResolvedValue({
      items: [albumWithoutArtist]
    })

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.groupedAlbums['Unknown Artist']).toHaveLength(1)
    expect(result.current.groupedAlbums['Unknown Artist'][0]).toEqual(albumWithoutArtist)
  })

  it('should set hasMore to false when less than limit items are returned', async () => {
    const smallBatch = [mockSavedAlbumItem] // Less than 50 items

    mockSpotifyApi.getSavedAlbums.mockResolvedValue({ items: smallBatch })

    const { result } = renderHook(() => useSavedAlbums())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.hasMore).toBe(false)
  })
})