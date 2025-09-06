import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Extracts JWT token from request headers or cookies.
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // 1️⃣ Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    console.log("Token extracted from Authorization header");
    return authHeader.split(" ")[1].trim();
  }

  // 2️⃣ Check Supabase cookie (for SSR or session-based auth)
  const cookieToken = request.cookies.get("sb-access-token")?.value;
  if (cookieToken) {
    console.log("Token extracted from cookie");
    return cookieToken;
  }

  console.log("No token found in request");
  return null;
}

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Get token from request
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    // 2️⃣ Create Supabase client with service role for secure user fetch
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 3️⃣ Get Supabase user from JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("Supabase auth.getUser error:", userError);
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    // 4️⃣ Fetch additional profile info (RLS bypass)
    const { data: profileUser, error: profileError } = await supabase
      .from("users")
      .select("username, bio, avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError || !profileUser) {
      console.error("Supabase profile fetch failed:", profileError?.message);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // 5️⃣ Return combined user info
    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: profileUser.username,
      bio: profileUser.bio,
      avatar_url: profileUser.avatar_url,
    });
  } catch (error: any) {
    console.error("Unexpected error in /api/auth/session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
