import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

/**
 * Result of an authentication check.
 * Either contains the authenticated user, or a pre-built 401 response.
 */
export type AuthResult =
  | { authenticated: true; user: User }
  | { authenticated: false; response: NextResponse };

/**
 * Verifies that the current request has a valid Supabase session.
 * Use this at the top of any API route handler that requires authentication.
 *
 * @example
 * ```ts
 * export async function GET(req: Request) {
 *   const auth = await requireAuth();
 *   if (!auth.authenticated) return auth.response;
 *
 *   // auth.user is available here
 *   const userId = auth.user.id;
 *   // ... rest of handler
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { success: false, error: 'Authentication required.' },
          { status: 401 }
        ),
      };
    }

    return { authenticated: true, user };
  } catch {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Authentication required.' },
        { status: 401 }
      ),
    };
  }
}
