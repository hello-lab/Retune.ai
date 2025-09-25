# ReTune.AI API Documentation

This document outlines the API endpoints available in ReTune.AI.

## Authentication

Most endpoints require authentication via Clerk. Include the session token in your requests.

## Endpoints

### Chat & Emotion Detection

#### POST `/api/gemini`

Processes user messages and detects emotional patterns using Google's Gemini AI.

**Request Body:**
```json
{
  "chatJson": [
    {
      "user": "User",
      "message": "I'm feeling really happy and energetic today!"
    },
    {
      "user": "AI", 
      "message": {
        "response": "Previous AI response...",
        "detected": ["joy", "energy"]
      }
    }
  ]
}
```

**Response:**
```json
{
  "response": "I can sense your happiness! Let me suggest some upbeat tracks that match your energy...",
  "detected": ["joy", "high-energy", "positive", "upbeat"]
}
```

**Error Responses:**
- `400` - Invalid request format
- `401` - Authentication required
- `500` - Gemini AI service error

### Playlist Generation

#### POST `/api/playlist`

Generates music playlists based on detected emotions and user preferences.

**Request Body:**
```json
{
  "query": "happy upbeat songs for working out",
  "limit": 15,
  "mood": ["joy", "energy", "motivation"]
}
```

**Response:**
```json
{
  "playlist": [
    {
      "id": "4iV5W9uYEdYUVa79Axb7Rh",
      "name": "Happy",
      "artist": "Pharrell Williams",
      "album": "G I R L",
      "preview_url": "https://p.scdn.co/mp3-preview/...",
      "duration_ms": 232560,
      "external_url": "https://open.spotify.com/track/...",
      "image_url": "https://i.scdn.co/image/..."
    }
  ],
  "total": 15,
  "mood_match": 0.92
}
```

### Playlist Management

#### GET `/api/get-playlist`

Retrieves saved playlists for the authenticated user.

**Query Parameters:**
- `limit` (optional): Number of playlists to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "playlists": [
    {
      "id": "playlist_id",
      "name": "Happy Vibes",
      "created_at": "2024-01-15T10:30:00Z",
      "mood": ["joy", "energy"],
      "track_count": 15
    }
  ],
  "total": 25
}
```

#### POST `/api/create-playlist`

Creates and saves a new playlist.

**Request Body:**
```json
{
  "name": "My Happy Playlist",
  "tracks": ["track_id_1", "track_id_2"],
  "mood": ["joy", "energy"],
  "description": "Songs that make me happy"
}
```

### Authentication Endpoints

#### GET `/api/auth/me`

Returns current user information.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

## Rate Limiting

- Gemini API: 60 requests per minute per user
- Playlist API: 100 requests per minute per user
- General APIs: 1000 requests per minute per user

## SDKs and Libraries

Currently, the API is accessed directly via HTTP requests. Consider using:

- **Fetch API** (built-in browser)
- **Axios** (Node.js/Browser)
- **SWR** or **React Query** for React applications

## Examples

### Basic Mood Detection

```javascript
const response = await fetch('/api/gemini', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  },
  body: JSON.stringify({
    chatJson: [
      { user: "User", message: "I need some calming music for studying" }
    ]
  })
});

const data = await response.json();
console.log(data.detected); // ["calm", "focus", "ambient"]
```

### Generate Playlist

```javascript
const playlist = await fetch('/api/playlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  },
  body: JSON.stringify({
    query: "calming study music",
    limit: 20,
    mood: ["calm", "focus", "ambient"]
  })
});

const tracks = await playlist.json();
```