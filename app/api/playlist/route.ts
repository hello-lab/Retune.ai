const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
import { createClient } from "@/lib/supabase/client";
import { auth } from '@clerk/nextjs/server'

const supabase = createClient();
// Get Spotify access token

async function getToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

// Search Spotify tracks based on moods/singers
async function searchTracks(query, token, limit = 50, offset = 0) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&offset=${offset}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  return data.tracks.items.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    url: track.external_urls.spotify,
    preview_url: track.preview_url,
    duration_ms: track.duration_ms,
    image: track.album.images[0]?.url,
    uri: track.uri,
  }));
}

export async function POST(request) {
  const { userId } = await auth();
  try {
    const { query, offset = 0, limit = 50 } = await request.json();
    
    if (!query) {
      return Response.json({ error: "Missing query" }, { status: 400 });
    }

    const token = await getToken();
    const tracks = await searchTracks(query, token, limit, offset);
    const { error } = await supabase.from("playlists").insert({ json: tracks, userid: userId ?? "no-user", name: query }).select();
  console.log(error);
    return Response.json({ tracks });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}