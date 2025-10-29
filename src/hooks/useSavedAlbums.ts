'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { spotifyApi } from '../api/spotify'
import { SpotifyAlbum } from '../types/spotify'

export interface SavedAlbumItem {
  album: SpotifyAlbum
  added_at: string
}

export interface GroupedAlbums {
  [artistName: string]: SavedAlbumItem[]
}

export interface UseSavedAlbumsReturn {
  savedAlbums: SavedAlbumItem[]
  groupedAlbums: GroupedAlbums
  loading: boolean
  error: string | null
  fetchSavedAlbums: () => Promise<void>
  removeAlbum: (albumId: string) => Promise<void>
  clearError: () => void
  hasMore: boolean
  loadMore: () => Promise<void>
}

export const useSavedAlbums = (): UseSavedAlbumsReturn => {
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbumItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchSavedAlbums = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const currentOffset = reset ? 0 : offset
      const limit = 50
      
      const response = await spotifyApi.getSavedAlbums(limit, currentOffset)
      
      if (reset) {
        setSavedAlbums(response.items)
        setOffset(limit)
      } else {
        setSavedAlbums(prev => [...prev, ...response.items])
        setOffset(prev => prev + limit)
      }
      
      setHasMore(response.items.length === limit)
    } catch (err) {
      console.error('Error fetching saved albums:', err)
      setError('Failed to load saved albums. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [offset])

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchSavedAlbums(false)
    }
  }, [fetchSavedAlbums, loading, hasMore])

  const removeAlbum = useCallback(async (albumId: string) => {
    try {
      setError(null)
      
      await spotifyApi.removeAlbum(albumId)
      
      setSavedAlbums(prev => prev.filter(item => item.album.id !== albumId))
    } catch (err) {
      console.error('Error removing album:', err)
      setError('Failed to remove album. Please try again.')
      throw err
    }
  }, [])

  // Group albums by artist using useMemo to avoid infinite re-renders
  const groupedAlbums = useMemo(() => {
    return savedAlbums.reduce<GroupedAlbums>((groups, item) => {
      const artistName = item.album.artists[0]?.name || 'Unknown Artist'
      if (!groups[artistName]) {
        groups[artistName] = []
      }
      groups[artistName].push(item)
      return groups
    }, {})
  }, [savedAlbums])

  // Initial fetch
  useEffect(() => {
    fetchSavedAlbums(true)
  }, [])

  return {
    savedAlbums,
    groupedAlbums,
    loading,
    error,
    fetchSavedAlbums: () => fetchSavedAlbums(true),
    removeAlbum,
    clearError,
    hasMore,
    loadMore
  }
}