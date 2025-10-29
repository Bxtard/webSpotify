'use client'

import styled from 'styled-components'

import { Layout } from '../../components/common/Layout'
import { AuthWrapper } from '../../components/auth/AuthWrapper'
import { SearchInput } from '../../components/ui/SearchInput'
import { ArtistList } from '../../components/artist/ArtistList'
import { Pagination } from '../../components/ui/Pagination'
import { useSpotifySearch } from '../../hooks/useSpotifySearch'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { PageErrorBoundary } from '../../components/ui/ErrorBoundary'

// SPOTIFY APP centered layout container
const SearchContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  }
`

const SearchHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`

// Hero title using SPOTIFY APP design system
const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.hero.fontSize};
  font-weight: ${({ theme }) => theme.typography.hero.fontWeight};
  line-height: ${({ theme }) => theme.typography.hero.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.hero.letterSpacing};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`

// Subtitle using SPOTIFY APP design system
const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.subtitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.subtitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.subtitle.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.subtitle.letterSpacing};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const SearchInputContainer = styled.div`
  max-width: ${({ theme }) => theme.layout.searchMaxWidth};
  width: 100%;
  margin: 0 auto ${({ theme }) => theme.spacing.xl} auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
  }
`

const ResultsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  text-align: left;
`

// Results counter styled with subtitle typography
const ResultsCounter = styled.div`
  font-size: ${({ theme }) => theme.typography.subtitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.subtitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.subtitle.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.subtitle.letterSpacing};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: left;
  }
`



const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.5;
`

const EmptyStateTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 400px;
  margin: 0 auto;
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
`

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const RetryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: 8px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const OfflineContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.textMuted}40;
`

const OfflineIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.6;
`

const OfflineTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const OfflineText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`



function SearchPageContent() {
  const {
    query,
    results,
    loading,
    error,
    hasSearched,
    totalResults,
    currentPage,
    totalPages,
    setQuery,
    setPage,
    retry
  } = useSpotifySearch(500, 4)
  const isOnline = useOnlineStatus()

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
  }

  const renderContent = () => {
    // Show offline state if user is offline
    if (!isOnline) {
      return (
        <OfflineContainer>
          <OfflineIcon>📡</OfflineIcon>
          <OfflineTitle>You&apos;re offline</OfflineTitle>
          <OfflineText>
            Please check your internet connection and try again.
          </OfflineText>
        </OfflineContainer>
      )
    }

    if (error) {
      return (
        <ErrorContainer>
          <ErrorTitle>Search Error</ErrorTitle>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={retry} disabled={loading}>
            {loading ? 'Retrying...' : 'Try Again'}
          </RetryButton>
        </ErrorContainer>
      )
    }

    if (hasSearched && results.length === 0 && !loading) {
      return (
        <EmptyState>
          <EmptyStateIcon>🔍</EmptyStateIcon>
          <EmptyStateTitle>No artists found</EmptyStateTitle>
          <EmptyStateText>
            We couldn&apos;t find any artists matching &quot;{query}&quot;. Try searching with different keywords.
          </EmptyStateText>
        </EmptyState>
      )
    }

    if (!hasSearched && !loading) {
      return (
        <EmptyState>
          <EmptyStateIcon>🎵</EmptyStateIcon>
          <EmptyStateTitle>Search for artists</EmptyStateTitle>
          <EmptyStateText>
            Start typing to discover your favorite artists and explore their music.
          </EmptyStateText>
        </EmptyState>
      )
    }

    return (
      <>
        <ArtistList artists={results} loading={loading} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={loading}
          />
        )}
      </>
    )
  }

  return (
    <AuthWrapper>
      <Layout showSearch onSearch={handleSearch} searchValue={query} searchLoading={loading}>
        <SearchContainer>
          <SearchHeader>
            <HeroTitle>
              Busca tus{' '}
              <span style={{ color: '#C4FF61' }}>artistas</span>
            </HeroTitle>
            <Subtitle>
              Encuentra tus artistas favoritos gracias a nuestro buscador y guarda tus álbumes favoritos
            </Subtitle>
          </SearchHeader>

          <SearchInputContainer>
            <SearchInput
              placeholder="Search for artists..."
              value={query}
              onChange={setQuery}
              onSubmit={() => { }} // Search is handled automatically by debounced hook
              loading={loading}
            />
          </SearchInputContainer>

          <ResultsContainer>
            {hasSearched && results.length > 0 && !loading && (
              <ResultsCounter>
                Mostrando {results.length} resultados de {totalResults.toLocaleString()} resultados
              </ResultsCounter>
            )}
            {renderContent()}
          </ResultsContainer>
        </SearchContainer>
      </Layout>
    </AuthWrapper>
  )
}

export default function SearchPage() {
  return (
    <PageErrorBoundary>
      <SearchPageContent />
    </PageErrorBoundary>
  )
}