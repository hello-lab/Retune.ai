<div align="center">
  <h1>🎵 ReTune.AI</h1>
  <p><strong>Personalize your soundtrack with AI-powered emotion detection</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green.svg)
  
  <img width="1920" height="1032" alt="Screenshot 2025-09-25 232455" src="https://github.com/user-attachments/assets/b8643f0c-a299-499f-8ff8-f245a30ee098" />

  <p>
    <a href="#-features"><strong>Features</strong></a> ·
    <a href="#-installation"><strong>Installation</strong></a> ·
    <a href="#-usage"><strong>Usage</strong></a> ·
    <a href="#-api"><strong>API</strong></a> ·
    <a href="#-deployment"><strong>Deploy</strong></a>
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

## 📸 ScreenShot
### Main Website
<img width="1920" height="1032" alt="1" src="https://github.com/user-attachments/assets/38f17424-efed-45b3-9182-ee2e7e1d58e6" />
<img width="1920" height="1032" alt="2" src="https://github.com/user-attachments/assets/1d0bd040-849f-4790-a995-899ee9775fa3" />
<img width="1920" height="1032" alt="3" src="https://github.com/user-attachments/assets/b121e8b0-0491-4c0d-9fd8-71fbe6cfbc9a" />
<img width="1920" height="1032" alt="4" src="https://github.com/user-attachments/assets/b6961328-5978-4eac-8e7e-c93fd21a04e2" />
<img width="1920" height="1032" alt="5" src="https://github.com/user-attachments/assets/2021d9c6-4fb1-44c0-a63e-c8bb8859fc53" />
<img width="1920" height="1032" alt="6" src="https://github.com/user-attachments/assets/d979223c-1a3e-4019-9ab9-e0724bd1087b" />
<img width="1920" height="1032" alt="7" src="https://github.com/user-attachments/assets/5bf94828-56c0-4a47-ad69-ff59ec26525a" />
<img width="1920" height="1032" alt="8" src="https://github.com/user-attachments/assets/60a7ff7f-9e64-43ac-9266-c200ffdcf8ee" />
<img width="1920" height="1032" alt="9" src="https://github.com/user-attachments/assets/d42f5b69-c56a-45a4-8f5a-447647188680" />
<img width="1920" height="1032" alt="10" src="https://github.com/user-attachments/assets/4e29a3f2-d9ff-4c5a-a425-c7798f430d9c" />
<img width="1920" height="1032" alt="11" src="https://github.com/user-attachments/assets/6766f4ad-6b64-41e4-8e4d-f7b03f2b7399" />
<img width="1920" height="1032" alt="12" src="https://github.com/user-attachments/assets/ea186f1e-14aa-423c-a4e3-b6816dd7b9bc" />
<img width="1920" height="1032" alt="13" src="https://github.com/user-attachments/assets/36faa355-1613-45cf-9bb0-823f097b581a" />
<img width="1920" height="1032" alt="14" src="https://github.com/user-attachments/assets/4d303d89-e033-45e7-8f2d-f8ca4e19ec53" />
<img width="1920" height="1032" alt="15" src="https://github.com/user-attachments/assets/0b695b5c-d821-4b09-b2d1-80cb2d9ecdac" />
<img width="1920" height="1032" alt="16" src="https://github.com/user-attachments/assets/c64fe733-d03d-493a-a4c6-60ad16df5fd0" />
<img width="1920" height="1032" alt="17" src="https://github.com/user-attachments/assets/f58cbcd4-8d57-45b3-89cc-5a1dec303942" />
<img width="1920" height="1032" alt="18" src="https://github.com/user-attachments/assets/93b42fdf-ca70-4bad-a025-0f94816fb03a" />
<h3>LightTheme</h3>

<img width="1920" height="1032" alt="19" src="https://github.com/user-attachments/assets/b11184f1-581e-4aad-b064-0d0e6e7c815e" />
<h3>Database </h3>
<img width="1616" height="228" alt="21" src="https://github.com/user-attachments/assets/8d9c8d1b-aefc-4add-b024-b9c0a3e6dcd9" />


## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hello-lab/Retune.ai)

**One-click deploy** with Vercel (recommended) or deploy to Netlify, Railway, AWS Amplify, or self-host with Docker.

---

<div align="center">
  <p>Made with ❤️ for music lovers everywhere</p>
  <p><a href="./CONTRIBUTING.md">Contributing</a> • <a href="./LICENSE">MIT License</a> • <a href="./docs/">Full Docs</a></p>
</div>
