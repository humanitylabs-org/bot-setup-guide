// Vercel serverless function: /api/hostinger
// Proxies Hostinger API to avoid CORS issues

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, method, path, body } = req.body;

  if (!apiKey || !method || !path) {
    return res.status(400).json({ error: 'Missing required fields: apiKey, method, path' });
  }

  try {
    const url = `https://api.hostinger.com${path}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    
    // Pass through status and data
    res.status(response.status).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
