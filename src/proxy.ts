import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// Rate Limiting (in-memory, per-IP sliding window)
// =============================================================================
// NOTE: In-memory rate limiting resets on server restart and does not share
// state across serverless function instances. For production at scale, consider
// using Redis (e.g., Upstash) or a dedicated rate-limiting service.

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 50;      // max requests per window per IP

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Periodically clean up stale entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    entry.timestamps = entry.timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000); // cleanup every minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { timestamps: [now] });
    return false;
  }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  entry.timestamps.push(now);

  return entry.timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

// =============================================================================
// CSRF / Origin Checking
// =============================================================================

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // In development, allow requests without origin (e.g., from curl/Postman)
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const allowedHost = request.headers.get('host');
  if (!allowedHost) return false;

  // Check if the Origin header matches our host
  if (origin) {
    try {
      const originUrl = new URL(origin);
      return originUrl.host === allowedHost;
    } catch {
      return false;
    }
  }

  // Fall back to Referer header
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return refererUrl.host === allowedHost;
    } catch {
      return false;
    }
  }

  // No origin or referer — reject in production
  return false;
}

// =============================================================================
// Proxy
// =============================================================================

// Routes that require authentication (business-owner-only endpoints)
const PROTECTED_PREFIXES = [
  '/api/reports',
  '/api/reviews/request',
  '/api/generate-blog',
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting, CSRF, and auth to API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // --- Rate Limiting ---
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '127.0.0.1';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // --- Auth cookie fast-fail for protected routes ---
  if (isProtectedRoute(pathname)) {
    // Check if any Supabase auth cookie is present.
    // This is a fast-fail optimization — the real verification happens in
    // requireAuth() inside the route handler via supabase.auth.getUser().
    const cookies = request.cookies.getAll();
    const hasAuthCookie = cookies.some(c =>
      c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    );

    if (!hasAuthCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.' },
        { status: 401 }
      );
    }
  }

  // --- CSRF / Origin protection for mutations ---
  const method = request.method.toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    if (!isValidOrigin(request)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: invalid origin.' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
