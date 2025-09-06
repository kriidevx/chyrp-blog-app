'use client';

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Send, User, Heart, Trash2, MessageCircle, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  users?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  comment_likes?: Array<{ id: string; user_id: string }>;
}

interface CommentFormProps {
  postSlug: string; // Changed from postId to postSlug for consistency
  currentUserId: string;
  comments: Comment[]; // Receive comments as prop to avoid duplicate fetching
  onCommentAdded?: (comment: Comment) => void;
}

const CommentForm = memo<CommentFormProps>(({ 
  postSlug, 
  currentUserId, 
  comments: initialComments,
  onCommentAdded 
}) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update comments when prop changes
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      alert("Please login to comment");
      return;
    }
    
    const trimmedComment = comment.trim();
    if (!trimmedComment) return;

    setIsSubmitting(true);

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
          action: "comment",
          content: trimmedComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment");
      }

      const newComment = await response.json();
      
      // Add the new comment to the beginning of the list
      setComments(prev => [newComment, ...prev]);
      onCommentAdded?.(newComment);
      setComment("");

    } catch (err) {
      console.error("Failed to post comment:", err);
      alert(err instanceof Error ? err.message : "Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUserId, comment, postSlug, onCommentAdded]);

  const handleLikeComment = useCallback(async (commentId: string) => {
    if (!currentUserId) {
      alert("Please login to like comments");
      return;
    }

    setLoadingCommentId(commentId);

    // Find the comment and check current like status
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

      const result = await response.json();
      
      // Verify server response matches our optimistic update
      if (result.liked === userAlreadyLiked) {
        console.warn("Server response doesn't match optimistic update, reverting");
        // Revert optimistic update
        setComments(prev =>
          prev.map(c => {
            if (c.id === commentId) {
              return { ...c, comment_likes: currentLikes };
            }
            return c;
          })
        );
      }

    } catch (err) {
      console.error("Failed to like comment:", err);
      
      // Revert optimistic update on error
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            return { ...c, comment_likes: currentLikes };
          }
          return c;
        })
      );
      
      alert("Failed to like comment. Please try again.");
    } finally {
      setLoadingCommentId(null);
    }
  }, [currentUserId, comments, postSlug]);

  const handleDeleteComment = useCallback(async (commentId: string, commentUserId: string) => {
    if (!currentUserId || currentUserId !== commentUserId) {
      alert("You can only delete your own comments");
      return;
    }

    if (!confirm("Are you sure you want to delete this comment?")) return;

    // Optimistic update - remove comment from list
    const originalComments = comments;
    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", currentUserId);

      if (error) throw error;

    } catch (err) {
      console.error("Failed to delete comment:", err);
      
      // Revert optimistic update on error
      setComments(originalComments);
      alert("Failed to delete comment. Please try again.");
    }
  }, [currentUserId, comments]);

  const formatTimeAgo = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }, []);

  const getUserLikeStatus = useCallback((comment: Comment) => {
    const likes = comment.comment_likes || [];
    return likes.some(like => like.user_id === currentUserId);
  }, [currentUserId]);

  const getLikeCount = useCallback((comment: Comment) => {
    return comment.comment_likes?.length || 0;
  }, []);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-md">
      {/* Comments Heading */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={20} className="text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={currentUserId ? "Add a comment..." : "Login to comment..."}
          className="w-full p-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white/80 placeholder-gray-400 transition"
          rows={3}
          disabled={!currentUserId || isSubmitting}
          maxLength={1000}
        />
        
        {/* Character counter */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {comment.length}/1000 characters
          </span>
          
          <button
            type="submit"
            disabled={!comment.trim() || isSubmitting || !currentUserId}
            className="px-5 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(c => {
            const likedByUser = getUserLikeStatus(c);
            const likeCount = getLikeCount(c);
            const isLoadingLike = loadingCommentId === c.id;
            
            return (
              <div
                key={c.id}
                className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 overflow-hidden flex-shrink-0">
                  {c.users?.avatar_url ? (
                    <img 
                      src={c.users.avatar_url} 
                      alt={c.users.username} 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800 truncate">
                      {c.users?.username || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTimeAgo(c.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 break-words mb-2">{c.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(c.id)}
                      disabled={!currentUserId || isLoadingLike}
                      className={`flex items-center gap-1 transition transform hover:scale-110 ${
                        likedByUser 
                          ? 'text-red-500' 
                          : 'text-gray-500 hover:text-red-500'
                      } ${!currentUserId || isLoadingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoadingLike ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Heart size={14} className={likedByUser ? 'fill-current' : ''} />
                      )}
                      <span className="text-sm">{likeCount}</span>
                    </button>
                    
                    {currentUserId && c.user_id === currentUserId && (
                      <button
                        onClick={() => handleDeleteComment(c.id, c.user_id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition transform hover:scale-110"
                      >
                        <Trash2 size={14} />
                        <span className="text-sm">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

CommentForm.displayName = 'CommentForm';

export default CommentForm;