import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useLikes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const toggleLike = async (postId: string) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Check if user has already liked the post
      const { data: existingLike } = await supabase
        .from('likes')
        .select()
        .eq('post_id', postId)
        .eq('user_id', user.user.id)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) throw error;
        return false;
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: user.user.id }]);

        if (error) throw error;
        return true;
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLikeStatus = async (postId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const { data } = await supabase
        .from('likes')
        .select()
        .eq('post_id', postId)
        .eq('user_id', user.user.id)
        .single();

      return !!data;
    } catch {
      return false;
    }
  };

  const getLikeCount = async (postId: string) => {
    try {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('post_id', postId);

      return count || 0;
    } catch {
      return 0;
    }
  };

  return {
    toggleLike,
    getLikeStatus,
    getLikeCount,
    loading,
    error,
  };
}