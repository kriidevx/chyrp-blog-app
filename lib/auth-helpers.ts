import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client with anon key (safe for server-side use)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Extract JWT token from request
 * Supports:
 * - Authorization header: "Bearer <token>"
 * - Supabase cookie: sb-access-token
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // 1. Try Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // 2. Try Supabase cookie
  const cookie = request.cookies.get("sb-access-token")?.value;
  if (cookie) {
    try {
      const parsed = JSON.parse(cookie); // cookie may be JSON string
      if (parsed?.access_token) return parsed.access_token;
    } catch {
      // cookie might be plain string token
      return cookie;
    }
  }

  return null;
}

/**
 * Returns authenticated user from request
 * Returns null if user is not authenticated or token is invalid
 */
export async function getUserFromRequest(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error("Supabase auth error:", error?.message);
    return null;
  }

  return user;
}
