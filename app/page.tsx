"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-6">
      <div className="max-w-5xl w-full bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-xl shadow-2xl">
        <header className="mb-10 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="text-6xl mr-4">🎵</div>
            <h1 className="text-6xl font-bold text-white">Retune.ai</h1>
          </div>
          <p className="mt-4 text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Personalize your soundtrack. Retune.ai detects your current emotion through an AI-powered chat and generates a playlist tailored to how you feel.
          </p>
        </header>

        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">⚙️</div>
            <h2 className="text-3xl font-semibold text-white">How it works</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Chat with AI</h3>
              <p className="text-gray-300">
                Describe how you feel, what you want to listen to, or answer a few short prompts.
              </p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Emotion Detection</h3>
              <p className="text-gray-300">
                The AI analyzes language and context to determine mood and energy levels.
              </p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <div className="text-4xl mb-4">🎼</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Playlist Generation</h3>
              <p className="text-gray-300">
                Maps detected emotions to music attributes and creates a curated playlist.
              </p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Listen & Refine</h3>
              <p className="text-gray-300">
                Preview tracks, adjust mood or tempo, and let the AI refine recommendations.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">✨</div>
            <h2 className="text-3xl font-semibold text-white">Features</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="text-3xl">🤖</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Natural Language Processing</h3>
                <p className="text-gray-300">
                  Advanced mood detection via conversational AI that understands context and emotion.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Dynamic Playlists</h3>
                <p className="text-gray-300">
                  Curated playlists tailored to your specific emotion, energy level, and vibe.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Privacy-First</h3>
                <p className="text-gray-300">
                  Chat analysis is used only for playlist generation unless you opt in otherwise.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="text-3xl">🔗</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Seamless Integration</h3>
                <p className="text-gray-300">
                  Connect with your preferred streaming service through settings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/chat"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg rounded-lg font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="text-2xl mr-3">🚀</span>
              Start Mood Chat
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-4 text-lg text-indigo-300 hover:text-indigo-200 hover:underline transition-colors duration-300"
            >
              <span className="text-xl mr-2">📖</span>
              Learn more
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
      </div>
    </main>
  );
}