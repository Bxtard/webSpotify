import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from '@/lib/registry'
import { GlobalErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ToastProvider } from '@/components/ui/Toast'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Web App',
  description: 'Discover and manage your favorite music with Spotify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ToastProvider>
            <GlobalErrorBoundary>
              <OfflineIndicator />
              {children}
            </GlobalErrorBoundary>
          </ToastProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}