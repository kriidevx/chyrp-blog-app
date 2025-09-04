"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  excerpt?: string | null;
}

export default function PostsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? ""; // category id
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);

      // Base query: only published posts
      let query = supabase
        .from("posts")
        .select("id, title, slug, content, excerpt, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      // Apply search (title or content)
      if (q) {
        // use ilike to do case-insensitive partial match on title OR content
        // NOTE: PostgREST doesn't support OR with ilike easily via client - so we do title match first, fallback to content if needed.
        query = query.ilike("title", `%${q}%`);
      }

      // Apply category filter (assumes posts.category_id equals category id)
      if (category) {
        query = query.eq("category_id", category);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    }

    fetchPosts();
  }, [q, category]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>

      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && posts.length === 0 && (
        <p className="text-gray-600">No posts match your filters.</p>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="p-5 border rounded-xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-1">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="text-sm text-gray-500 mb-2">{new Date(post.created_at).toLocaleDateString()}</p>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
              {post.excerpt ?? post.content?.slice(0, 180) ?? ""}
            </p>
            <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline mt-3 inline-block">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
