'use client'

import { useState, useEffect, useCallback } from 'react'
import { spotifyApi } from '../api/spotify'

export interface UseAlbumManagementReturn {
  savedAlbums: Set<string>
  loading: boolean
  error: string | null
  saveAlbum: (albumId: string) => Promise<void>
  removeAlbum: (albumId: string) => Promise<void>
  checkAlbumsSaved: (albumIds: string[]) => Promise<void>
  clearError: () => void
}

export const useAlbumManagement = (): UseAlbumManagementReturn => {
  const [savedAlbums, setSavedAlbums] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const checkAlbumsSaved = useCallback(async (albumIds: string[]) => {
    if (albumIds.length === 0) return

    try {
      setLoading(true)
      setError(null)
      
      const savedStatus = await spotifyApi.checkSavedAlbums(albumIds)
      
      setSavedAlbums(prevSaved => {
        const newSaved = new Set(prevSaved)
        albumIds.forEach((albumId, index) => {
          if (savedStatus[index]) {
            newSaved.add(albumId)
          } else {
            newSaved.delete(albumId)
          }
        })
        return newSaved
      })
    } catch (err) {
      console.error('Error checking saved albums:', err)
      setError('Failed to check saved albums status')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveAlbum = useCallback(async (albumId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await spotifyApi.saveAlbum(albumId)
      
      setSavedAlbums(prev => new Set(prev).add(albumId))
    } catch (err) {
      console.error('Error saving album:', err)
      setError('Failed to save album. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const removeAlbum = useCallback(async (albumId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await spotifyApi.removeAlbum(albumId)
      
      setSavedAlbums(prev => {
        const newSet = new Set(prev)
        newSet.delete(albumId)
        return newSet
      })
    } catch (err) {
      console.error('Error removing album:', err)
      setError('Failed to remove album. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    savedAlbums,
    loading,
    error,
    saveAlbum,
    removeAlbum,
    checkAlbumsSaved,
    clearError
  }
}