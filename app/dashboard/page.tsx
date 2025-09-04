"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  published: boolean;
  created_at: string;
  slug: string;
};

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data: { user }} = await supabase.auth.getUser();

      if (!user) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("id, title, published, created_at, slug")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      } else {
        setPosts([]);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Posts</h1>
      <Link href="/dashboard/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block mb-6">
        + New Post
      </Link>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Create one above!</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()} — {post.published ? "Published" : "Draft"}</p>
                </div>
                <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">View</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
