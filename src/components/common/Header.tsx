'use client'

import styled, { css } from 'styled-components'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface HeaderProps {
  showSearch?: boolean
  onSearch?: (query: string) => void
  searchValue?: string
  searchLoading?: boolean
}

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background-color: ${({ theme }) => theme.colors.background}95;
`

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 32px;
    height: 32px;
    fill: ${({ theme }) => theme.colors.primary};
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
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
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
      }
    `}
`

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 ${({ theme }) => theme.spacing.lg};
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 500px;
    margin: 0 ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: 600px;
    margin: 0 ${({ theme }) => theme.spacing['2xl']};
  }
`



const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease-in-out;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
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

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease-in-out;
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
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

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
`

const MobileNavLink = styled(Link)<{ $isActive?: boolean }>`
  display: block;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease-in-out;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: 48px;
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.surface};
    margin: 0 -${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.colors.primary};
      font-weight: ${theme.typography.fontWeight.semibold};
    `}
`

export const Header: React.FC<HeaderProps> = ({
  showSearch = false,
  onSearch,
  searchValue = '',
  searchLoading = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchValue)
  const pathname = usePathname()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const isActive = (path: string) => pathname === path

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo href="/">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Spotify App
        </Logo>

        {showSearch && (
          <SearchContainer>
            <form onSubmit={handleSearchSubmit}>
              <SearchIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Buscar artistas..."
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={searchLoading}
              />
            </form>
          </SearchContainer>
        )}

        <Navigation>
          <NavLink href="/search" $isActive={isActive('/search')}>
            Buscar
          </NavLink>
          <NavLink href="/albums" $isActive={isActive('/albums')}>
            Mis álbumes
          </NavLink>
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
          onClick={() => setMobileMenuOpen(false)}
        >
          Buscar
        </MobileNavLink>
        <MobileNavLink 
          href="/albums" 
          $isActive={isActive('/albums')}
          onClick={() => setMobileMenuOpen(false)}
        >
          Mis álbumes
        </MobileNavLink>
      </MobileMenu>
    </HeaderContainer>
  )
}