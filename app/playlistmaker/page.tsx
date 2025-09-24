'use client';
import { useState, useEffect, useRef } from 'react';

import {useUser} from '@clerk/nextjs';
export default function PlaylistMaker() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  // New web player states
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showWebPlayer, setShowWebPlayer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrack]);

  const handleTrackEnd = () => {
    if (isRepeat) {
      // Repeat current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      // Play next track
      playNext();
    }
  };

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
    if (!match) return null;
    return decodeURIComponent(match.split('=')[1] || '');
  };

  // setInput controls whether the used query should be shown in the input.
  const generatePlaylist = async (e?: any, providedQuery?: string, setInput = true) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const q = (providedQuery ?? query).trim();
    if (!q) return;

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
          query: q,
          limit: 15 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate playlist');
      }

      setTracks(data.tracks);
      setPlaylistName(`${q} Playlist`);
      // only update the visible input if allowed
      if (setInput) {
        setQuery(q);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // On load: check cookie named "inference", parse it (array of strings) and run as inference
  useEffect(() => {
    try {
      const cookieVal = getCookie('inference');
      if (!cookieVal) return;

      // try JSON.parse first
      let parsed: any = null;
      try {
        parsed = JSON.parse(cookieVal);
      } catch {
        // fallback: treat as comma separated list
        const parts = cookieVal.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (parts.length) parsed = parts;
      }

      if (Array.isArray(parsed) && parsed.length > 0) {
        // convert array of strings into a single query string (space-separated)
        const q = parsed.join(' ');
        // run generation using the composed query but do not show the query in the input on first load
        generatePlaylist(undefined, q, false);
      } else if (typeof parsed === 'string' && parsed.trim()) {
        // run generation with the string but do not show the query in the input on first load
        generatePlaylist(undefined, parsed.trim(), false);
      }
    } catch (e) {
      // ignore cookie parse errors
      console.warn('Failed to parse inference cookie', e);
    }
    // we intentionally do not include generatePlaylist in deps to run this only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = (track: any, index?: number) => {
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
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.play().catch(e => {
      setError('Failed to play audio preview');
      setIsPlaying(false);
      setCurrentTrack(null);
    });
    
    setCurrentTrack(track);
    setCurrentTrackIndex(index !== undefined ? index : tracks.findIndex(t => t.id === track.id));
    setIsPlaying(true);
    setShowWebPlayer(true);

    // Handle errors
    audioRef.current.onerror = () => {
      setError('Failed to play audio preview');
      setIsPlaying(false);
      setCurrentTrack(null);
    };
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        setError('Failed to resume playback');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (tracks.length === 0 || currentTrackIndex === -1) return;

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }

    playTrack(tracks[nextIndex], nextIndex);
  };

  const playPrevious = () => {
    if (tracks.length === 0 || currentTrackIndex === -1) return;

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    }

    playTrack(tracks[prevIndex], prevIndex);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.volume = newMuted ? 0 : volume;
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTrackIndex(-1);
    setShowWebPlayer(false);
    setCurrentTime(0);
    setDuration(0);
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
    } catch (err: any) {
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

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen py-[15vh] p-4">
      <div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎵 Spotify Playlist Maker
          </h1>
          <p className="text-gray-300 text-lg">
            Generate playlists based on moods, artists, or genres
          </p>
        </div>

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
                        onClick={() => playTrack(track, index)}
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

        {/* Web Player */}
        {showWebPlayer && currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/20 p-4 z-40">
            <div className="max-w-6xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-3">
                <input
                  ref={progressRef}
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* Track Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {currentTrack.image && (
                    <img
                      src={currentTrack.image}
                      alt={`${currentTrack.name} album cover`}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {currentTrack.name}
                    </h4>
                    <p className="text-gray-400 text-sm truncate">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`p-2 rounded-full transition-colors ${
                      isShuffled ? 'text-purple-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a1 1 0 011-1h3.586l1.707-1.707A1 1 0 0113 3v3a1 1 0 11-2 0V4.414L9.586 5.828A2 2 0 008.172 6H6a1 1 0 01-1-1zM2 12a1 1 0 011-1h3.586l1.707-1.707A1 1 0 0110 10v3a1 1 0 11-2 0v-1.586L6.586 12.828A2 2 0 005.172 13H3a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <button
                    onClick={playPrevious}
                    className="p-2 text-white hover:text-purple-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
                    </svg>
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={playNext}
                    className="p-2 text-white hover:text-purple-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
                    </svg>
                  </button>

                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-2 rounded-full transition-colors ${
                      isRepeat ? 'text-purple-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>

                {/* Volume Controls */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    ) : volume < 0.5 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14 8a1 1 0 10-2 0v4a1 1 0 102 0V8z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 010 1.414A4.98 4.98 0 0117 10a4.98 4.98 0 01-1.343 2.243 1 1 0 11-1.414-1.414A2.98 2.98 0 0015 10a2.98 2.98 0 00-.757-1.829 1 1 0 011.414-1.414z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume * 100}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <button
                    onClick={stopPlayback}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors ml-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
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

        {/* Custom CSS for sliders */}
        <style jsx>{`
          .slider {
            background: linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${currentTime && duration ? (currentTime / duration) * 100 : 0}%, #374151 ${currentTime && duration ? (currentTime / duration) * 100 : 0}%, #374151 100%);
          }
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 15px;
            width: 15px;
            border-radius: 50%;
            background: #8b5cf6;
            cursor: pointer;
            border: 2px solid #ffffff;
          }
          .slider::-moz-range-thumb {
            height: 15px;
            width: 15px;
            border-radius: 50%;
            background: #8b5cf6;
            cursor: pointer;
            border: 2px solid #ffffff;
          }
        `}</style>
      </div>
    </div></div>
  );
}