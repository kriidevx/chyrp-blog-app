'use client';

import React, { useState, useEffect } from "react";
import { Heart, Zap, ThumbsUp, Star, Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LikeButtonProps {
  postId?: string;
  initialLikes?: number;
  initialIsLiked?: boolean;
  variant?: "heart" | "thumbs" | "star" | "fire" | "zap";
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  animated?: boolean;
  userId?: string; // Added userId prop
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId = "1",
  initialLikes = 42,
  initialIsLiked = false,
  variant = "heart",
  size = "md",
  showCount = true,
  animated = true,
  userId, // Added userId to destructure
}) => {
  const [liked, setLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    async function fetchLikes() {
      if (!userId) return; // Only fetch if userId is present
      try {
        const { data, error } = await supabase
          .from("likes")
          .select("*", { count: "exact" })
          .eq("post_id", postId);
        if (error) throw error;

        setLikesCount(data ? data.length : 0);

        const userLiked = await supabase
          .from("likes")
          .select("*")
          .eq("post_id", postId)
          .eq("user_id", userId)
          .single();

        setLiked(!!userLiked.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLikes();
  }, [postId, userId]);

  const getIcon = () => {
    switch (variant) {
      case "thumbs":
        return ThumbsUp;
      case "star":
        return Star;
      case "fire":
        return Flame;
      case "zap":
        return Zap;
      default:
        return Heart;
    }
  };

  const getColors = () => {
    switch (variant) {
      case "thumbs":
        return {
          liked: "text-blue-500 border-blue-500 shadow-blue-500/25",
          unliked: "text-gray-400 border-slate-700/50",
          hover: "hover:text-blue-400 hover:border-blue-400/50",
        };
      case "star":
        return {
          liked: "text-yellow-500 border-yellow-500 shadow-yellow-500/25",
          unliked: "text-gray-400 border-slate-700/50",
          hover: "hover:text-yellow-400 hover:border-yellow-400/50",
        };
      case "fire":
        return {
          liked: "text-orange-500 border-orange-500 shadow-orange-500/25",
          unliked: "text-gray-400 border-slate-700/50",
          hover: "hover:text-orange-400 hover:border-orange-400/50",
        };
      case "zap":
        return {
          liked: "text-cyan-500 border-cyan-500 shadow-cyan-500/25",
          unliked: "text-gray-400 border-slate-700/50",
          hover: "hover:text-cyan-400 hover:border-cyan-400/50",
        };
      default:
        return {
          liked: "text-pink-500 border-pink-500 shadow-pink-500/25",
          unliked: "text-gray-400 border-slate-700/50",
          hover: "hover:text-pink-400 hover:border-pink-400/50",
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-1.5";
      case "lg":
        return "p-3";
      default:
        return "p-2";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-3 w-3";
      case "lg":
        return "h-6 w-6";
      default:
        return "h-4 w-4";
    }
  };

  const colors = getColors();
  const Icon = getIcon();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return; // Only allow like if userId is present

    if (animated) {
      setIsAnimating(true);

      // Create particle explosion
      if (liked === false) {
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 60 - 30,
          y: Math.random() * 60 - 30,
        }));
        setParticles(newParticles);

        // Remove particles after animation
        setTimeout(() => setParticles([]), 1000);
      }

      setTimeout(() => setIsAnimating(false), 300);
    }

    // Update state
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    // Here you would typically make an API call
    try {
      if (liked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
      } else {
        await supabase.from("likes").insert([{ post_id: postId, user_id: userId }]);
      }
    } catch (error) {
      // Revert on error
      setLiked(liked);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="relative inline-flex items-center space-x-2">
      {/* Particle Effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-1 h-1 bg-gradient-to-r ${
            variant === "heart"
              ? "from-pink-500 to-red-500"
              : variant === "thumbs"
              ? "from-blue-500 to-blue-600"
              : variant === "star"
              ? "from-yellow-500 to-orange-500"
              : variant === "fire"
              ? "from-orange-500 to-red-500"
              : "from-cyan-500 to-blue-500"
          } rounded-full opacity-100 animate-ping`}
          style={{
            left: `50%`,
            top: `50%`,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            animationDuration: "1s",
            animationFillMode: "forwards",
          }}
        />
      ))}

      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={!userId} // Disable if no userId
        className={`
          relative ${getSizeClasses()} rounded-lg border backdrop-blur-xl
          transition-all duration-300 transform
          ${liked
            ? `bg-gradient-to-r ${
                colors.liked.includes("pink")
                  ? "from-pink-500/20 to-red-500/20"
                  : colors.liked.includes("blue")
                  ? "from-blue-500/20 to-blue-600/20"
                  : colors.liked.includes("yellow")
                  ? "from-yellow-500/20 to-orange-500/20"
                  : colors.liked.includes("orange")
                  ? "from-orange-500/20 to-red-500/20"
                  : "from-cyan-500/20 to-blue-500/20"
              } ${colors.liked} shadow-lg`
            : `bg-slate-800/50 ${colors.unliked} ${colors.hover}`
          }
          ${isAnimating ? "scale-125" : "hover:scale-110"}
          group overflow-hidden
        `}
      >
        {/* Background Glow */}
        <div
          className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-r ${
            variant === "heart"
              ? "from-pink-500/10 to-red-500/10"
              : variant === "thumbs"
              ? "from-blue-500/10 to-blue-600/10"
              : variant === "star"
              ? "from-yellow-500/10 to-orange-500/10"
              : variant === "fire"
              ? "from-orange-500/10 to-red-500/10"
              : "from-cyan-500/10 to-blue-500/10"
          }
        `}
        />

        <Icon
          className={`
          ${getIconSize()} relative z-10 transition-all duration-300
          ${liked ? "fill-current animate-pulse" : ""}
          ${isAnimating ? "animate-bounce" : ""}
        `}
        />

        {/* Ripple Effect */}
        {isAnimating && (
          <div
            className={`
            absolute inset-0 rounded-lg animate-ping
            ${variant === "heart"
              ? "bg-pink-500/30"
              : variant === "thumbs"
              ? "bg-blue-500/30"
              : variant === "star"
              ? "bg-yellow-500/30"
              : variant === "fire"
              ? "bg-orange-500/30"
              : "bg-cyan-500/30"
            }
          `}
          />
        )}
      </button>

      {/* Like Count */}
      {showCount && (
        <span
          className={`
          text-sm font-medium transition-all duration-300
          ${liked
            ? variant === "heart"
              ? "text-pink-400"
              : variant === "thumbs"
              ? "text-blue-400"
              : variant === "star"
              ? "text-yellow-400"
              : variant === "fire"
              ? "text-orange-400"
              : "text-cyan-400"
            : "text-gray-400"
          }
          ${isAnimating ? "scale-110" : ""}
        `}
        >
          {likesCount.toLocaleString()}
        </span>
      )}

      {/* Floating Hearts Animation for Heart Variant */}
      {variant === "heart" && isAnimating && liked && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-500 animate-bounce opacity-100"
              style={{
                left: `${50 + (i - 1) * 20}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.8s",
                animationFillMode: "forwards",
                fontSize: "0.75rem",
              }}
            >
              ♥
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default LikeButton;
