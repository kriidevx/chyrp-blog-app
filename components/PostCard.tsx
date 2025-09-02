'use client';

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Eye, Heart, MessageCircle, Share2, Tag, User, Zap, BookOpen, TrendingUp } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
};

interface PostCardProps {
  post?: {
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
    featured?: boolean;
    trending?: boolean;
  };
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  index?: number;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post = {
    id: '1',
    title: 'Building the Future of Web Development with Next.js and AI',
    excerpt: 'Explore how artificial intelligence is revolutionizing web development workflows and creating unprecedented user experiences in modern applications.',
    author: 'Alex Chen',
    publishedAt: '2024-01-15',
    readTime: 8,
    views: 2543,
    likes: 127,
    comments: 23,
    tags: ['Next.js', 'AI', 'Web Development', 'React'],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500',
    featured: true,
    trending: true,
  },
  variant = 'default',
  index = 0
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `/post/${post.id}`,
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'featured':
        return 'md:col-span-2 md:row-span-2';
      case 'compact':
        return 'h-64';
      case 'minimal':
        return 'border-l-4 border-l-cyan-400';
      default:
        return '';
    }
  };

  return (
    <article
      className={`group relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 ${getVariantClasses()}`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          <Zap className="h-3 w-3" />
          <span>Featured</span>
        </div>
      )}

      {/* Trending Badge */}
      {post.trending && (
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          <TrendingUp className="h-3 w-3" />
          <span>Trending</span>
        </div>
      )}

      {/* Image Section */}
      {post.image && (
        <div className="relative h-48 md:h-56 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-12 w-12 text-gray-600 animate-pulse" />
            </div>
          </div>
          
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Reading Progress Indicator */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-400 transition-all duration-500 cursor-pointer">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 group-hover:text-gray-300 transition-colors duration-300">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, tagIndex) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${tagIndex * 0.05}s` }}
            >
              <Tag className="h-2 w-2" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1 hover:text-cyan-400 transition-colors cursor-pointer">
              <Eye className="h-3 w-3" />
              <span>{post.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-pink-400 transition-colors cursor-pointer">
              <MessageCircle className="h-3 w-3" />
              <span>{post.comments}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                isLiked
                  ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/25'
                  : 'bg-slate-800/50 border-slate-700/50 text-gray-400 hover:text-pink-400 hover:border-pink-400/50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </article>
  );
};

export default PostCard;
