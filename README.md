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
    <a href="#how-it-works"><strong>How It Works</strong></a> ·
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a> ·
    <a href="#api-reference"><strong>API</strong></a> ·
    <a href="#deployment"><strong>Deployment</strong></a> ·
    <a href="./docs/API.md"><strong>API Docs</strong></a> ·
    <a href="./CONTRIBUTING.md"><strong>Contributing</strong></a>
  </p>
</div>

---

## Overview

ReTune.AI is an innovative music discovery platform that uses conversational AI to detect your current mood and emotional state, then generates personalized playlists tailored to how you feel. By combining natural language processing with music recommendation algorithms, ReTune.AI creates a truly personalized and empathetic music experience.</p>

## ✨ Features

### 🤖 **Natural Language Processing**
Advanced mood detection via conversational AI that understands context and emotion in your messages.

### 🎯 **Dynamic Playlists** 
Curated playlists tailored to your specific emotion, energy level, and musical preferences.

### 🔒 **Privacy-First**
Chat analysis is used only for playlist generation unless you opt in otherwise. Your conversations remain private.

### 🔗 **Seamless Integration**
Connect with your preferred streaming service through settings for direct playlist access.

### 🎨 **Beautiful UI**
Modern glassmorphism design with smooth animations and responsive layout.

## 🔄 How It Works

### 1. 💬 Chat with AI
Describe how you feel, what you want to listen to, or answer a few short prompts.

![Mood Chat Interface](https://github.com/user-attachments/assets/9378fc3f-8ca9-4b94-a43e-4a82c8d62fff)

### 2. 🧠 Emotion Detection  
The AI analyzes language and context to determine mood and energy levels.

### 3. 🎼 Playlist Generation
Maps detected emotions to music attributes and creates a curated playlist.

### 4. 🎧 Listen & Refine
Preview tracks, adjust mood or tempo, and let the AI refine recommendations.

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- Supabase account
- Clerk account (for authentication)
- Google AI Studio API key (for Gemini)
- Spotify Developer account (optional, for music integration)

### 1. Clone the Repository

```bash
git clone https://github.com/hello-lab/Retune.ai.git
cd Retune.ai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your_gemini_api_key

# Spotify API (Optional)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 4. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the database migrations (if any)

### 5. Authentication Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure your Clerk keys in `.env.local`
3. Set up authentication providers as needed

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Basic Workflow

1. **Start a Mood Chat**: Navigate to `/mood` or click "Start Mood Chat" on the homepage
2. **Describe Your Feelings**: Type how you're feeling or what music you want
3. **AI Analysis**: The AI will analyze your input and detect emotional patterns  
4. **Playlist Generation**: Click "Generate" to create a personalized playlist
5. **Listen & Refine**: Preview tracks and provide feedback for better recommendations

### Page Overview

- **Home (`/`)**: Landing page with feature overview and navigation
- **Mood Chat (`/mood`)**: Interactive chat interface for emotion detection
- **Browse (`/diyplaylist`)**: Manual playlist creation and browsing
- **History (`/history`)**: View your previously generated playlists
- **Playback (`/playback`)**: Music player interface (if integrated)

## 🔧 API Reference

### Gemini AI Endpoint

**POST** `/api/gemini`

Processes chat messages and detects emotional patterns.

```javascript
// Request
{
  "chatJson": [
    { "user": "User", "message": "I'm feeling really happy today!" },
    { "user": "AI", "message": { "response": "...", "detected": ["joy", "energy"] } }
  ]
}

// Response  
{
  "response": "I can sense your happiness! Here are some upbeat tracks...",
  "detected": ["joy", "high-energy", "positive"]
}
```

### Playlist Generation

**POST** `/api/playlist`

Generates playlists based on detected emotions and preferences.

```javascript
// Request
{
  "query": "happy upbeat songs",
  "limit": 15,
  "mood": ["joy", "energy"]
}

// Response
{
  "playlist": [
    {
      "id": "track_id",
      "name": "Song Name",
      "artist": "Artist Name", 
      "preview_url": "https://...",
      "duration_ms": 180000
    }
  ]
}
```

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database**: Supabase
- **AI/ML**: Google Gemini AI
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: GSAP
- **Music API**: Spotify Web API (optional)

## 🎨 Components

### Core Components

- `SplitText`: Animated text splitting for hero sections
- `GlassSurface`: Glassmorphism UI elements with blur effects  
- `CardSwap`: Animated card transitions
- `PixelCard`: Retro-style card components
- `MoodPlaylist`: Playlist display and interaction

### UI Components (shadcn/ui)

- `Button`, `Input`, `Card`, `Badge`
- `Checkbox`, `Label`, `DropdownMenu`

## 📚 Documentation

- 📖 [API Documentation](./docs/API.md) - Detailed API reference
- 🚀 [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to various platforms
- 🤝 [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- 📝 [Changelog](./CHANGELOG.md) - Project history and updates

## 🚀 Deployment

## 🚀 Deployment

The easiest way to deploy ReTune.AI is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hello-lab/Retune.ai)

For detailed deployment instructions including Docker, AWS, Railway, and self-hosted options, see our [Deployment Guide](./docs/DEPLOYMENT.md).

### Quick Vercel Deploy

1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy!

## 🔒 Security & Privacy

ReTune.AI takes your privacy seriously:

- **Local Processing**: Chat analysis happens server-side but conversations aren't stored permanently
- **Minimal Data**: Only necessary data for playlist generation is processed
- **Secure Authentication**: Uses Clerk for enterprise-grade authentication
- **API Security**: All API endpoints are protected and rate-limited
- **Open Source**: Full transparency - review our code anytime

> 💡 **Note**: Configure your privacy preferences in the app settings to control data usage.

## 🔧 Development

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints
│   ├── mood/              # Mood chat interface
│   ├── diyplaylist/       # Manual playlist creation
│   ├── history/           # Playlist history
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── tutorial/         # Tutorial components
├── lib/                   # Utility functions
├── contexts/              # React contexts
└── public/               # Static assets
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server  
npm run lint         # Run ESLint
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔍 Troubleshooting

### Common Issues

**Clerk Authentication Errors**
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly
- Check that your Clerk application is configured properly

**Gemini AI Not Responding**  
- Verify your `GOOGLE_AI_API_KEY` is valid
- Check API quotas and limits in Google AI Studio

**Supabase Connection Issues**
- Confirm your Supabase URL and keys are correct
- Ensure your Supabase project is active

**Build Errors**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

### Getting Help

- 📝 [Create an Issue](https://github.com/hello-lab/Retune.ai/issues)
- 💬 [Discussions](https://github.com/hello-lab/Retune.ai/discussions)
- 📧 Contact the maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Supabase](https://supabase.com) - Backend as a Service
- [Clerk](https://clerk.com) - Authentication platform
- [Google AI](https://ai.google.dev) - Gemini AI models
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

---

<div align="center">
  <p>Made with ❤️ by the ReTune.AI team</p>
  <p>Empowering music discovery through AI and emotion</p>
</div>
