"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Mic,
  Share2,
  Volume2,
  Loader2,
  ThumbsUp,
  Bookmark,
  CheckCircle2,
  List,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function PostPage() {
  const { id } = useParams();

  // Supabase state
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingTTS, setIsLoadingTTS] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch post + comments from Supabase
  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*, comments(*)")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching post:", error);
      else {
        setPost(data);
        setComments(data.comments || []);
      }
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  // ✅ Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const totalHeight = contentRef.current.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      setProgress((scrollY / totalHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Text-to-speech
  const handleSpeak = () => {
    if (!post) return;
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsLoadingTTS(true);
    const utterance = new SpeechSynthesisUtterance(post.content);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsLoadingTTS(false);
    };
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsLoadingTTS(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin h-8 w-8 text-cyan-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-cyan-400 z-50"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
      />

      {/* Header */}
      <div className="relative bg-slate-900/50 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>

          <motion.h1
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {post.title}
          </motion.h1>

          <div className="flex items-center text-slate-400 text-sm space-x-4">
            <span>By {post.author}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="max-w-4xl mx-auto px-4 py-8 prose prose-invert prose-lg"
      >
        <motion.div
          className="text-slate-200 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {post.content}
        </motion.div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={handleSpeak}
          className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-cyan-400 shadow-lg transition"
        >
          {isLoadingTTS ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isSpeaking ? (
            <Mic className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>

        <button className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-cyan-400 shadow-lg transition">
          <Share2 className="h-5 w-5" />
        </button>

        <button className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-cyan-400 shadow-lg transition">
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      {/* Comments */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-cyan-400 flex items-center mb-4">
          <MessageSquare className="h-5 w-5 mr-2" /> Comments
        </h2>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, idx) => (
              <motion.div
                key={idx}
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-slate-200">{comment.content}</p>
                <span className="text-sm text-slate-400">
                  — {comment.author || "Anonymous"}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-slate-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
