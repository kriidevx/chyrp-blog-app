/**
 * API Route: /api/posts
 *
 * Purpose:
 * - Fetch a paginated list of published posts for the main feed.
 *
 * Methods:
 * - GET → Returns posts with optional filtering by category, tag, and search query.
 *
 * Query Parameters:
 * - category: string (slug of category to filter by)
 * - tag: string (slug of tag to filter by)
 * - q: string (search query for post title)
 * - page: number (default: 1)
 * - limit: number (default: 10)
 *
 * Returns:
 * - JSON object containing posts[], page, limit, hasMore.
 *
 * Implementation Guidelines:
 * - Always fetch only published posts (`published = true`).
 * - Joins users, categories, and tags for display metadata.
 * - Uses pagination with `.range(offset, offset + limit - 1)`.
 * - Extendable for trending feed by adding order("view_count", { ascending: false }).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("posts")
      .select(
        `
        id, title, slug, excerpt, created_at, view_count,
        users(id, username, avatar_url),
        categories(name, slug),
        post_tags(tags(name, slug))
      `
      )
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) query = query.eq("categories.slug", category);
    if (tag) query = query.eq("post_tags.tags.slug", tag);
    if (q) query = query.ilike("title", `%${q}%`);

    const { data: posts, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      posts,
      page,
      limit,
      hasMore: posts.length === limit,
    });
  } catch (err) {
    console.error("Error in GET /api/posts:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
