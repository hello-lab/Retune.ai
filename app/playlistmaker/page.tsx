'use client';
import { useState, useEffect, useRef } from 'react';

import {useUser} from '@clerk/nextjs';
export default function PlaylistMaker() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  const audioRef = useRef(null);
const { isSignedIn, user } = useUser();
  useEffect(() => {

    
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  
  const generatePlaylist = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setTracks([]);

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          limit: 15 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate playlist');
      }

      setTracks(data.tracks);
      setPlaylistName(`${query} Playlist`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const playTrack = (track) => {
    if (!track.preview_url) {
      setError('No preview available for this track');
      return;
    }

    if (currentTrack?.id === track.id && isPlaying) {
      // Pause current track
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    // Stop current track if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Play new track
    audioRef.current = new Audio(track.preview_url);
    audioRef.current.play().catch(e => {
      setError('Failed to play audio preview');
      setIsPlaying(false);
      setCurrentTrack(null);
    });
    
    setCurrentTrack(track);
    setIsPlaying(true);

    // Handle track end
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentTrack(null);
    };

    // Handle errors
    audioRef.current.onerror = () => {
      setError('Failed to play audio preview');
      setIsPlaying(false);
      setCurrentTrack(null);
    };
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const handleSpotifyLogin = () => {
    window.location.href = '/api/auth/spotify';
  };

  const exportToSpotify = async () => {
   

    if (!playlistName.trim()) {
      setError('Please enter a playlist name');
      return;
    }

    setExportLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          description: `Generated from mood/artist: ${query}`,
          tracks: tracks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create playlist');
      }

      // Success! Open the playlist in Spotify
      window.open(data.playlist.url, '_blank');
      setShowExportModal(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setExportLoading(false);
    }
  };

  const exportToJSON = () => {
    const playlistData = {
      name: playlistName || `${query} Playlist`,
      query: query,
      created: new Date().toISOString(),
      tracks: tracks.map(track => ({
        name: track.name,
        artist: track.artist,
        album: track.album,
        spotify_url: track.url,
        duration_ms: track.duration_ms,
        spotify_uri: track.uri,
      })),
    };

    const blob = new Blob([JSON.stringify(playlistData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlistName || 'playlist'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎵 Spotify Playlist Maker
          </h1>
          <p className="text-gray-300 text-lg">
            Generate playlists based on moods, artists, or genres
          </p>
        </div>

        <form onSubmit={generatePlaylist} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter mood, artist, or genre (e.g., 'happy', 'Kendrick Lamar', 'jazz')"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Playlist'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-2 text-red-300 hover:text-red-100 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {tracks.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Your Playlist ({tracks.length} tracks)
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Export to Spotify
                </button>
                <button
                  onClick={exportToJSON}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Export JSON
                </button>
              </div>
            </div>

            {isPlaying && currentTrack && (
              <div className="mb-4 p-3 bg-purple-600/20 rounded-lg border border-purple-500/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentTrack.image && (
                      <img
                        src={currentTrack.image}
                        alt={`${currentTrack.name} album cover`}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">Now Playing:</p>
                      <p className="text-purple-200 text-sm">
                        {currentTrack.name} by {currentTrack.artist}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={stopPlayback}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                  >
                    Stop
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                    currentTrack?.id === track.id
                      ? 'bg-purple-500/20 border border-purple-500/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-gray-400 font-mono text-sm w-8">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {track.image && (
                    <img
                      src={track.image}
                      alt={`${track.name} album cover`}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {track.name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {track.artist} • {track.album}
                    </p>
                  </div>
                  
                  <div className="text-gray-400 text-sm">
                    {formatDuration(track.duration_ms)}
                  </div>
                  
                  <div className="flex gap-2">
                    {track.preview_url && (
                      <button
                        onClick={() => playTrack(track)}
                        className={`px-3 py-1 text-white text-sm rounded-md transition-colors ${
                          currentTrack?.id === track.id && isPlaying
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        {currentTrack?.id === track.id && isPlaying ? 'Pause' : 'Play'}
                      </button>
                    )}
                    <a
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                    >
                      Spotify
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Generating your playlist...</p>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Export to Spotify</h3>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

             

              <div className="flex gap-3">
                <button
                  onClick={exportToSpotify}
                  disabled={exportLoading || !playlistName.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {exportLoading ? 'Creating...' : 'Create Playlist'}
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}