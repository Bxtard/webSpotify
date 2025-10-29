// useSpotifyApi hook placeholder - will be implemented in task 3
export function useSpotifyApi() {
  return {
    searchArtists: () => Promise.resolve([]),
    getArtist: () => Promise.resolve(null),
    getArtistAlbums: () => Promise.resolve([]),
    saveAlbum: () => Promise.resolve(),
    removeAlbum: () => Promise.resolve(),
    getSavedAlbums: () => Promise.resolve([])
  }
}