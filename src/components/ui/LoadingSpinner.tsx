'use client'

import styled, { keyframes } from 'styled-components'
import React from 'react'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const SpinnerContainer = styled.div<{
  size: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}>`
  display: inline-block;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          width: 16px;
          height: 16px;
        `
      case 'md':
        return `
          width: 24px;
          height: 24px;
        `
      case 'lg':
        return `
          width: 32px;
          height: 32px;
        `
      case 'xl':
        return `
          width: 48px;
          height: 48px;
        `
      default:
        return `
          width: 24px;
          height: 24px;
        `
    }
  }}
`

const Spinner = styled.div<{
  size: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}>`
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top: 2px solid ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `border-width: 1.5px;`
      case 'md':
        return `border-width: 2px;`
      case 'lg':
        return `border-width: 3px;`
      case 'xl':
        return `border-width: 4px;`
      default:
        return `border-width: 2px;`
    }
  }}
`

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color,
  className,
  ...props
}) => {
  return (
    <SpinnerContainer size={size} color={color} className={className} {...props}>
      <Spinner size={size} color={color} />
    </SpinnerContainer>
  )
}

// Centered loading spinner for full-page loading
const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  width: 100%;
`

export const CenteredLoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => (
  <CenteredContainer>
    <LoadingSpinner {...props} />
  </CenteredContainer>
)

// Loading spinner with text
const SpinnerWithTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 200px;
  width: 100%;
`

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
`

export interface LoadingSpinnerWithTextProps extends LoadingSpinnerProps {
  text?: string
}

export const LoadingSpinnerWithText: React.FC<LoadingSpinnerWithTextProps> = ({
  text = 'Loading...',
  ...props
}) => (
  <SpinnerWithTextContainer>
    <LoadingSpinner {...props} />
    <LoadingText>{text}</LoadingText>
  </SpinnerWithTextContainer>
)