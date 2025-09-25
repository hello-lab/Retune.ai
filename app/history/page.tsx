"use client";

import React, { useEffect, useState } from "react";
import { Search, Music, ExternalLink, Play } from "lucide-react";

type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
  url: string;
  preview_url: string | null;
  duration_ms: number | null;
  image?: string;
  uri?: string;
};

type Playlist = {
  id: number | string;
  created_at?: string;
  userid?: string;
  name?: string;
  json?: Track[];
  spotify?: string;
};

type ApiResponse = {
  data: Playlist[];
};

function formatDuration(ms: number | null | undefined) {
  if (ms == null) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Single-file Playlists viewer component.
 *
 * This version swaps inline styles for scoped styled-jsx CSS for cleaner,
 * responsive and consistent styling.
 */
export default function PlaylistsViewer({ apiUrl = "/api/get-playlist" }: { apiUrl?: string }) {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMap, setOpenMap] = useState<Record<string | number, boolean>>({});
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(apiUrl)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch ${apiUrl}: ${res.status} ${text}`);
        }
        return res.json();
      })
      .then((json: ApiResponse) => {
        if (!mounted) return;
        const items = Array.isArray(json?.data) ? json.data : [];
        setPlaylists(items);
        console.log(items)

      })
      .catch((err: any) => {
        if (!mounted) return;
        setError(err?.message || String(err));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  function toggle(id: string | number) {
    setOpenMap((m) => ({ ...m, [id]: !m[id] }));
  }

  const normalized =
    playlists?.filter((p) => {
      if (!filter) return true;
      const q = filter.toLowerCase();
      if (p.name?.toLowerCase().includes(q)) return true;
      if (p.json?.some((t) => t.name?.toLowerCase().includes(q) || t.artist?.toLowerCase().includes(q)))
        return true;
      return false;
    }) ?? [];

  if (loading) {
    return (
      <div className="min-h-screen  p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading playlists…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
              <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!normalized.length) {
    return (
      <div className="min-h-screen flex flex-1 w-[100vw] py-[20vh] p-6">
        <div className="max-w-[90vw] mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md shadow-sm">
              <Music className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No playlists found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-[12vh] p-6 font-sans">
      <div className="w-[80vw] p-4 rounded-xl bg-primary/10 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[--primary] mb-2">Your Playlists</h1>
          <p className="text-slate-600">Discover and manage your music collections</p>
        </div>

        {/* Search/Filter */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              aria-label="Filter playlists or tracks"
              placeholder="Filter by playlist, track or artist..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-secondary text-primary border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Playlists List */}
        <div className="space-y-4">
          {normalized.map((pl) => (
            <div 
              key={pl.id}
              className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {pl.name ?? "Untitled"}
                  </h3>
                  {pl.created_at && (
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(pl.created_at).toLocaleString()}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Music className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {pl.json ? `${pl.json.length} track${pl.json.length === 1 ? "" : "s"}` : "no tracks"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                 
                  {pl.spotify && pl.spotify !== "none" ? (
                    <iframe src={pl.spotify} width="100%" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media" className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"></iframe>
                  ) :  <button
                    onClick={() => toggle(pl.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 hover:-translate-y-0.5 ${
                      openMap[pl.id]
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                    aria-expanded={!!openMap[pl.id]}
                  >
                    {openMap[pl.id] ? "Hide tracks" : "Show tracks"}
                  </button>}
                </div>
              </div>

              {openMap[pl.id] && pl.json && (
                <div className="mt-6 pt-6 border-t border-slate-200/60">
                  <div className="space-y-3">
                    {pl.json.map((t) => (
<>

                     { t.spotify?<div>hola</div>:
                      <div 
                        key={t.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-200"
                      >
                        {/* Album Art */}
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          {t.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={t.image} 
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Music className="h-6 w-6 text-blue-400" />
                          )}
                        </div>

                        {/* Track Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-slate-900 truncate" title={t.name}>
                                {t.name}
                              </h4>
                              <p className="text-sm text-slate-600 truncate mt-1">
                                {t.artist} <span className="text-slate-400">• {t.album}</span>
                              </p>
                            </div>
                            <div className="text-xs text-slate-500 flex-shrink-0 min-w-[40px] text-right">
                              {formatDuration(t.duration_ms ?? undefined)}
                            </div>
                          </div>

                          {/* Track Actions */}
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <a 
                              href={t.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors duration-200"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Spotify
                            </a>
                            {t.preview_url && (
                              <div className="flex items-center gap-2">
                                <Play className="h-3 w-3 text-slate-400" />
                                <audio 
                                  controls 
                                  src={t.preview_url}
                                  className="h-6 text-xs"
                                  style={{ maxWidth: '200px' }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>}

</>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}