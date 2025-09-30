const rateLimitMap = new Map();

export function rateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get existing requests for this identifier
  const requests = rateLimitMap.get(identifier) || [];
  
  // Filter out old requests outside the window
  const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart);
  
  // Check if rate limit exceeded
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  
  return true;
}

export function getRateLimitInfo(identifier: string, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const requests = rateLimitMap.get(identifier) || [];
  const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart);
  
  return {
    remaining: Math.max(0, 5 - recentRequests.length),
    resetTime: windowStart + windowMs,
  };
}

