"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

type CommentFormProps = {
  postId: string;
  onCommentAdded?: (comment: Comment) => void;
};

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);

    try {
      // Get current authenticated user with Supabase v2
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!userData?.user) {
        alert("You must be logged in to comment.");
        setSubmitting(false);
        return;
      }

      const author = userData.user.email || "Anonymous";

      // Insert comment and fetch inserted row with .select().single()
      const { data: newComment, error: insertError } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          author,
          content,
        })
        .select()
        .single();

      if (insertError || !newComment) throw insertError || new Error("Failed to insert comment");

      setContent("");
      if (onCommentAdded) onCommentAdded(newComment as Comment);
    } catch (error) {
      console.error(error);
      alert("Error submitting comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        rows={4}
        className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Post Comment"}
      </button>
    </form>
  );
}
