"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { Plus, Zap, Award, Coffee, Lightbulb, Target } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ReactionType {
  id: string;
  emoji: string;
  label: string;
  count: number;
  color: string;
  icon?: React.ReactNode;
}

interface ReactionsUIProps {
  postSlug: string; // Changed from postId to postSlug
  currentUserId: string;
  onUnauthorized?: () => void;
}

const defaultReactions: Omit<ReactionType, 'count'>[] = [
  {
    id: "fire",
    emoji: "🔥",
    label: "Fire",
    color: "from-orange-500 to-red-500",
    icon: <Zap size={12} />,
  },
  {
    id: "star",
    emoji: "⭐",
    label: "Amazing",
    color: "from-yellow-500 to-orange-500",
    icon: <Award size={12} />,
  },
  {
    id: "coffee",
    emoji: "☕",
    label: "Helpful",
    color: "from-amber-600 to-brown-500",
    icon: <Coffee size={12} />,
  },
  {
    id: "bulb",
    emoji: "💡",
    label: "Insightful",
    color: "from-yellow-400 to-amber-500",
    icon: <Lightbulb size={12} />,
  },
  {
    id: "target",
    emoji: "🎯",
    label: "On Point",
    color: "from-green-500 to-emerald-500",
    icon: <Target size={12} />,
  },
];

const ReactionsUI = memo<ReactionsUIProps>(({
  postSlug,
  currentUserId,
  onUnauthorized,
}) => {
  const [reactions, setReactions] = useState<ReactionType[]>(
    defaultReactions.map(r => ({ ...r, count: 0 }))
  );
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReactions = useCallback(async () => {
    if (!postSlug) return;

    try {
      // First get the post ID from slug
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", postSlug)
        .single();

      if (postError || !postData) {
        console.error("Error getting post ID:", postError);
        return;
      }

      const postId = postData.id;

      // Then get reactions for this post
      const { data: reactionData, error: reactionError } = await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", postId);

      if (reactionError) {
        console.error("Error loading reactions:", reactionError);
        return;
      }

      // Update reaction counts
      const updatedReactions = defaultReactions.map(r => {
        const count = reactionData?.filter(d => d.reaction_type === r.id).length || 0;
        return { ...r, count };
      });

      // Get user's reactions
      const userReactionIds = currentUserId && reactionData
        ? reactionData
            .filter(d => d.user_id === currentUserId)
            .map(d => d.reaction_type)
        : [];

      setReactions(updatedReactions);
      setUserReactions(userReactionIds);
    } catch (err) {
      console.error("Failed to load reactions:", err);
    } finally {
      setLoading(false);
    }
  }, [postSlug, currentUserId]);

  const handleReaction = useCallback(async (reactionId: string) => {
    if (!currentUserId) {
      onUnauthorized?.();
      return;
    }

    const alreadyReacted = userReactions.includes(reactionId);
    setAnimatingReaction(reactionId);

    // Optimistic update
    setReactions(prev =>
      prev.map(r =>
        r.id === reactionId
          ? { ...r, count: alreadyReacted ? r.count - 1 : r.count + 1 }
          : r
      )
    );

    setUserReactions(prev =>
      alreadyReacted
        ? prev.filter(r => r !== reactionId)
        : [...prev, reactionId]
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
          action: "reaction", 
          reactionId 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle reaction");
      }

      const result = await response.json();
      
      // Verify the server response matches our optimistic update
      if (result.reacted !== !alreadyReacted) {
        console.warn("Server response doesn't match optimistic update, reloading reactions");
        loadReactions();
      }

    } catch (err) {
      console.error("Failed to update reaction:", err);
      
      // Revert optimistic update on error
      setReactions(prev =>
        prev.map(r =>
          r.id === reactionId
            ? { ...r, count: alreadyReacted ? r.count + 1 : r.count - 1 }
            : r
        )
      );

      setUserReactions(prev =>
        alreadyReacted
          ? [...prev, reactionId]
          : prev.filter(r => r !== reactionId)
      );
    }

    setTimeout(() => setAnimatingReaction(null), 600);
  }, [postSlug, currentUserId, userReactions, onUnauthorized, loadReactions]);

  useEffect(() => {
    if (postSlug) {
      loadReactions();
    }
  }, [loadReactions]);

  const visibleReactions = showAll ? reactions : reactions.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="w-16 h-8 bg-gray-200 animate-pulse rounded-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleReactions.map((reaction) => {
        const userReacted = userReactions.includes(reaction.id);
        const isAnimating = animatingReaction === reaction.id;

        return (
          <button
            key={reaction.id}
            onClick={() => handleReaction(reaction.id)}
            disabled={!currentUserId}
            className={`
              group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 transform-gpu hover:scale-110 active:scale-95 overflow-hidden
              ${
                userReacted
                  ? `bg-gradient-to-r ${reaction.color} text-white shadow-lg ring-2 ring-opacity-30`
                  : "bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800"
              }
              shadow-md hover:shadow-xl
              ${isAnimating ? "animate-pulse ring-2 ring-blue-400/50" : ""}
              ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            title={`${reaction.label} (${reaction.count})`}
          >
            <div className="flex items-center gap-1">
              <span
                className={`text-sm ${isAnimating ? "animate-bounce" : ""}`}
              >
                {reaction.emoji}
              </span>
              {userReacted && reaction.icon && (
                <div className="text-white/80">{reaction.icon}</div>
              )}
            </div>
            <span
              className={`text-xs font-medium transition-all duration-200 ${
                isAnimating ? "scale-125" : ""
              }`}
            >
              {reaction.count}
            </span>

            {/* Ripple effect for active reactions */}
            {isAnimating && userReacted && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
            )}
          </button>
        );
      })}

      {reactions.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-full text-xs text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-105"
        >
          <Plus
            size={10}
            className={`transition-transform duration-200 ${
              showAll ? "rotate-45" : ""
            }`}
          />
          {showAll ? "Less" : `+${reactions.length - 3}`}
        </button>
      )}
    </div>
  );
});

ReactionsUI.displayName = 'ReactionsUI';

export default ReactionsUI;