'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useSavedAlbums } from '../../hooks/useSavedAlbums'
import { AlbumCard } from './AlbumCard'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'
import { Button } from '../ui/Button'

const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }
`

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.hero.fontSize};
  font-weight: ${({ theme }) => theme.typography.hero.fontWeight};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  line-height: ${({ theme }) => theme.typography.hero.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.hero.letterSpacing};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.subtitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.subtitle.fontWeight};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.subtitle.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.subtitle.letterSpacing};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`

const ErrorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.subtitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.subtitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.subtitle.lineHeight};
  margin: 0;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  max-width: 600px;
  margin: 0 auto;
`

const EmptyStateIcon = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`

const EmptyStateTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.subtitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.subtitle.fontWeight};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  max-width: 450px;
  line-height: ${({ theme }) => theme.typography.subtitle.lineHeight};
`

const ArtistSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};

  &:last-child {
    margin-bottom: 0;
  }
`

const ArtistHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const ArtistName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`

const AlbumCount = styled.span`
  font-size: ${({ theme }) => theme.typography.cardMeta.fontSize};
  font-weight: ${({ theme }) => theme.typography.cardMeta.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
  margin-left: ${({ theme }) => theme.spacing.md};
`

const AlbumsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.grid.mobile.gap};
  grid-template-columns: repeat(${({ theme }) => theme.grid.mobile.columns}, 1fr);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.grid.tablet.gap};
    grid-template-columns: repeat(${({ theme }) => theme.grid.tablet.columns}, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: ${({ theme }) => theme.grid.desktop.gap};
    grid-template-columns: repeat(${({ theme }) => theme.grid.desktop.columns}, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(5, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }
`

const LoadingGrid = styled(AlbumsGrid)`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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
          <Title>
            Mis albumes{' '}
            <span style={{ color: '#C4FF61' }}>guardados</span>
          </Title>
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
          <Title>
            Mis álbumes<br />
            <span style={{ color: '#C4FF61' }}>guardados</span>
          </Title>
          <Subtitle>
            Disfruta de tu música a un solo click y descubre que<br />
            discos has guardado dentro de "mis álbumes"
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
        <Title>
          Mis álbumes<br />
          <span style={{ color: '#C4FF61' }}>guardados</span>
        </Title>
        <Subtitle>
          Disfruta de tu música a un solo click y descubre que<br />
          discos has guardado dentro de "mis álbumes"
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
                  onSave={async () => { }} // Not used since isSaved is true
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