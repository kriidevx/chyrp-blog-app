import React, { useState } from 'react';
import { Grid, List, Calendar, TrendingUp, Heart, MessageCircle, Share2, Bookmark, MoreVertical } from 'lucide-react';
import { Post } from '@/typings';
import PostCard from '../../components/PostCard';

type ExtendedPost = Post & {
  readTime?: number;
  likes?: number;
  views?: number;
  tags?: string[];
  isBookmarked?: boolean;
  isPinned?: boolean;
};

interface ProfilePostsProps {
  posts: ExtendedPost[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  sortBy?: 'recent' | 'popular' | 'oldest';
}

export default function ProfilePosts({ 
  posts = [], 
  loading = false,
  viewMode: initialViewMode = 'grid',
  sortBy: initialSortBy = 'recent'
}: ProfilePostsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>(initialSortBy);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCount = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="
            bg-white/10 backdrop-blur-xl border border-white/20
            rounded-2xl p-6 animate-pulse
          ">
            <div className="h-4 bg-white/20 rounded w-3/4 mb-4" />
            <div className="h-3 bg-white/20 rounded w-full mb-2" />
            <div className="h-3 bg-white/20 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
        <div className="text-slate-500 font-medium">No posts yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            Posts ({posts.length})
          </h2>
          
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="
              px-3 py-1.5 rounded-lg text-sm
              bg-white/10 backdrop-blur-xl border border-white/20
              text-slate-700 hover:bg-white/20
              transition-all duration-200 outline-none
            "
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`
              p-2 rounded-md transition-all duration-200
              ${viewMode === 'grid' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-blue-600 hover:bg-white/20'
              }
            `}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              p-2 rounded-md transition-all duration-200
              ${viewMode === 'list' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-blue-600 hover:bg-white/20'
              }
            `}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Posts Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {posts.map((post) => (
          <article
            key={post.id}
            className={`
              group relative cursor-pointer
              bg-white/10 backdrop-blur-xl border border-white/20
              hover:bg-white/15 hover:border-white/30
              shadow-lg hover:shadow-2xl
              transition-all duration-300 hover:scale-[1.02]
              ${viewMode === 'grid' ? 'rounded-2xl overflow-hidden' : 'rounded-xl p-4 flex gap-4'}
            `}
          >
            {post.isPinned && (
              <div className="absolute top-3 right-3 z-10 p-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg shadow-lg">
                <TrendingUp size={12} className="text-white" />
              </div>
            )}

            {viewMode === 'grid' ? (
              <>
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    {post.readTime && (
                      <div>{post.readTime} min read</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      {post.likes !== undefined && (
                        <div className="flex items-center gap-1 text-xs">
                          <Heart size={12} className="text-pink-500" />
                          <span>{formatCount(post.likes)}</span>
                        </div>
                      )}
                      {post.comments !== undefined && (
                        <div className="flex items-center gap-1 text-xs">
                          <MessageCircle size={12} className="text-blue-500" />
                          <span>{formatCount(post.comments)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-white/10">
                        <Share2 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-white/10">
                        <Bookmark size={14} className={post.isBookmarked ? 'fill-current' : ''} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-white/10">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {post.image && (
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    {post.readTime && (
                      <div>{post.readTime} min read</div>
                    )}
                    {post.likes !== undefined && (
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="text-pink-500" />
                        <span>{formatCount(post.likes)}</span>
                      </div>
                    )}
                    {post.comments !== undefined && (
                      <div className="flex items-center gap-1">
                        <MessageCircle size={12} className="text-blue-500" />
                        <span>{formatCount(post.comments)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
