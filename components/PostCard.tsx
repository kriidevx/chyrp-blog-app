"use client";

import React from "react";
import {
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
} from "lucide-react";

type PostCardProps = {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  author?: string;
  likes?: number;
  comments?: number;
  isBookmarked?: boolean;
  tags?: string[];
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "No date";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCount = (num: number = 0) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

export default function PostCard({
  title,
  excerpt,
  created_at,
  author = "Anonymous",
  likes = 0,
  comments = 0,
  isBookmarked = false,
  tags = [],
}: PostCardProps) {
  const handleTagClick = (tag: string) => {
    console.log("Clicked tag:", tag);
    // TODO: Replace with router.push(`/tags/${tag}`) or filter logic
  };

  return (
    <article
      className="
        group relative bg-white/10 backdrop-blur-xl border border-white/20
        rounded-xl p-6 transition-all duration-300
        hover:scale-[1.02] hover:shadow-2xl hover:bg-white/15
        flex flex-col justify-between
      "
    >
      {/* Title + Excerpt */}
      <div>
        <h3 className="font-bold text-lg text-slate-800 line-clamp-2 group-hover:text-blue-600">
          {title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mt-2">{excerpt}</p>

        {/* Date + Author */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(created_at)}
          </span>
          <span>•</span>
          <span className="text-slate-700">{author}</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4">
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Heart size={12} className="text-pink-500" />
              {formatCount(likes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={12} className="text-blue-500" />
              {formatCount(comments)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 size={14} className="text-slate-500 hover:text-blue-600" />
            <Bookmark
              size={14}
              className={
                isBookmarked
                  ? "text-blue-500 fill-current"
                  : "text-slate-500 hover:text-blue-600"
              }
            />
            <MoreVertical size={14} className="text-slate-500" />
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="
                  px-3 py-1 text-xs rounded-full 
                  bg-blue-100 text-blue-600 font-medium
                  hover:bg-blue-200 transition-colors
                "
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
