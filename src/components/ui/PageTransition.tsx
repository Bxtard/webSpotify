'use client'

import styled, { keyframes } from 'styled-components'
import React, { ReactNode, useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../utils/animations'

export interface PageTransitionProps {
  children: ReactNode
  type?: 'fade' | 'slideFromRight' | 'slideFromLeft' | 'slideUp'
  duration?: number
  className?: string
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const slideFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const TransitionContainer = styled.div<{
  type: 'fade' | 'slideFromRight' | 'slideFromLeft' | 'slideUp'
  duration: number
}>`
  animation-duration: ${({ duration }) => duration}ms;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-fill-mode: both;
  
  ${({ type }) => {
    switch (type) {
      case 'fade':
        return `animation-name: ${fadeIn};`
      case 'slideFromRight':
        return `animation-name: ${slideFromRight};`
      case 'slideFromLeft':
        return `animation-name: ${slideFromLeft};`
      case 'slideUp':
        return `animation-name: ${slideUp};`
      default:
        return `animation-name: ${fadeIn};`
    }
  }}

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeIn} 200ms ease-out;
  }
`

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return <div style={{ opacity: 0 }}>{children}</div>
  }

  return (
    <TransitionContainer type={type} duration={duration} className={className}>
      {children}
    </TransitionContainer>
  )
}

// Convenience components for common transition types
export const FadeTransition: React.FC<Omit<PageTransitionProps, 'type'>> = (props) => (
  <PageTransition type="fade" {...props} />
)

export const SlideTransition: React.FC<Omit<PageTransitionProps, 'type'>> = (props) => (
  <PageTransition type="slideFromRight" {...props} />
)

export const SlideUpTransition: React.FC<Omit<PageTransitionProps, 'type'>> = (props) => (
  <PageTransition type="slideUp" {...props} />
)