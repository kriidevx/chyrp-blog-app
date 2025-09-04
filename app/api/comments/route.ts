// app/api/comments/route.ts
// Purpose: Handle post comments
// - GET: Fetch all comments for a given post (requires ?post_id=...)
// - POST: Add a new comment to a post (requires auth token)
// Implementation Notes:
//   • Comments are tied to posts by post_id
//   • Only authenticated users may create comments
//   • You may later extend this with pagination or nested replies

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET comments for a specific post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id");

    if (!postId) {
      return NextResponse.json({ error: "post_id is required" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("comments")
      .select("id, content, user_id, post_id, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments: data });
  } catch (err) {
    console.error("Error fetching comments:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST create a new comment
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { post_id, content } = body;

    if (!post_id || !content) {
      return NextResponse.json(
        { error: "post_id and content are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id, content, user_id: user.id }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: data });
  } catch (err) {
    console.error("Error creating comment:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
