'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PlaylistMaker() {
  const searchParams = useSearchParams();
  // get ?url (case-insensitive fallback to URL)
  const queryUrl = searchParams?.get('url') ?? searchParams?.get('URL') ?? '';

  const [param, setParam] = useState<string>(queryUrl);

  useEffect(() => {
    setParam(searchParams?.get('url') ?? searchParams?.get('URL') ?? '');
  }, [searchParams]);

  return (
    <div className="min-h-screen py-[12vh] border-radius-xl  p-4">
      <div className="max-w-4xl bg-gradient-to-br  rounded-xl from-purple-900 via-blue-900 to-indigo-900 p-5 mx-auto">
        <iframe src={param} className="w-full h-96 rounded-xl" allowFullScreen></iframe>
      </div>
    </div>
  );
}
