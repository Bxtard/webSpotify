import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state parameter' },
        { status: 400 }
      )
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing Spotify OAuth configuration')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    )

    return NextResponse.json(tokenResponse.data)
  } catch (error) {
    console.error('Token exchange error:', error)
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const errorData = error.response?.data
      
      console.error('Spotify API Error:', {
        status,
        data: errorData,
        headers: error.response?.headers
      })
      
      if (status === 400) {
        if (errorData?.error === 'invalid_grant') {
          return NextResponse.json(
            { error: 'Authorization code has expired or is invalid. Please try logging in again.' },
            { status: 400 }
          )
        } else if (errorData?.error === 'invalid_client') {
          return NextResponse.json(
            { error: 'Invalid client credentials. Please contact support.' },
            { status: 400 }
          )
        }
      }
    }
    
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}