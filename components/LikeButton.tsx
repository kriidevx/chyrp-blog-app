"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type LikeButtonProps = {
  postId: string;
  userId: string;
};

export default function LikeButton({ postId, userId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    async function fetchLikes() {
      if (!userId) return;
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

  async function toggleLike() {
    if (!userId) return;
    try {
      if (liked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
        setLikesCount((c) => Math.max(c - 1, 0));
        setLiked(false);
      } else {
        await supabase.from("likes").insert([{ post_id: postId, user_id: userId }]);
        setLikesCount((c) => c + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button
      aria-pressed={liked}
      onClick={toggleLike}
      disabled={!userId}
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-md font-semibold transition ${
        liked
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
      } ${!userId ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span>{liked ? "Liked" : "Like"}</span>
      <span>({likesCount})</span>
    </button>
  );
}
