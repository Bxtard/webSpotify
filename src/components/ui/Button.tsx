'use client'

import styled, { css } from 'styled-components'
import React from 'react'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth', 'loading'].includes(prop),
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: 44px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 48px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.sm};
          height: 36px;

          @media (max-width: ${theme.breakpoints.sm}) {
            height: 44px;
            padding: ${theme.spacing.sm} ${theme.spacing.md};
          }
        `
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          height: 52px;

          @media (max-width: ${theme.breakpoints.sm}) {
            height: 56px;
            padding: ${theme.spacing.lg} ${theme.spacing.xl};
          }
        `
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          height: 44px;

          @media (max-width: ${theme.breakpoints.sm}) {
            height: 48px;
            padding: ${theme.spacing.md} ${theme.spacing.lg};
          }
        `
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.background};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            opacity: 0.9;
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.textPrimary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary};
            opacity: 0.9;
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.textPrimary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.error};
            opacity: 0.9;
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.surfaceHover};
            color: ${theme.colors.textPrimary};
            border-color: ${theme.colors.textMuted};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.surface};
          }
        `
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.background};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            opacity: 0.9;
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
    }
  }}
`

const LoadingSpinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.xs};

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          width: 14px;
          height: 14px;
          border-width: 1.5px;
        `
      case 'lg':
        return `
          width: 20px;
          height: 20px;
          border-width: 2.5px;
        `
      default:
        return `
          width: 16px;
          height: 16px;
          border-width: 2px;
        `
    }
  }}

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && <LoadingSpinner size={size} />}
      {children}
    </StyledButton>
  )
}