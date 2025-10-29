'use client'

import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`

const OfflineBar = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: ${({ isVisible }) => (isVisible ? slideDown : slideUp)} 0.3s ease-in-out;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`

const OfflineContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 1200px;
  margin: 0 auto;
`

const OfflineIcon = styled.span`
  font-size: 16px;
`

const OfflineText = styled.span`
  flex: 1;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`

const RetryButton = styled.button`
  background: none;
  border: 1px solid currentColor;
  color: inherit;
  padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xxs};
    font-size: 10px;
  }
`

interface OfflineIndicatorProps {
  onRetry?: () => void
  className?: string
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  onRetry,
  className,
}) => {
  const { isOnline, isSlowConnection } = useNetworkStatus()

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  if (isOnline && !isSlowConnection) {
    return null
  }

  return (
    <OfflineBar isVisible={!isOnline || isSlowConnection} className={className}>
      <OfflineContent>
        <OfflineIcon>
          {!isOnline ? '📡' : '🐌'}
        </OfflineIcon>
        <OfflineText>
          {!isOnline 
            ? 'You are currently offline. Some features may not work properly.'
            : 'Slow connection detected. Loading may take longer than usual.'
          }
        </OfflineText>
        {onRetry && (
          <RetryButton onClick={handleRetry}>
            Retry
          </RetryButton>
        )}
      </OfflineContent>
    </OfflineBar>
  )
}

// Hook to get offline indicator props
export const useOfflineIndicator = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus()
  
  return {
    isOffline: !isOnline,
    isSlowConnection,
    shouldShow: !isOnline || isSlowConnection,
  }
}