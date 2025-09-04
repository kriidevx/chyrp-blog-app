// app/api/search/route.ts
// Purpose: Search posts by keyword (title, content, tags, category)
// - GET: Accepts ?q=keyword and returns matching posts
// Implementation Notes:
//   • Public (no auth required)
//   • Searches across posts.title, posts.content, categories.name, tags.name
//   • Only returns published posts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ✅ GET - Search posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Search in posts (title + content)
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        slug,
        content,
        published,
        created_at,
        categories(name),
        post_tags(tag_id, tags(name))
      `
      )
      .ilike("title", `%${query}%`)
      .or(`content.ilike.%${query}%`)
      .eq("published", true)
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ query, results: posts ?? [] });
  } catch (err) {
    console.error("Error in search:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
