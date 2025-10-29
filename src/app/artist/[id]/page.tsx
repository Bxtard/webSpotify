'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

import { Layout } from '../../../components/common/Layout'
import { AuthWrapper } from '../../../components/auth/AuthWrapper'
import { spotifyApi } from '../../../api/spotify'
import { SpotifyArtist, SpotifyAlbum } from '../../../types/spotify'
import { Button } from '../../../components/ui/Button'
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton'
import { AlbumCard } from '../../../components/album/AlbumCard'
import { useAlbumManagement } from '../../../hooks/useAlbumManagement'
import { PageErrorBoundary } from '../../../components/ui/ErrorBoundary'

interface ArtistPageProps {
  params: {
    id: string
  }
}

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

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  align-self: flex-start;
  font-size: ${({ theme }) => theme.typography.nav.fontSize};
  font-weight: ${({ theme }) => theme.typography.nav.fontWeight};
`

const ArtistHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing.xl} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.xl};
    padding: ${({ theme }) => theme.spacing.lg} 0;
  }
`

const ArtistImage = styled.img`
  width: 240px;
  height: 240px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  object-fit: cover;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  transition: transform ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 200px;
    height: 200px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 180px;
    height: 180px;
  }
`

const ArtistImagePlaceholder = styled.div`
  width: 240px;
  height: 240px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 200px;
    height: 200px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 180px;
    height: 180px;
  }

  svg {
    width: 80px;
    height: 80px;
    fill: currentColor;
  }
`

const ArtistInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ArtistName = styled.h1`
  font-size: ${({ theme }) => theme.typography.hero.fontSize};
  font-weight: ${({ theme }) => theme.typography.hero.fontWeight};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.hero.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.hero.letterSpacing};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`

const ArtistStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`

const StatItem = styled.span`
  font-size: ${({ theme }) => theme.typography.cardMeta.fontSize};
  font-weight: ${({ theme }) => theme.typography.cardMeta.fontWeight};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.cardMeta.lineHeight};
  
  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const GenreTag = styled.span`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`

const AlbumsSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
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

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  h3 {
    color: ${({ theme }) => theme.colors.error};
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.subtitle.fontSize};
    line-height: ${({ theme }) => theme.typography.subtitle.lineHeight};
  }
`

const AlbumErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  span {
    color: ${({ theme }) => theme.colors.error};
    font-size: ${({ theme }) => theme.typography.cardMeta.fontSize};
    font-weight: ${({ theme }) => theme.typography.cardMeta.fontWeight};
  }
`

const DismissButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xxs};
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const HeaderSkeleton = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`

const AlbumsSkeleton = styled.div`
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

