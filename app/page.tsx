"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  PenTool,
  BookOpen,
  TrendingUp,
  Users,
  MessageCircle,
  Eye,
  Play,
  Globe,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import PostCard from "@/components/PostCard"; // Adjust path if needed

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ChyrpHomepage() {
  const router = useRouter();

  const [typedText, setTypedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
  }>({ totalUsers: 0, totalPosts: 0, totalComments: 0 });

  const phrases = [
    "Welcome to Chyrp Blog",
    "From Legacy to Modern",
    "Experience the Future",
    "Built for Creators",
  ];

  // Typing animation with phrase cycling
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let i = 0;
    let isDeleting = false;

    const typeTimer = setInterval(
      () => {
        if (!isDeleting && i < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, i + 1));
          i++;
        } else if (!isDeleting && i === currentPhrase.length) {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        } else if (isDeleting && i > 0) {
          setTypedText(currentPhrase.slice(0, i - 1));
          i--;
        } else if (isDeleting && i === 0) {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          isDeleting = false;
          clearInterval(typeTimer);
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearInterval(typeTimer);
  }, [currentPhraseIndex]);

  // Generate particles on mount
  useEffect(() => {
    const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
      size: Math.random() > 0.5 ? "w-1 h-1" : "w-2 h-2",
      opacity: Math.random() > 0.5 ? "opacity-20" : "opacity-40",
    }));
    setParticles(generatedParticles);
  }, []);

  // Mouse move tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auth listener and session load
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  // Fetch latest 6 posts, and stats for totals: users, posts, comments
  useEffect(() => {
    async function fetchData() {
      setLoadingPosts(true);

      // Fetch latest 6 posts ordered by created_at desc
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (postsError) {
        console.error("Error fetching posts:", postsError);
      } else {
        setPosts(postsData ?? []);
      }

      // Fetch total users count
      const { count: userCount, error: userCountErr } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });
      const totalUsers = userCountErr ? 0 : userCount ?? 0;

      // Fetch total posts count
      const { count: postsCount, error: postsCountErr } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });
      const totalPosts = postsCountErr ? 0 : postsCount ?? 0;

      // Fetch total comments count (assumes comments table)
      const { count: commentsCount, error: commentsCountErr } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true });
      const totalComments = commentsCountErr ? 0 : commentsCount ?? 0;

      setStats({
        totalUsers,
        totalPosts,
        totalComments,
      });

      setLoadingPosts(false);
    }
    fetchData();
  }, []);

  // Login & Logout handlers
  const handleLogin = () => {
    router.push("/auth/login");
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  // Navigation handlers
  const handleStartWriting = () => {
    if (user) router.push("/dashboard");
    else router.push("/auth/login");
  };
  const handleExplorePosts = () => {
    router.push("/posts");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden relative">
      {/* Background radial gradient on mouse */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.15), transparent 40%)`,
        }}
      />
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute ${particle.size} bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full ${particle.opacity} animate-float`}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Top-right login/logout button */}
      <div className="fixed top-6 right-6 z-20">
        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
            type="button"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            type="button"
          >
            Login
          </button>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center z-10 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-4 select-none">
          <span className="block text-slate-900 mb-2">Chyrp Blog</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:400%_400%] animate-gradient">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-700 mb-8 max-w-3xl leading-relaxed">
          We transformed a 16-year-old PHP blogging platform into a cutting-edge
          Next.js application.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold">
            Experience the future of blogging.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 w-full max-w-md">
          <button
            onClick={handleStartWriting}
            className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl transform-gpu transition-all duration-500 hover:scale-110 hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] ring-4 ring-blue-600/20 flex justify-center items-center gap-2"
            type="button"
          >
            <PenTool className="w-5 h-5" />
            Start Writing
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleExplorePosts}
            className="group w-full px-8 py-4 bg-white/60 backdrop-blur-xl border border-white/40 text-slate-700 font-semibold rounded-2xl transform-gpu transition-all duration-500 hover:scale-105 hover:bg-white/80 hover:shadow-xl flex justify-center items-center gap-2"
            type="button"
          >
            <BookOpen className="w-5 h-5" />
            Explore Posts
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full max-w-4xl">
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-2">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-slate-600 font-medium">Active Writers</div>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-2">
              {stats.totalPosts.toLocaleString()}
            </div>
            <div className="text-slate-600 font-medium">Posts Published</div>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-2">
              {stats.totalComments.toLocaleString()}
            </div>
            <div className="text-slate-600 font-medium">Comments</div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <TrendingUp className="w-8 h-8 text-cyan-500" />
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Latest Posts
          </h2>
        </div>
        {loadingPosts ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug || post.id.toString()}
                title={post.title}
                excerpt={post.excerpt}
                created_at={post.created_at}
                author={post.author || "Unknown"}
                likes={post.likes || 0}
                comments={post.comments || 0}
                tags={post.tags || []}
                trending={post.trending || false}
                image={post.image}
                isGrid={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600/5 to-cyan-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-8">
            Ready to Start Writing?
          </h2>
          <p className="text-xl text-slate-700 mb-12 max-w-2xl mx-auto">
            Join thousands of creators already sharing their stories on our
            modern platform
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleStartWriting}
              className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl transform-gpu transition-all duration-500 hover:scale-110 hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] ring-4 ring-blue-600/20"
              type="button"
            >
              <span className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Start Writing Today
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
