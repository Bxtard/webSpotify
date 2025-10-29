'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useSavedAlbums } from '../../hooks/useSavedAlbums'
import { AlbumCard } from './AlbumCard'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'
import { Button } from '../ui/Button'

const Container = styled.div`
  width: 100%;
`

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`

const ErrorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  text-align: center;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
`

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`

const EmptyStateTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  max-width: 400px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

const ArtistSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  &:last-child {
    margin-bottom: 0;
  }
`

const ArtistHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const ArtistName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`

const AlbumCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: ${({ theme }) => theme.spacing.sm};
`

const AlbumsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: 1fr;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(5, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }
`

const LoadingGrid = styled(AlbumsGrid)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const RetryButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.md};
`

export const SavedAlbums: React.FC = () => {
  const {
    savedAlbums,
    groupedAlbums,
    loading,
    error,
    fetchSavedAlbums,
    removeAlbum,
    clearError,
    hasMore,
    loadMore
  } = useSavedAlbums()

  const [removingAlbums, setRemovingAlbums] = useState<Set<string>>(new Set())

  const handleRemoveAlbum = async (albumId: string) => {
    try {
      setRemovingAlbums(prev => new Set(prev).add(albumId))
      await removeAlbum(albumId)
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setRemovingAlbums(prev => {
        const newSet = new Set(prev)
        newSet.delete(albumId)
        return newSet
      })
    }
  }

  const handleRetry = () => {
    clearError()
    fetchSavedAlbums()
  }

  // Show loading skeletons on initial load
  if (loading && savedAlbums.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Mis álbumes</Title>
          <Subtitle>Cargando tus álbumes guardados...</Subtitle>
        </Header>
        <LoadingGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingSkeleton key={index} variant="card" />
          ))}
        </LoadingGrid>
      </Container>
    )
  }

  // Show empty state if no albums
  if (!loading && savedAlbums.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Mis álbumes</Title>
          <Subtitle>Tu colección de música</Subtitle>
        </Header>
        
        {error && (
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
            <RetryButton variant="primary" size="sm" onClick={handleRetry}>
              Reintentar
            </RetryButton>
          </ErrorContainer>
        )}
        
        <EmptyState>
          <EmptyStateIcon>
            <svg viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>No tienes álbumes guardados</EmptyStateTitle>
          <EmptyStateText>
            Explora artistas y guarda sus álbumes para crear tu colección personal de música.
          </EmptyStateText>
          <Button variant="primary" size="md" onClick={() => window.location.href = '/search'}>
            Buscar música
          </Button>
        </EmptyState>
      </Container>
    )
  }

  const artistNames = Object.keys(groupedAlbums).sort()

  return (
    <Container>
      <Header>
        <Title>Mis álbumes</Title>
        <Subtitle>
          {savedAlbums.length} {savedAlbums.length === 1 ? 'álbum' : 'álbumes'} de {artistNames.length} {artistNames.length === 1 ? 'artista' : 'artistas'}
        </Subtitle>
      </Header>

      {error && (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton variant="primary" size="sm" onClick={handleRetry}>
            Reintentar
          </RetryButton>
        </ErrorContainer>
      )}

      {artistNames.map(artistName => {
        const artistAlbums = groupedAlbums[artistName]
        return (
          <ArtistSection key={artistName}>
            <ArtistHeader>
              <ArtistName>
                {artistName}
                <AlbumCount>
                  {artistAlbums.length} {artistAlbums.length === 1 ? 'álbum' : 'álbumes'}
                </AlbumCount>
              </ArtistName>
            </ArtistHeader>
            <AlbumsGrid>
              {artistAlbums.map(({ album }) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  isSaved={true}
                  onSave={async () => {}} // Not used since isSaved is true
                  onRemove={handleRemoveAlbum}
                  loading={removingAlbums.has(album.id)}
                />
              ))}
            </AlbumsGrid>
          </ArtistSection>
        )
      })}

      {hasMore && (
        <LoadMoreContainer>
          <Button
            variant="secondary"
            size="md"
            onClick={loadMore}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar más álbumes'}
          </Button>
        </LoadMoreContainer>
      )}
    </Container>
  )
}

export default SavedAlbums