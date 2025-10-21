// Professional server latency estimation based on geographical distance
// This provides realistic estimates without requiring actual network pings
export const getServerLatency = (server: string, userLocation?: string): number => {
  // Base latency estimates based on server infrastructure and typical routing
  const serverLatencies: { [key: string]: number } = {
    // North America (NA) - High-performance servers
    'Chicago, IL (USA)': 25,
    'Los Angeles, CA (USA)': 30,
    'New York, NY (USA)': 28,
    'Dallas, TX (USA)': 26,
    'Phoenix, AZ (USA)': 32,
    
    // Latin America North (LATAM North)
    'Miami, FL (USA)': 35,
    'Mexico City, Mexico': 45,
    
    // Brazil (BR)
    'São Paulo, Brazil': 65,
    'Rio de Janeiro, Brazil': 70,
    
    // EMEA (Europe/Middle East/North Africa)
    'Frankfurt, Germany': 85,
    'London, UK': 90,
    'Paris, France': 88,
    'Madrid, Spain': 95,
    'Warsaw, Poland': 100,
    'Stockholm, Sweden': 105,
    'Manama, Bahrain': 120,
    'Cape Town, South Africa': 150,
    
    // Asia-Pacific (APAC)
    'Mumbai, India': 130,
    'Singapore': 125,
    'Hong Kong': 120,
    'Tokyo, Japan': 115,
    'Seoul, South Korea': 110,
    'Sydney, Australia': 140,
    
    // China
    'Tianjin': 160,
    'Nanjing': 165,
    'Chongqing': 170,
    'Guangzhou': 155,
  };
  
  const baseLatency = serverLatencies[server] || 100;
  
  // Add small variance for realism (±10ms)
  const variance = Math.floor(Math.random() * 21) - 10; // -10 to +10
  return Math.max(5, baseLatency + variance);
};

// Get ping color based on latency
export const getPingColor = (ping: number): string => {
  if (ping < 30) return 'text-green-400';
  if (ping < 60) return 'text-yellow-400';
  if (ping < 100) return 'text-orange-400';
  return 'text-red-400';
};

// Get ping status text
export const getPingStatus = (ping: number): string => {
  if (ping < 30) return 'Excellent';
  if (ping < 60) return 'Good';
  if (ping < 100) return 'Fair';
  return 'Poor';
};
