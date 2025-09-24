"use client";

import React, { useEffect, useState } from "react";

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
 * Usage:
 * - Place this file in your Next.js app (e.g. components/PlaylistsViewer.tsx).
 * - Import and render: <PlaylistsViewer apiUrl="/api/pasted" />
 *
 * The component fetches the JSON shape you pasted (root.data array) and renders
 * playlists + collapsible track lists, with a filter input.
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

  if (loading) return <div style={{ padding: 16 }}>Loading playlists…</div>;
  if (error) return <div style={{ padding: 16, color: "crimson" }}>Error: {error}</div>;
  if (!normalized.length) return <div style={{ padding: 16 }}>No playlists found.</div>;

  return (
    <div className="py-[20vh]" style={{ padding: 16,paddingTop:"20vh", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <div style={{ marginBottom: 12 }}>
        <input
          aria-label="Filter playlists or tracks"
          placeholder="Filter by playlist, track or artist..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ddd",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {normalized.map((pl) => (
          <div
            key={pl.id}
            style={{
              border: "1px solid #e6e6e6",
              borderRadius: 8,
              padding: 12,
              background: "var(--primary-50)",
              width: "100vh",
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{pl.name ?? "Untitled"}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {pl.created_at ? new Date(pl.created_at).toLocaleString() : null}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: "#444" }}>
                  {pl.json ? `${pl.json.length} track${pl.json.length === 1 ? "" : "s"}` : "no tracks"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => toggle(pl.id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: openMap[pl.id] ? "#f3f4f6" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  {openMap[pl.id] ? "Hide tracks" : "Show tracks"}
                </button>
                <a
                  href={pl.spotify ?? "#"}
                  onClick={(e) => {
                    if (pl.spotify === "none") e.preventDefault();
                  }}
                  style={{ fontSize: 12, color: "#666" }}
                >
                  {pl.spotify && pl.spotify !== "none" ? "Spotify" : ""}
                </a>
              </div>
            </div>

            {openMap[pl.id] && pl.json && (
              <div style={{ marginTop: 12 }}>
                {pl.json.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "8px 8px",
                      alignItems: "center",
                      borderBottom: "1px solid #f2f2f2",
                    }}
                  >
                    <div style={{ width: 56, height: 56, flex: "0 0 56px" }}>
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 6,
                            background: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(148, 158, 212, 1)",
                            fontSize: 12,
                          }}
                        >
                          no image
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {t.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#666", marginLeft: 12 }}>{formatDuration(t.duration_ms ?? undefined)}</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                        {t.artist} • <span style={{ color: "#777" }}>{t.album}</span>
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: 12,
                            color: "#0b5fff",
                            textDecoration: "none",
                            padding: "4px 8px",
                            border: "1px solid #dbe7ff",
                            borderRadius: 6,
                            background: 'var(--primary-50)',
                          }}
                        >
                          Open in Spotify
                        </a>
                        {t.preview_url && (
                          <audio
                            controls
                            src={t.preview_url}
                            style={{ marginLeft: 8, verticalAlign: "middle" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}