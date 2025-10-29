'use client'

import styled, { keyframes } from 'styled-components'
import React from 'react'
import { prefersReducedMotion } from '../../utils/animations'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white'
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

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const SpinnerContainer = styled.div<{
  size: 'sm' | 'md' | 'lg' | 'xl'
  variant: 'primary' | 'secondary' | 'white'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return 'width: 16px; height: 16px;'
      case 'md':
        return 'width: 24px; height: 24px;'
      case 'lg':
        return 'width: 32px; height: 32px;'
      case 'xl':
        return 'width: 48px; height: 48px;'
      default:
        return 'width: 24px; height: 24px;'
    }
  }}
`

const Spinner = styled.div<{
  size: 'sm' | 'md' | 'lg' | 'xl'
  variant: 'primary' | 'secondary' | 'white'
}>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          border-top-color: ${theme.colors.primary};
          border-right-color: ${theme.colors.primary}40;
        `
      case 'secondary':
        return `
          border-top-color: ${theme.colors.textSecondary};
          border-right-color: ${theme.colors.textSecondary}40;
        `
      case 'white':
        return `
          border-top-color: ${theme.colors.textPrimary};
          border-right-color: ${theme.colors.textPrimary}40;
        `
      default:
        return `
          border-top-color: ${theme.colors.primary};
          border-right-color: ${theme.colors.primary}40;
        `
    }
  }}
  
  animation: ${spin} 1s linear infinite;
  
  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    animation: ${pulse} 2s ease-in-out infinite;
    border-radius: 2px;
    
    ${({ variant, theme }) => {
      switch (variant) {
        case 'primary':
          return `background-color: ${theme.colors.primary};`
        case 'secondary':
          return `background-color: ${theme.colors.textSecondary};`
        case 'white':
          return `background-color: ${theme.colors.textPrimary};`
        default:
          return `background-color: ${theme.colors.primary};`
      }
    }}
    
    border: none;
  }
`

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
}) => {
  return (
    <SpinnerContainer size={size} variant={variant} className={className}>
      <Spinner size={size} variant={variant} />
    </SpinnerContainer>
  )
}

// Convenience components for common use cases
export const SmallSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner size="sm" {...props} />
)

export const LargeSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner size="lg" {...props} />
)

export const PrimarySpinner: React.FC<Omit<LoadingSpinnerProps, 'variant'>> = (props) => (
  <LoadingSpinner variant="primary" {...props} />
)

export const WhiteSpinner: React.FC<Omit<LoadingSpinnerProps, 'variant'>> = (props) => (
  <LoadingSpinner variant="white" {...props} />
)