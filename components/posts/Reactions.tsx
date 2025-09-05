'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Zap, Award, Coffee, Lightbulb, Target } from 'lucide-react';
import { supabase } from "@/lib/supabase";

interface ReactionType {
  id: string;
  emoji: string;
  label: string;
  count: number;
  color: string;
  icon?: React.ReactNode;
}

const defaultReactions: ReactionType[] = [
  { id: 'fire', emoji: '�', label: 'Fire', count: 0, color: 'from-blue-500 to-cyan-500', icon: <Zap size={12} /> },
  { id: 'star', emoji: '⭐', label: 'Amazing', count: 0, color: 'from-cyan-500 to-blue-500', icon: <Award size={12} /> },
  { id: 'coffee', emoji: '☕', label: 'Helpful', count: 0, color: 'from-blue-600 to-cyan-400', icon: <Coffee size={12} /> },
  { id: 'bulb', emoji: '�', label: 'Insightful', count: 0, color: 'from-cyan-600 to-blue-400', icon: <Lightbulb size={12} /> },
  { id: 'target', emoji: '🎯', label: 'On Point', count: 0, color: 'from-blue-400 to-cyan-600', icon: <Target size={12} /> }
];

export default function Reactions({ postId }: { postId: string }) {
  const [showAll, setShowAll] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);
  const [reactions, setReactions] = useState<ReactionType[]>(defaultReactions);
  const [userReactions, setUserReactions] = useState<string[]>([]);

  // Fetch existing reactions
  useEffect(() => {
    async function fetchReactions() {
      try {
        const { data, error } = await supabase
          .from("reactions")
          .select("id, emoji")
          .eq("post_id", postId);

        if (error) throw error;

        // Update reaction counts
        const counts = data.reduce((acc: { [key: string]: number }, reaction) => {
          acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
          return acc;
        }, {});

        setReactions(defaultReactions.map(reaction => ({
          ...reaction,
          count: counts[reaction.emoji] || 0
        })));

        // Get user reactions
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          const { data: userReacts } = await supabase
            .from("reactions")
            .select("emoji")
            .eq("post_id", postId)
            .eq("user_id", user.data.user.id);

          setUserReactions(userReacts?.map(r => r.emoji) || []);
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    }

    fetchReactions();
  }, [postId]);

  const handleReaction = async (reactionId: string) => {
    const reaction = reactions.find(r => r.id === reactionId);
    if (!reaction) return;

    setAnimatingReaction(reactionId);
    
    try {
      await supabase.from("reactions").insert({ 
        post_id: postId, 
        emoji: reaction.emoji 
      });

      // Update local state
      setReactions(prev => prev.map(r => 
        r.id === reactionId ? { ...r, count: r.count + 1 } : r
      ));
      setUserReactions(prev => [...prev, reactionId]);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
    
    setTimeout(() => setAnimatingReaction(null), 600);
  };

  const visibleReactions = showAll ? reactions : reactions.slice(0, 3);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Reaction buttons */}
      {visibleReactions.map((reaction) => {
        const userReacted = userReactions.includes(reaction.id);
        const isAnimating = animatingReaction === reaction.id;
        
        return (
          <button
            key={reaction.id}
            onClick={() => handleReaction(reaction.id)}
            className={`
              group relative flex items-center gap-1.5 px-3 py-1.5
              rounded-full transition-all duration-300 transform-gpu
              hover:scale-110 active:scale-95 overflow-hidden
              ${userReacted 
                ? `bg-gradient-to-r ${reaction.color} text-white shadow-lg ring-2 ring-blue-400/30` 
                : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-slate-600 hover:text-blue-600'
              }
              backdrop-blur-xl shadow-md hover:shadow-xl
              ${isAnimating ? 'animate-pulse ring-2 ring-cyan-400/50' : ''}
            `}
          >
            <div className="flex items-center gap-1">
              <span className={`text-sm ${isAnimating ? 'animate-bounce' : ''}`}>
                {reaction.emoji}
              </span>
              {userReacted && reaction.icon && (
                <div className="text-white/80">
                  {reaction.icon}
                </div>
              )}
            </div>

            <span className={`
              text-xs font-medium transition-all duration-200
              ${isAnimating ? 'scale-125' : ''}
            `}>
              {reaction.count}
            </span>

            <div className={`
              absolute inset-0 rounded-full bg-gradient-to-r ${reaction.color} opacity-30
              scale-0 group-active:scale-150 transition-transform duration-300
            `} />

            {isAnimating && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 bg-white rounded-full animate-ping`}
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 100}ms`,
                      animationDuration: '600ms'
                    }}
                  />
                ))}
              </div>
            )}

            {userReacted && (
              <div className={`
                absolute inset-0 rounded-full bg-gradient-to-r ${reaction.color} opacity-20
                animate-pulse pointer-events-none
              `} />
            )}
          </button>
        );
      })}

      {/* Show more/less button */}
      {reactions.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="
            flex items-center gap-1 px-2 py-1.5
            bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
            rounded-full text-xs text-slate-500 hover:text-blue-500
            backdrop-blur-xl transition-all duration-200
            hover:scale-105
          "
        >
          <Plus 
            size={10} 
            className={`transition-transform duration-200 ${showAll ? 'rotate-45' : ''}`} 
          />
          {showAll ? 'Less' : `+${reactions.length - 3}`}
        </button>
      )}

      {/* Add reaction button */}
      <button className="
        flex items-center justify-center w-8 h-8
        bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-400/30
        rounded-full text-slate-400 hover:text-blue-500
        backdrop-blur-xl transition-all duration-300
        hover:scale-110 group
      ">
        <Plus size={12} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}
