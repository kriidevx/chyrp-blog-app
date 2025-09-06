"use client";

import React from "react";
import PostCard from "@/components/PostCard";

const dummyPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    excerpt: "Next.js 14 introduces powerful new features like Server Actions...",
    created_at: "2025-08-12",
    author: "Bhavya",
    likes: 123,
    comments: 14,
    isBookmarked: false,
    tags: ["Next.js", "React", "Supabase"],
  },
  {
    id: "2",
    title: "Building a Fullstack App with Supabase",
    excerpt: "Supabase is an open-source Firebase alternative...",
    created_at: "2025-07-22",
    author: "Lahari",
    likes: 542,
    comments: 89,
    isBookmarked: true,
    tags: ["Supabase", "Database", "Backend"],
  },
];

export default function ProfilePostsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {dummyPosts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
