"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Eye, Heart, MessageCircle } from "lucide-react";

import QuickActions from "@/components/dashboard/QuickActions";
import Analytics from "@/components/dashboard/Analytics";
import PostsManager from "@/components/dashboard/posts/PostsManager";
import NewPostManager from "@/components/newPost/NewPostManager"; // ✅ Use manager
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  // ----------------------------
  // User & Session State
  // ----------------------------
  const [username, setUsername] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNewPostManager, setShowNewPostManager] = useState(false);

  // ----------------------------
  // Posts & Analytics State
  // ----------------------------
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  // ----------------------------
  // Filter & Search State
  // ----------------------------
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ----------------------------
  // Bulk Selection State
  // ----------------------------
  const [selectedPosts, setSelectedPosts] = useState<Set<number>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [draggedPost, setDraggedPost] = useState<number | null>(null);

  // ----------------------------
  // Initialize Dashboard
  // ----------------------------
  useEffect(() => {
    async function initializeDashboard() {
      setLoadingUser(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          router.replace("/auth/login");
          return;
        }

        const token = session.access_token;
        setAccessToken(token);

        async function fetchUsername() {
          const res = await fetch("/api/users/username");
          if (!res.ok) {
            console.error("Failed to fetch username");
            return null;
          }
          const username = await res.text(); // use .text() for plain string
          return username;
        }

        // Usage in an async context
        const username = await fetchUsername();

        setUsername(username || "User");

        const postsRes = await fetch("/api/posts/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!postsRes.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);

        const analyticsRes = await fetch("/api/dashboard/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!analyticsRes.ok) throw new Error("Failed to fetch analytics");
        const analyticsData = await analyticsRes.json();

        setStats([
          {
            label: "Total Posts",
            value: analyticsData.totalPosts,
            icon: FileText,
            color: "from-blue-600 to-blue-500",
          },
          {
            label: "Total Views",
            value: Number(analyticsData.totalViews).toLocaleString(),
            icon: Eye,
            color: "from-cyan-500 to-cyan-400",
          },
          {
            label: "Total Likes",
            value: Number(analyticsData.totalLikes).toLocaleString(),
            icon: Heart,
            color: "from-blue-600 to-cyan-500",
          },
          {
            label: "Comments",
            value: Number(analyticsData.totalComments).toLocaleString(),
            icon: MessageCircle,
            color: "from-cyan-500 to-blue-600",
          },
        ]);

        setError(null);
      } catch (err: any) {
        console.error("Dashboard initialization failed:", err);
        setError("Failed to load dashboard. Redirecting...");
        router.replace("/auth/login");
      } finally {
        setLoadingUser(false);
      }
    }

    initializeDashboard();
  }, []);

  // ----------------------------
  // Filtered posts for display
  // ----------------------------
  const filteredPosts = posts.filter((post) => {
    const isPublished = post.published === true || post.published === "true";
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "published" && isPublished) ||
      (selectedFilter === "draft" && !isPublished);
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ----------------------------
  // Render
  // ----------------------------
  if (loadingUser) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-6 lg:px-8 max-w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header & QuickActions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6 md:gap-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Welcome back, {username}!
              </span>
            </h1>
            <p className="text-xl text-slate-900/70">
              Ready to create something amazing today?
            </p>
          </div>
          <QuickActions
            username={username}
            currentUserName={username} // same as username
            onPostSaved={(newPost) => setPosts((prev) => [newPost, ...prev])}
            onOpenNewPost={() => setShowNewPostManager(true)}
            loading={false}
          />

          {showNewPostManager && (
            <NewPostManager
              currentUserName={username}
              onPostSaved={(newPost) => {
                setPosts((prev) => [newPost, ...prev]);
                setShowNewPostManager(false); // close modal after saving
              }}
            />
          )}
        </div>

        {/* Posts Manager */}
        <PostsManager
          posts={filteredPosts}
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
          accessToken={accessToken}
        />

        {/* Analytics */}
        <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">
          Analytics
        </h2>
        <Analytics id="analytics-section" stats={stats} />
      </div>
    </div>
  );
}
