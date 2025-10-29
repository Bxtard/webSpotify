import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json()

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Missing refresh token' },
        { status: 400 }
      )
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('Missing Spotify OAuth configuration')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Refresh access token
    const tokenResponse = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
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
    console.error('Token refresh error:', error)
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const errorData = error.response?.data
      
      console.error('Spotify API Error:', {
        status,
        data: errorData
      })
      
      if (status === 400) {
        if (errorData?.error === 'invalid_grant') {
          return NextResponse.json(
            { error: 'Refresh token has expired. Please log in again.' },
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
      { error: 'Token refresh failed. Please log in again.' },
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