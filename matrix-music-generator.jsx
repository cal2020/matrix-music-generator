import React, { useState, useEffect, useRef } from 'react';

export default function MatrixMusicGenerator() {
  const [newsHeadlines, setNewsHeadlines] = useState([]);
  const [selectedHeadlines, setSelectedHeadlines] = useState([]);
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [newsApiKey, setNewsApiKey] = useState('');
  const [sunoApiKey, setSunoApiKey] = useState('');
  const canvasRef = useRef(null);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);
    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01';

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    if (!newsApiKey.trim()) {
      setStatus('Please enter your NewsAPI key');
      return;
    }

    setLoading(true);
    setStatus('Fetching latest headlines from the Matrix...');
    
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${newsApiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        setNewsHeadlines(data.articles.map(article => article.title));
        setStatus(`Downloaded ${data.articles.length} headlines`);
      } else {
        setStatus('No headlines found');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleHeadline = (index) => {
    setSelectedHeadlines(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const generateLyrics = async () => {
    if (selectedHeadlines.length === 0) {
      setStatus('Select at least one headline');
      return;
    }

    setLoading(true);
    setStatus('Generating lyrics from selected headlines...');

    const headlines = selectedHeadlines.map(i => newsHeadlines[i]).join('. ');
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { 
              role: "user", 
              content: `Create creative song lyrics inspired by these news headlines. Make it catchy and musical, with verses and a chorus. Headlines: ${headlines}

Create original lyrics that are inspired by these themes but don't directly quote the headlines. Make it artistic and singable.`
            }
          ]
        })
      });

      const data = await response.json();
      const lyrics = data.content[0].text;
      setGeneratedLyrics(lyrics);
      setStatus('Lyrics generated successfully');
    } catch (error) {
      setStatus(`Error generating lyrics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateSong = async () => {
    if (!generatedLyrics.trim()) {
      setStatus('Generate lyrics first');
      return;
    }

    if (!sunoApiKey.trim()) {
      setStatus('Please enter your Suno AI API key');
      return;
    }

    setLoading(true);
    setStatus('Transmitting to Suno AI...');
    setSongUrl('');

    try {
      // Note: This is a placeholder for Suno AI API integration
      // The actual API endpoint and structure may vary
      // Check Suno AI documentation at https://suno.ai or their API docs
      
      const response = await fetch('https://api.suno.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sunoApiKey}`
        },
        body: JSON.stringify({
          prompt: generatedLyrics,
          make_instrumental: false,
          wait_audio: true
        })
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // Adjust based on actual Suno API response structure
      if (data.audio_url || data.url) {
        setSongUrl(data.audio_url || data.url);
        setStatus('Song generated successfully!');
      } else {
        setStatus('Song generation in progress. Response: ' + JSON.stringify(data).substring(0, 100));
      }
    } catch (error) {
      setStatus(`Error: ${error.message}. Note: Check Suno AI API documentation for correct endpoints.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20" />
      
      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <div className="border-2 border-green-400 p-6 mb-6 bg-black bg-opacity-80">
          <h1 className="text-4xl mb-2 text-center glitch-text">MATRIX MUSIC GENERATOR</h1>
          <p className="text-center text-sm">News → Lyrics → Music</p>
        </div>

        {/* API Keys Section */}
        <div className="border border-green-400 p-4 mb-6 bg-black bg-opacity-80">
          <h2 className="text-xl mb-3">⚙️ API CONFIGURATION</h2>
          <div className="space-y-3">
            <div>
              <label className="block mb-1 text-sm">NewsAPI Key:</label>
              <input
                type="password"
                value={newsApiKey}
                onChange={(e) => setNewsApiKey(e.target.value)}
                placeholder="Enter your NewsAPI key"
                className="w-full bg-black border border-green-400 text-green-400 p-2 focus:outline-none focus:border-green-300"
              />
              <p className="text-xs mt-1 opacity-70">Get free key at newsapi.org</p>
            </div>
            <div>
              <label className="block mb-1 text-sm">Suno AI API Key:</label>
              <input
                type="password"
                value={sunoApiKey}
                onChange={(e) => setSunoApiKey(e.target.value)}
                placeholder="Enter your Suno AI API key"
                className="w-full bg-black border border-green-400 text-green-400 p-2 focus:outline-none focus:border-green-300"
              />
              <p className="text-xs mt-1 opacity-70">Get key from Suno AI</p>
            </div>
          </div>
        </div>

        {/* Status Display */}
        {status && (
          <div className="border border-green-400 p-3 mb-6 bg-black bg-opacity-80">
            <div className="flex items-center">
              <span className="mr-2">{'>'}</span>
              <span className="animate-pulse">{status}</span>
            </div>
          </div>
        )}

        {/* Step 1: Fetch News */}
        <div className="border border-green-400 p-4 mb-6 bg-black bg-opacity-80">
          <h2 className="text-xl mb-3">STEP 1: DOWNLOAD HEADLINES</h2>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="w-full bg-green-400 text-black font-bold py-3 px-6 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'LOADING...' : 'FETCH NEWS FROM MATRIX'}
          </button>
          
          {newsHeadlines.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm mb-2">Select headlines to use:</p>
              {newsHeadlines.map((headline, index) => (
                <div
                  key={index}
                  onClick={() => toggleHeadline(index)}
                  className={`p-2 border cursor-pointer transition-all ${
                    selectedHeadlines.includes(index)
                      ? 'border-green-300 bg-green-400 bg-opacity-10'
                      : 'border-green-400 hover:bg-green-400 hover:bg-opacity-5'
                  }`}
                >
                  <span className="mr-2">{selectedHeadlines.includes(index) ? '✓' : '○'}</span>
                  {headline}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Generate Lyrics */}
        <div className="border border-green-400 p-4 mb-6 bg-black bg-opacity-80">
          <h2 className="text-xl mb-3">STEP 2: GENERATE LYRICS</h2>
          <button
            onClick={generateLyrics}
            disabled={loading || selectedHeadlines.length === 0}
            className="w-full bg-green-400 text-black font-bold py-3 px-6 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'PROCESSING...' : 'CREATE LYRICS'}
          </button>
          
          {generatedLyrics && (
            <div className="mt-4 p-4 border border-green-400 bg-black whitespace-pre-wrap max-h-96 overflow-y-auto">
              {generatedLyrics}
            </div>
          )}
        </div>

        {/* Step 3: Generate Song */}
        <div className="border border-green-400 p-4 mb-6 bg-black bg-opacity-80">
          <h2 className="text-xl mb-3">STEP 3: GENERATE SONG</h2>
          <button
            onClick={generateSong}
            disabled={loading || !generatedLyrics}
            className="w-full bg-green-400 text-black font-bold py-3 px-6 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'GENERATING...' : 'TRANSMIT TO SUNO AI'}
          </button>
          
          {songUrl && (
            <div className="mt-4">
              <p className="mb-2">Song Generated:</p>
              <audio controls className="w-full">
                <source src={songUrl} type="audio/mpeg" />
              </audio>
              <a
                href={songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-center border border-green-400 p-2 hover:bg-green-400 hover:bg-opacity-10"
              >
                Open Song Link
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .glitch-text {
          text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                      -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
                      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitch 500ms infinite;
        }

        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                        -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
                        0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                        -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
                        0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                        0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                        0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                        0.05em 0 0 rgba(0, 255, 0, 0.75),
                        0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                        0.05em 0 0 rgba(0, 255, 0, 0.75),
                        0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
                        -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }
      `}</style>
    </div>
  );
}
