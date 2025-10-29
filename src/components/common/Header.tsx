'use client'

import styled, { css } from 'styled-components'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { animationMixins, prefersReducedMotion } from '../../utils/animations'

export interface HeaderProps {
  currentPage?: 'search' | 'albums'
  onLogout: () => void
}

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  height: ${({ theme }) => theme.layout.headerHeight};
`

const HeaderContent = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 ${({ theme }) => theme.spacing['2xl']};
  }
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.brand.fontSize};
  font-weight: ${({ theme }) => theme.typography.brand.fontWeight};
  letter-spacing: ${({ theme }) => theme.typography.brand.letterSpacing};
  line-height: ${({ theme }) => theme.typography.brand.lineHeight};
  text-decoration: none;
  transition: color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  will-change: transform, color;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    transition: outline-offset ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  }

  /* Responsive font size adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.25rem; /* Slightly smaller on mobile */
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
    
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: none;
    }
  }
`

const Navigation = styled.nav`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: ${({ theme }) => theme.spacing['2xl']};
  }
`

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.nav.fontSize};
  font-weight: ${({ theme }) => theme.typography.nav.fontWeight};
  line-height: ${({ theme }) => theme.typography.nav.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.nav.letterSpacing};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  position: relative;
  white-space: nowrap;
  will-change: transform, background-color;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    transition: outline-offset ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.colors.primary};
      background-color: ${theme.colors.surface};

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background-color: ${theme.colors.primary};
        border-radius: 1px;
        transition: width ${theme.animation.duration.normal} ${theme.animation.easing.easeOut};
      }

      &:hover::after {
        width: 30px;
      }
    `}

  /* Responsive adjustments */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: 0.9rem;
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut},
                background-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
    
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: none;
    }
  }
`

const LogoutButton = styled.button`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.nav.fontSize};
  font-weight: ${({ theme }) => theme.typography.nav.fontWeight};
  line-height: ${({ theme }) => theme.typography.nav.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.nav.letterSpacing};
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut},
              transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  white-space: nowrap;
  will-change: transform, background-color;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    transition: outline-offset ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  }

  /* Responsive adjustments */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: 0.9rem;
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut},
                background-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
    
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: none;
    }
  }
`



const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.surface};
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.easeInOut};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 50;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    `}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  /* Enhanced mobile responsiveness */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`

const MobileNavLink = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    margin: 0 -${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.surface};
    margin: 0 -${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.colors.primary};
      font-weight: ${theme.typography.fontWeight.semibold};
      background-color: ${theme.colors.surface};
      margin: 0 -${theme.spacing.md};
      padding-left: ${theme.spacing.md};
      padding-right: ${theme.spacing.md};
    `}

  /* Enhanced touch targets for mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 52px;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`

const MobileLogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} 0;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-align: left;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    margin: 0 -${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.surface};
    margin: 0 -${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Enhanced touch targets for mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 52px;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    onLogout()
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) => pathname === path

  // Close mobile menu on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo href="/">
          SPOTIFY APP
        </Logo>

        <Navigation>
          <NavLink href="/search" $isActive={isActive('/search')}>
            Buscar
          </NavLink>
          <NavLink href="/albums" $isActive={isActive('/albums')}>
            Mis álbumes
          </NavLink>
          <LogoutButton onClick={onLogout}>
            Cerrar sesión
          </LogoutButton>
        </Navigation>

        <MobileMenuButton onClick={toggleMobileMenu}>
          <svg viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </MobileMenuButton>
      </HeaderContent>

      <MobileMenu $isOpen={mobileMenuOpen}>
        <MobileNavLink 
          href="/search" 
          $isActive={isActive('/search')}
          onClick={handleMobileMenuClose}
        >
          Buscar
        </MobileNavLink>
        <MobileNavLink 
          href="/albums" 
          $isActive={isActive('/albums')}
          onClick={handleMobileMenuClose}
        >
          Mis álbumes
        </MobileNavLink>
        <MobileLogoutButton onClick={handleLogout}>
          Cerrar sesión
        </MobileLogoutButton>
      </MobileMenu>
    </HeaderContainer>
  )
}