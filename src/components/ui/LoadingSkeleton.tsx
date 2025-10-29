'use client'

import styled, { css, keyframes } from 'styled-components'
import React from 'react'

export interface LoadingSkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  variant?: 'text' | 'rectangular' | 'circular' | 'card'
  lines?: number
  className?: string
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const SkeletonBase = styled.div<{
  width?: string | number
  height?: string | number
  borderRadius?: string | number
}>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 0%,
    ${({ theme }) => theme.colors.surfaceHover} 50%,
    ${({ theme }) => theme.colors.surface} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  
  ${({ width }) =>
    width &&
    css`
      width: ${typeof width === 'number' ? `${width}px` : width};
    `}
  
  ${({ height }) =>
    height &&
    css`
      height: ${typeof height === 'number' ? `${height}px` : height};
    `}
  
  ${({ borderRadius }) =>
    borderRadius &&
    css`
      border-radius: ${typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius};
    `}
`

const TextSkeleton = styled(SkeletonBase)`
  height: 1em;
  border-radius: 4px;
  margin-bottom: 0.5em;

  &:last-child {
    margin-bottom: 0;
    width: 60%;
  }
`

const RectangularSkeleton = styled(SkeletonBase)`
  border-radius: 8px;
`

const CircularSkeleton = styled(SkeletonBase)`
  border-radius: 50%;
`

const CardSkeletonContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const CardImageSkeleton = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
`

const CardContentSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const CardTitleSkeleton = styled(SkeletonBase)`
  height: 20px;
  width: 80%;
  border-radius: 4px;
`

const CardSubtitleSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 60%;
  border-radius: 4px;
`

const CardMetaSkeleton = styled(SkeletonBase)`
  height: 12px;
  width: 40%;
  border-radius: 4px;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width,
  height,
  borderRadius,
  variant = 'rectangular',
  lines = 1,
  className,
  ...props
}) => {
  if (variant === 'text') {
    return (
      <TextContainer className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <TextSkeleton
            key={index}
            width={width}
            height={height}
            borderRadius={borderRadius}
            {...props}
          />
        ))}
      </TextContainer>
    )
  }

  if (variant === 'circular') {
    return (
      <CircularSkeleton
        width={width}
        height={height}
        className={className}
        {...props}
      />
    )
  }

  if (variant === 'card') {
    return (
      <CardSkeletonContainer className={className}>
        <CardImageSkeleton />
        <CardContentSkeleton>
          <CardTitleSkeleton />
          <CardSubtitleSkeleton />
          <CardMetaSkeleton />
        </CardContentSkeleton>
      </CardSkeletonContainer>
    )
  }

  return (
    <RectangularSkeleton
      width={width}
      height={height}
      borderRadius={borderRadius}
      className={className}
      {...props}
    />
  )
}

// Convenience components for common use cases
export const SkeletonText: React.FC<Omit<LoadingSkeletonProps, 'variant'>> = (props) => (
  <LoadingSkeleton variant="text" {...props} />
)

export const SkeletonCard: React.FC<Omit<LoadingSkeletonProps, 'variant'>> = (props) => (
  <LoadingSkeleton variant="card" {...props} />
)

export const SkeletonCircle: React.FC<Omit<LoadingSkeletonProps, 'variant'>> = (props) => (
  <LoadingSkeleton variant="circular" {...props} />
)