import { useState, useEffect, useCallback } from 'react'

export interface NetworkStatus {
  isOnline: boolean
  isSlowConnection: boolean
  connectionType: string | null
  effectiveType: string | null
}

export interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
    connectionType: null,
    effectiveType: null,
  })

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      setNetworkStatus({
        isOnline: navigator.onLine,
        isSlowConnection: connection ? 
          ['slow-2g', '2g'].includes(connection.effectiveType) : false,
        connectionType: connection?.type || null,
        effectiveType: connection?.effectiveType || null,
      })
    }

    const handleOnline = () => updateNetworkStatus()
    const handleOffline = () => updateNetworkStatus()
    const handleConnectionChange = () => updateNetworkStatus()

    // Initial status
    updateNetworkStatus()

    // Event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Connection API listeners (if supported)
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  return networkStatus
}

export function useRetry(config: Partial<RetryConfig> = {}) {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  
  const finalConfig = { ...defaultRetryConfig, ...config }

  const calculateDelay = useCallback((attempt: number) => {
    const delay = finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt)
    return Math.min(delay, finalConfig.maxDelay)
  }, [finalConfig])

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    onRetry?: (attempt: number, error: Error) => void
  ): Promise<T> => {
    let lastError: Error

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          setIsRetrying(true)
          setRetryCount(attempt)
          
          const delay = calculateDelay(attempt - 1)
          await new Promise(resolve => setTimeout(resolve, delay))
          
          if (onRetry) {
            onRetry(attempt, lastError!)
          }
        }

        const result = await operation()
        
        // Success - reset retry state
        setRetryCount(0)
        setIsRetrying(false)
        
        return result
      } catch (error) {
        lastError = error as Error
        
        // If this was the last attempt, throw the error
        if (attempt === finalConfig.maxRetries) {
          setIsRetrying(false)
          throw error
        }
      }
    }

    // This should never be reached, but TypeScript requires it
    throw lastError!
  }, [finalConfig, calculateDelay])

  const reset = useCallback(() => {
    setRetryCount(0)
    setIsRetrying(false)
  }, [])

  return {
    retry,
    retryCount,
    isRetrying,
    reset,
    canRetry: retryCount < finalConfig.maxRetries,
  }
}

export function useNetworkErrorHandler() {
  const networkStatus = useNetworkStatus()
  const { retry, retryCount, isRetrying, reset, canRetry } = useRetry()

  const handleNetworkError = useCallback((error: Error) => {
    // Check if it's a network-related error
    const isNetworkError = 
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.name === 'NetworkError' ||
      error.name === 'TypeError'

    return {
      isNetworkError,
      shouldRetry: isNetworkError && networkStatus.isOnline && canRetry,
      isOffline: !networkStatus.isOnline,
      isSlowConnection: networkStatus.isSlowConnection,
    }
  }, [networkStatus, canRetry])

  return {
    networkStatus,
    retry,
    retryCount,
    isRetrying,
    reset,
    canRetry,
    handleNetworkError,
  }
}