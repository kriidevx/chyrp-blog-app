// app/api/auth/session/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Your Supabase project credentials (use anon or service role key as appropriate)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Get user info from token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch profile details from your users table
    const { data: profileUser, error: profileError } = await supabase
      .from("users")
      .select("username, bio, avatar_url, email")
      .eq("id", user.id)
      .single();

    if (profileError || !profileUser) {
      return NextResponse.json({ error: "Failed to get user profile" }, { status: 500 });
    }

    // Return combined user and profile details
    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: profileUser.username,
      bio: profileUser.bio,
      avatar_url: profileUser.avatar_url,
    });
  } catch (error) {
    console.error("Error in auth/session API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
