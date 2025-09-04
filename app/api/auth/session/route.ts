/**
 * Auth Session API
 *
 * GET → Returns the authenticated user’s profile (from `users` table)
 * based on the Supabase auth JWT.
 *
 * Implementation Guidelines:
 * - Uses `getUserFromRequest` helper for auth.
 * - Returns combined user info (id, email, username, bio, avatar).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserFromRequest } from "@/lib/auth-helpers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch profile details from your users table
    const { data: profileUser, error: profileError } = await supabase
      .from("users")
      .select("username, bio, avatar_url, email")
      .eq("id", user.id)
      .single();

    if (profileError || !profileUser) {
      return NextResponse.json(
        { error: "Failed to get user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: profileUser.username,
      bio: profileUser.bio,
      avatar_url: profileUser.avatar_url,
    });
  } catch (error) {
    console.error("Error in auth/session API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
