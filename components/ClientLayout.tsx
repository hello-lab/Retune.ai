"use client";
import { useEffect, useState, lazy, Suspense } from "react";
import { PerformanceProvider, usePerformance } from "@/contexts/PerformanceContext";

const DotGrid = lazy(() => import("@/components/DotGrid"));

function PerformanceIndicator() {
  const { highPerformanceMode, togglePerformanceMode } = usePerformance();
  
  return (
    <button
      onClick={togglePerformanceMode}
      className="fixed top-20 right-4 z-[1001] bg-black/50 text-white px-3 py-1 rounded text-sm hover:bg-black/70 transition-colors"
      title={`Currently: ${highPerformanceMode ? 'High Performance' : 'Normal'} mode. Click to toggle.`}
    >
      {highPerformanceMode ? "🚀 Performance" : "🎨 Visual"}
    </button>
  );
}

function ClientLayoutInner({ children }: { children: React.ReactNode }) {
  const { highPerformanceMode } = usePerformance();
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    
    // Check if token already exists before making API call
    const existingToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('spotify_access_token='));
    
    if (existingToken) {
      const token = decodeURIComponent(existingToken.split('=')[1]);
      setSpotifyToken(token);
      return;
    }

    // Only fetch if no token exists
    fetch("/api/auth/token")
      .then(res => res.json())
      .then((data) => {
        if (data.spotifyAccessToken) {
          setSpotifyToken(data.spotifyAccessToken);
          // Persist token in a cookie; use expires/max-age if provided by the API
          const maxAge = data.expires_in ? `; max-age=${data.expires_in}` : "";
          const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
          document.cookie = `spotify_access_token=${encodeURIComponent(
            data.spotifyAccessToken
          )}; path=/; SameSite=Lax${secure}${maxAge}`;
        }
      })
      .catch((err) => console.error("Error fetching Spotify token:", err));
  }, [hasMounted]);

  if (!hasMounted) {
    return <>{children}</>;
  }

  return (
    <>
      <PerformanceIndicator />
      {!highPerformanceMode && (
        <div style={{ 
          width: '100%', 
          height: '600px', 
          position: 'absolute', 
          zIndex: 0,
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}>
          <div style={{ 
            width: '100%', 
            height: '700%', 
            position: 'absolute', 
            top: 0, 
            zIndex: 10,
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}>
            <Suspense fallback={null}>
              <DotGrid
                dotSize={1}
                gap={15}
                baseColor="#c699daff"
                activeColor="#006b59ff"
                proximity={50}
                shockRadius={250}
                shockStrength={5}
                resistance={300}
                returnDuration={1}
              />
            </Suspense>
          </div>
        </div>
      )}
      <div className="relative h-screen flex flex-col items-center justify-center z-[10]">{children}</div>
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <PerformanceProvider>
      <ClientLayoutInner>{children}</ClientLayoutInner>
    </PerformanceProvider>
  );
}