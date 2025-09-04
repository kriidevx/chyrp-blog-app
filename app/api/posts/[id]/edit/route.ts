// app/api/posts/[id]/edit/route.ts
// -------------------------------------------------------------
// Purpose:
//   Handles updating an existing post by ID.
//
// Endpoints:
//   PATCH /api/posts/[id]/edit
//     - Requires Authorization header with Bearer token
//     - Only the author of the post can update it
//
// Expected Request Body:
//   {
//     "title": "Updated title",        // optional
//     "content": "Updated content",    // optional
//     "published": true/false          // optional
//   }
//
// Implementation Guidelines:
//   - Verify token → identify user
//   - Ensure post belongs to authenticated user
//   - Allow partial updates (title, content, published)
//   - Regenerate slug if title changes
//   - Return updated post on success
// -------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json();
    const { title, content, published } = body;

    // Fetch existing post to check ownership
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("id, user_id, title, slug, content, published")
      .eq("id", params.id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prepare updates
    const updates: any = {};
    if (title && title !== existingPost.title) {
      updates.title = title;
      updates.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
    if (content) updates.content = content;
    if (published !== undefined) updates.published = published;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    // Update post
    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ post: updatedPost });
  } catch (err) {
    console.error("Error in PATCH /posts/[id]/edit:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
