'use client'

import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useLazyImage } from '../../utils/lazyLoading'

interface LazyImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
  priority?: boolean
}

const ImageContainer = styled.div<{ $aspectRatio?: number }>`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  
  ${({ $aspectRatio }) => $aspectRatio && `
    aspect-ratio: ${$aspectRatio};
  `}
`

const Image = styled.img<{ $loaded: boolean; $error: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: ${({ $loaded, $error }) => $loaded && !$error ? 1 : 0};
  
  &.lazy-loading {
    opacity: 0.6;
  }
  
  &.lazy-error {
    opacity: 0.5;
  }
`

const PlaceholderContainer = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${({ $show }) => $show ? 'shimmer 1.5s infinite' : 'none'};
  opacity: ${({ $show }) => $show ? 1 : 0};
  transition: opacity 0.3s ease;
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: ${({ theme }) => theme.colors.surface};
  }
`

const ErrorPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 2rem;
`

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  onLoad,
  onError,
  priority = false,
}) => {
  const { imgRef, loaded, error, imgProps } = useLazyImage(src, {
    placeholder,
    threshold: priority ? 0.5 : 0.1,
    rootMargin: priority ? '50px 0px' : '100px 0px'
  })

  const [aspectRatio, setAspectRatio] = useState<number | undefined>()

  useEffect(() => {
    if (typeof width === 'number' && typeof height === 'number') {
      setAspectRatio(width / height)
    }
  }, [width, height])

  useEffect(() => {
    if (loaded && onLoad) {
      onLoad()
    }
  }, [loaded, onLoad])

  useEffect(() => {
    if (error && onError) {
      onError()
    }
  }, [error, onError])

  return (
    <ImageContainer 
      className={className}
      $aspectRatio={aspectRatio}
      style={{ width, height }}
    >
      <Image
        {...imgProps}
        alt={alt}
        $loaded={loaded}
        $error={error}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      
      <PlaceholderContainer $show={!loaded && !error}>
        {/* Loading shimmer effect */}
      </PlaceholderContainer>
      
      {error && (
        <ErrorPlaceholder>
          🖼️
        </ErrorPlaceholder>
      )}
    </ImageContainer>
  )
}