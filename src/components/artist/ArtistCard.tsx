'use client'

import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { SpotifyArtist } from '../../types/spotify'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'
import { animationMixins, prefersReducedMotion } from '../../utils/animations'
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance'

interface ArtistCardProps {
  artist?: SpotifyArtist
  loading?: boolean
  selected?: boolean
  onClick?: () => void
}

const CardContainer = styled.div<{ selected?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              transform ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut},
              box-shadow ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut},
              border-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.borderActive : 'transparent'};
  position: relative;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.cardWidth};
  height: ${({ theme }) => theme.layout.cardHeight};
  display: flex;
  flex-direction: column;
  will-change: transform, background-color, box-shadow;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: auto;
    min-height: 200px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.02) translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(196, 255, 97, 0.2);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    transition: outline-offset ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  }

  &:active {
    transform: scale(0.98) translateY(0);
    transition-duration: ${({ theme }) => theme.animation.duration.fast};
  }

  /* Touch-friendly interactions for mobile devices */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 44px; /* Minimum touch target size */
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      transform: scale(1.01) translateY(-1px);
    }
    
    &:active {
      transform: scale(0.97) translateY(0);
    }
  }

  /* Ensure consistent spacing and alignment */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      transform: scale(1.02) translateY(-2px);
    }
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: background-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut},
                border-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    &:active {
      transform: none;
    }
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
  flex-shrink: 0;
`

const ArtistImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  will-change: transform;

  ${CardContainer}:hover & {
    transform: scale(1.08);
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    ${CardContainer}:hover & {
      transform: none;
    }
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
  flex-grow: 1;
  justify-content: flex-start;
`

const ArtistName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.cardTitle.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.cardTitle.letterSpacing};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};

  ${CardContainer}:hover & {
    color: #000000;
  }
`

const FollowersCount = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.cardMeta.fontSize};
  font-weight: ${({ theme }) => theme.typography.cardMeta.fontWeight};
  line-height: ${({ theme }) => theme.typography.cardMeta.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.cardMeta.letterSpacing};
  margin: 0;
  transition: color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};

  ${CardContainer}:hover & {
    color: #000000;
  }
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
  selected = false,
  onClick 
}) => {
  const router = useRouter()
  const { elementRef, handleMouseEnter, handleMouseLeave } = useAnimationPerformance()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (artist) {
      router.push(`/artist/${artist.id}`)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
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
      return `Followers: ${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `Followers: ${(count / 1000).toFixed(1)}K`
    } else {
      return `Followers: ${count.toLocaleString()}`
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

  return (
    <CardContainer 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      onClick={handleClick} 
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button" 
      tabIndex={0} 
      selected={selected}
      aria-label={`View ${artist.name} artist details`}
    >
      <ImageContainer>
        {imageUrl ? (
          <ArtistImage 
            src={imageUrl} 
            alt={`${artist.name} artist image`}
            loading="lazy"
            decoding="async"
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
      </ArtistInfo>
    </CardContainer>
  )
}