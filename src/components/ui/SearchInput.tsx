'use client'

import styled, { css } from 'styled-components'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { animationMixins, prefersReducedMotion } from '../../utils/animations'
import { LoadingSpinner } from './LoadingSpinner'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  loading?: boolean
  disabled?: boolean
}

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: ${({ theme }) => theme.layout.searchInputHeight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  transition: border-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              box-shadow ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  will-change: border-color, box-shadow;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}80;
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: border-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut},
                box-shadow ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
    
    &:focus-within {
      transform: none;
    }
  }
`

const StyledInput = styled.input`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  outline: none;
  height: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`

const SearchButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut},
              box-shadow ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  min-width: 100px;
  height: 100%;
  will-change: transform, background-color;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(196, 255, 97, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
    transition: outline-offset ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  }

  ${({ disabled, theme }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      background-color: ${theme.colors.textMuted};
      
      &:hover {
        transform: none;
        box-shadow: none;
      }
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
    min-width: 80px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: background-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
    
    &:hover:not(:disabled) {
      transform: none;
      box-shadow: none;
    }
    
    &:active:not(:disabled) {
      transform: none;
    }
  }
`

const SpinnerWrapper = styled.div`
  margin-right: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
`

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search for artists...",
  loading = false,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !loading && !disabled && value.trim()) {
        onSubmit()
      }
    },
    [onSubmit, loading, disabled, value]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const handleSubmit = useCallback(() => {
    if (!loading && !disabled && value.trim()) {
      onSubmit()
    }
  }, [onSubmit, loading, disabled, value])

  return (
    <SearchContainer>
      <StyledInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
      />
      <SearchButton
        onClick={handleSubmit}
        disabled={disabled || loading || !value.trim()}
        type="button"
      >
        {loading && (
          <SpinnerWrapper>
            <LoadingSpinner size="sm" variant="white" />
          </SpinnerWrapper>
        )}
        Search
      </SearchButton>
    </SearchContainer>
  )
}