import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
async function getUserProfile(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }
  
  return response.json();
}

async function createPlaylist(accessToken, userId, name, description) {
  const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      public: false,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create playlist');
  }
  
  return response.json();
}

async function addTracksToPlaylist(accessToken, playlistId, trackUris) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: trackUris,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add tracks to playlist');
  }
  
  return response.json();
}

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('spotify_access_token');

    if (!accessToken) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, description, tracks } = await request.json();

    if (!name || !tracks || tracks.length === 0) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user profile
    const user = await getUserProfile(accessToken.value);

    // Create playlist
    const playlist = await createPlaylist(accessToken.value, user.id, name, description);

    // Add tracks to playlist
    const trackUris = tracks.map(track => `spotify:track:${track.id}`);
    await addTracksToPlaylist(accessToken.value, playlist.id, trackUris);

    return Response.json({
      playlist: {
        id: playlist.id,
        name: playlist.name,
        url: playlist.external_urls.spotify,
      },
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}