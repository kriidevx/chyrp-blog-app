"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 dark:text-white">
        Latest Posts
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
