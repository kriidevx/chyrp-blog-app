'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, User, Heart, Trash2, Image as ImageIcon, Smile } from 'lucide-react';
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
}

interface CommentFormProps {
  postId: string;
  onCommentAdded?: (comment: Comment) => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: 'This is an amazing post! The insights are really valuable.',
      author: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      timestamp: new Date(Date.now() - 3600000),
      likes: 5,
      replies: []
    },
    {
      id: '2', 
      content: 'Great work! Looking forward to more content like this.',
      author: 'Sarah Kim',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      timestamp: new Date(Date.now() - 7200000),
      likes: 3,
      replies: []
    }
  ]);
  const [activeUsers, setActiveUsers] = useState([
    { name: 'John', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face' },
    { name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face' }
  ]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setComment(value);
    
    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    // AI suggestions when typing
    if (value.length > 10 && value.length % 20 === 0) {
      setAiSuggestions([
        'That\'s a great point!',
        'I completely agree with this perspective.',
        'Thanks for sharing this insight!'
      ]);
    } else if (value.length < 10) {
      setAiSuggestions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    try {
      // Get current authenticated user with Supabase v2
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!userData?.user) {
        alert("You must be logged in to comment.");
        setIsSubmitting(false);
        return;
      }

      const newComment: Comment = {
        id: Date.now().toString(),
        content: comment.trim(),
        author: userData.user.email || 'Anonymous',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        timestamp: new Date(),
        likes: 0,
        replies: []
      };

      // Insert comment and fetch inserted row with .select().single()
      const { data: insertedComment, error: insertError } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          author: newComment.author,
          content: newComment.content,
        })
        .select()
        .single();

      if (insertError || !insertedComment) throw insertError || new Error("Failed to insert comment");

      setComments(prev => [newComment, ...prev]);
      setComment('');
      setAiSuggestions([]);
      onCommentAdded?.(newComment);
    } catch (error) {
      console.error(error);
      alert("Error submitting comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative space-y-8 p-8 min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 bg-[length:400%_400%] animate-gradient text-slate-50">
      
      {/* Active Users */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {activeUsers.map((user, i) => (
            <div
              key={i}
              className="relative w-10 h-10 rounded-full overflow-hidden ring-4 ring-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.7)] transform hover:scale-125 transition duration-500"
            >
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-50 animate-pulse"></div>
            </div>
          ))}
        </div>
        <span className="text-sm text-slate-200">
          {activeUsers.length} people are reading this
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 relative">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={handleInputChange}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-slate-900 placeholder-slate-500"
                    rows={3}
                  />
                  
                  {/* AI Suggestions */}
                  {aiSuggestions.length > 0 && (
                    <div className="px-4 pb-2">
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 text-xs text-blue-500">
                          <Sparkles className="w-3 h-3 animate-pulse" />
                          AI Suggestions:
                        </div>
                        {aiSuggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setComment(s)}
                            className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      >
                        <ImageIcon className="w-5 h-5 text-slate-600" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      >
                        <Smile className="w-5 h-5 text-slate-600" />
                      </button>
                      {isTyping && (
                        <div className="flex gap-1 ml-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!comment.trim() || isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-xl font-semibold 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:scale-105 active:scale-95 transition-all duration-200
                               shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {comments.length} Comments
          </h3>
        </div>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white/5 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/10 dark:border-gray-700/20 p-6 hover:bg-white/10 dark:hover:bg-gray-800/40 transition-all duration-300 transform hover:scale-[1.01]"
            >
              <div className="flex items-start gap-4">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20 dark:border-gray-600/30"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="group flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                    >
                      <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-500 transition-colors duration-200 text-sm">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
