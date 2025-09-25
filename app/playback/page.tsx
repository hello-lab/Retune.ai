// app/playback/page.js
import { Suspense } from 'react';
import { PlaylistPlayer } from '@/components/playlist-player';

export default function PlaylistMaker() {
  return (
    <div className="min-h-screen py-[12vh] border-radius-xl p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <PlaylistPlayer />
      </Suspense>
    </div>
  );
}