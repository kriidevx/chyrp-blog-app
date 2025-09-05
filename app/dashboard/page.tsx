"use client";

import { useState, useEffect } from "react";
import { FileText, Eye, Heart, MessageCircle } from "lucide-react";
import QuickActions from "@/components/dashboard/QuickActions";
import Analytics from "@/components/dashboard/Analytics";
import PostsManager from "@/components/dashboard/posts/PostsManager";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosts, setSelectedPosts] = useState(new Set<number>());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [draggedPost, setDraggedPost] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Fetch authenticated user and username + access token
  useEffect(() => {
    async function fetchUser() {
      setLoadingUser(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error("Not logged in");
        }

        setAccessToken(session.access_token);

        const res = await fetch("/api/auth/session", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch session");

        const data = await res.json();
        setUsername(data.username || "");
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setUsername("");
        setAccessToken(null);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  // Fetch posts for authenticated user
  useEffect(() => {
    async function fetchPosts() {
      if (!username) return; // Wait for username

      setLoadingPosts(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error("Not logged in");
        }

        const accessTokenToken = session.access_token;

        const res = await fetch("/api/posts/user", {
          headers: {
            Authorization: `Bearer ${accessTokenToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();

        setPosts(data.posts || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load posts");
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchPosts();
  }, [username]);

  // Fetch real analytics from your analytics API without growth
  useEffect(() => {
    async function fetchStats() {
      if (!username) return; // Wait for username

      setLoadingStats(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error("Not logged in");
        }

        const accessTokenToken = session.access_token;

        const res = await fetch("/api/dashboard/analytics", {
          headers: {
            Authorization: `Bearer ${accessTokenToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const data = await res.json();

        setStats([
          {
            label: "Total Posts",
            value: data.totalPosts,
            icon: FileText,
            color: "from-blue-600 to-blue-500",
          },
          {
            label: "Total Views",
            value: Number(data.totalViews).toLocaleString(),
            icon: Eye,
            color: "from-cyan-500 to-cyan-400",
          },
          {
            label: "Total Likes",
            value: Number(data.totalLikes).toLocaleString(),
            icon: Heart,
            color: "from-blue-600 to-cyan-500",
          },
          {
            label: "Comments",
            value: Number(data.totalComments).toLocaleString(),
            icon: MessageCircle,
            color: "from-cyan-500 to-blue-600",
          },
        ]);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
        setStats([]);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, [username]);

  if (loadingUser || loadingPosts || loadingStats)
    return <p className="text-center">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-6 lg:px-8 max-w-full">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6 md:gap-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Welcome back, {username.split(" ")[0]}!
              </span>
            </h1>
            <p className="text-xl text-slate-900/70">
              Ready to create something amazing today?
            </p>
          </div>
          <QuickActions username={username} />
        </div>

        {/* Posts Manager */}
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Create one above!</p>
        ) : (
          <PostsManager
            posts={posts}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedPosts={selectedPosts}
            setSelectedPosts={setSelectedPosts}
            showBulkActions={showBulkActions}
            setShowBulkActions={setShowBulkActions}
            draggedPost={draggedPost}
            setDraggedPost={setDraggedPost}
            accessToken={accessToken} // Pass token to PostsManager
          />
        )}

        {/* Analytics Section */}
        <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">
          Analytics
        </h2>
        <Analytics id="analytics-section" stats={stats} />

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          @keyframes slide-in-from-top-2 {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-in {
            animation: slide-in-from-top-2 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
