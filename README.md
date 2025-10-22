# Matrix Music Generator

A creative AI-powered web application that generates music from news headlines using a three-stage pipeline: News → Lyrics → Music.

## Overview

Matrix Music Generator combines three powerful APIs to create a unique musical experience:

1. **NewsAPI** - Fetches current news headlines
2. **Claude AI (Anthropic)** - Generates creative song lyrics based on selected headlines
3. **Suno AI** - Transforms lyrics into actual music

The application features a Matrix-inspired cyberpunk aesthetic with animated green "rain" background.

## Features

- **Matrix-themed UI**: Animated falling katakana characters create an immersive cyberpunk experience
- **Three-step workflow**: Intuitive pipeline from news selection to music generation
- **Multi-headline selection**: Choose multiple news stories to inspire your lyrics
- **Real-time status updates**: Visual feedback throughout the generation process
- **Built-in audio player**: Listen to your generated songs immediately
- **Secure API handling**: API keys stored as environment variables, never exposed to the browser

## Prerequisites

You'll need API keys from the following services:

- [NewsAPI](https://newsapi.org/) - For fetching news headlines
- [Anthropic Claude](https://console.anthropic.com/) - For generating lyrics
- [Suno AI](https://suno.ai/) - For music generation

## Installation

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/matrix-music-generator.git
   cd matrix-music-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your API keys:
   ```
   NEWS_API_KEY=your_newsapi_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   SUNO_API_KEY=your_suno_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Deploy to Vercel

This project is configured for automatic deployment to Vercel:

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Vercel will automatically detect the Vite configuration
5. **Important**: Add environment variables in Vercel:
   - Go to "Settings" → "Environment Variables"
   - Add these three variables:
     - `NEWS_API_KEY` - Your NewsAPI key
     - `ANTHROPIC_API_KEY` - Your Claude API key
     - `SUNO_API_KEY` - Your Suno AI API key
6. Click "Deploy"
7. Your app will be live with automatic deployments on every push!

## Usage

1. Open the application in your browser (make sure environment variables are configured)

2. Follow the three-step process:
   - **Step 1**: Click "FETCH NEWS FROM MATRIX" to download current headlines and select news stories
   - **Step 2**: Click "CREATE LYRICS" to generate song lyrics based on selected headlines
   - **Step 3**: Click "TRANSMIT TO SUNO AI" to produce your music

3. Listen to your AI-generated music in the built-in player!

## Technical Details

- **Build Tool**: Vite
- **Framework**: React (with Hooks: useState, useEffect, useRef)
- **Styling**: Tailwind CSS
- **Canvas Animation**: HTML5 Canvas for Matrix effect
- **Deployment**: Vercel (with automatic deployments)
- **APIs**:
  - NewsAPI v2
  - Anthropic Claude API (claude-sonnet-4-20250514)
  - Suno AI API v1

## Project Structure

```
matrix-music-generator/
├── api/                            # Vercel Serverless Functions
│   ├── news.js                     # NewsAPI proxy endpoint
│   ├── lyrics.js                   # Claude API proxy endpoint
│   └── song.js                     # Suno AI proxy endpoint
├── src/
│   ├── matrix-music-generator.jsx  # Main component
│   ├── App.jsx                     # App wrapper
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind directives
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── vercel.json                     # Vercel deployment config
├── .env.example                    # Environment variables template
└── package.json                    # Dependencies
```

### Architecture

**Frontend** (`src/matrix-music-generator.jsx`):
- **Matrix Animation**: Canvas-based falling characters effect
- **API Integration**: Calls serverless functions at `/api/*`
- **UI Components**: Three-step workflow interface with status indicators

**Backend** (Vercel Serverless Functions in `api/`):
- **`/api/news`**: Proxies requests to NewsAPI (avoids CORS and 426 errors)
- **`/api/lyrics`**: Proxies requests to Claude API for lyrics generation
- **`/api/song`**: Proxies requests to Suno AI for music generation
- **Security**: API keys stored in environment variables, never exposed to the browser

## Security Notes

- API keys are stored as environment variables (never in code or exposed to the browser)
- `.env.local` is in `.gitignore` to prevent accidentally committing secrets
- Serverless functions act as a secure proxy layer between the frontend and external APIs
- In Vercel, environment variables are encrypted and securely managed

## Future Enhancements

- Lyrics editing before song generation
- Multiple music styles and genre selection
- Save/download generated songs
- Share functionality (social media integration)
- Song history and playlist management
- Custom theming options

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Powered by Anthropic Claude AI
- Music generation by Suno AI
- News data from NewsAPI
- Inspired by The Matrix aesthetic
