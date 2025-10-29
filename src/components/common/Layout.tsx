'use client'

import styled from 'styled-components'
import React from 'react'
import { Header } from './Header'

export interface LayoutProps {
  children: React.ReactNode
  showSearch?: boolean
  onSearch?: (query: string) => void
  searchValue?: string
  searchLoading?: boolean
  className?: string
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

const ContentGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: 1fr;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.xl};
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(5, 1fr);
  }
`

const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  margin-top: auto;
`

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
`

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
`

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const Layout: React.FC<LayoutProps> = ({
  children,
  showSearch = false,
  onSearch,
  searchValue,
  searchLoading = false,
  className,
  ...props
}) => {
  return (
    <LayoutContainer className={className} {...props}>
      <Header
        showSearch={showSearch}
        onSearch={onSearch}
        searchValue={searchValue}
        searchLoading={searchLoading}
      />
      
      <MainContent>
        {children}
      </MainContent>

      <Footer>
        <FooterContent>
          <FooterText>
            © 2024 Spotify Web App. Powered by Spotify Web API.
          </FooterText>
          <FooterLinks>
            <FooterLink 
              href="https://developer.spotify.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Terms of Service
            </FooterLink>
            <FooterLink 
              href="https://www.spotify.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Privacy Policy
            </FooterLink>
          </FooterLinks>
        </FooterContent>
      </Footer>
    </LayoutContainer>
  )
}

// Utility component for responsive grids
export const ResponsiveGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return <ContentGrid className={className}>{children}</ContentGrid>
}