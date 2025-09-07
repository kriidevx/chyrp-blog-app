'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Calendar, User, Tag } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
  user_id: string;
  users: {
    username: string;
    avatar_url?: string;
  };
  post_tags: {
    tags: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

interface RelatedPostsProps {
  currentPostId: string;
  categoryId?: string;
  tags?: string[];
  limit?: number;
}

const RelatedPostSkeleton = memo(() => (
  <div className="animate-pulse bg-white rounded-lg p-4 shadow-sm">
    <div className="bg-gray-300 h-4 rounded mb-2"></div>
    <div className="bg-gray-300 h-3 rounded mb-1"></div>
    <div className="bg-gray-300 h-3 rounded w-3/4 mb-3"></div>
    <div className="flex items-center gap-2">
      <div className="bg-gray-300 h-3 rounded w-16"></div>
      <div className="bg-gray-300 h-3 rounded w-20"></div>
    </div>
  </div>
));
RelatedPostSkeleton.displayName = 'RelatedPostSkeleton';

const PostCard = memo<{ post: Post }>(({ post }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border border-gray-100">
    <h4 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">
      <Link
        href={`/posts/${post.slug}`}
        className="text-gray-900 hover:text-blue-600 transition-colors"
      >
        {post.title}
      </Link>
    </h4>
    {post.excerpt && (
      <p className="text-gray-600 text-xs mb-3 line-clamp-3 leading-relaxed">
        {post.excerpt}
      </p>
    )}
    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
      <div className="flex items-center gap-1">
        <User size={10} />
        <span className="truncate max-w-20">{post.users?.username || 'Unknown'}</span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar size={10} />
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
    </div>
    {post.post_tags?.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {post.post_tags.slice(0, 2).map((tagItem, index) => (
          <span
            key={tagItem.tags?.id || index}
            className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
          >
            <Tag size={8} />
            {tagItem.tags?.name || 'Tag'}
          </span>
        ))}
        {post.post_tags.length > 2 && (
          <span className="text-xs text-gray-400">+{post.post_tags.length - 2}</span>
        )}
      </div>
    )}
  </div>
));
PostCard.displayName = 'PostCard';

const RelatedPosts = memo<RelatedPostsProps>(
  ({ currentPostId, categoryId, tags = [], limit = 3 }) => {
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const normalizePosts = (posts: any[]): Post[] => {
      return posts.map((post) => ({
        ...post,
        users: Array.isArray(post.users) ? post.users[0] : post.users,
        post_tags: Array.isArray(post.post_tags)
          ? post.post_tags.map((pt: any) => ({
              ...pt,
              tags: Array.isArray(pt.tags) ? pt.tags[0] : pt.tags,
            }))
          : [],
      }));
    };

    const fetchRelatedPosts = useCallback(async () => {
      if (!currentPostId) return;
      try {
        setLoading(true);
        setError(null);

        let posts: Post[] = [];

        // Strategy 1: Matching tags
        if (tags.length > 0) {
          const { data: tagPosts, error: tagError } = await supabase
            .from('posts')
            .select(`
              id,
              title,
              excerpt,
              slug,
              created_at,
              user_id,
              users!inner(username, avatar_url),
              post_tags!inner(
                tags!inner(id, name, slug)
              )
            `)
            .eq('published', true)
            .neq('id', currentPostId)
            .in('post_tags.tags.slug', tags.slice(0, 3))
            .limit(limit)
            .order('created_at', { ascending: false });

          if (!tagError && tagPosts?.length) {
            posts = normalizePosts(tagPosts);
          }
        }

        // Strategy 2: Matching category if no tag matches
        if (posts.length === 0 && categoryId) {
          const { data: categoryPosts, error: categoryError } = await supabase
            .from('posts')
            .select(`
              id,
              title,
              excerpt,
              slug,
              created_at,
              user_id,
              users!inner(username, avatar_url),
              post_tags(
                tags(id, name, slug)
              )
            `)
            .eq('published', true)
            .eq('category_id', categoryId)
            .neq('id', currentPostId)
            .limit(limit)
            .order('created_at', { ascending: false });

          if (!categoryError && categoryPosts?.length) {
            posts = normalizePosts(categoryPosts);
          }
        }

        // Strategy 3: Fallback to popular posts
        if (posts.length === 0) {
          const { data: recentPosts, error: recentError } = await supabase
            .from('posts')
            .select(`
              id,
              title,
              excerpt,
              slug,
              created_at,
              user_id,
              view_count,
              users!inner(username, avatar_url),
              post_tags(
                tags(id, name, slug)
              )
            `)
            .eq('published', true)
            .neq('id', currentPostId)
            .limit(limit)
            .order('view_count', { ascending: false })
            .order('created_at', { ascending: false });

          if (!recentError && recentPosts?.length) {
            posts = normalizePosts(recentPosts);
          } else if (recentError) {
            setError('Failed to load related posts');
          }
        }

        setRelatedPosts(posts);
      } catch (err) {
        setError('Failed to load related posts');
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    }, [currentPostId, categoryId, tags, limit]);

    useEffect(() => {
      fetchRelatedPosts();
    }, [fetchRelatedPosts]);

    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: limit }, (_, i) => (
            <RelatedPostSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-4">
          <div className="text-red-500 text-sm mb-2">{error}</div>
          <button
            onClick={fetchRelatedPosts}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    if (relatedPosts.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Tag size={24} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-sm">No related posts found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }
);

RelatedPosts.displayName = 'RelatedPosts';

export default RelatedPosts;
