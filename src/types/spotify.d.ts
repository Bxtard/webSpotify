// Spotify API types placeholder - will be implemented in task 3
export interface SpotifyArtist {
  id: string
  name: string
  images: SpotifyImage[]
  followers: {
    total: number
  }
  genres: string[]
  popularity: number
  external_urls: {
    spotify: string
  }
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  release_date: string
  artists: SpotifyArtist[]
  total_tracks: number
  external_urls: {
    spotify: string
  }
}

export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[]
    total: number
    limit: number
    offset: number
    next: string | null
  }
}