"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Grid, List } from "lucide-react";
import PostCard, { PostCardProps } from "@/components/PostCard";

export default function FeedPage() {
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "oldest">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Dynamic categories based on posts
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        const mapped: PostCardProps[] = data.map((p: any) => ({
          title: p.title,
          excerpt: p.excerpt || (p.content ? p.content.slice(0, 120) + "..." : ""),
          created_at: p.created_at,
          likes: p.like_count || 0,
          comments: p.comment_count || 0,
          tags: p.tags || [],
          author: p.author || "Unknown",
          image: p.image || "",
          category: p.category || "Uncategorized",
          trending: p.trending || false,
          isGrid: true,
          featureType: p.featureType || "default",
          slug: p.slug,
        }));

        setPosts(mapped);
      } catch (err) {
        console.error(err);
        setPosts([]);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    let temp = [...posts];

    if (selectedCategory !== "all") {
      temp = temp.filter((p) => p.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      temp = temp.filter((p) => p.tags?.some((t) => selectedTags.includes(t)));
    }

    temp.sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest")
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "popular") return (b.likes || 0) - (a.likes || 0);
      return 0;
    });

    return temp;
  }, [posts, selectedCategory, selectedTags, sortBy]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Filters + View Mode */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Category + Sort */}
        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-white/10 backdrop-blur-xl border border-white/20 text-slate-700 hover:bg-white/20 transition"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-sm bg-white/10 backdrop-blur-xl border border-white/20 text-slate-700 hover:bg-white/20 transition"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:text-blue-600 hover:bg-white/20"
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === "list"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:text-blue-600 hover:bg-white/20"
            }`}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <List size={16} />
          </button>
        </div>

        {/* Selected tags */}
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="flex items-center text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                aria-label={`Remove filter tag ${tag}`}
              >
                {tag} ✕
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center col-span-full p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-slate-500">
          Loading posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center col-span-full p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-slate-500">
          No posts match your filters
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredPosts.map((post, idx) => (
            <div key={idx} className={viewMode === "grid" ? "" : "w-full"}>
              <PostCard
                {...post}
                isGrid={viewMode === "grid"}
                onTagClick={handleTagClick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
