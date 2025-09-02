import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

import React, { useState, useEffect } from "react";
import {
  Tag,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Filter,
  Grid,
  List,
  Search,
  Zap,
  Hash,
  Sparkles,
  Calendar,
  BookOpen,
  BarChart3,
} from "lucide-react";

export default async function TagPage({ params }: { params: { slug: string } }) {
  // ✅ Supabase query – DO NOT TOUCH
  const { data: tagPosts } = await supabase
    .from("posts")
    .select("*")
    .contains("tags", [params.slug]) // If tags stored as an array in posts
    .order("created_at", { ascending: false });

  const tagName = decodeURIComponent(params.slug);

  // Dynamic color function
  const getTagColor = (tag: string) => {
    const colors = [
      "from-cyan-400 to-blue-500",
      "from-purple-400 to-pink-500",
      "from-green-400 to-emerald-500",
      "from-orange-400 to-red-500",
      "from-yellow-400 to-orange-500",
      "from-indigo-400 to-purple-500",
      "from-pink-400 to-rose-500",
      "from-teal-400 to-cyan-500",
    ];
    const hash = tag.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  const tagColor = getTagColor(tagName);

  // Stats from Supabase posts
  const totalViews = tagPosts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
  const avgReadTime =
    tagPosts && tagPosts.length > 0
      ? Math.round(
          tagPosts.reduce((sum, post) => sum + (post.readTime || 0), 0) /
            tagPosts.length
        )
      : 0;

  const tagStats = {
    totalPosts: tagPosts?.length || 0,
    totalViews,
    avgReadTime,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br ${tagColor}/10 rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br ${tagColor}/10 rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className={`p-3 bg-gradient-to-r ${tagColor} rounded-xl`}>
              <Hash className="h-8 w-8 text-white" />
            </div>
            <h1
              className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${tagColor} tracking-tighter`}
            >
              {tagName}
            </h1>
            <Sparkles className="h-8 w-8 text-pink-400 animate-bounce" />
          </div>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Explore all posts tagged with{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${tagColor} font-semibold`}
            >
              #{tagName}
            </span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              {
                label: "Posts",
                value: tagStats.totalPosts,
                icon: BookOpen,
                color: "from-cyan-400 to-blue-500",
              },
              {
                label: "Total Views",
                value: tagStats.totalViews.toLocaleString(),
                icon: Eye,
                color: "from-purple-400 to-pink-500",
              },
              {
                label: "Avg Read Time",
                value: `${tagStats.avgReadTime}m`,
                icon: Clock,
                color: "from-green-400 to-emerald-500",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 group hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div
                      className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tagPosts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
