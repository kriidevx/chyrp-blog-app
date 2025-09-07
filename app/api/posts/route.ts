import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET(req: NextRequest) {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        excerpt,
        slug,
        view_count,
        feather_type,
        created_at,
        user_id,
        category_id,
        users!inner(username),
        categories!left(name),
        post_tags (
          tags: tags(name)
        ),
        likes(id),
        comments(id)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedPosts = (posts ?? []).map((post: any) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      view_count: post.view_count || 0,
      feather_type: post.feather_type || "default",
      created_at: post.created_at,
      author: post.users?.username ?? null,
      category: post.categories?.name ?? null,
      tags: Array.isArray(post.post_tags)
        ? post.post_tags.map((t: any) => t.tags?.name).filter(Boolean)
        : [],
      like_count: Array.isArray(post.likes) ? post.likes.length : 0,
      comment_count: Array.isArray(post.comments) ? post.comments.length : 0,
      image: null, // placeholder for future media fetching
    }));

    return NextResponse.json(formattedPosts);
  } catch (err: any) {
    console.error("Supabase fetch error:", err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}
