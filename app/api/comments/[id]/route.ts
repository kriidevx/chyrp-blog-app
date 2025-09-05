// app/api/comments/[id]/route.ts
// Purpose: Delete a specific comment
// - DELETE: Remove a comment by ID
// Implementation Notes:
//   • Only the comment author OR the post author can delete the comment
//   • Requires auth token
//   • Useful for moderation and user control

import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check for authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    // Verify user
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = params.id;

    // Fetch comment
    const { data: comment, error: commentError } = await supabaseAdmin
      .from("comments")
      .select("id, user_id, post_id")
      .eq("id", commentId)
      .single();

    if (commentError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Fetch post to check author
    const { data: post, error: postError } = await supabaseAdmin
      .from("posts")
      .select("user_id")
      .eq("id", comment.post_id)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Permission check
    if (comment.user_id !== user.id && post.user_id !== user.id) {
      return NextResponse.json(
        { error: "You are not allowed to delete this comment" },
        { status: 403 }
      );
    }

    // Delete comment
    const { error: deleteError } = await supabaseAdmin
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
