import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Since all functionality is now on the main page, we don't need complex middleware
  // Just allow all requests to pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - ranks (rank images)
     * - patterns (background patterns)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|ranks|patterns).*)',
  ],
};
