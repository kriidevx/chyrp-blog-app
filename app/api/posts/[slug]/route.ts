import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function getSlug(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  return segments[segments.length - 1];
}

async function incrementViewCount(postId: string) {
  const { error } = await supabase.rpc("increment_post_view_count", {
    post_id: postId,
  });
  if (error) {
    console.error("Error incrementing view count:", error);
  }
}

export async function GET(req: NextRequest) {
  const slug = getSlug(req);
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    // Optionally get currentUser from auth token if needed (omitted here - add if required)

    // Fetch post with related data
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(
        `
        *,
        users!inner(id, username, avatar_url),
        categories!inner(id, name),
        comments(
          id,
          user_id,
          content,
          created_at,
          users!inner(id, username, avatar_url),
          comment_likes(id, user_id)
        )
      `
      )
      .eq("slug", slug)
      .maybeSingle();

    if (postError) {
      console.error("Post fetch error:", postError);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (!postData) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check access permission (assuming no user object here, handle as needed)
    if (!postData.published /* && user check here if applicable */) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Parallel queries for likes and tags
    const [likeCountResult, tagsResult] = await Promise.all([
      supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postData.id),
      supabase
        .from("post_tags")
        .select("tags!inner(name)")
        .eq("post_id", postData.id),
    ]);

    if (likeCountResult.error) {
      console.error("Likes count error:", likeCountResult.error);
      return NextResponse.json(
        { error: "Failed to fetch likes" },
        { status: 500 }
      );
    }
    if (tagsResult.error) {
      console.error("Tags fetch error:", tagsResult.error);
      return NextResponse.json(
        { error: "Failed to fetch tags" },
        { status: 500 }
      );
    }

    const totalLikes = likeCountResult.count || 0;
    const tags = tagsResult.data?.map((t: any) => t.tags.name) || [];

    // Fetch navigation posts
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
        .maybeSingle(),
    ]);

    // Fetch mentioned users
    const { data: mentionedUsers, error: mentionedError } = await supabase
      .from("webmentions")
      .select("users!inner(id, username, avatar_url)")
      .eq("target_post_id", postData.id);

    if (mentionedError) {
      console.error("Mentioned users fetch error:", mentionedError);
    }

    const mentioned =
      mentionedUsers?.map((m: any) => ({
        id: m.users.id,
        username: m.users.username,
        avatar_url: m.users.avatar_url,
        name: m.users.username,
      })) || [];

    // Transform post authors and comments users to single objects (not arrays)
    const transformedPost = {
      ...postData,
      users: Array.isArray(postData.users) ? postData.users[0] : postData.users,
      tags,
      category_name: postData.categories?.name || "",
      likes: totalLikes,
    };

    const transformedComments =
      postData.comments?.map((comment: any) => ({
        ...comment,
        users: Array.isArray(comment.users) ? comment.users[0] : comment.users,
      })) || [];

    // Increment view count asynchronously, don't await
    if (postData.published) {
      void incrementViewCount(postData.id);
    }

    return NextResponse.json({
      post: { ...transformedPost, comments: transformedComments },
      prevPost: prevPostResult.data || null,
      nextPost: nextPostResult.data || null,
      mentioned,
      // Omit currentUser from this example; add if needed
      likedByUser: false, // TODO: implement currentUser like check if needed
    });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
