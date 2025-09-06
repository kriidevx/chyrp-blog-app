// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Fetch posts with user, category, tags, likes & comments count
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
        tags:post_tags(
          tag:tags(name)
        ),
        likes:likes(id),
        comments:comments(id)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Format the data for FeedPage
    const formattedPosts = posts?.map((post: any) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      view_count: post.view_count || 0,
      feather_type: post.feather_type || "default",
      created_at: post.created_at,
      author: post.users?.username,
      category: post.categories?.name,
      tags: post.tags?.map((t: any) => t.tag.name) || [],
      like_count: post.likes?.length || 0,
      comment_count: post.comments?.length || 0,
      image: null, // can later fetch from post_media if needed
    }));

    return NextResponse.json(formattedPosts);
  } catch (err: any) {
    console.error("Supabase fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
