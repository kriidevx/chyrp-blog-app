import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getSlug(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

async function getCurrentUserFromToken(token: string) {
  if (!token) {
    return null;
  }
  
  try {
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: userData, error } = await supabaseAuth.auth.getUser(token);
    if (error) {
      console.error("Invalid token:", error);
      return null;
    }
    
    return userData.user;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

async function incrementViewCount(postId: string) {
  try {
    const { error } = await supabase
      .from("posts")
      .update({ view_count: supabase.sql`view_count + 1` })
      .eq("id", postId);
      
    if (error) {
      console.error("Error incrementing view count:", error);
    }
  } catch (error) {
    console.error("View count update failed:", error);
  }
}

export async function GET(req: NextRequest) {
  const slug = getSlug(req);
  
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    // Get current user from token
    const authHeader = req.headers.get("authorization");
    let currentUser = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      currentUser = await getCurrentUserFromToken(token);
    }

    const currentUserId = currentUser?.id;

    // Single optimized query to get post with all related data
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(`
        *,
        users!inner(id, username, avatar_url),
        categories(id, name),
        comments(
          id,
          user_id,
          content,
          created_at,
          users!inner(id, username, avatar_url),
          comment_likes(id, user_id)
        )
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (!postData || postError) {
      console.error("Post not found or error:", postError);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user can access this post
    const canAccess = postData.published || postData.user_id === currentUserId;
    if (!canAccess) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get like count and user's like status in parallel
    const [likeCountResult, userLikeResult, tagsResult] = await Promise.all([
      // Get total like count
      supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postData.id),
      
      // Check if current user liked this post
      currentUserId ? supabase
        .from("likes")
        .select("id")
        .eq("post_id", postData.id)
        .eq("user_id", currentUserId)
        .maybeSingle() : Promise.resolve({ data: null }),
      
      // Get post tags
      supabase
        .from("post_tags")
        .select("tags!inner(name)")
        .eq("post_id", postData.id)
    ]);

    const totalLikes = likeCountResult.count || 0;
    const likedByUser = !!userLikeResult.data;
    const tags = tagsResult.data?.map((t: any) => t.tags.name) || [];

    // Get navigation posts (previous and next)
    const [prevPostResult, nextPostResult] = await Promise.all([
      supabase
        .from("posts")
        .select("title, slug")
        .eq("published", true)
        .lt("created_at", postData.created_at)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      
      supabase
        .from("posts")
        .select("title, slug")
        .eq("published", true)
        .gt("created_at", postData.created_at)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()
    ]);

    // Get mentioned users
    const { data: mentionedUsers } = await supabase
      .from("webmentions")
      .select("users!inner(id, username, avatar_url)")
      .eq("target_post_id", postData.id);

    const mentioned = mentionedUsers?.map((m: any) => ({
      id: m.users.id,
      username: m.users.username,
      avatar_url: m.users.avatar_url,
      name: m.users.username,
    })) || [];

    // Transform users field to single object instead of array
    const transformedPost = {
      ...postData,
      users: Array.isArray(postData.users) ? postData.users[0] : postData.users,
      tags,
      category_name: postData.categories?.name || "",
      likes: totalLikes,
    };

    // Transform comments to ensure users is a single object
    const transformedComments = postData.comments?.map((comment: any) => ({
      ...comment,
      users: Array.isArray(comment.users) ? comment.users[0] : comment.users,
    })) || [];

    // Increment view count asynchronously (don't wait for it)
    if (postData.published) {
      incrementViewCount(postData.id);
    }

    const response = {
      post: { 
        ...transformedPost, 
        comments: transformedComments 
      },
      prevPost: prevPostResult.data || null,
      nextPost: nextPostResult.data || null,
      mentioned,
      user: currentUser,
      likedByUser
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" }, 
      { status: 500 }
    );
  }
}