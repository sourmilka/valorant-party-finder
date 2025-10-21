import { SERVERS } from './constants';

// Valorant server options organized by region
export const serverOptions = {
  'North America (NA)': [
    'Chicago, IL (USA)',
    'Los Angeles, CA (USA)',
    'New York, NY (USA)',
    'Dallas, TX (USA)',
    'Phoenix, AZ (USA)'
  ],
  'Latin America North (LATAM North)': [
    'Miami, FL (USA)',
    'Mexico City, Mexico'
  ],
  'Brazil (BR)': [
    'São Paulo, Brazil',
    'Rio de Janeiro, Brazil'
  ],
  'EMEA (Europe/Middle East/North Africa)': [
    'Frankfurt, Germany',
    'London, UK',
    'Paris, France',
    'Madrid, Spain',
    'Warsaw, Poland',
    'Stockholm, Sweden',
    'Manama, Bahrain',
    'Cape Town, South Africa'
  ],
  'Asia-Pacific (APAC)': [
    'Mumbai, India',
    'Singapore',
    'Hong Kong',
    'Tokyo, Japan',
    'Seoul, South Korea',
    'Sydney, Australia'
  ],
  'China': [
    'Tianjin',
    'Nanjing',
    'Chongqing',
    'Guangzhou'
  ]
};

// Flatten all servers into a single array
export const allServers = SERVERS;

// Helper function to get region from server
export const getRegionFromServer = (server: string): string => {
  for (const [region, servers] of Object.entries(serverOptions)) {
    if (servers.includes(server)) {
      return region;
    }
  }
  return 'Unknown';
};
