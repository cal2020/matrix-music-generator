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

  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    console.error('SUNO_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'SUNO_API_KEY not configured',
      message: 'Please add SUNO_API_KEY to your Vercel environment variables'
    });
  }

  try {
    const { lyrics } = req.body;

    if (!lyrics) {
      return res.status(400).json({ error: 'Lyrics are required' });
    }

    // Use SunoAPI.org endpoint (correct third-party provider)
    const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        custom_mode: true,
        prompt: lyrics,
        title: 'Matrix Music Generation',
        tags: 'pop, electronic',
        make_instrumental: false,
        model: 'V3_5'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Suno API error:', response.status, data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error generating song:', error.message, error.stack);
    return res.status(500).json({
      error: 'Failed to generate song',
      message: error.message
    });
  }
}
