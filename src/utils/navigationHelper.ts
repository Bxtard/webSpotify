/**
 * Navigation Helper Utilities
 * 
 * This module provides utilities for navigation management and route validation
 * across the Spotify Web App.
 */

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export interface RouteConfig {
  path: string
  name: string
  requiresAuth: boolean
  showInNavigation: boolean
  icon?: string
}

/**
 * Application route configuration
 */
export const APP_ROUTES: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    requiresAuth: false,
    showInNavigation: false
  },
  {
    path: '/login',
    name: 'Login',
    requiresAuth: false,
    showInNavigation: false
  },
  {
    path: '/auth/callback',
    name: 'Auth Callback',
    requiresAuth: false,
    showInNavigation: false
  },
  {
    path: '/search',
    name: 'Buscar',
    requiresAuth: true,
    showInNavigation: true,
    icon: '🔍'
  },
  {
    path: '/albums',
    name: 'Mis álbumes',
    requiresAuth: true,
    showInNavigation: true,
    icon: '💿'
  },
  {
    path: '/artist/[id]',
    name: 'Artist Detail',
    requiresAuth: true,
    showInNavigation: false
  }
]

/**
 * Navigation helper class
 */
export class NavigationHelper {
  /**
   * Get routes that should be shown in navigation
   */
  static getNavigationRoutes(): RouteConfig[] {
    return APP_ROUTES.filter(route => route.showInNavigation)
  }

  /**
   * Get route configuration by path
   */
  static getRouteConfig(path: string): RouteConfig | undefined {
    return APP_ROUTES.find(route => {
      if (route.path.includes('[id]')) {
        // Handle dynamic routes
        const routePattern = route.path.replace('[id]', '[^/]+')
        const regex = new RegExp(`^${routePattern}$`)
        return regex.test(path)
      }
      return route.path === path
    })
  }

  /**
   * Check if a route requires authentication
   */
  static requiresAuth(path: string): boolean {
    const route = this.getRouteConfig(path)
    return route?.requiresAuth ?? true // Default to requiring auth for unknown routes
  }

  /**
   * Get the default route for authenticated users
   */
  static getDefaultAuthenticatedRoute(): string {
    return '/search'
  }

  /**
   * Get the login route
   */
  static getLoginRoute(): string {
    return '/login'
  }

  /**
   * Navigate to artist detail page
   */
  static navigateToArtist(router: AppRouterInstance, artistId: string): void {
    router.push(`/artist/${artistId}`)
  }

  /**
   * Navigate to search page with optional query
   */
  static navigateToSearch(router: AppRouterInstance, query?: string): void {
    const searchPath = query ? `/search?q=${encodeURIComponent(query)}` : '/search'
    router.push(searchPath)
  }

  /**
   * Navigate to saved albums page
   */
  static navigateToAlbums(router: AppRouterInstance): void {
    router.push('/albums')
  }

  /**
   * Navigate back with fallback
   */
  static navigateBack(router: AppRouterInstance, fallbackPath: string = '/search'): void {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackPath)
    }
  }

  /**
   * Handle authentication redirect
   */
  static handleAuthRedirect(
    router: AppRouterInstance, 
    isAuthenticated: boolean, 
    currentPath: string,
    loading: boolean = false
  ): void {
    // Don't redirect while loading
    if (loading) return

    const route = this.getRouteConfig(currentPath)
    
    if (!route) {
      // Unknown route, redirect to default
      if (isAuthenticated) {
        router.push(this.getDefaultAuthenticatedRoute())
      } else {
        router.push(this.getLoginRoute())
      }
      return
    }

    // Handle authentication requirements
    if (route.requiresAuth && !isAuthenticated) {
      router.push(this.getLoginRoute())
    } else if (!route.requiresAuth && isAuthenticated && currentPath === '/login') {
      router.push(this.getDefaultAuthenticatedRoute())
    }
  }

  /**
   * Get breadcrumb navigation for current path
   */
  static getBreadcrumbs(path: string): { name: string; path: string }[] {
    const breadcrumbs: { name: string; path: string }[] = []
    
    // Always start with home/search for authenticated routes
    if (path !== '/search' && this.requiresAuth(path)) {
      breadcrumbs.push({ name: 'Buscar', path: '/search' })
    }

    // Add current page
    const route = this.getRouteConfig(path)
    if (route && route.path !== '/search') {
      breadcrumbs.push({ name: route.name, path })
    }

    return breadcrumbs
  }

  /**
   * Validate navigation state
   */
  static validateNavigationState(
    currentPath: string,
    isAuthenticated: boolean
  ): { isValid: boolean; suggestedAction?: string } {
    const route = this.getRouteConfig(currentPath)
    
    if (!route) {
      return {
        isValid: false,
        suggestedAction: 'Redirect to default route'
      }
    }

    if (route.requiresAuth && !isAuthenticated) {
      return {
        isValid: false,
        suggestedAction: 'Redirect to login'
      }
    }

    if (!route.requiresAuth && isAuthenticated && currentPath === '/login') {
      return {
        isValid: false,
        suggestedAction: 'Redirect to search'
      }
    }

    return { isValid: true }
  }
}

/**
 * URL parameter utilities
 */
export class URLHelper {
  /**
   * Extract artist ID from artist detail URL
   */
  static extractArtistId(path: string): string | null {
    const match = path.match(/^\/artist\/([^/]+)$/)
    return match ? match[1] : null
  }

  /**
   * Extract search query from URL parameters
   */
  static extractSearchQuery(searchParams: URLSearchParams): string {
    return searchParams.get('q') || ''
  }

  /**
   * Build search URL with query
   */
  static buildSearchURL(query: string): string {
    if (!query.trim()) return '/search'
    return `/search?q=${encodeURIComponent(query.trim())}`
  }

  /**
   * Build artist detail URL
   */
  static buildArtistURL(artistId: string): string {
    return `/artist/${encodeURIComponent(artistId)}`
  }
}

/**
 * Mobile navigation utilities
 */
export class MobileNavigationHelper {
  /**
   * Check if current device is mobile
   */
  static isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  }

  /**
   * Get mobile-optimized navigation items
   */
  static getMobileNavigationItems(): RouteConfig[] {
    return NavigationHelper.getNavigationRoutes().map(route => ({
      ...route,
      name: route.name.length > 10 ? route.name.substring(0, 10) + '...' : route.name
    }))
  }

  /**
   * Handle mobile menu toggle
   */
  static handleMobileMenuToggle(
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
  ): void {
    setIsOpen(!isOpen)
    
    // Prevent body scroll when menu is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = !isOpen ? 'hidden' : 'auto'
    }
  }

  /**
   * Close mobile menu
   */
  static closeMobileMenu(setIsOpen: (open: boolean) => void): void {
    setIsOpen(false)
    
    // Restore body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto'
    }
  }
}