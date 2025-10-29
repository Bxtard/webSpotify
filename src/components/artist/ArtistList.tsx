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
  gap: ${({ theme }) => theme.layout.gridGap};
  width: 100%;
  
  /* Mobile: 2 columns */
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.grid.mobile.gap};
  padding: 0 ${({ theme }) => theme.grid.mobile.padding};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    /* Tablet: 3 columns */
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.grid.tablet.gap};
    padding: 0 ${({ theme }) => theme.grid.tablet.padding};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    /* Desktop: 4 columns */
    grid-template-columns: repeat(4, 1fr);
    gap: ${({ theme }) => theme.grid.desktop.gap};
    padding: 0 ${({ theme }) => theme.grid.desktop.padding};
  }

  /* Ensure cards maintain consistent sizing */
  & > * {
    width: 100%;
    max-width: ${({ theme }) => theme.layout.cardWidth};
    justify-self: center;
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
        {Array.from({ length: 4 }).map((_, index) => (
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