'use client'

import React from 'react'
import styled from 'styled-components'
import { Button } from './Button'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  min-height: 200px;
`

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.8;
`

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  max-width: 400px;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const ErrorDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 500px;
  width: 100%;
`

const ErrorCode = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const ErrorDescription = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`

const NetworkStatus = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

export interface NetworkErrorProps {
  error?: Error | string
  onRetry?: () => void
  onGoBack?: () => void
  showNetworkStatus?: boolean
  retryCount?: number
  isRetrying?: boolean
  canRetry?: boolean
  className?: string
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  error,
  onRetry,
  onGoBack,
  showNetworkStatus = true,
  retryCount = 0,
  isRetrying = false,
  canRetry = true,
  className,
}) => {
  const { isOnline, isSlowConnection, connectionType, effectiveType } = useNetworkStatus()

  const getErrorInfo = () => {
    if (!isOnline) {
      return {
        icon: '📡',
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
        code: 'OFFLINE',
        description: 'Your device is not connected to the internet.',
      }
    }

    if (isSlowConnection) {
      return {
        icon: '🐌',
        title: 'Slow Connection',
        message: 'Your connection is slow. This may cause timeouts or failed requests.',
        code: 'SLOW_CONNECTION',
        description: 'Consider switching to a faster network if possible.',
      }
    }

    const errorMessage = typeof error === 'string' ? error : error?.message || 'Unknown error'
    
    if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
      return {
        icon: '⏱️',
        title: 'Request Timeout',
        message: 'The request took too long to complete. This might be due to a slow connection or server issues.',
        code: 'TIMEOUT',
        description: errorMessage,
      }
    }

    if (errorMessage.includes('fetch') || errorMessage.includes('NetworkError')) {
      return {
        icon: '🌐',
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
        description: errorMessage,
      }
    }

    if (errorMessage.includes('500')) {
      return {
        icon: '🔧',
        title: 'Server Error',
        message: 'The server encountered an error. Please try again later.',
        code: 'SERVER_ERROR',
        description: errorMessage,
      }
    }

    if (errorMessage.includes('401') || errorMessage.includes('403')) {
      return {
        icon: '🔒',
        title: 'Authentication Error',
        message: 'Your session may have expired. Please log in again.',
        code: 'AUTH_ERROR',
        description: errorMessage,
      }
    }

    return {
      icon: '❌',
      title: 'Request Failed',
      message: 'Something went wrong with your request. Please try again.',
      code: 'REQUEST_ERROR',
      description: errorMessage,
    }
  }

  const errorInfo = getErrorInfo()

  return (
    <ErrorContainer className={className}>
      <ErrorIcon>{errorInfo.icon}</ErrorIcon>
      <ErrorTitle>{errorInfo.title}</ErrorTitle>
      <ErrorMessage>{errorInfo.message}</ErrorMessage>
      
      <ErrorDetails>
        <ErrorCode>{errorInfo.code}</ErrorCode>
        <ErrorDescription>{errorInfo.description}</ErrorDescription>
        {retryCount > 0 && (
          <ErrorDescription style={{ marginTop: '8px' }}>
            Retry attempts: {retryCount}
          </ErrorDescription>
        )}
      </ErrorDetails>

      <ButtonGroup>
        {onRetry && canRetry && (
          <Button 
            variant="primary" 
            onClick={onRetry}
            loading={isRetrying}
            disabled={!isOnline}
          >
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        )}
        {onGoBack && (
          <Button variant="ghost" onClick={onGoBack}>
            Go Back
          </Button>
        )}
      </ButtonGroup>

      {showNetworkStatus && (
        <NetworkStatus>
          Status: {isOnline ? 'Online' : 'Offline'}
          {connectionType && ` • Connection: ${connectionType}`}
          {effectiveType && ` • Speed: ${effectiveType}`}
          {isSlowConnection && ' • Slow connection detected'}
        </NetworkStatus>
      )}
    </ErrorContainer>
  )
}

// Convenience component for API errors
export interface ApiErrorProps extends Omit<NetworkErrorProps, 'error'> {
  status?: number
  statusText?: string
  message?: string
}

export const ApiError: React.FC<ApiErrorProps> = ({
  status,
  statusText,
  message,
  ...props
}) => {
  const errorMessage = message || `${status} ${statusText}` || 'API request failed'
  
  return <NetworkError error={errorMessage} {...props} />
}