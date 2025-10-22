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
- **Secure API key management**: Input fields for your API credentials

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

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Deploy to Vercel

This project is configured for automatic deployment to Vercel:

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Vercel will automatically detect the Vite configuration and deploy
5. Your app will be live with automatic deployments on every push!

## Usage

1. Open the application in your browser

2. Enter your API keys in the input fields at the top

3. Follow the three-step process:
   - **Step 1**: Click "Download Headlines" and select news stories
   - **Step 2**: Click "Generate Lyrics" to create song lyrics
   - **Step 3**: Click "Generate Song" to produce your music

4. Listen to your AI-generated music!

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
├── src/
│   ├── matrix-music-generator.jsx  # Main component
│   ├── App.jsx                     # App wrapper
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind directives
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── vercel.json                     # Vercel deployment config
└── package.json                    # Dependencies
```

The main component (`src/matrix-music-generator.jsx`) contains:

- **Matrix Animation**: Canvas-based falling characters effect
- **API Integration Functions**:
  - `fetchNews()`: Retrieves headlines from NewsAPI
  - `generateLyrics()`: Creates lyrics using Claude AI
  - `generateSong()`: Generates music with Suno AI
- **UI Components**: Three-step workflow interface with status indicators

## Security Notes

- API keys are entered by users at runtime (not stored in code)
- Use `.gitignore` to prevent accidentally committing sensitive files
- Consider using environment variables for production deployments

## Future Enhancements

- Package.json for dependency management
- Environment variable configuration
- Additional music generation options
- Lyrics editing before song generation
- Save/download generated songs
- Share functionality

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Powered by Anthropic Claude AI
- Music generation by Suno AI
- News data from NewsAPI
- Inspired by The Matrix aesthetic
