import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated) {
    return NextResponse.json({ message: 'User not found' })
  }
  // Get the OAuth access token for the user
  const provider = 'spotify'
  const client = await clerkClient()
  return await client.users.getUserOauthAccessToken(userId, provider).then((res) =>{ 
    console.log(res) 

  const accessToken = res.data[0].token || ''
  console.log(accessToken)
  if (!accessToken) {
    return NextResponse.json({ message: 'Access token not found' }, { status: 401 })
  }
  // Use the access token as needed
  return NextResponse.json({ spotifyAccessToken: accessToken })})
}
