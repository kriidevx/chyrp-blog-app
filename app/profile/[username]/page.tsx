"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfilePosts from "@/components/profile/ProfilePosts";
import ProfileActions from "@/components/profile/ProfileActions";

type User = {
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

useEffect(() => {
  async function fetchLoggedInUserProfile() {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      setLoggedInUser(null);
      return;
    }

    // Fetch user profile from your 'users' table using authUser.id
    const { data: profileUser, error: profileError } = await supabase
      .from("users")
      .select("username")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profileUser) {
      setLoggedInUser(null);
      return;
    }

    setLoggedInUser({ username: profileUser.username });
  }

  fetchLoggedInUserProfile();
}, []);


  // Fetch profile user and posts
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      if (!username) {
        setUser(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/users/profile/${encodeURIComponent(username)}`
        );

        if (!response.ok) {
          setUser(null);
          setPosts([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data.user || null);
        setPosts(data.posts || []);
      } catch (error) {
        console.error(error);
        setUser(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const isOwner = loggedInUser?.username === username;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ProfileInfo user={user} />
      <ProfileActions isOwner={isOwner} />
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <ProfilePosts posts={posts} />
    </div>
  );
}
