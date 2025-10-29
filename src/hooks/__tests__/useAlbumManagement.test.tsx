import { renderHook, act, waitFor } from '@testing-library/react'
import { useAlbumManagement } from '../useAlbumManagement'
import { spotifyApi } from '../../api/spotify'

// Mock Spotify API
jest.mock('../../api/spotify')

const mockSpotifyApi = spotifyApi as jest.Mocked<typeof spotifyApi>

describe('useAlbumManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useAlbumManagement())

    expect(result.current.savedAlbums).toEqual(new Set())
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should check saved albums successfully', async () => {
    mockSpotifyApi.checkSavedAlbums.mockResolvedValue([true, false, true])

    const { result } = renderHook(() => useAlbumManagement())

    await act(async () => {
      await result.current.checkAlbumsSaved(['album1', 'album2', 'album3'])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.savedAlbums.has('album1')).toBe(true)
    expect(result.current.savedAlbums.has('album2')).toBe(false)
    expect(result.current.savedAlbums.has('album3')).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('should handle empty album list when checking saved albums', async () => {
    const { result } = renderHook(() => useAlbumManagement())

    await act(async () => {
      await result.current.checkAlbumsSaved([])
    })

    expect(mockSpotifyApi.checkSavedAlbums).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(false)
  })

  it('should handle error when checking saved albums', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSpotifyApi.checkSavedAlbums.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useAlbumManagement())

    await act(async () => {
      await result.current.checkAlbumsSaved(['album1', 'album2'])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to check saved albums status')
    expect(consoleError).toHaveBeenCalledWith('Error checking saved albums:', expect.any(Error))

    consoleError.mockRestore()
  })

  it('should save album successfully', async () => {
    mockSpotifyApi.saveAlbum.mockResolvedValue(undefined)

    const { result } = renderHook(() => useAlbumManagement())

    await act(async () => {
      await result.current.saveAlbum('album1')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockSpotifyApi.saveAlbum).toHaveBeenCalledWith('album1')
    expect(result.current.savedAlbums.has('album1')).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('should handle error when saving album', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSpotifyApi.saveAlbum.mockRejectedValue(new Error('Save failed'))

    const { result } = renderHook(() => useAlbumManagement())

    let thrownError: Error | undefined

    await act(async () => {
      try {
        await result.current.saveAlbum('album1')
      } catch (error) {
        thrownError = error as Error
      }
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to save album. Please try again.')
    expect(result.current.savedAlbums.has('album1')).toBe(false)
    expect(thrownError).toBeInstanceOf(Error)
    expect(consoleError).toHaveBeenCalledWith('Error saving album:', expect.any(Error))

    consoleError.mockRestore()
  })

  it('should remove album successfully', async () => {
    mockSpotifyApi.removeAlbum.mockResolvedValue(undefined)

    const { result } = renderHook(() => useAlbumManagement())

    // First add an album to the saved set
    act(() => {
      result.current.savedAlbums.add('album1')
    })

    await act(async () => {
      await result.current.removeAlbum('album1')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockSpotifyApi.removeAlbum).toHaveBeenCalledWith('album1')
    expect(result.current.savedAlbums.has('album1')).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle error when removing album', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSpotifyApi.removeAlbum.mockRejectedValue(new Error('Remove failed'))

    const { result } = renderHook(() => useAlbumManagement())

    // First add an album to the saved set
    act(() => {
      result.current.savedAlbums.add('album1')
    })

    let thrownError: Error | undefined

    await act(async () => {
      try {
        await result.current.removeAlbum('album1')
      } catch (error) {
        thrownError = error as Error
      }
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to remove album. Please try again.')
    expect(result.current.savedAlbums.has('album1')).toBe(true) // Should still be saved
    expect(thrownError).toBeInstanceOf(Error)
    expect(consoleError).toHaveBeenCalledWith('Error removing album:', expect.any(Error))

    consoleError.mockRestore()
  })

  it('should clear error', () => {
    const { result } = renderHook(() => useAlbumManagement())

    // Set an error first
    act(() => {
      // Simulate an error state by calling a method that would set an error
      result.current.checkAlbumsSaved(['album1']).catch(() => {})
    })

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBe(null)
  })

  it('should set loading state during operations', async () => {
    let resolvePromise: () => void
    const savePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })
    mockSpotifyApi.saveAlbum.mockReturnValue(savePromise)

    const { result } = renderHook(() => useAlbumManagement())

    act(() => {
      result.current.saveAlbum('album1')
    })

    expect(result.current.loading).toBe(true)

    // Resolve the promise
    resolvePromise!()
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should update saved albums state correctly when checking multiple times', async () => {
    const { result } = renderHook(() => useAlbumManagement())

    // First check
    mockSpotifyApi.checkSavedAlbums.mockResolvedValueOnce([true, false])
    await act(async () => {
      await result.current.checkAlbumsSaved(['album1', 'album2'])
    })

    expect(result.current.savedAlbums.has('album1')).toBe(true)
    expect(result.current.savedAlbums.has('album2')).toBe(false)

    // Second check with different results
    mockSpotifyApi.checkSavedAlbums.mockResolvedValueOnce([false, true])
    await act(async () => {
      await result.current.checkAlbumsSaved(['album1', 'album2'])
    })

    expect(result.current.savedAlbums.has('album1')).toBe(false)
    expect(result.current.savedAlbums.has('album2')).toBe(true)
  })

  it('should maintain separate state for different albums', async () => {
    mockSpotifyApi.saveAlbum.mockResolvedValue(undefined)
    mockSpotifyApi.removeAlbum.mockResolvedValue(undefined)

    const { result } = renderHook(() => useAlbumManagement())

    // Save multiple albums
    await act(async () => {
      await result.current.saveAlbum('album1')
    })
    await act(async () => {
      await result.current.saveAlbum('album2')
    })

    expect(result.current.savedAlbums.has('album1')).toBe(true)
    expect(result.current.savedAlbums.has('album2')).toBe(true)

    // Remove one album
    await act(async () => {
      await result.current.removeAlbum('album1')
    })

    expect(result.current.savedAlbums.has('album1')).toBe(false)
    expect(result.current.savedAlbums.has('album2')).toBe(true)
  })

  it('should clear error when starting new operations', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // First, cause an error
    mockSpotifyApi.saveAlbum.mockRejectedValueOnce(new Error('First error'))
    
    const { result } = renderHook(() => useAlbumManagement())

    await act(async () => {
      try {
        await result.current.saveAlbum('album1')
      } catch {}
    })

    expect(result.current.error).toBe('Failed to save album. Please try again.')

    // Now perform a successful operation
    mockSpotifyApi.saveAlbum.mockResolvedValueOnce(undefined)

    await act(async () => {
      await result.current.saveAlbum('album2')
    })

    expect(result.current.error).toBe(null)

    consoleError.mockRestore()
  })
})