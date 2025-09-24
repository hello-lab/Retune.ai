"use client";
import { useState, useEffect } from "react";

// Replace with your Spotify app credentials
const SPOTIFY_CLIENT_ID = "cdb4eda38a75415b987ccc1f26fea5af";
const SPOTIFY_CLIENT_SECRET = "42214960cde045af8052bd4aee5c0e5d";

// Get a public (app-only) Spotify token
async function getSpotifyToken() {
  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  const data = await res.json();
  return data.access_token;
}

// Search for tracks by mood/genre/singer
async function searchTracks(mood: string, token: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=track&limit=2`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  const data = await res.json();
  return data.tracks?.items ?? [];
}

export default function MoodPlaylist({ moods }: { moods: string[] }) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTracks() {
      setLoading(true);
      const token = await getSpotifyToken();
      let allTracks: any[] = [];
      for (const mood of moods) {
        const foundTracks = await searchTracks(mood, token);
        allTracks = [...allTracks, ...foundTracks];
      }
      setTracks(allTracks);
      setLoading(false);
    }
    if (moods && moods.length > 0) {
      fetchTracks();
    }
  }, [moods]);

  return (
    <div>
      <h2>Your Mood-Based Playlist</h2>
      {loading && <p>Generating playlist...</p>}
      {!loading && tracks.length === 0 && <p>No tracks found.</p>}
      <ul>
        {tracks.map(track => (
          <li key={track.id}>
           
            <iframe
              src={`https://open.spotify.com/embed/track/${track.id}`}
              width="300"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
              title={track.name}
            ></iframe>
          </li>
        ))}
      </ul>
    </div>
  );
}