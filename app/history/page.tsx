"use client";

import MoodPlaylist from '@/components/MoodPlaylist';
import { useState, useEffect } from 'react';

// Example moods generated from your model/API
const generatedMoods = [
  "happy",
  "chill",
  "Taylor Swift",
  "energetic",
  "pop"
];

export default function Page() {
  const [user, setUser] = useState<string>("");

  // read "user" cookie on the client and store it in state
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookieEntry = document.cookie.split('; ').find(entry => entry.startsWith('user='));
    if (cookieEntry) {
      const value = cookieEntry.split('=').slice(1).join('=');
      setUser(decodeURIComponent(value));
    }
  }, []);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
      <h1>AI Mood Playlist</h1>
      <p>
        Here is your personalized playlist, generated from detected moods and artists:
      </p>
      <p>User cookie: {user || "not set"}</p>
      <MoodPlaylist moods={generatedMoods} />
    </main>
  );
}