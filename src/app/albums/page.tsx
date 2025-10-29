'use client'

import { Layout } from '../../components/common/Layout'
import { AuthWrapper } from '../../components/auth/AuthWrapper'
import { SavedAlbums } from '../../components/album/SavedAlbums'

import { PageErrorBoundary } from '../../components/ui/ErrorBoundary'

export default function AlbumsPage() {
  return (
    <PageErrorBoundary>
      <AuthWrapper>
        <Layout>
          <SavedAlbums />
        </Layout>
      </AuthWrapper>
    </PageErrorBoundary>
  )
}