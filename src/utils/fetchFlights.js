function registrationToCountry(reg) {
  if (!reg) return 'Unknown';
  const code = reg.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const prefixMap = [
    ['N', 'United States'],
    ['C', 'Canada'],
    ['G', 'United Kingdom'],
    ['F', 'France'],
    ['D', 'Germany'],
    ['OE', 'Austria'],
    ['VH', 'Australia'],
    ['JA', 'Japan'],
    ['S', 'Brazil'],
    ['PH', 'Netherlands'],
    ['EI', 'Ireland'],
    ['VP', 'Bermuda'],
  ];

  for (const [prefix, country] of prefixMap) {
    if (code.startsWith(prefix)) {
      return country;
    }
  }

  return 'Unknown';
}

export async function fetchFlights() {
  const target = 'https://api.adsb.lol/v2/point/40/-74/150';
  const API_URL = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`;

  const response = await fetch(API_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.ac || !Array.isArray(data.ac) || data.ac.length === 0) {
    throw new Error('No flight data available.');
  }

  return data.ac.slice(0, 20).map((flight) => ({
    callsign: (flight.flight || flight.r || flight.hex || 'N/A').toString().trim(),
    country: registrationToCountry(flight.r),
    speed: Math.round(flight.gs || 0),
    altitude: Math.round(flight.alt_baro || 0),
  }));
}