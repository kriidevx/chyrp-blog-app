// app/api/likes/route.ts
// Purpose: Handle post likes (toggle like/unlike)
// - POST: Toggle like for a post (add if not exists, remove if already liked)
// - GET: Get like count for a post
// Implementation Notes:
//   • Requires auth token for POST
//   • Uses `likes` table with (post_id, user_id)
//   • Useful for engagement metrics

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ✅ POST - toggle like/unlike
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { post_id } = await request.json();
    if (!post_id) {
      return NextResponse.json({ error: "Missing post_id" }, { status: 400 });
    }

    // Check if like exists
    const { data: existingLike } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", post_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingLike) {
      // Unlike
      const { error: unlikeError } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);

      if (unlikeError) {
        return NextResponse.json({ error: unlikeError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, liked: false });
    } else {
      // Like
      const { error: likeError } = await supabase
        .from("likes")
        .insert([{ post_id, user_id: user.id }]);

      if (likeError) {
        return NextResponse.json({ error: likeError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, liked: true });
    }
  } catch (err) {
    console.error("Error toggling like:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET - fetch like count for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get("post_id");

    if (!post_id) {
      return NextResponse.json({ error: "Missing post_id" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { count, error } = await supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post_id, like_count: count ?? 0 });
  } catch (err) {
    console.error("Error fetching like count:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
