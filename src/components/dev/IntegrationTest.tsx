'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { UserFlowTester, NavigationTester, APIIntegrationTester, UserFlowTestResult } from '../../utils/userFlowTest'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'

const TestContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const TestHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`

const TestTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

const TestDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const TestSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`

const TestControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`

const TestResults = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const TestResult = styled.div<{ success: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

const TestStep = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  flex: 1;
`

const TestStatus = styled.span<{ success: boolean }>`
  color: ${({ success, theme }) => success ? theme.colors.success : theme.colors.error};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-right: ${({ theme }) => theme.spacing.md};
`

const TestError = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 2px solid ${({ theme }) => theme.colors.error};
`

const TestData = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
`

const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`

const SummaryItem = styled.div`
  text-align: center;
`

const SummaryValue = styled.div<{ color?: 'success' | 'error' | 'primary' }>`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ color, theme }) => {
    switch (color) {
      case 'success': return theme.colors.success
      case 'error': return theme.colors.error
      case 'primary': return theme.colors.primary
      default: return theme.colors.textPrimary
    }
  }};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const SummaryLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
`

const LoadingText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`

const NavigationList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`

const NavigationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const RouteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const RoutePath = styled.code`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xs};
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`

const AuthBadge = styled.span<{ required: boolean }>`
  background-color: ${({ required, theme }) => required ? theme.colors.error : theme.colors.success};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xs};
  border-radius: 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

export const IntegrationTest: React.FC = () => {
  const [userFlowResults, setUserFlowResults] = useState<UserFlowTestResult[]>([])
  const [apiResults, setApiResults] = useState<UserFlowTestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [testType, setTestType] = useState<'user-flow' | 'api' | null>(null)

  const runUserFlowTest = async () => {
    setLoading(true)
    setTestType('user-flow')
    
    try {
      const tester = new UserFlowTester()
      const results = await tester.testCompleteUserFlow()
      setUserFlowResults(results)
    } catch (error) {
      console.error('User flow test error:', error)
      setUserFlowResults([{
        step: 'Test Execution',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }])
    } finally {
      setLoading(false)
      setTestType(null)
    }
  }

  const runAPITest = async () => {
    setLoading(true)
    setTestType('api')
    
    try {
      const results = await APIIntegrationTester.testAPIEndpoints()
      setApiResults(results)
    } catch (error) {
      console.error('API test error:', error)
      setApiResults([{
        step: 'API Test Execution',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }])
    } finally {
      setLoading(false)
      setTestType(null)
    }
  }

  const clearResults = () => {
    setUserFlowResults([])
    setApiResults([])
  }

  const getUserFlowSummary = () => {
    const total = userFlowResults.length
    const passed = userFlowResults.filter(r => r.success).length
    const failed = total - passed
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0
    return { total, passed, failed, passRate }
  }

  const getApiSummary = () => {
    const total = apiResults.length
    const passed = apiResults.filter(r => r.success).length
    const failed = total - passed
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0
    return { total, passed, failed, passRate }
  }

  const navigationRoutes = NavigationTester.testNavigationFlow()

  return (
    <TestContainer>
      <TestHeader>
        <TestTitle>Integration Test Suite</TestTitle>
        <TestDescription>
          Test the complete user journey and API integrations to ensure all components work together correctly.
        </TestDescription>
      </TestHeader>

      <TestSection>
        <SectionTitle>Test Controls</SectionTitle>
        <TestControls>
          <Button 
            variant="primary" 
            onClick={runUserFlowTest}
            disabled={loading}
          >
            Run User Flow Test
          </Button>
          <Button 
            variant="secondary" 
            onClick={runAPITest}
            disabled={loading}
          >
            Run API Integration Test
          </Button>
          <Button 
            variant="ghost" 
            onClick={clearResults}
            disabled={loading}
          >
            Clear Results
          </Button>
        </TestControls>

        {loading && (
          <LoadingContainer>
            <LoadingSpinner size="sm" />
            <LoadingText>
              Running {testType === 'user-flow' ? 'user flow' : 'API integration'} tests...
            </LoadingText>
          </LoadingContainer>
        )}
      </TestSection>

      {userFlowResults.length > 0 && (
        <TestSection>
          <SectionTitle>User Flow Test Results</SectionTitle>
          <SummaryCard>
            <SummaryGrid>
              <SummaryItem>
                <SummaryValue>{getUserFlowSummary().total}</SummaryValue>
                <SummaryLabel>Total Tests</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue color="success">{getUserFlowSummary().passed}</SummaryValue>
                <SummaryLabel>Passed</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue color="error">{getUserFlowSummary().failed}</SummaryValue>
                <SummaryLabel>Failed</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue color="primary">{getUserFlowSummary().passRate}%</SummaryValue>
                <SummaryLabel>Pass Rate</SummaryLabel>
              </SummaryItem>
            </SummaryGrid>
          </SummaryCard>
          
          <TestResults>
            {userFlowResults.map((result, index) => (
              <div key={index}>
                <TestResult success={result.success}>
                  <TestStep>{result.step}</TestStep>
                  <TestStatus success={result.success}>
                    {result.success ? '✓ PASS' : '✗ FAIL'}
                  </TestStatus>
                </TestResult>
                {result.error && (
                  <TestError>{result.error}</TestError>
                )}
                {result.data && (
                  <TestData>
                    {JSON.stringify(result.data, null, 2)}
                  </TestData>
                )}
              </div>
            ))}
          </TestResults>
        </TestSection>
      )}

      {apiResults.length > 0 && (
        <TestSection>
          <SectionTitle>API Integration Test Results</SectionTitle>
          <SummaryCard>
            <SummaryGrid>
              <SummaryItem>
                <SummaryValue>{getApiSummary().total}</SummaryValue>
                <SummaryLabel>Total Tests</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue color="success">{getApiSummary().passed}</SummaryValue>
                <SummaryLabel>Passed</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue color="error">{getApiSummary().failed}</SummaryValue>
                <SummaryLabel>Failed</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue color="primary">{getApiSummary().passRate}%</SummaryValue>
                <SummaryLabel>Pass Rate</SummaryLabel>
              </SummaryItem>
            </SummaryGrid>
          </SummaryCard>
          
          <TestResults>
            {apiResults.map((result, index) => (
              <div key={index}>
                <TestResult success={result.success}>
                  <TestStep>{result.step}</TestStep>
                  <TestStatus success={result.success}>
                    {result.success ? '✓ PASS' : '✗ FAIL'}
                  </TestStatus>
                </TestResult>
                {result.error && (
                  <TestError>{result.error}</TestError>
                )}
                {result.data && (
                  <TestData>
                    {JSON.stringify(result.data, null, 2)}
                  </TestData>
                )}
              </div>
            ))}
          </TestResults>
        </TestSection>
      )}

      <TestSection>
        <SectionTitle>Navigation Routes</SectionTitle>
        <NavigationList>
          {navigationRoutes.map((route, index) => (
            <NavigationItem key={index}>
              <RouteInfo>
                <RoutePath>{route.route}</RoutePath>
                <AuthBadge required={route.requiresAuth}>
                  {route.requiresAuth ? 'Auth Required' : 'Public'}
                </AuthBadge>
              </RouteInfo>
              <TestStatus success={route.accessible}>
                {route.accessible ? '✓' : '✗'}
              </TestStatus>
            </NavigationItem>
          ))}
        </NavigationList>
      </TestSection>
    </TestContainer>
  )
}