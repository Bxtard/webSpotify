import { useState, useEffect, useCallback } from 'react'
import { spotifyApi } from '../api/spotify'
import { SpotifyArtist } from '../types/spotify'

interface SearchState {
  query: string
  results: SpotifyArtist[]
  loading: boolean
  error: string | null
  hasSearched: boolean
  totalResults: number
  currentPage: number
  totalPages: number
  limit: number
  offset: number
}

export function useSpotifySearch(debounceMs: number = 500, limit: number = 20) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    hasSearched: false,
    totalResults: 0,
    currentPage: 1,
    totalPages: 0,
    limit,
    offset: 0,
  })

  // Search function
  const performSearch = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) return

    const offset = (page - 1) * searchState.limit
    setSearchState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await spotifyApi.search(query.trim(), searchState.limit, offset)
      const totalPages = Math.ceil(response.artists.total / searchState.limit)
      
      setSearchState(prev => ({
        ...prev,
        results: response.artists.items,
        loading: false,
        hasSearched: true,
        totalResults: response.artists.total,
        currentPage: page,
        totalPages,
        offset,
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
        totalResults: 0,
        totalPages: 0,
      }))
    }
  }, [searchState.limit])

  // Debounced search effect for new queries
  useEffect(() => {
    if (!searchState.query.trim()) {
      setSearchState(prev => ({
        ...prev,
        results: [],
        loading: false,
        error: null,
        hasSearched: false,
        totalResults: 0,
        currentPage: 1,
        totalPages: 0,
        offset: 0,
      }))
      return
    }

    const timeoutId = setTimeout(() => {
      performSearch(searchState.query, 1) // Always start from page 1 for new queries
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [searchState.query, debounceMs, performSearch])

  const setQuery = useCallback((query: string) => {
    setSearchState(prev => ({ 
      ...prev, 
      query,
      currentPage: 1, // Reset to first page when query changes
      offset: 0
    }))
  }, [])

  const setPage = useCallback((page: number) => {
    if (searchState.query.trim() && page !== searchState.currentPage) {
      performSearch(searchState.query, page)
    }
  }, [searchState.query, searchState.currentPage, performSearch])

  const retry = useCallback(async () => {
    if (!searchState.query.trim()) return
    performSearch(searchState.query, searchState.currentPage)
  }, [searchState.query, searchState.currentPage, performSearch])

  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      loading: false,
      error: null,
      hasSearched: false,
      totalResults: 0,
      currentPage: 1,
      totalPages: 0,
      limit: searchState.limit,
      offset: 0,
    })
  }, [searchState.limit])

  const clearError = useCallback(() => {
    setSearchState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...searchState,
    setQuery,
    setPage,
    retry,
    clearSearch,
    clearError,
  }
}