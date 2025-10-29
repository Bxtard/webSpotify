'use client'

import styled, { css } from 'styled-components'
import React from 'react'

export interface CardProps {
  image?: string
  title: string
  subtitle?: string
  meta?: string
  actions?: React.ReactNode
  onClick?: () => void
  variant: 'artist' | 'album'
  loading?: boolean
  className?: string
}

const CardContainer = styled.div<{ clickable?: boolean; loading?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;

      &:hover {
        background-color: ${({ theme }) => theme.colors.surfaceHover};
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    `}

  ${({ loading }) =>
    loading &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.surfaceHover};
`

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;

  ${CardContainer}:hover & {
    transform: scale(1.05);
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

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CardMeta = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xxs};
`

const CardActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
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

export const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  meta,
  actions,
  onClick,
  variant,
  loading = false,
  className,
  ...props
}) => {
  const renderPlaceholder = () => {
    if (variant === 'artist') {
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )
    } else {
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      )
    }
  }

  return (
    <CardContainer
      clickable={!!onClick}
      loading={loading}
      onClick={onClick}
      className={className}
      {...props}
    >
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      <ImageContainer>
        {image ? (
          <CardImage src={image} alt={title} />
        ) : (
          <ImagePlaceholder>{renderPlaceholder()}</ImagePlaceholder>
        )}
      </ImageContainer>

      <CardContent>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        {meta && <CardMeta>{meta}</CardMeta>}
        {actions && <CardActions>{actions}</CardActions>}
      </CardContent>
    </CardContainer>
  )
}