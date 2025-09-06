import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  username: string;
  avatar_url?: string;
}

interface Post {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  feather_type: string;
  likes: number;
  view_count: number;
  category_name?: string;
  category_id?: string;
  tags?: string[];
  users?: User;
}

interface UsePostReturn {
  post: Post | null;
  currentUser: User | null;
  likedByUser: boolean;
  loading: boolean;
  error: string | null;
  refreshPost: () => void;
  toggleLike: () => Promise<void>;
  updateLikes: (newCount: number, liked: boolean) => void;
}

export const usePost = (slug: string): UsePostReturn => {
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [likedByUser, setLikedByUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`/api/posts/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPost(data.post);
      setCurrentUser(data.user);
      setLikedByUser(data.likedByUser ?? false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch post';
      setError(errorMessage);
      console.error('Failed to fetch post:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const toggleLike = useCallback(async () => {
    if (!currentUser?.id || !post || post.user_id === currentUser.id || isToggling) {
      return;
    }

    setIsToggling(true);
    const originalLiked = likedByUser;
    const originalLikes = post.likes;

    // Optimistic update
    const newLiked = !originalLiked;
    const newLikes = originalLiked ? post.likes - 1 : post.likes + 1;
    
    setLikedByUser(newLiked);
    setPost(prev => prev ? { ...prev, likes: newLikes } : prev);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const response = await fetch(`/api/posts/${post.slug}/actions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: "like" }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      const result = await response.json();
      
      // Update with server response
      setLikedByUser(result.liked);
      setPost(prev => prev ? { ...prev, likes: result.total_likes } : prev);

    } catch (err) {
      console.error("Failed to like post:", err);
      
      // Revert optimistic update
      setLikedByUser(originalLiked);
      setPost(prev => prev ? { ...prev, likes: originalLikes } : prev);
      
      throw err; // Re-throw for component to handle
    } finally {
      setIsToggling(false);
    }
  }, [currentUser, post, likedByUser, isToggling]);

  const updateLikes = useCallback((newCount: number, liked: boolean) => {
    setPost(prev => prev ? { ...prev, likes: newCount } : prev);
    setLikedByUser(liked);
  }, []);

  const refreshPost = useCallback(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    currentUser,
    likedByUser,
    loading,
    error,
    refreshPost,
    toggleLike,
    updateLikes,
  };
};