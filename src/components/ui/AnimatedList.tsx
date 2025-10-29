'use client'

import styled, { keyframes } from 'styled-components'
import React, { ReactNode, useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../utils/animations'

export interface AnimatedListProps {
  children: ReactNode[]
  staggerDelay?: number
  animationType?: 'fadeIn' | 'slideUp' | 'slideFromLeft' | 'scale'
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

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const ListContainer = styled.div`
  display: contents;
`

const AnimatedItem = styled.div<{
  delay: number
  animationType: 'fadeIn' | 'slideUp' | 'slideFromLeft' | 'scale'
}>`
  animation-delay: ${({ delay }) => delay}ms;
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-fill-mode: both;
  
  ${({ animationType }) => {
    switch (animationType) {
      case 'fadeIn':
        return `animation-name: ${fadeIn};`
      case 'slideUp':
        return `animation-name: ${slideUp};`
      case 'slideFromLeft':
        return `animation-name: ${slideFromLeft};`
      case 'scale':
        return `animation-name: ${scaleIn};`
      default:
        return `animation-name: ${slideUp};`
    }
  }}

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeIn} 0.2s ease-out;
    animation-delay: 0ms;
  }
`

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  staggerDelay = 100,
  animationType = 'slideUp',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return (
      <ListContainer className={className}>
        {children.map((child, index) => (
          <div key={index} style={{ opacity: 0 }}>
            {child}
          </div>
        ))}
      </ListContainer>
    )
  }

  return (
    <ListContainer className={className}>
      {children.map((child, index) => (
        <AnimatedItem
          key={index}
          delay={index * staggerDelay}
          animationType={animationType}
        >
          {child}
        </AnimatedItem>
      ))}
    </ListContainer>
  )
}

// Convenience components for common animation types
export const FadeInList: React.FC<Omit<AnimatedListProps, 'animationType'>> = (props) => (
  <AnimatedList animationType="fadeIn" {...props} />
)

export const SlideUpList: React.FC<Omit<AnimatedListProps, 'animationType'>> = (props) => (
  <AnimatedList animationType="slideUp" {...props} />
)

export const ScaleInList: React.FC<Omit<AnimatedListProps, 'animationType'>> = (props) => (
  <AnimatedList animationType="scale" {...props} />
)