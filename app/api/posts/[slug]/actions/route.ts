import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Use private environment variables for server side
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Validation schemas
const likeActionSchema = z.object({
  action: z.literal("like"),
});

const commentActionSchema = z.object({
  action: z.literal("comment"),
  content: z.string().min(1).max(1000),
});

const commentLikeActionSchema = z.object({
  action: z.literal("like_comment"),
  commentId: z.string().uuid(),
});

const reactionActionSchema = z.object({
  action: z.literal("reaction"),
  reactionId: z.string(),
});

const actionSchema = z.discriminatedUnion("action", [
  likeActionSchema,
  commentActionSchema,
  commentLikeActionSchema,
  reactionActionSchema,
]);

function getSlug(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  const slugIndex = segments.findIndex((segment) => segment === "actions") - 1;
  if (slugIndex < 0) return null;
  return segments[slugIndex];
}

async function getCurrentUserFromToken(token?: string) {
  if (!token) {
    return null;
  }
  try {
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabaseAuth.auth.getUser(token);
    if (error) {
      console.error("Invalid token:", error);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("id, user_id, published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }
  return data;
}

async function handleLikeAction(postId: string, userId: string) {
  const { data: existingLike, error: checkError } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (checkError) throw new Error("Error checking existing like");

  if (existingLike) {
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id);
    if (deleteError) throw new Error("Error removing like");
    return { liked: false, total_likes: await getLikeCount(postId) };
  } else {
    const { error: insertError } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });
    if (insertError) throw new Error("Error adding like");
    return { liked: true, total_likes: await getLikeCount(postId) };
  }
}

async function getLikeCount(postId: string) {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);
  if (error) throw new Error("Error getting like count");
  return count || 0;
}

async function handleCommentAction(
  postId: string,
  userId: string,
  content: string
) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      content: content.trim(),
    })
    .select(
      `
      *,
      users!inner(id, username, avatar_url),
      comment_likes(id, user_id)
    `
    )
    .single();

  if (error) throw new Error("Error creating comment");

  return {
    ...data,
    users: Array.isArray(data.users) ? data.users[0] : data.users,
  };
}

async function handleCommentLikeAction(commentId: string, userId: string) {
  const { data: existingLike, error: checkError } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (checkError) throw new Error("Error checking existing comment like");

  if (existingLike) {
    const { error: deleteError } = await supabase
      .from("comment_likes")
      .delete()
      .eq("id", existingLike.id);
    if (deleteError) throw new Error("Error removing comment like");
    return { liked: false };
  } else {
    const { error: insertError } = await supabase
      .from("comment_likes")
      .insert({ comment_id: commentId, user_id: userId });
    if (insertError) throw new Error("Error adding comment like");
    return { liked: true };
  }
}

async function handleReactionAction(
  postId: string,
  userId: string,
  reactionId: string
) {
  const { data: existingReaction, error: checkError } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .eq("reaction_type", reactionId)
    .maybeSingle();

  if (checkError) throw new Error("Error checking existing reaction");

  if (existingReaction) {
    const { error: deleteError } = await supabase
      .from("reactions")
      .delete()
      .eq("id", existingReaction.id);
    if (deleteError) throw new Error("Error removing reaction");
    return { reacted: false };
  } else {
    const { error: insertError } = await supabase
      .from("reactions")
      .insert({ post_id: postId, user_id: userId, reaction_type: reactionId });
    if (insertError) throw new Error("Error adding reaction");
    return { reacted: true };
  }
}

export async function POST(req: NextRequest) {
  const slug = getSlug(req);
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const rawBody = await req.json();
    const validatedBody = actionSchema.parse(rawBody);

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const currentUser = await getCurrentUserFromToken(token);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (!post.published && post.user_id !== currentUser.id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    switch (validatedBody.action) {
      case "like": {
        if (post.user_id === currentUser.id) {
          return NextResponse.json(
            { error: "Cannot like your own post" },
            { status: 403 }
          );
        }
        const result = await handleLikeAction(post.id, currentUser.id);
        return NextResponse.json(result);
      }
      case "comment": {
        const result = await handleCommentAction(
          post.id,
          currentUser.id,
          validatedBody.content
        );
        return NextResponse.json(result);
      }
      case "like_comment": {
        const result = await handleCommentLikeAction(
          validatedBody.commentId,
          currentUser.id
        );
        return NextResponse.json(result);
      }
      case "reaction": {
        const result = await handleReactionAction(
          post.id,
          currentUser.id,
          validatedBody.reactionId
        );
        return NextResponse.json(result);
      }
      default: {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
      }
    }
  } catch (error) {
    console.error("Action failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
