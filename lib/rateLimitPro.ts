import connectDB from './mongodb';
import mongoose from 'mongoose';

// Rate limit schema for persistent storage
const rateLimitSchema = new mongoose.Schema({
  identifier: { type: String, required: true, index: true },
  requests: [{ type: Date, index: true }],
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-expire after 1 hour
});

const RateLimit = mongoose.models.RateLimit || mongoose.model('RateLimit', rateLimitSchema);

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
}

export class ProfessionalRateLimit {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    try {
      await connectDB();
      
      const now = new Date();
      const windowStart = new Date(now.getTime() - this.config.windowMs);

      // Find or create rate limit record
      let rateLimitRecord = await RateLimit.findOne({ identifier });
      
      if (!rateLimitRecord) {
        rateLimitRecord = new RateLimit({ identifier, requests: [] });
      }

      // Filter out old requests outside the window
      const recentRequests = rateLimitRecord.requests.filter(
        (timestamp: Date) => timestamp > windowStart
      );

      // Check if rate limit exceeded
      const allowed = recentRequests.length < this.config.maxRequests;
      const remaining = Math.max(0, this.config.maxRequests - recentRequests.length);
      const resetTime = new Date(now.getTime() + this.config.windowMs);

      if (allowed) {
        // Add current request
        recentRequests.push(now);
        rateLimitRecord.requests = recentRequests;
        await rateLimitRecord.save();
      }

      return { allowed, remaining, resetTime };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request if rate limiting fails
      return { 
        allowed: true, 
        remaining: this.config.maxRequests - 1, 
        resetTime: new Date(Date.now() + this.config.windowMs) 
      };
    }
  }
}

// Pre-configured rate limiters for different endpoints
export const loginRateLimit = new ProfessionalRateLimit({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000 // 15 minutes
});

export const createPartyRateLimit = new ProfessionalRateLimit({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000 // 1 hour
});

export const createLFGRateLimit = new ProfessionalRateLimit({
  maxRequests: 15,
  windowMs: 60 * 60 * 1000 // 1 hour
});

export const generalAPIRateLimit = new ProfessionalRateLimit({
  maxRequests: 100,
  windowMs: 15 * 60 * 1000 // 15 minutes
});

// Helper function to get client identifier
export function getClientIdentifier(request: any, userId?: string): string {
  // Prefer user ID for authenticated requests
  if (userId) return `user:${userId}`;
  
  // Fall back to IP address
  const xff = request.headers.get('x-forwarded-for');
  const ip = xff ? xff.split(',')[0].trim() : (request.ip || 'unknown');
  return `ip:${ip}`;
}
