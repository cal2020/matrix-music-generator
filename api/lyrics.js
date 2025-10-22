export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY not configured',
      message: 'Please add ANTHROPIC_API_KEY to your Vercel environment variables'
    });
  }

  try {
    const { headlines } = req.body;

    if (!headlines || !Array.isArray(headlines) || headlines.length === 0) {
      return res.status(400).json({ error: 'Headlines array is required' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are a creative songwriter. Based on these news headlines, write original, artistic song lyrics that capture the essence and emotion of the stories. The lyrics should be poetic, singable, and emotionally resonant.\n\nHeadlines:\n${headlines.join('\n')}\n\nWrite complete song lyrics (verses and chorus):`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Claude API error:', response.status, data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error generating lyrics:', error.message, error.stack);
    return res.status(500).json({
      error: 'Failed to generate lyrics',
      message: error.message
    });
  }
}
