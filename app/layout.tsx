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
import ClientLayout from "@/components/ClientLayout";
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
}>) {
  return (
        <ClerkProvider>

    <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>
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
          {children}
          </ClientLayout>
        </ThemeProvider>
         
      </body>
    </html>
    </ClerkProvider>
  );
}
