const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 4000;

app.get('/api/flights', async (req, res) => {
  const API_URL = 'https://opensky-network.org/api/states/all';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      return res.status(response.status).json({ error: `API error: ${response.statusText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from OpenSky API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});