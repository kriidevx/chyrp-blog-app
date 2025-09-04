/**
 * Auth Helpers
 *
 * Provides utility functions for extracting the logged-in user
 * from API requests using Supabase JWT tokens.
 *
 * Implementation Guidelines:
 * - Always call `getUserFromRequest(request)` in API routes
 *   that require authentication.
 * - Accepts JWT from either:
 *   - `Authorization: Bearer <token>` header, or
 *   - Supabase auth cookie (if you’re using SSR/session-based).
 * - Returns `null` if the user is not authenticated.
 */

import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Extracts JWT token from request (Authorization header or cookies).
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // 1. Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // 2. Check Supabase cookie
  const cookieToken = request.cookies.get("sb-access-token")?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Returns the authenticated Supabase user from the request.
 */
export async function getUserFromRequest(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return user;
}
