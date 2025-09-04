// app/api/reactions/route.ts
// Purpose: Handle emoji reactions on posts
// - POST: Add a reaction (emoji) to a post
// - DELETE: Remove a reaction
// - GET: Get reaction counts for a post
// Implementation Notes:
//   • Requires auth for POST/DELETE
//   • Uses `reactions` table with (post_id, user_id, reaction_type)
//   • Supports multiple reaction types per post (e.g., 👍, ❤️, 😂)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ✅ POST - Add a reaction
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

    const { post_id, reaction_type } = await request.json();
    if (!post_id || !reaction_type) {
      return NextResponse.json({ error: "Missing post_id or reaction_type" }, { status: 400 });
    }

    // Check if reaction already exists
    const { data: existingReaction } = await supabase
      .from("reactions")
      .select("id")
      .eq("post_id", post_id)
      .eq("user_id", user.id)
      .eq("reaction_type", reaction_type)
      .maybeSingle();

    if (existingReaction) {
      return NextResponse.json({ success: true, message: "Reaction already exists" });
    }

    // Add new reaction
    const { error: insertError } = await supabase
      .from("reactions")
      .insert([{ post_id, user_id: user.id, reaction_type }]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, added: true });
  } catch (err) {
    console.error("Error adding reaction:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE - Remove a reaction
export async function DELETE(request: NextRequest) {
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

    const { post_id, reaction_type } = await request.json();
    if (!post_id || !reaction_type) {
      return NextResponse.json({ error: "Missing post_id or reaction_type" }, { status: 400 });
    }

    // Delete reaction
    const { error: deleteError } = await supabase
      .from("reactions")
      .delete()
      .eq("post_id", post_id)
      .eq("user_id", user.id)
      .eq("reaction_type", reaction_type);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, removed: true });
  } catch (err) {
    console.error("Error removing reaction:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET - Get reactions summary for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get("post_id");

    if (!post_id) {
      return NextResponse.json({ error: "Missing post_id" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("reactions")
      .select("reaction_type")
      .eq("post_id", post_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Count reactions by type
    const counts: Record<string, number> = {};
    data?.forEach((row) => {
      counts[row.reaction_type] = (counts[row.reaction_type] || 0) + 1;
    });

    return NextResponse.json({ post_id, reactions: counts });
  } catch (err) {
    console.error("Error fetching reactions:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
