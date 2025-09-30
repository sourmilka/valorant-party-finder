// Mock ping data for demonstration
// In a real app, you would ping actual servers
export const getMockPing = (server: string): number => {
  const pingData: { [key: string]: number } = {
    // North America (NA)
    'Chicago, IL (USA)': Math.floor(Math.random() * 20) + 15, // 15-35ms
    'Los Angeles, CA (USA)': Math.floor(Math.random() * 30) + 25, // 25-55ms
    'New York, NY (USA)': Math.floor(Math.random() * 25) + 20, // 20-45ms
    'Dallas, TX (USA)': Math.floor(Math.random() * 20) + 18, // 18-38ms
    'Phoenix, AZ (USA)': Math.floor(Math.random() * 25) + 22, // 22-47ms
    
    // Latin America North (LATAM North)
    'Miami, FL (USA)': Math.floor(Math.random() * 30) + 25, // 25-55ms
    'Mexico City, Mexico': Math.floor(Math.random() * 40) + 35, // 35-75ms
    
    // Brazil (BR)
    'São Paulo, Brazil': Math.floor(Math.random() * 50) + 45, // 45-95ms
    'Rio de Janeiro, Brazil': Math.floor(Math.random() * 55) + 50, // 50-105ms
    
    // EMEA (Europe/Middle East/North Africa)
    'Frankfurt, Germany': Math.floor(Math.random() * 60) + 55, // 55-115ms
    'London, UK': Math.floor(Math.random() * 65) + 60, // 60-125ms
    'Paris, France': Math.floor(Math.random() * 62) + 58, // 58-120ms
    'Madrid, Spain': Math.floor(Math.random() * 68) + 62, // 62-130ms
    'Warsaw, Poland': Math.floor(Math.random() * 70) + 65, // 65-135ms
    'Stockholm, Sweden': Math.floor(Math.random() * 75) + 70, // 70-145ms
    'Manama, Bahrain': Math.floor(Math.random() * 80) + 75, // 75-155ms
    'Cape Town, South Africa': Math.floor(Math.random() * 100) + 90, // 90-190ms
    
    // Asia-Pacific (APAC)
    'Mumbai, India': Math.floor(Math.random() * 90) + 80, // 80-170ms
    'Singapore': Math.floor(Math.random() * 85) + 75, // 75-160ms
    'Hong Kong': Math.floor(Math.random() * 80) + 70, // 70-150ms
    'Tokyo, Japan': Math.floor(Math.random() * 75) + 65, // 65-140ms
    'Seoul, South Korea': Math.floor(Math.random() * 70) + 60, // 60-130ms
    'Sydney, Australia': Math.floor(Math.random() * 95) + 85, // 85-180ms
    
    // China
    'Tianjin': Math.floor(Math.random() * 120) + 100, // 100-220ms
    'Nanjing': Math.floor(Math.random() * 125) + 105, // 105-230ms
    'Chongqing': Math.floor(Math.random() * 130) + 110, // 110-240ms
    'Guangzhou': Math.floor(Math.random() * 115) + 95, // 95-210ms
  };
  
  return pingData[server] || Math.floor(Math.random() * 50) + 30;
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
