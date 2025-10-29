'use client'

import styled, { css } from 'styled-components'
import React, { useState, useCallback } from 'react'

export interface InputProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  loading?: boolean
  error?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'search'
  fullWidth?: boolean
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`

const StyledInput = styled.input<{ hasError?: boolean; loading?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  transition: all 0.2s ease-in-out;
  outline: none;
  width: 100%;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 48px;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  ${({ hasError, theme }) =>
    hasError &&
    css`
      border-color: ${theme.colors.error};

      &:focus {
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 2px ${theme.colors.error}20;
      }
    `}

  ${({ loading }) =>
    loading &&
    css`
      padding-right: 40px;

      @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        padding-right: 48px;
      }
    `}
`

const LoadingSpinner = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.textMuted};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: translateY(-50%) rotate(0deg);
    }
    100% {
      transform: translateY(-50%) rotate(360deg);
    }
  }
`

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`

const SearchInput = styled(StyledInput)`
  padding-left: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-left: 48px;
  }
`

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  onSubmit,
  loading = false,
  error,
  disabled = false,
  type = 'text',
  fullWidth = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSubmit) {
        onSubmit()
      }
    },
    [onSubmit]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const InputComponent = type === 'search' ? SearchInput : StyledInput

  return (
    <InputContainer fullWidth={fullWidth}>
      <div style={{ position: 'relative' }}>
        {type === 'search' && (
          <SearchIcon>
            <svg viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </SearchIcon>
        )}
        <InputComponent
          type={type === 'search' ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          hasError={!!error}
          loading={loading}
          {...props}
        />
        {loading && <LoadingSpinner />}
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  )
}