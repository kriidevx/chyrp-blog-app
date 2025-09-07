import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

function getSlug(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  const slugIndex = segments.findIndex(segment => segment === "actions") - 1;
  return segments[slugIndex];
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

async function getPostBySlug(slug: string) {
  const { data: postData, error } = await supabase
    .from("posts")
    .select("id, user_id, published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return postData;
}

async function handleLikeAction(postId: string, userId: string) {
  // Check if like exists
  const { data: existingLike, error: checkError } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (checkError) {
    throw new Error("Error checking existing like");
  }

  let liked = false;
  
  if (existingLike) {
    // Remove like
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id);
      
    if (deleteError) {
      throw new Error("Error removing like");
    }
    liked = false;
  } else {
    // Add like
    const { error: insertError } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });
      
    if (insertError) {
      throw new Error("Error adding like");
    }
    liked = true;
  }

  // Get updated like count
  const { count, error: countError } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (countError) {
    throw new Error("Error getting like count");
  }

  return { liked, total_likes: count || 0 };
}

async function handleCommentAction(postId: string, userId: string, content: string) {
  const { data: newComment, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      content: content.trim(),
    })
    .select(`
      *,
      users!inner(id, username, avatar_url),
      comment_likes(id, user_id)
    `)
    .single();

  if (error) {
    throw new Error("Error creating comment");
  }

  // Transform the response to match expected format
  return {
    ...newComment,
    users: Array.isArray(newComment.users) ? newComment.users[0] : newComment.users,
  };
}

async function handleCommentLikeAction(commentId: string, userId: string) {
  // Check if comment like exists
  const { data: existingLike, error: checkError } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (checkError) {
    throw new Error("Error checking existing comment like");
  }

  if (existingLike) {
    // Remove like
    const { error: deleteError } = await supabase
      .from("comment_likes")
      .delete()
      .eq("id", existingLike.id);
      
    if (deleteError) {
      throw new Error("Error removing comment like");
    }
    return { liked: false };
  } else {
    // Add like
    const { error: insertError } = await supabase
      .from("comment_likes")
      .insert({
        comment_id: commentId,
        user_id: userId,
      });
      
    if (insertError) {
      throw new Error("Error adding comment like");
    }
    return { liked: true };
  }
}

async function handleReactionAction(postId: string, userId: string, reactionId: string) {
  // Check if reaction exists
  const { data: existingReaction, error: checkError } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .eq("reaction_type", reactionId)
    .maybeSingle();

  if (checkError) {
    throw new Error("Error checking existing reaction");
  }

  if (existingReaction) {
    // Remove reaction
    const { error: deleteError } = await supabase
      .from("reactions")
      .delete()
      .eq("id", existingReaction.id);
      
    if (deleteError) {
      throw new Error("Error removing reaction");
    }
    return { reacted: false };
  } else {
    // Add reaction
    const { error: insertError } = await supabase
      .from("reactions")
      .insert({
        post_id: postId,
        user_id: userId,
        reaction_type: reactionId,
      });
      
    if (insertError) {
      throw new Error("Error adding reaction");
    }
    return { reacted: true };
  }
}

export async function POST(req: NextRequest) {
  const slug = getSlug(req);
  
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    // Parse and validate request body
    const rawBody = await req.json();
    const validatedBody = actionSchema.parse(rawBody);
    
    // Get and validate auth token
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const currentUser = await getCurrentUserFromToken(token);
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get post data
    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if post is published (except for owner)
    if (!post.published && post.user_id !== currentUser.id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Handle different actions
    switch (validatedBody.action) {
      case "like": {
        // Prevent users from liking their own posts
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
        return NextResponse.json(
          { error: "Invalid action" }, 
          { status: 400 }
        );
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