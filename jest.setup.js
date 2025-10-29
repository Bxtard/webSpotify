import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.location methods if needed in individual tests
// Individual tests can mock window.location as needed

// Mock environment variables
process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = 'test_client_id'
process.env.SPOTIFY_CLIENT_SECRET = 'test_client_secret'
process.env.NEXT_PUBLIC_REDIRECT_URI = 'http://localhost:3000/api/auth/callback'