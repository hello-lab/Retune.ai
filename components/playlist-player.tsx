// components/PlaylistPlayer.js
'use client';

import { useSearchParams } from 'next/navigation';

export function PlaylistPlayer() {
  const searchParams = useSearchParams();
  const queryUrl = searchParams?.get('url') ?? searchParams?.get('URL') ?? '';

  return (
    <div className="max-w-4xl bg-gradient-to-br rounded-xl from-purple-900 via-blue-900 to-indigo-900 p-5 mx-auto">
      <iframe src={queryUrl} className="w-full h-96 rounded-xl" allowFullScreen></iframe>
    </div>
  );
}