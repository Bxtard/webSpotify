// Authentication types placeholder - will be implemented in task 3
export interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  user: SpotifyUser | null
  loading: boolean
  error: string | null
}

export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: SpotifyImage[]
}

export interface SpotifyImage {
  url: string
  height: number
  width: number
}