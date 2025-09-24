"use client";
import type { Metadata } from "next";
// import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { hasEnvVars } from "@/lib/utils";
import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Hero } from "@/components/hero";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
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
}>) 
 

{
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
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        
                <header className="flex justify-end items-center p-4 gap-4 h-16">
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
          </header>
          {children}
        </ThemeProvider>
         
      </body>
    </html>
    </ClerkProvider>
  );
}
