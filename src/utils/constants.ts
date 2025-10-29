// Constants placeholder - will be implemented in task 3
export const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1'
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify'
].join(' ')