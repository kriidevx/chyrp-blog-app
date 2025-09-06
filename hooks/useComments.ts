interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  users?: User;
  comment_likes?: any[];
}

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (content: string) => Promise<Comment>;
  toggleCommentLike: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  setComments: (comments: Comment[]) => void;
}

export const useComments = (postSlug: string, currentUserId?: string): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(async (content: string): Promise<Comment> => {
    if (!currentUserId) {
      throw new Error('Authentication required');
    }

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`/api/posts/${postSlug}/actions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        action: "comment",
        content: content.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to post comment");
    }

    const newComment = await response.json();
    setComments(prev => [newComment, ...prev]);
    
    return newComment;
  }, [postSlug, currentUserId]);

  const toggleCommentLike = useCallback(async (commentId: string) => {
    if (!currentUserId) {
      throw new Error('Authentication required');
    }

    const targetComment = comments.find(c => c.id === commentId);
    if (!targetComment) return;

    const currentLikes = targetComment.comment_likes || [];
    const userAlreadyLiked = currentLikes.some(like => like.user_id === currentUserId);

    // Optimistic update
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const updatedLikes = userAlreadyLiked
            ? currentLikes.filter(like => like.user_id !== currentUserId)
            : [...currentLikes, { id: Date.now().toString(), user_id: currentUserId }];
          
          return { ...c, comment_likes: updatedLikes };
        }
        return c;
      })
    );

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`/api/posts/${postSlug}/actions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: "like_comment",
          commentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to like comment");
      }

      // If we reach here, the server operation succeeded
      // The optimistic update should be correct
      
    } catch (err) {
      // Revert optimistic update on error
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            return { ...c, comment_likes: currentLikes };
          }
          return c;
        })
      );
      throw err;
    }
  }, [postSlug, currentUserId, comments]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!currentUserId) {
      throw new Error('Authentication required');
    }

    const originalComments = comments;
    
    // Optimistic update
    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", currentUserId);

      if (error) throw error;
      
    } catch (err) {
      // Revert optimistic update on error
      setComments(originalComments);
      throw err;
    }
  }, [currentUserId, comments]);

  return {
    comments,
    loading,
    error,
    addComment,
    toggleCommentLike,
    deleteComment,
    setComments,
  };
};
