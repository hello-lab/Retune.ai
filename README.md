<div align="center">
  <h1>🎵 ReTune.AI</h1>
  <p><strong>Personalize your soundtrack with AI-powered emotion detection</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green.svg)
  
  ![Homepage Screenshot](https://github.com/user-attachments/assets/cebf310a-626e-41d4-b464-420edb688a14)
  
  <p>
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a> ·
    <a href="#api"><strong>API</strong></a> ·
    <a href="#deployment"><strong>Deploy</strong></a>
  </p>
</div>

---

ReTune.AI uses conversational AI to detect your current mood and emotional state, then generates personalized playlists tailored to how you feel. Chat with our AI, describe your feelings, and get music that matches your vibe.

## ✨ Features

🤖 **AI Mood Detection** - Advanced natural language processing understands your emotions  
🎯 **Dynamic Playlists** - Curated tracks tailored to your specific mood and energy  
🔒 **Privacy-First** - Conversations used only for playlist generation  
🎨 **Beautiful UI** - Modern glassmorphism design with smooth animations  
🔗 **Music Integration** - Connect with your preferred streaming service

## 🚀 Installation

```bash
# Clone and install
git clone https://github.com/hello-lab/Retune.ai.git
cd Retune.ai
npm install

# Environment setup - create .env.local with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
GOOGLE_AI_API_KEY=your_gemini_key

# Run development server
npm run dev
```

**Requirements:** Node.js 18+, accounts for Supabase, Clerk, and Google AI Studio

## 📱 Usage

1. **Start Mood Chat** - Navigate to `/mood` or click "Start Mood Chat"
2. **Describe Feelings** - Type how you're feeling or what music you want
3. **AI Analysis** - The AI detects emotional patterns from your input
4. **Get Playlist** - Click "Generate" for personalized music recommendations
5. **Listen & Refine** - Preview tracks and provide feedback

### Page Overview
- **Home (`/`)** - Landing page with features and navigation
- **Mood Chat (`/mood`)** - Interactive AI emotion detection interface  
- **Browse (`/diyplaylist`)** - Manual playlist creation and browsing
- **History (`/history`)** - View previously generated playlists

## 🔧 API

### Emotion Detection
```javascript
POST /api/gemini
{
  "chatJson": [
    { "user": "User", "message": "I'm feeling happy today!" }
  ]
}
// Response: { "response": "...", "detected": ["joy", "energy"] }
```

### Playlist Generation
```javascript
POST /api/playlist
{
  "query": "happy upbeat songs",
  "limit": 15,
  "mood": ["joy", "energy"]
}
// Response: { "playlist": [...tracks], "mood_match": 0.92 }
```

## 🛠️ Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, GSAP animations  
**Backend:** Supabase (database), Clerk (auth), Google Gemini AI (emotion detection)  
**Optional:** Spotify Web API for music integration

## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hello-lab/Retune.ai)

**One-click deploy** with Vercel (recommended) or deploy to Netlify, Railway, AWS Amplify, or self-host with Docker.

---

<div align="center">
  <p>Made with ❤️ for music lovers everywhere</p>
  <p><a href="./CONTRIBUTING.md">Contributing</a> • <a href="./LICENSE">MIT License</a> • <a href="./docs/">Full Docs</a></p>
</div>
