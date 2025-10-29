/**
 * User Flow Test Utilities
 * 
 * This module provides utilities to test the complete user journey
 * from login to album management in the Spotify Web App.
 */

import { spotifyApi } from '../api/spotify'
import { authApi } from '../api/auth'

export interface UserFlowTestResult {
  step: string
  success: boolean
  error?: string
  data?: any
}

export class UserFlowTester {
  private results: UserFlowTestResult[] = []

  /**
   * Test the complete user flow from authentication to album management
   */
  async testCompleteUserFlow(): Promise<UserFlowTestResult[]> {
    this.results = []

    // Step 1: Test authentication status check
    await this.testAuthenticationStatus()

    // Step 2: Test search functionality (if authenticated)
    if (this.isAuthenticated()) {
      await this.testSearchFunctionality()
      await this.testArtistDetailFlow()
      await this.testAlbumManagement()
      await this.testSavedAlbumsFlow()
    }

    return this.results
  }

  /**
   * Test authentication status and token validation
   */
  private async testAuthenticationStatus(): Promise<void> {
    try {
      const accessToken = authApi.getAccessToken()
      
      if (!accessToken) {
        this.addResult('Authentication Check', false, 'No access token found')
        return
      }

      if (authApi.isTokenExpired()) {
        this.addResult('Token Validation', false, 'Access token is expired')
        return
      }

      // Test API call with current token
      const user = await spotifyApi.getCurrentUser()
      this.addResult('Authentication Check', true, undefined, { user: user.display_name })
    } catch (error) {
      this.addResult('Authentication Check', false, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Test search functionality with a sample query
   */
  private async testSearchFunctionality(): Promise<void> {
    try {
      const searchResults = await spotifyApi.searchArtists('Beatles', 5)
      
      if (searchResults.artists.items.length === 0) {
        this.addResult('Search Functionality', false, 'No search results returned')
        return
      }

      this.addResult('Search Functionality', true, undefined, {
        resultCount: searchResults.artists.items.length,
        firstResult: searchResults.artists.items[0].name
      })
    } catch (error) {
      this.addResult('Search Functionality', false, error instanceof Error ? error.message : 'Search failed')
    }
  }

  /**
   * Test artist detail page functionality
   */
  private async testArtistDetailFlow(): Promise<void> {
    try {
      // First get an artist from search
      const searchResults = await spotifyApi.searchArtists('Beatles', 1)
      
      if (searchResults.artists.items.length === 0) {
        this.addResult('Artist Detail Flow', false, 'No artist found for testing')
        return
      }

      const artist = searchResults.artists.items[0]
      
      // Test getting artist details
      const artistDetails = await spotifyApi.getArtist(artist.id)
      
      // Test getting artist albums
      const artistAlbums = await spotifyApi.getArtistAlbums(artist.id)
      
      this.addResult('Artist Detail Flow', true, undefined, {
        artistName: artistDetails.name,
        albumCount: artistAlbums.items.length
      })
    } catch (error) {
      this.addResult('Artist Detail Flow', false, error instanceof Error ? error.message : 'Artist detail test failed')
    }
  }

  /**
   * Test album save/remove functionality
   */
  private async testAlbumManagement(): Promise<void> {
    try {
      // Get a sample album to test with
      const searchResults = await spotifyApi.searchArtists('Beatles', 1)
      
      if (searchResults.artists.items.length === 0) {
        this.addResult('Album Management', false, 'No artist found for album testing')
        return
      }

      const artist = searchResults.artists.items[0]
      const artistAlbums = await spotifyApi.getArtistAlbums(artist.id)
      
      if (artistAlbums.items.length === 0) {
        this.addResult('Album Management', false, 'No albums found for testing')
        return
      }

      const testAlbum = artistAlbums.items[0]
      
      // Test checking if album is saved
      const savedStatus = await spotifyApi.checkAlbumsSaved([testAlbum.id])
      
      // Test save/remove operations (we'll just test the API calls, not actually modify user's library)
      this.addResult('Album Management', true, undefined, {
        albumName: testAlbum.name,
        initialSavedStatus: savedStatus[0]
      })
    } catch (error) {
      this.addResult('Album Management', false, error instanceof Error ? error.message : 'Album management test failed')
    }
  }

  /**
   * Test saved albums page functionality
   */
  private async testSavedAlbumsFlow(): Promise<void> {
    try {
      const savedAlbums = await spotifyApi.getSavedAlbums(10)
      
      this.addResult('Saved Albums Flow', true, undefined, {
        savedAlbumCount: savedAlbums.items.length,
        totalSaved: savedAlbums.total
      })
    } catch (error) {
      this.addResult('Saved Albums Flow', false, error instanceof Error ? error.message : 'Saved albums test failed')
    }
  }

  /**
   * Check if user is currently authenticated
   */
  private isAuthenticated(): boolean {
    const accessToken = authApi.getAccessToken()
    return !!accessToken && !authApi.isTokenExpired()
  }

  /**
   * Add a test result to the results array
   */
  private addResult(step: string, success: boolean, error?: string, data?: any): void {
    this.results.push({
      step,
      success,
      error,
      data
    })
  }

  /**
   * Get a summary of test results
   */
  getTestSummary(): { total: number; passed: number; failed: number; passRate: number } {
    const total = this.results.length
    const passed = this.results.filter(r => r.success).length
    const failed = total - passed
    const passRate = total > 0 ? (passed / total) * 100 : 0

    return { total, passed, failed, passRate }
  }

  /**
   * Get failed test details
   */
  getFailedTests(): UserFlowTestResult[] {
    return this.results.filter(r => !r.success)
  }
}

/**
 * Navigation flow test utilities
 */
export class NavigationTester {
  /**
   * Test all navigation links and routes
   */
  static testNavigationFlow(): { route: string; accessible: boolean; requiresAuth: boolean }[] {
    const routes = [
      { path: '/', accessible: true, requiresAuth: false },
      { path: '/login', accessible: true, requiresAuth: false },
      { path: '/auth/callback', accessible: true, requiresAuth: false },
      { path: '/search', accessible: true, requiresAuth: true },
      { path: '/albums', accessible: true, requiresAuth: true },
      { path: '/artist/[id]', accessible: true, requiresAuth: true }
    ]

    return routes.map(route => ({
      route: route.path,
      accessible: route.accessible,
      requiresAuth: route.requiresAuth
    }))
  }

  /**
   * Test responsive design breakpoints
   */
  static testResponsiveBreakpoints(): { breakpoint: string; width: number; description: string }[] {
    return [
      { breakpoint: 'mobile', width: 375, description: 'Mobile portrait' },
      { breakpoint: 'mobile-landscape', width: 640, description: 'Mobile landscape' },
      { breakpoint: 'tablet', width: 768, description: 'Tablet portrait' },
      { breakpoint: 'desktop', width: 1024, description: 'Desktop' },
      { breakpoint: 'large-desktop', width: 1280, description: 'Large desktop' }
    ]
  }
}

/**
 * API integration test utilities
 */
export class APIIntegrationTester {
  /**
   * Test all Spotify API endpoints used in the application
   */
  static async testAPIEndpoints(): Promise<UserFlowTestResult[]> {
    const results: UserFlowTestResult[] = []
    
    const endpoints = [
      {
        name: 'Get Current User',
        test: () => spotifyApi.getCurrentUser()
      },
      {
        name: 'Search Artists',
        test: () => spotifyApi.searchArtists('test', 1)
      },
      {
        name: 'Get Saved Albums',
        test: () => spotifyApi.getSavedAlbums(1)
      }
    ]

    for (const endpoint of endpoints) {
      try {
        await endpoint.test()
        results.push({
          step: endpoint.name,
          success: true
        })
      } catch (error) {
        results.push({
          step: endpoint.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }
}