'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`

// Styled components
const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 400px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    left: ${({ theme }) => theme.spacing.md};
    max-width: none;
  }
`

const ToastItem = styled.div<{
  type: Toast['type']
  isExiting?: boolean
}>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${({ isExiting }) => (isExiting ? slideOut : slideIn)} 0.3s ease-in-out;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;

  ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return `border-left: 4px solid ${theme.colors.success};`
      case 'error':
        return `border-left: 4px solid ${theme.colors.error};`
      case 'warning':
        return `border-left: 4px solid #FFA726;`
      case 'info':
        return `border-left: 4px solid ${theme.colors.primary};`
      default:
        return ''
    }
  }}
`

const ToastIcon = styled.div<{ type: Toast['type'] }>`
  font-size: 20px;
  line-height: 1;
  margin-top: 2px;

  ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return `color: ${theme.colors.success};`
      case 'error':
        return `color: ${theme.colors.error};`
      case 'warning':
        return `color: #FFA726;`
      case 'info':
        return `color: ${theme.colors.primary};`
      default:
        return `color: ${theme.colors.textSecondary};`
    }
  }}
`

const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`

const ToastTitle = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`

const ToastMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const ToastActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const ToastAction = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.primary}dd;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  line-height: 1;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

const getToastIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    default:
      return 'ℹ'
  }
}

interface ToastItemComponentProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItemComponent: React.FC<ToastItemComponentProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false)

  const handleRemove = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => onRemove(toast.id), 300)
  }, [toast.id, onRemove])

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(handleRemove, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, handleRemove])

  return (
    <ToastItem type={toast.type} isExiting={isExiting}>
      <ToastIcon type={toast.type}>
        {getToastIcon(toast.type)}
      </ToastIcon>
      <ToastContent>
        <ToastTitle>{toast.title}</ToastTitle>
        {toast.message && <ToastMessage>{toast.message}</ToastMessage>}
        {toast.action && (
          <ToastActions>
            <ToastAction onClick={toast.action.onClick}>
              {toast.action.label}
            </ToastAction>
          </ToastActions>
        )}
      </ToastContent>
      <CloseButton onClick={handleRemove}>
        ×
      </CloseButton>
    </ToastItem>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItemComponent
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

// Convenience hooks for different toast types
export const useSuccessToast = () => {
  const { addToast } = useToast()
  return useCallback((title: string, message?: string) => {
    return addToast({ type: 'success', title, message })
  }, [addToast])
}

export const useErrorToast = () => {
  const { addToast } = useToast()
  return useCallback((title: string, message?: string) => {
    return addToast({ type: 'error', title, message, duration: 7000 })
  }, [addToast])
}

export const useWarningToast = () => {
  const { addToast } = useToast()
  return useCallback((title: string, message?: string) => {
    return addToast({ type: 'warning', title, message })
  }, [addToast])
}

export const useInfoToast = () => {
  const { addToast } = useToast()
  return useCallback((title: string, message?: string) => {
    return addToast({ type: 'info', title, message })
  }, [addToast])
}