export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const results = {
    timestamp: new Date().toISOString(),
    environment_variables: {},
    api_tests: {}
  };

  // Check if environment variables are set
  results.environment_variables = {
    NEWS_API_KEY: process.env.NEWS_API_KEY ? '✓ Set' : '✗ Missing',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? '✓ Set' : '✗ Missing',
    SUNO_API_KEY: process.env.SUNO_API_KEY ? '✓ Set' : '✗ Missing',
  };

  // Test NewsAPI if key is set
  if (process.env.NEWS_API_KEY) {
    try {
      const newsResponse = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${process.env.NEWS_API_KEY}`
      );
      const newsData = await newsResponse.json();

      if (newsResponse.ok) {
        results.api_tests.NewsAPI = {
          status: '✓ Working',
          articles_found: newsData.totalResults || 0
        };
      } else {
        results.api_tests.NewsAPI = {
          status: '✗ Failed',
          error: newsData.message || 'Unknown error',
          status_code: newsResponse.status
        };
      }
    } catch (error) {
      results.api_tests.NewsAPI = {
        status: '✗ Error',
        error: error.message
      };
    }
  } else {
    results.api_tests.NewsAPI = '✗ Key not set';
  }

  // Test Anthropic API if key is set
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Say hi' }]
        })
      });

      const claudeData = await claudeResponse.json();

      if (claudeResponse.ok) {
        results.api_tests.Anthropic = {
          status: '✓ Working',
          model: claudeData.model || 'Unknown'
        };
      } else {
        results.api_tests.Anthropic = {
          status: '✗ Failed',
          error: claudeData.error?.message || 'Unknown error',
          status_code: claudeResponse.status
        };
      }
    } catch (error) {
      results.api_tests.Anthropic = {
        status: '✗ Error',
        error: error.message
      };
    }
  } else {
    results.api_tests.Anthropic = '✗ Key not set';
  }

  // Note about Suno API
  results.api_tests.SunoAI = process.env.SUNO_API_KEY
    ? '⚠ Key is set (not tested - endpoint may vary)'
    : '✗ Key not set';

  return res.status(200).json(results);
}
