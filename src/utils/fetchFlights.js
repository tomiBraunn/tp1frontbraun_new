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

  // Calculate distance from origin (0, 0)
  const calculateDistance = (lat, lon) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat * Math.PI) / 180;
    const dLon = (lon * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(0) * Math.cos(dLat) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Category mapping
  const getCategoryLabel = (category) => {
    const categoryMap = {
      'A0': 'Unknown',
      'A1': 'Small',
      'A2': 'Small',
      'A3': 'Medium',
      'A4': 'Large',
      'A5': 'Large',
      'A6': 'Large',
      'B0': 'Unknown',
      'B1': 'Small',
      'B2': 'Small',
      'B3': 'Medium',
      'B4': 'Large',
      'B5': 'Large',
      'B6': 'Large',
      'B7': 'Very Large',
    };
    return categoryMap[category] || 'Unknown';
  };

  return data.ac.map((flight) => {
    const speedKts = Math.round(flight.gs || 0);
    const speedKmh = Math.round(speedKts * 1.852);
    const distance = calculateDistance(flight.lat || 0, flight.lon || 0);
    const baroRate = flight.baro_rate || 0;
    const trackMovement = baroRate > 0 ? '↑' : baroRate < 0 ? '↓' : '→';

    return {
      callsign: (flight.flight || flight.r || flight.hex || 'N/A').toString().trim(),
      registration: flight.r || 'Unknown',
      country: registrationToCountry(flight.r),
      speedKts,
      speedKmh,
      altitude: Math.round(flight.alt_baro || 0),
      lat: flight.lat || 0,
      lon: flight.lon || 0,
      track: Math.round(flight.track || 0),
      baroRate: Math.round(Math.abs(baroRate)),
      trackMovement,
      squawk: flight.squawk || 'N/A',
      distance,
      category: getCategoryLabel(flight.category),
    };
  });
}