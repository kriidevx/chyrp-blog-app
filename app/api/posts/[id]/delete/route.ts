// app/api/posts/[id]/delete/route.ts
// Purpose: Deletes a post by its ID if the requester is the author.
// Implementation guidelines:
// - Auth required (Bearer token).
// - Only the post’s author can delete it.
// - If deleted, all related comments/likes/reactions remain (or you can cascade in DB).
// - Returns success or appropriate error.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
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

    const postId = params.id;

    // Fetch the post to check ownership
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("id, user_id")
      .eq("id", postId)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete this post" },
        { status: 403 }
      );
    }

    // Delete the post
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
