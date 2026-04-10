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
    ['LV', 'Argentina'],
    ['LQ', 'Argentina'],
  ];

  for (const [prefix, country] of prefixMap) {
    if (code.startsWith(prefix)) {
      return country;
    }
  }

  return 'Unknown';
}

export async function fetchFlights() {
  // Use a wider global region so the app includes flights beyond the U.S.
  const API_URL = 'https://api.adsb.lol/v2/lat/0/lon/0/dist/7000';

  const response = await fetch(API_URL, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}: ${text}`);
  }

  const data = await response.json();
  if (!data.ac || !Array.isArray(data.ac) || data.ac.length === 0) {
    throw new Error('No flight data available.');
  }

  return data.ac.slice(0, 20).map((flight) => {
    const speedKts = Math.round(flight.gs || 0);
    const speedKmh = Math.round(speedKts * 1.852);

    return {
      callsign: (flight.flight || flight.r || flight.hex || 'N/A').toString().trim(),
      country: registrationToCountry(flight.r),
      speedKts,
      speedKmh,
      altitude: Math.round(flight.alt_baro || 0),
      lat: flight.lat || 0,
      lon: flight.lon || 0,
    };
  });
}