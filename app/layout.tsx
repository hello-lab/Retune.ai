"use client";
import { useState, useEffect } from "react";
import type { Metadata } from "next";
// import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import GlassSurface  from "@/components/GlassSurface";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import DotGrid from "@/components/DotGrid";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   display: "swap",
//   subsets: ["latin"],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

useEffect(() => {
  if (!document.cookie.includes("spotify_access_token")) 
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


},[]);
  return (

        <ClerkProvider>

  
      <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden dotnet">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <div style={{ width: '100%', height: location.pathname=='/'?'470%':'100%', position: 'absolute' }}>
  <DotGrid
    dotSize={2}
    gap={15}
    baseColor="#8c7ec5ff"
    activeColor="#5227FF"
    proximity={100}
    shockRadius={250}
    shockStrength={5}
    resistance={750}
    returnDuration={1.5}
  />
</div>
            <header className="flex fixed top-0 w-[100vw] justify-end  p-4 gap-5 h-16 z-[1000]">
          <GlassSurface
  displace={0.5}
  distortionScale={-180}
  redOffset={5}
  greenOffset={15}
  blueOffset={25}
  brightness={50}
  opacity={0.93}
  backgroundOpacity={0.1}
  mixBlendMode="screen"
  className="px-4 gap-4 w-[100vw] py-2 rounded-full "
>
  <div className="flex gap-4 items-center justify-center">
  <div>
    <div className="flex items-center gap-4 text-xl">
      <Link
        href="/"
        className=" font-semibold hover:underline  transition-colors duration-150"
      >
        Home
      </Link>
      <nav className="flex items-center gap-3">
        <Link
          href="/diyplaylist"
          className="   hover:underline   transition-colors duration-150"
        >
          Browse
        </Link>
        <Link
          href="/history"
          className=" hover:underline   transition-colors duration-150"
        >
          Playlists
        </Link>
        <Link
          href="/mood"
          className=" hidden sm:inline hover:underline    transition-colors duration-150"
        >
          Generate
        </Link>
       
      </nav>
    </div>
  </div>
  <div className="h-[20vh] relative  bg-[gray] w-[1px]"></div>
  <div className="flex items-center gap-4  ">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <ThemeSwitcher />
            </div></div>
            </GlassSurface>
          </header>
          <div className="z-[11] relative">
          {children}</div>
        </ThemeProvider>
         
      </body>
    </html>
    </ClerkProvider>
  );
}
