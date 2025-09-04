"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, content, created_at")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPost(data);
      }

      setLoading(false);
    }

    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600 dark:text-gray-400">Post not found.</p>
        <Link
          href="/posts"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {post.title}
      </h1>

      {/* Date */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Published on {new Date(post.created_at).toLocaleDateString()}
      </p>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        {post.content}
      </div>

      {/* Back link */}
      <footer className="mt-10">
        <Link
          href="/posts"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Feed
        </Link>
      </footer>
    </article>
  );
}
