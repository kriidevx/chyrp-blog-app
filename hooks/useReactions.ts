interface Reaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
  color: string;
  icon?: React.ReactNode;
}

interface UseReactionsReturn {
  reactions: Reaction[];
  userReactions: string[];
  loading: boolean;
  error: string | null;
  toggleReaction: (reactionId: string) => Promise<void>;
  refreshReactions: () => void;
}

export const useReactions = (postSlug: string, currentUserId?: string): UseReactionsReturn => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReactions = useCallback(async () => {
    if (!postSlug) return;

    try {
      setError(null);
      
      // Get post ID from slug first
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", postSlug)
        .single();

      if (postError || !postData) {
        throw new Error("Post not found");
      }

      // Get reactions for this post
      const { data: reactionData, error: reactionError } = await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", postData.id);

      if (reactionError) {
        throw new Error("Failed to load reactions");
      }

      // Process reaction data here...
      // This would include mapping to your default reactions and counting
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reactions');
    } finally {
      setLoading(false);
    }
  }, [postSlug, currentUserId]);

  const toggleReaction = useCallback(async (reactionId: string) => {
    if (!currentUserId) {
      throw new Error('Authentication required');
    }

    // Implementation similar to the component logic
    // with optimistic updates and server calls
    
  }, [postSlug, currentUserId, userReactions]);

  const refreshReactions = useCallback(() => {
    loadReactions();
  }, [loadReactions]);

  useEffect(() => {
    loadReactions();
  }, [loadReactions]);

  return {
    reactions,
    userReactions,
    loading,
    error,
    toggleReaction,
    refreshReactions,
  };
};
