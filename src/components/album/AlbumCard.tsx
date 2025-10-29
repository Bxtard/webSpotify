'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { SpotifyAlbum } from '../../types/spotify'
import { Button } from '../ui/Button'

export interface AlbumCardProps {
  album: SpotifyAlbum
  isSaved: boolean
  onSave: (albumId: string) => Promise<void>
  onRemove: (albumId: string) => Promise<void>
  loading?: boolean
}

const CardContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['loading'].includes(prop),
})<{ loading?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  will-change: transform, box-shadow;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    transform: scale(1.02) translateZ(0);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  }

  &:not(:hover) {
    will-change: auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    &:hover {
      transform: none;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }

  ${({ loading }) =>
    loading &&
    `
      pointer-events: none;
      opacity: 0.7;
    `}
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surfaceHover};
`

const AlbumImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};

  ${CardContainer}:hover & {
    transform: scale(1.05) translateZ(0);
  }

  @media (prefers-reduced-motion: reduce) {
    ${CardContainer}:hover & {
      transform: none;
    }
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 40%;
    height: 40%;
    fill: currentColor;
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`

const AlbumTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.cardTitle.fontWeight};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.cardTitle.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.cardTitle.letterSpacing};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const AlbumArtists = styled.p`
  font-size: ${({ theme }) => theme.typography.cardMeta.fontSize};
  font-weight: ${({ theme }) => theme.typography.cardMeta.fontWeight};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.cardMeta.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.cardMeta.letterSpacing};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const AlbumMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xxs};
`

const ReleaseYear = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme }) => theme.colors.textMuted};
`

const TrackCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme }) => theme.colors.textMuted};
`

const CardActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`

const ActionButton = styled(Button)`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    min-height: 48px;
  }
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.colors.textMuted};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  isSaved,
  onSave,
  onRemove,
  loading = false,
}) => {
  const [actionLoading, setActionLoading] = useState(false)

  const handleAction = async () => {
    try {
      setActionLoading(true)
      if (isSaved) {
        await onRemove(album.id)
      } else {
        await onSave(album.id)
      }
    } catch (error) {
      console.error('Error handling album action:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.getFullYear().toString()
  }

  const getArtistNames = (artists: SpotifyAlbum['artists']): string => {
    return artists.map(artist => artist.name).join(', ')
  }

  const getTrackCountText = (count: number): string => {
    return count === 1 ? '1 track' : `${count} tracks`
  }

  return (
    <CardContainer loading={loading || actionLoading}>
      {(loading || actionLoading) && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      <ImageContainer>
        {album.images && album.images.length > 0 ? (
          <AlbumImage 
            src={album.images[0].url} 
            alt={album.name}
            loading="lazy"
          />
        ) : (
          <ImagePlaceholder>
            <svg viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </ImagePlaceholder>
        )}
      </ImageContainer>

      <CardContent>
        <AlbumTitle title={album.name}>{album.name}</AlbumTitle>
        <AlbumArtists title={getArtistNames(album.artists)}>
          {getArtistNames(album.artists)}
        </AlbumArtists>
        <AlbumMeta>
          <ReleaseYear>{formatReleaseDate(album.release_date)}</ReleaseYear>
          <TrackCount>{getTrackCountText(album.total_tracks)}</TrackCount>
        </AlbumMeta>
        <CardActions>
          <ActionButton
            variant={isSaved ? 'danger' : 'primary'}
            size="sm"
            onClick={handleAction}
            loading={actionLoading}
            disabled={loading || actionLoading}
          >
            {isSaved ? 'Remove album' : 'Add album'}
          </ActionButton>
        </CardActions>
      </CardContent>
    </CardContainer>
  )
}