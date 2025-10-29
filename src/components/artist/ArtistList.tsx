'use client'

import styled from 'styled-components'
import { SpotifyArtist } from '../../types/spotify'
import { ArtistCard } from './ArtistCard'

interface ArtistListProps {
  artists: SpotifyArtist[]
  loading?: boolean
  onArtistClick?: (artist: SpotifyArtist) => void
}

const GridContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    max-width: 400px;
    margin: 0 auto;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }
`

const LoadingGrid = styled(GridContainer)`
  /* Same grid layout for loading state */
`

export const ArtistList: React.FC<ArtistListProps> = ({ 
  artists, 
  loading = false, 
  onArtistClick 
}) => {
  if (loading) {
    return (
      <LoadingGrid>
        {Array.from({ length: 8 }).map((_, index) => (
          <ArtistCard key={`loading-${index}`} loading />
        ))}
      </LoadingGrid>
    )
  }

  return (
    <GridContainer>
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          onClick={onArtistClick ? () => onArtistClick(artist) : undefined}
        />
      ))}
    </GridContainer>
  )
}