'use client'

import styled, { css } from 'styled-components'
import React, { useMemo, useState, useEffect } from 'react'
import { animationMixins, prefersReducedMotion } from '../../utils/animations'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
  disabled?: boolean
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.xxs};
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }
`

const PageButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isActive'].includes(prop),
})<{ isActive?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.layout.paginationButtonSize};
  height: ${({ theme }) => theme.layout.paginationButtonSize};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut},
              box-shadow ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  min-width: ${({ theme }) => theme.layout.paginationButtonSize};
  will-change: transform, background-color;
  
  /* Default inactive state */
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  /* Active state */
  ${({ isActive, theme }) =>
    isActive &&
    css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.background};
      font-weight: ${theme.typography.fontWeight.semibold};
      box-shadow: 0 4px 12px rgba(196, 255, 97, 0.3);
      transform: scale(1.05);
    `}
  
  /* Hover state for inactive buttons */
  ${({ isActive, disabled, theme }) =>
    !isActive && !disabled &&
    css`
      &:hover {
        background-color: ${theme.colors.surfaceHover};
        color: ${theme.colors.textPrimary};
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    `}

  &:active:not(:disabled) {
    transform: scale(0.95);
    transition-duration: ${({ theme }) => theme.animation.duration.fast};
  }
  
  /* Disabled state */
  ${({ disabled, theme }) =>
    disabled &&
    css`
      opacity: 0.4;
      cursor: not-allowed;
      background-color: ${theme.colors.surface};
      color: ${theme.colors.textMuted};
      
      &:hover {
        transform: none;
        background-color: ${theme.colors.surface};
        color: ${theme.colors.textMuted};
        box-shadow: none;
      }
    `}

  /* Focus state for accessibility */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    transition: outline-offset ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  }

  /* Touch-friendly sizing on mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 44px;
    height: 44px;
    min-width: 44px;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: background-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut},
                color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
    
    ${({ isActive }) =>
      isActive &&
      css`
        transform: none;
        box-shadow: none;
      `}
    
    ${({ isActive, disabled }) =>
      !isActive && !disabled &&
      css`
        &:hover {
          transform: none;
          box-shadow: none;
        }
      `}
    
    &:active:not(:disabled) {
      transform: none;
    }
  }
`

const NavigationButton = styled(PageButton).withConfig({
  shouldForwardProp: (prop) => !['direction'].includes(prop),
})<{ direction: 'prev' | 'next' }>`
  width: auto;
  min-width: ${({ theme }) => theme.layout.paginationButtonSize};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.xs};
    min-width: 44px;
  }
`

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.layout.paginationButtonSize};
  height: ${({ theme }) => theme.layout.paginationButtonSize};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 44px;
    height: 44px;
  }
`

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 7,
  disabled = false,
}) => {
  // Track window width for responsive behavior
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Responsive max visible pages - fewer on mobile
  const responsiveMaxVisible = useMemo(() => {
    return windowWidth < 640 ? 5 : maxVisiblePages
  }, [windowWidth, maxVisiblePages])

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const maxVisible = responsiveMaxVisible
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = []
    const halfVisible = Math.floor(maxVisible / 2)

    // Always show first page
    pages.push(1)

    if (currentPage <= halfVisible + 1) {
      // Show pages from start
      for (let i = 2; i <= Math.min(maxVisible - 1, totalPages - 1); i++) {
        pages.push(i)
      }
      if (totalPages > maxVisible - 1) {
        pages.push('ellipsis')
      }
    } else if (currentPage >= totalPages - halfVisible) {
      // Show pages from end
      if (totalPages > maxVisible - 1) {
        pages.push('ellipsis')
      }
      for (let i = Math.max(2, totalPages - maxVisible + 2); i <= totalPages - 1; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current
      pages.push('ellipsis')
      for (let i = currentPage - halfVisible + 1; i <= currentPage + halfVisible - 1; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }, [currentPage, totalPages, responsiveMaxVisible])

  const handlePageChange = (page: number) => {
    if (disabled || page === currentPage || page < 1 || page > totalPages) {
      return
    }
    onPageChange(page)
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null
  }

  return (
    <PaginationContainer>
      {/* Previous button */}
      <NavigationButton
        direction="prev"
        onClick={handlePrevious}
        disabled={disabled || currentPage === 1}
        aria-label="Previous page"
      >
        ←
      </NavigationButton>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
        }

        return (
          <PageButton
            key={page}
            isActive={page === currentPage}
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </PageButton>
        )
      })}

      {/* Next button */}
      <NavigationButton
        direction="next"
        onClick={handleNext}
        disabled={disabled || currentPage === totalPages}
        aria-label="Next page"
      >
        →
      </NavigationButton>
    </PaginationContainer>
  )
}