"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import {
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Tag,
  ArrowUpDown,
  Zap,
  Sparkles,
  Hexagon,
} from "lucide-react";

// Post interface for type safety
interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  image?: string;
  category: string;
  trending?: boolean;
}

// ✅ This is your original Supabase fetcher
async function SupabaseCategoryPage({ params }: { params: { slug: string } }) {
  const { data: categoryPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("category_slug", params.slug)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Posts in category: {params.slug}
      </h1>
      {categoryPosts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// ✅ This is your extended React UI version
const EnhancedCategoryPage = ({ params }: { params: { category: string } }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "popular" | "trending"
  >("newest");
  const [viewMode, setViewMode] = useState<"hexagon" | "grid" | "list">(
    "hexagon"
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryName = decodeURIComponent(params.category);



  return (
    // 👇 keep your big JSX here
    <div>{/* all your Enhanced UI JSX */}</div>
  );
};


export default EnhancedCategoryPage;

