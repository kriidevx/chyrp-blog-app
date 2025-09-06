"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Heart, MessageCircle, Tag, TrendingUp } from "lucide-react";
import getFeatherIcon from "@/lib/dashboard/getFeatherIcon";

export type PostCardProps = {
  
  slug: string;
  title: string;
  excerpt: string;
  created_at: string;
  likes?: number;
  comments?: number;
  author?: string;
  tags?: string[];
  trending?: boolean;
  category?: string;
  image?: string;
  featureType?: string; // New prop
  onTagClick?: (tag: string) => void;
  isGrid?: boolean;
};

export default function PostCard({
  slug,
  title,
  excerpt,
  created_at,
  likes,
  comments,
  author,
  tags = [],
  trending = false,
  category,
  image,
  featureType,
  onTagClick,
  isGrid = true,
}: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`} className="group">
      <div
        className={`bg-white/10 backdrop-blur-xl border border-blue-400/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative ${
          isGrid ? "" : "w-full"
        }`}
      >
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Trending Badge */}
        {trending && (
          <div
            className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full text-xs font-semibold z-10 ${
              isGrid ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"
            }`}
          >
            <TrendingUp size={isGrid ? 10 : 12} />
            Trending
          </div>
        )}

        <div className="p-6 flex flex-col justify-between space-y-4">
          {/* Title & Excerpt */}
          <div className="space-y-2 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2">{excerpt}</p>
            </div>
            {/* Feather Icon */}
            {featureType && (
              <span className="text-2xl ml-2">{getFeatherIcon(featureType)}</span>
            )}
          </div>

          {/* Category */}
          {category && (
            <div className="text-xs text-blue-700 font-semibold uppercase">
              {category}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick && onTagClick(tag);
                }}
                className="flex items-center text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                aria-label={`Filter by tag ${tag}`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </button>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(created_at).toLocaleDateString()}
              </span>
              {author && <span>By {author}</span>}
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500" /> {likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> {comments || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
