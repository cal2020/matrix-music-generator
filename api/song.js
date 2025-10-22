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
    return res.status(500).json({ error: 'SUNO_API_KEY not configured' });
  }

  try {
    const { lyrics } = req.body;

    if (!lyrics) {
      return res.status(400).json({ error: 'Lyrics are required' });
    }

    const response = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        lyrics: lyrics,
        make_instrumental: false,
        wait_audio: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error generating song:', error);
    return res.status(500).json({ error: 'Failed to generate song' });
  }
}
