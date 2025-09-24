"use client";
import Link from "next/link";
import SplitText from "@/components/splittext";
import CardSwap, { Card } from '@/components/card'
import GlassSurface from "@/components/GlassSurface";
import PixelCard from "@/components/PixelCard";
export default function Home() {
  return (
    <main className="min-h-screen  items-center justify-center text-gray-100 p-6">
        <section className="mb-10 h-screen items-center flex text-center flex-col justify-center">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-6xl font-bold text-white"><SplitText
  text="ReTune.Ai"
  className="text-[15vw] font-semibold text-center"
  delay={100}
  duration={1}
  ease="elastic.out(1, 0.5)"
  splitType="chars"
  from={{ opacity: 0, y: -80 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-400px"
  textAlign="center"
/></h1>
          </div>
          <p className="mt-4 text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto z-10">
            Personalize your soundtrack. Retune.ai detects your current emotion through an AI-powered chat and generates a playlist tailored to how you feel.
          </p>


        </section>

            <section className="mb-12 h-screen items-start flex flex-col justify-left">
        <div className="flex items-left absolute top-[100vh] w-[100vw] p-4 z-[100] mb-6">
        <h2 className="text-9xl font-semibold text-white">How it works</h2>
          </div>
           <CardSwap
           skewAmount={0}
    cardDistance={60}
    verticalDistance={80}
    delay={5000}
    pauseOnHover={false}
  >
    <Card>
              
<GlassSurface
  displace={0.7}
  distortionScale={-180}
  redOffset={5}
  greenOffset={15}
  blueOffset={25}
  brightness={50}
  opacity={0.3}
  backgroundOpacity={0.5}
  mixBlendMode="screen"
  height={"100%"}
  className="px-4 gap-4 w-[100vw] py-2 rounded-full flex-col flex justify-center items-center"
>
  <div>
              <div className="text-8xl mb-4">💬</div>
              <h3 className="text-6xl font-semibold mb-2 text-white">Chat with AI</h3>
              <p className="text-gray-300 text-3xl">
                Describe how you feel, what you want to listen to, or answer a few short prompts.
              </p></div>
            </GlassSurface>
    </Card>
    <Card>
              
<GlassSurface
  displace={0.7}
  distortionScale={-180}
  redOffset={5}
  greenOffset={15}
  blueOffset={25}
  brightness={50}
  opacity={0.3}
  backgroundOpacity={0.5}
  mixBlendMode="screen"
  height={"100%"}
  className="px-4 gap-4 w-[100vw] py-2 rounded-full flex-col flex justify-center items-center"
>
  <div>
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-6xl font-semibold mb-2 text-white">Emotion Detection</h3>
              <p className="text-gray-300 text-3xl">
                The AI analyzes language and context to determine mood and energy levels.
              </p>
              </div>
            </GlassSurface>
    </Card>
    <Card>
             
<GlassSurface
  displace={0.7}
  distortionScale={-180}
  redOffset={5}
  greenOffset={15}
  blueOffset={25}
  brightness={50}
  opacity={0.3}
  backgroundOpacity={0.5}
  mixBlendMode="screen"
  height={"100%"}
  className="px-4 gap-4 w-[100vw] py-2 rounded-full flex-col flex justify-center items-center"
>
              <div className="text-4xl mb-4">🎼</div>
              <h3 className="text-6xl font-semibold mb-2 text-white">Playlist Generation</h3>
              <p className="text-gray-300 text-3xl">
                Maps detected emotions to music attributes and creates a curated playlist.
              </p>
            </GlassSurface>
    </Card>
    <Card>
      <GlassSurface
  displace={0.7}
  distortionScale={-180}
  redOffset={5}
  greenOffset={15}
  blueOffset={25}
  brightness={50}
  opacity={0.3}
  backgroundOpacity={0.5}
  mixBlendMode="screen"
  height={"100%"}
  className="px-4 gap-4 w-[100vw] py-2 rounded-full flex-col flex justify-center items-center"
>
      <div className="">
              <div className="text-5xl mb-4">🎧</div>
              <h3 className="text-6xl font-semibold mb-2 text-white">Listen & Refine</h3>
              <p className="text-gray-300 text-3xl">
                Preview tracks, adjust mood or tempo, and let the AI refine recommendations.
              </p>
            </div></GlassSurface>
    </Card>
  </CardSwap>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
           
            
           
            
          </div>
        </section>

            <section className="mb-12 h-screen items-start flex flex-col justify-left">
        <div className="flex items-left w-[100vw] p-4 z-[100] mb-6">

            <h2 className="text-9xl font-semibold text-white">Features</h2>
          </div>
            <div className="grid gap-6 md:grid-cols-2">
            <GlassSurface
              displace={0.7}
              distortionScale={-180}
              redOffset={5}
              greenOffset={15}
              blueOffset={25}
              brightness={50}
              opacity={0.3}
              backgroundOpacity={0.5}
              mixBlendMode="screen"
              height={"20vh"}
              className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg"
            >
              <div className="text-3xl">🤖</div>
              <div>
              <h3 className="text-lg font-semibold text-white mb-2">Natural Language Processing</h3>
              <p className="text-gray-300">
              Advanced mood detection via conversational AI that understands context and emotion.
              </p>
              </div>
            </GlassSurface>

            <GlassSurface
              displace={0.7}
              distortionScale={-180}
              redOffset={5}
              greenOffset={15}
              blueOffset={25}
              brightness={50}
              opacity={0.3}
              backgroundOpacity={0.5}
              mixBlendMode="screen"
              height={"20vh"}
              className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg"
            >
              <div className="text-3xl">🎯</div>
              <div>
              <h3 className="text-lg font-semibold text-white mb-2">Dynamic Playlists</h3>
              <p className="text-gray-300">
              Curated playlists tailored to your specific emotion, energy level, and vibe.
              </p>
              </div>
            </GlassSurface>

            <GlassSurface
              displace={0.7}
              distortionScale={-180}
              redOffset={5}
              greenOffset={15}
              blueOffset={25}
              brightness={50}
              opacity={0.3}
              backgroundOpacity={0.5}
              mixBlendMode="screen"
              height={"20vh"}
              className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg"
            >
              <div className="text-3xl">🔒</div>
              <div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacy-First</h3>
              <p className="text-gray-300">
              Chat analysis is used only for playlist generation unless you opt in otherwise.
              </p>
              </div>
            </GlassSurface>

            <GlassSurface
              displace={0.7}
              distortionScale={-180}
              redOffset={5}
              greenOffset={15}
              blueOffset={25}
              brightness={50}
              opacity={0.3}
              backgroundOpacity={0.5}
              mixBlendMode="screen"
              height={"20vh"}
              className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg"
            >
              <div className="text-3xl">🔗</div>
              <div>
              <h3 className="text-lg font-semibold text-white mb-2">Seamless Integration</h3>
              <p className="text-gray-300">
              Connect with your preferred streaming service through settings.
              </p>
              </div>
            </GlassSurface>
            </div>
        </section>

        <section className=" text-center h-screen items-center flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/mood"
              className="inline-flex items-center w-[80vw] h-[80vh] "
            ><PixelCard height="100%"  variant="purple">

              <span className="text-[5vw] absolute mr-3">🚀
              Start Mood Chat</span></PixelCard>
            </Link>
           
          </div>
        </section>

        <footer className="text-center border-t border-gray-700 pt-8">
          <div className="flex justify-center items-center mb-4">
            <div className="text-2xl mr-3">💝</div>
            <p className="text-lg text-gray-300 max-w-3xl">
              Retune.ai aims to make music discovery personal and empathetic. Your conversations are processed to infer mood and generate better
              recommendations — data handling and retention are described in the privacy settings.
            </p>
          </div>
        </footer>
    </main>
  );
}