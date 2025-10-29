import { useState, useEffect, useCallback } from 'react'
import { spotifyApi } from '../api/spotify'
import { SpotifyArtist } from '../types/spotify'

interface SearchState {
  query: string
  results: SpotifyArtist[]
  loading: boolean
  error: string | null
  hasSearched: boolean
}

export function useSpotifySearch(debounceMs: number = 500) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    hasSearched: false,
  })

  // Debounced search effect
  useEffect(() => {
    if (!searchState.query.trim()) {
      setSearchState(prev => ({
        ...prev,
        results: [],
        loading: false,
        error: null,
        hasSearched: false,
      }))
      return
    }

    const timeoutId = setTimeout(async () => {
      setSearchState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const response = await spotifyApi.search(searchState.query.trim())
        setSearchState(prev => ({
          ...prev,
          results: response.artists.items,
          loading: false,
          hasSearched: true,
        }))
      } catch (error: any) {
        console.error('Search error:', error)
        
        let errorMessage = 'Failed to search artists. Please try again.'
        
        if (error.response?.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.'
        } else if (error.response?.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.'
        } else if (error.response?.status >= 500) {
          errorMessage = 'Spotify service is temporarily unavailable. Please try again later.'
        } else if (!error.response) {
          errorMessage = 'Network error. Please check your connection and try again.'
        }
        
        setSearchState(prev => ({
          ...prev,
          results: [],
          loading: false,
          error: errorMessage,
          hasSearched: true,
        }))
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [searchState.query, debounceMs])

  const setQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }))
  }, [])

  const retry = useCallback(async () => {
    if (!searchState.query.trim()) return
    
    setSearchState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await spotifyApi.search(searchState.query.trim())
      setSearchState(prev => ({
        ...prev,
        results: response.artists.items,
        loading: false,
        hasSearched: true,
      }))
    } catch (error: any) {
      console.error('Retry search error:', error)
      
      let errorMessage = 'Failed to search artists. Please try again.'
      
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.'
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Spotify service is temporarily unavailable. Please try again later.'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection and try again.'
      }
      
      setSearchState(prev => ({
        ...prev,
        results: [],
        loading: false,
        error: errorMessage,
        hasSearched: true,
      }))
    }
  }, [searchState.query])

  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      loading: false,
      error: null,
      hasSearched: false,
    })
  }, [])

  const clearError = useCallback(() => {
    setSearchState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...searchState,
    setQuery,
    retry,
    clearSearch,
    clearError,
  }
}