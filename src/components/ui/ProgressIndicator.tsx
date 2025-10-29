'use client'

import styled, { keyframes } from 'styled-components'
import React from 'react'

export interface ProgressIndicatorProps {
  progress?: number // 0-100
  variant?: 'linear' | 'circular'
  size?: 'sm' | 'md' | 'lg'
  color?: string
  showPercentage?: boolean
  indeterminate?: boolean
  className?: string
}

// Linear Progress Bar
const LinearContainer = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
  overflow: hidden;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `height: 4px;`
      case 'md':
        return `height: 6px;`
      case 'lg':
        return `height: 8px;`
      default:
        return `height: 6px;`
    }
  }}
`

const indeterminateAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`

const LinearProgressBar = styled.div<{
  progress: number
  color?: string
  indeterminate: boolean
}>`
  height: 100%;
  background-color: ${({ color, theme }) => color || theme.colors.primary};
  border-radius: inherit;
  transition: width 0.3s ease-in-out;
  
  ${({ indeterminate, progress }) =>
    indeterminate
      ? `
        width: 50%;
        animation: ${indeterminateAnimation} 1.5s ease-in-out infinite;
      `
      : `
        width: ${progress}%;
      `}
`

// Circular Progress
const CircularContainer = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          width: 24px;
          height: 24px;
        `
      case 'md':
        return `
          width: 32px;
          height: 32px;
        `
      case 'lg':
        return `
          width: 48px;
          height: 48px;
        `
      default:
        return `
          width: 32px;
          height: 32px;
        `
    }
  }}
`

const CircularSvg = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`

const CircularTrack = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.surface};
  stroke-width: 2;
`

const circularIndeterminateAnimation = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -15;
  }
  100% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -125;
  }
`

const CircularProgressPath = styled.circle<{
  progress: number
  color?: string
  indeterminate: boolean
  circumference: number
}>`
  fill: none;
  stroke: ${({ color, theme }) => color || theme.colors.primary};
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease-in-out;
  
  ${({ indeterminate, progress, circumference }) =>
    indeterminate
      ? `
        animation: ${circularIndeterminateAnimation} 1.4s ease-in-out infinite;
      `
      : `
        stroke-dasharray: ${circumference};
        stroke-dashoffset: ${circumference - (progress / 100) * circumference};
      `}
`

const PercentageText = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  position: absolute;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `font-size: ${theme.typography.fontSize.xs};`
      case 'md':
        return `font-size: ${theme.typography.fontSize.sm};`
      case 'lg':
        return `font-size: ${theme.typography.fontSize.base};`
      default:
        return `font-size: ${theme.typography.fontSize.sm};`
    }
  }}
`

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress = 0,
  variant = 'linear',
  size = 'md',
  color,
  showPercentage = false,
  indeterminate = false,
  className,
  ...props
}) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100)
  
  if (variant === 'circular') {
    const radius = 14
    const circumference = 2 * Math.PI * radius
    
    return (
      <CircularContainer size={size} className={className} {...props}>
        <CircularSvg>
          <CircularTrack
            cx="50%"
            cy="50%"
            r={radius}
          />
          <CircularProgressPath
            cx="50%"
            cy="50%"
            r={radius}
            progress={normalizedProgress}
            color={color}
            indeterminate={indeterminate}
            circumference={circumference}
          />
        </CircularSvg>
        {showPercentage && !indeterminate && (
          <PercentageText size={size}>
            {Math.round(normalizedProgress)}%
          </PercentageText>
        )}
      </CircularContainer>
    )
  }

  return (
    <LinearContainer size={size} className={className} {...props}>
      <LinearProgressBar
        progress={normalizedProgress}
        color={color}
        indeterminate={indeterminate}
      />
    </LinearContainer>
  )
}

// Convenience components
export const LinearProgress: React.FC<Omit<ProgressIndicatorProps, 'variant'>> = (props) => (
  <ProgressIndicator variant="linear" {...props} />
)

export const CircularProgress: React.FC<Omit<ProgressIndicatorProps, 'variant'>> = (props) => (
  <ProgressIndicator variant="circular" {...props} />
)