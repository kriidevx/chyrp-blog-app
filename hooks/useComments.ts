import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useComments(postId: string) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*, profiles(*)')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setComments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const addComment = async (content: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            content,
            post_id: postId,
            user_id: user.user.id,
          },
        ])
        .select('*, profiles(*)')
        .single();

      if (error) throw error;

      setComments([...comments, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
  };
}
