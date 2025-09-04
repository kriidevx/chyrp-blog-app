'use client';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NewPostModal from "@/components/NewPostModal"; // import the modal

type Post = { id: string; title: string; published: boolean; created_at: string; slug: string; };
type User = { id: string; email: string; username: string; avatar_url?: string; bio?: string; };

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state

  useEffect(() => {
    async function fetchUserAndPosts() {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          setError("Not logged in");
          setLoading(false);
          return;
        }

        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata?.username || "",
          avatar_url: session.user.user_metadata?.avatar_url,
          bio: session.user.user_metadata?.bio,
        });

        const accessToken = session.access_token;

        const resPosts = await fetch("/api/posts/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const dataPosts = await resPosts.json();

        if (!resPosts.ok) {
          setError(dataPosts.error || "Failed to fetch posts");
          setPosts([]);
        } else {
          setPosts(dataPosts.posts || []);
        }
      } catch (err: any) {
        console.error(err);
        setError("Unexpected error occurred");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndPosts();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Posts</h1>

      {user && (
        <button
          onClick={() => setIsModalOpen(true)} // open modal on click
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block mb-6"
        >
          + New Post
        </button>
      )}

      {/* New Post Modal */}
      <NewPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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
