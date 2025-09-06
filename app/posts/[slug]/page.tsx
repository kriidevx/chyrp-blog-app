"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import {
  ArrowLeft,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PostViewer from "@/components/posts/text/PostViewer";
import LikeButton from "@/components/posts/interaction/LikeButton";
import CommentFormUI from "@/components/posts/interaction/CommentForm";
import ReactionsUI from "@/components/posts/interaction/Reactions";
import MentionedPpl from "@/components/posts/MentionedPeople";
import RelatedPosts from "@/components/posts/RelatedPosts";

interface User {
  id: string;
  username: string;
  avatar_url?: string;
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  users?: User;
  comment_likes?: any[];
}

interface Post {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  feather_type: string;
  likes: number;
  view_count: number;
  category_name?: string;
  category_id?: string;
  tags?: string[];
  users?: User;
  comments?: Comment[];
}

interface MentionedUser {
  id: string;
  username: string;
  name: string;
  avatar_url?: string;
}

interface PostPageState {
  post: Post | null;
  currentUser: User | null;
  likedByUser: boolean;
  comments: Comment[];
  mentioned: MentionedUser[];
  prevPost: Post | null;
  nextPost: Post | null;
  loading: boolean;
  actionLoading: {
    like: boolean;
    comment: boolean;
  };
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PostPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [state, setState] = useState<PostPageState>({
    post: null,
    currentUser: null,
    likedByUser: false,
    comments: [],
    mentioned: [],
    prevPost: null,
    nextPost: null,
    loading: true,
    actionLoading: {
      like: false,
      comment: false,
    },
  });

  // Memoized computed values
  const isOwner = useMemo(
    () => state.post?.user_id === state.currentUser?.id,
    [state.post?.user_id, state.currentUser?.id]
  );

  const fetchPostData = useCallback(async () => {
    if (!slug) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`/api/posts/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!res.ok) {
        console.error(`HTTP ${res.status}: ${res.statusText}`);
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const json = await res.json();

      if (json.error) {
        console.error("API Error:", json.error);
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      setState(prev => ({
        ...prev,
        post: json.post,
        comments: json.post.comments || [],
        prevPost: json.prevPost || null,
        nextPost: json.nextPost || null,
        mentioned: json.mentioned || [],
        currentUser: json.user || null,
        likedByUser: json.likedByUser ?? false,
        loading: false,
      }));

    } catch (err) {
      console.error("Unexpected error fetching post:", err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [slug]);

  const handleAddComment = useCallback((comment: Comment) => {
    setState(prev => ({
      ...prev,
      comments: [comment, ...prev.comments],
    }));
  }, []);

  const handleToggleLike = useCallback(async () => {
    const { currentUser, post } = state;
    
    if (!currentUser?.id) {
      alert("Please login to like the post");
      return;
    }
    if (!post || isOwner) return;

    setState(prev => ({
      ...prev,
      actionLoading: { ...prev.actionLoading, like: true }
    }));

    // Optimistic update
    const wasLiked = state.likedByUser;
    const newLikeCount = wasLiked ? post.likes - 1 : post.likes + 1;
    
    setState(prev => ({
      ...prev,
      likedByUser: !wasLiked,
      post: prev.post ? { ...prev.post, likes: newLikeCount } : prev.post,
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`/api/posts/${post.slug}/actions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: "like" }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }

      const json = await res.json();

      // Update with server response
      setState(prev => ({
        ...prev,
        likedByUser: json.liked,
        post: prev.post ? { ...prev.post, likes: json.total_likes } : prev.post,
      }));

    } catch (err) {
      console.error("Failed to like post:", err);
      
      // Revert optimistic update
      setState(prev => ({
        ...prev,
        likedByUser: wasLiked,
        post: prev.post ? { ...prev.post, likes: post.likes } : prev.post,
      }));
      
      alert("Failed to like post. Please try again.");
    } finally {
      setState(prev => ({
        ...prev,
        actionLoading: { ...prev.actionLoading, like: false }
      }));
    }
  }, [state.currentUser, state.post, state.likedByUser, isOwner]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="flex-1 space-y-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!state.post) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow-md bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200"
          >
            <ArrowLeft size={16} /> Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  const { post } = state;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Back Button */}
        <div className="flex justify-start mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow-md bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200"
          >
            <ArrowLeft size={16} /> Back to Feed
          </Link>
        </div>

        {/* Post Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6 w-full lg:w-[850px]">
          <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
          <p className="text-gray-500">by {post.users?.username || "Unknown"}</p>

          {/* Category & Tags */}
          {post.category_name && (
            <p className="text-sm text-gray-500">Category: {post.category_name}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Viewer & Content */}
          <PostViewer featherType={post.feather_type} />
          <div className="prose max-w-none text-gray-800">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Likes and Actions */}
          <div className="flex items-center gap-4">
            <LikeButton
              likes={post.likes}
              likedByUser={state.likedByUser}
              size="md"
              onClick={handleToggleLike}
              disabled={!state.currentUser?.id || isOwner || state.actionLoading.like}
              loading={state.actionLoading.like}
            />
            <span className="text-gray-600">{post.view_count} views</span>

            <div className="ml-auto flex gap-2">
              {isOwner ? (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow-md bg-gradient-to-r from-green-400 to-green-500 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200">
                    <Edit size={16} /> Edit
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow-md bg-gradient-to-r from-red-500 to-red-600 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200">
                    <Trash2 size={16} /> Delete
                  </button>
                </>
              ) : (
                <>
                  {state.prevPost && (
                    <Link
                      href={`/posts/${state.prevPost.slug}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-800 font-semibold shadow-sm bg-gray-200 hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-200"
                    >
                      <ChevronLeft size={16} /> {state.prevPost.title}
                    </Link>
                  )}
                  {state.nextPost && (
                    <Link
                      href={`/posts/${state.nextPost.slug}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-800 font-semibold shadow-sm bg-gray-200 hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-200"
                    >
                      {state.nextPost.title} <ChevronRight size={16} />
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Reactions and Mentions */}
          <div className="space-y-4">
            <ReactionsUI
              postSlug={post.slug}
              currentUserId={state.currentUser?.id || ""}
              onUnauthorized={() => alert("Please login to react")}
            />
            {state.mentioned.length > 0 && (
              <MentionedPpl postId={post.id} mentioned={state.mentioned} />
            )}
          </div>

          {/* Comment Form */}
          {state.currentUser?.id ? (
            <CommentFormUI
              postSlug={post.slug}
              currentUserId={state.currentUser.id}
              comments={state.comments}
              onCommentAdded={handleAddComment}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Login to comment and interact with this post</p>
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold shadow-md bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar: Related Posts */}
      <div className="hidden lg:flex flex-col w-72 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Related Posts</h3>
        <RelatedPosts
          currentPostId={post.id}
          categoryId={post.category_id}
          tags={post.tags}
          limit={3}
        />
      </div>
    </div>
  );
}