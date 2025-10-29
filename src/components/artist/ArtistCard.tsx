'use client'

import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { SpotifyArtist } from '../../types/spotify'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'

interface ArtistCardProps {
  artist?: SpotifyArtist
  loading?: boolean
  onClick?: () => void
}

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: 280px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
    min-height: 240px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: ${({ theme }) => theme.colors.primary}40;
  }

  &:active {
    transform: translateY(0);
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.98);
      background-color: ${({ theme }) => theme.colors.surfaceHover};
    }
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`

const ArtistImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 3rem;
`

const ArtistInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const ArtistName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const FollowersCount = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  margin: 0;
`

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const GenreTag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xs};
  border-radius: 4px;
  text-transform: capitalize;
`

const LoadingCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const LoadingImageSkeleton = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
`

const LoadingTextSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const ArtistCard: React.FC<ArtistCardProps> = ({ 
  artist, 
  loading = false, 
  onClick 
}) => {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (artist) {
      router.push(`/artist/${artist.id}`)
    }
  }

  if (loading) {
    return (
      <LoadingCard>
        <LoadingImageSkeleton>
          <LoadingSkeleton height="100%" />
        </LoadingImageSkeleton>
        <LoadingTextSkeleton>
          <LoadingSkeleton height="24px" width="80%" />
          <LoadingSkeleton height="16px" width="60%" />
        </LoadingTextSkeleton>
      </LoadingCard>
    )
  }

  if (!artist) {
    return null
  }

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K followers`
    } else {
      return `${count} followers`
    }
  }

  const getArtistImage = (): string | null => {
    if (!artist.images || artist.images.length === 0) {
      return null
    }
    
    // Find the best image size (prefer medium size around 300px)
    const sortedImages = [...artist.images].sort((a, b) => {
      const aDiff = Math.abs(a.width - 300)
      const bDiff = Math.abs(b.width - 300)
      return aDiff - bDiff
    })
    
    return sortedImages[0]?.url || null
  }

  const imageUrl = getArtistImage()
  const displayGenres = artist.genres.slice(0, 3) // Show max 3 genres

  return (
    <CardContainer onClick={handleClick} role="button" tabIndex={0}>
      <ImageContainer>
        {imageUrl ? (
          <ArtistImage 
            src={imageUrl} 
            alt={`${artist.name} artist image`}
            loading="lazy"
          />
        ) : (
          <PlaceholderImage>
            🎤
          </PlaceholderImage>
        )}
      </ImageContainer>
      
      <ArtistInfo>
        <ArtistName title={artist.name}>
          {artist.name}
        </ArtistName>
        
        <FollowersCount>
          {formatFollowers(artist.followers.total)}
        </FollowersCount>
        
        {displayGenres.length > 0 && (
          <GenresList>
            {displayGenres.map((genre, index) => (
              <GenreTag key={index}>
                {genre}
              </GenreTag>
            ))}
          </GenresList>
        )}
      </ArtistInfo>
    </CardContainer>
  )
}