function ArtistPageContent({ params }: ArtistPageProps) {
  const router = useRouter()
  const [artist, setArtist] = useState<SpotifyArtist | null>(null)
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [albumsLoading, setAlbumsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const {
    savedAlbums,
    loading: albumManagementLoading,
    error: albumManagementError,
    saveAlbum,
    removeAlbum,
    checkAlbumsSaved,
    clearError: clearAlbumError
  } = useAlbumManagement()

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch artist details
        const artistData = await spotifyApi.getArtist(params.id)
        setArtist(artistData)
        setLoading(false)

        // Fetch artist albums
        setAlbumsLoading(true)
        const albumsData = await spotifyApi.getArtistAlbums(params.id)
        setAlbums(albumsData.items)
        setAlbumsLoading(false)

        // Check which albums are saved
        if (albumsData.items.length > 0) {
          const albumIds = albumsData.items.map(album => album.id)
          await checkAlbumsSaved(albumIds)
        }
      } catch (err) {
        console.error('Error fetching artist data:', err)
        setError('Failed to load artist information. Please try again.')
        setLoading(false)
        setAlbumsLoading(false)
      }
    }

    if (params.id) {
      fetchArtistData()
    }
  }, [params.id, checkAlbumsSaved])

  const handleBack = () => {
    router.back()
  }

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    setAlbumsLoading(true)
    // Re-trigger the effect by updating a dependency
    window.location.reload()
  }

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const renderContent = () => {
    if (error) {
      return (
        <Container>
          <BackButton variant="ghost" onClick={handleBack}>
            ← Back
          </BackButton>
          <ErrorMessage>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <Button onClick={handleRetry}>Try Again</Button>
          </ErrorMessage>
        </Container>
      )
    }

    if (loading) {
      return (
        <Container>
          <LoadingSkeleton width="80px" height="40px" borderRadius="8px" />
          <LoadingContainer>
            <HeaderSkeleton>
              <LoadingSkeleton variant="circular" width="200px" height="200px" />
              <div style={{ flex: 1 }}>
                <LoadingSkeleton width="300px" height="48px" borderRadius="4px" />
                <LoadingSkeleton width="200px" height="20px" borderRadius="4px" />
                <LoadingSkeleton width="150px" height="20px" borderRadius="4px" />
                <LoadingSkeleton width="250px" height="20px" borderRadius="4px" />
              </div>
            </HeaderSkeleton>
            <LoadingSkeleton width="200px" height="32px" borderRadius="4px" />
            <AlbumsSkeleton>
              {Array.from({ length: 8 }).map((_, index) => (
                <LoadingSkeleton key={index} variant="card" />
              ))}
            </AlbumsSkeleton>
          </LoadingContainer>
        </Container>
      )
    }

    return (
      <Container>
        <BackButton variant="ghost" onClick={handleBack}>
          ← Back
        </BackButton>

        {artist && (
          <>
            <ArtistHeader>
              {artist.images && artist.images.length > 0 ? (
                <ArtistImage
                  src={artist.images[0].url}
                  alt={artist.name}
                />
              ) : (
                <ArtistImagePlaceholder>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </ArtistImagePlaceholder>
              )}

              <ArtistInfo>
                <ArtistName>{artist.name}</ArtistName>
                <ArtistStats>
                  <StatItem>
                    <strong>{formatFollowers(artist.followers.total)}</strong> followers
                  </StatItem>
                  {artist.popularity > 0 && (
                    <StatItem>
                      <strong>{artist.popularity}%</strong> popularity
                    </StatItem>
                  )}
                </ArtistStats>
                {artist.genres && artist.genres.length > 0 && (
                  <GenreList>
                    {artist.genres.slice(0, 5).map((genre, index) => (
                      <GenreTag key={index}>{genre}</GenreTag>
                    ))}
                  </GenreList>
                )}
              </ArtistInfo>
            </ArtistHeader>

            <AlbumsSection>
              <SectionTitle>Albums</SectionTitle>
              
              {albumManagementError && (
                <AlbumErrorMessage>
                  <span>{albumManagementError}</span>
                  <DismissButton onClick={clearAlbumError}>
                    ✕
                  </DismissButton>
                </AlbumErrorMessage>
              )}
              
              {albumsLoading ? (
                <AlbumsSkeleton>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <LoadingSkeleton key={index} variant="card" />
                  ))}
                </AlbumsSkeleton>
              ) : albums.length > 0 ? (
                <AlbumsGrid>
                  {albums.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      isSaved={savedAlbums.has(album.id)}
                      onSave={saveAlbum}
                      onRemove={removeAlbum}
                      loading={albumManagementLoading}
                    />
                  ))}
                </AlbumsGrid>
              ) : albums.length > 0 ? (
                <AlbumsGrid>
                  {albums.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      isSaved={savedAlbums.has(album.id)}
                      onSave={saveAlbum}
                      onRemove={removeAlbum}
                      loading={albumManagementLoading}
                    />
                  ))}
                </AlbumsGrid>
              ) : (
                <ErrorMessage>
                  <h3>No albums found</h3>
                  <p>This artist doesn&apos;t have any albums available.</p>
                </ErrorMessage>
              )}
            </AlbumsSection>
          </>
        )}
      </Container>
    )
  }

  return (
    <AuthWrapper>
      <Layout>
        {renderContent()}
      </Layout>
    </AuthWrapper>
  )
}

export default function ArtistPage({ params }: ArtistPageProps) {
  return (
    <PageErrorBoundary>
      <ArtistPageContent params={params} />
    </PageErrorBoundary>
  )
}