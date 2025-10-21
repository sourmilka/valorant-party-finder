import { NextResponse } from 'next/server';

export interface APIError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded', public resetTime?: Date) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string = 'Database operation failed') {
    super(message);
    this.name = 'DatabaseError';
  }
}

export function handleAPIError(error: any): NextResponse {
  // Log error for monitoring (in production, use proper logging service)
  console.error('API Error:', {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: 'VALIDATION_ERROR',
        details: error.details
      },
      { status: 400 }
    );
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: 'AUTHENTICATION_ERROR'
      },
      { status: 401 }
    );
  }

  if (error instanceof RateLimitError) {
    const headers: Record<string, string> = {
      'X-RateLimit-Policy': 'Enforced'
    };
    
    if (error.resetTime) {
      headers['X-RateLimit-Reset'] = error.resetTime.toISOString();
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: 'RATE_LIMIT_ERROR',
        resetTime: error.resetTime
      },
      { status: 429, headers }
    );
  }

  if (error instanceof DatabaseError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database operation failed. Please try again later.',
        code: 'DATABASE_ERROR'
      },
      { status: 500 }
    );
  }

  // Handle MongoDB validation errors
  if (error.name === 'ValidationError' && error.errors) {
    const details = Object.values(error.errors).map((e: any) => ({
      field: e.path,
      message: e.message
    }));
    
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details
      },
      { status: 400 }
    );
  }

  // Handle MongoDB duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return NextResponse.json(
      {
        success: false,
        error: `${field} already exists`,
        code: 'DUPLICATE_ERROR'
      },
      { status: 409 }
    );
  }

  // Generic server error (don't expose internal details)
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error. Please try again later.',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  );
}

// Utility function to validate required fields
export function validateRequiredFields(data: any, requiredFields: string[]): void {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new ValidationError(
      `Required fields missing: ${missing.join(', ')}`,
      { missingFields: missing }
    );
  }
}

// Utility function to sanitize user input
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, ''); // Basic XSS prevention
}
