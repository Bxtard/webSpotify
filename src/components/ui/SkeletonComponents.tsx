'use client'

import styled from 'styled-components'
import React from 'react'
import { LoadingSkeleton } from './LoadingSkeleton'

// Artist Card Skeleton
const ArtistCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease-in-out;
`

export const ArtistCardSkeleton: React.FC = () => (
  <ArtistCardContainer>
    <LoadingSkeleton variant="circular" width="120px" height="120px" />
    <LoadingSkeleton width="80%" height="20px" borderRadius="4px" />
    <LoadingSkeleton width="60%" height="16px" borderRadius="4px" />
  </ArtistCardContainer>
)

// Album Card Skeleton
const AlbumCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

export const AlbumCardSkeleton: React.FC = () => (
  <AlbumCardContainer>
    <LoadingSkeleton width="100%" height="200px" borderRadius="8px" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <LoadingSkeleton width="90%" height="18px" borderRadius="4px" />
      <LoadingSkeleton width="70%" height="14px" borderRadius="4px" />
      <LoadingSkeleton width="50%" height="12px" borderRadius="4px" />
    </div>
    <LoadingSkeleton width="100%" height="40px" borderRadius="8px" />
  </AlbumCardContainer>
)

// Search Results Skeleton
const SearchResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const SearchResultsSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <SearchResultsContainer>
    {Array.from({ length: count }).map((_, index) => (
      <ArtistCardSkeleton key={index} />
    ))}
  </SearchResultsContainer>
)

// Artist Header Skeleton
const ArtistHeaderContainer = styled.div`
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

const ArtistInfoSkeleton = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    text-align: center;
  }
`

export const ArtistHeaderSkeleton: React.FC = () => (
  <ArtistHeaderContainer>
    <LoadingSkeleton variant="circular" width="200px" height="200px" />
    <ArtistInfoSkeleton>
      <LoadingSkeleton width="300px" height="48px" borderRadius="4px" />
      <LoadingSkeleton width="200px" height="20px" borderRadius="4px" />
      <LoadingSkeleton width="150px" height="20px" borderRadius="4px" />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
        <LoadingSkeleton width="80px" height="24px" borderRadius="12px" />
        <LoadingSkeleton width="100px" height="24px" borderRadius="12px" />
        <LoadingSkeleton width="90px" height="24px" borderRadius="12px" />
      </div>
    </ArtistInfoSkeleton>
  </ArtistHeaderContainer>
)

// Albums Grid Skeleton
const AlbumsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    max-width: 300px;
    margin: 0 auto;
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }
`

export const AlbumsGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <AlbumsGridContainer>
    {Array.from({ length: count }).map((_, index) => (
      <AlbumCardSkeleton key={index} />
    ))}
  </AlbumsGridContainer>
)

// Saved Albums Skeleton
const SavedAlbumsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`

const ArtistGroupSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const ArtistNameSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ArtistAlbumsGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    max-width: 300px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const SavedAlbumsSkeleton: React.FC<{ artistCount?: number; albumsPerArtist?: number }> = ({
  artistCount = 3,
  albumsPerArtist = 4,
}) => (
  <SavedAlbumsContainer>
    {Array.from({ length: artistCount }).map((_, artistIndex) => (
      <ArtistGroupSkeleton key={artistIndex}>
        <ArtistNameSkeleton>
          <LoadingSkeleton variant="circular" width="40px" height="40px" />
          <LoadingSkeleton width="200px" height="24px" borderRadius="4px" />
        </ArtistNameSkeleton>
        <ArtistAlbumsGridSkeleton>
          {Array.from({ length: albumsPerArtist }).map((_, albumIndex) => (
            <AlbumCardSkeleton key={albumIndex} />
          ))}
        </ArtistAlbumsGridSkeleton>
      </ArtistGroupSkeleton>
    ))}
  </SavedAlbumsContainer>
)

// Page Loading Skeleton (full page)
const PageLoadingContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const PageLoadingSkeleton: React.FC = () => (
  <PageLoadingContainer>
    <LoadingSkeleton width="200px" height="40px" borderRadius="8px" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LoadingSkeleton width="300px" height="32px" borderRadius="4px" />
      <LoadingSkeleton width="100%" height="48px" borderRadius="8px" />
    </div>
    <SearchResultsSkeleton />
  </PageLoadingContainer>
)