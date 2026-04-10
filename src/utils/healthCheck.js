export async function checkApiHealth() {
  const targetUrl = 'https://opensky-network.org/api/states/all';
  const API_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

  try {
    const response = await fetch(API_URL);
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}