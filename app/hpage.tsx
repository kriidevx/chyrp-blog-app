"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";
import { ChevronRight, PenTool, BookOpen, TrendingUp, Users, MessageCircle } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
  author: string;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  image?: string;
  featured?: boolean;
  trending?: boolean;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Welcome to Chyrp Blog';
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Typing animation effect
  useEffect(() => {
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 100);
    
    return () => clearInterval(typeTimer);
  }, []);

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch posts from Supabase
  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        setPosts(
          (data || []).map((post: any) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            created_at: post.created_at,
            author: post.author || "Unknown",
            publishedAt: post.publishedAt || post.created_at || "",
            readTime: post.readTime || 0,
            views: post.views || 0,
            likes: post.likes || 0,
            comments: post.comments || 0,
            tags: post.tags || [],
            image: post.image,
            featured: post.featured || false,
            trending: post.trending || false,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const trendingPosts = posts.filter(post => post.trending).slice(0, 4).map(post => ({
    title: post.title,
    views: post.views,
    author: post.author,
    image: post.image || "/api/placeholder/400/250"
  }));

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Animated Background */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37,99,235,0.15), transparent 40%)`
        }}
      />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Hero content */}
        <div className="text-center z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:400%_400%] animate-gradient">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-900/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Share your thoughts, connect with readers, and build your digital presence with our modern blogging platform
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl transform-gpu transition-all duration-500 hover:scale-110 hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] ring-4 ring-blue-600/20">
              <span className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Start Writing
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button className="group px-8 py-4 bg-white/10 backdrop-blur-3xl border border-white/20 text-slate-900 font-semibold rounded-2xl transform-gpu transition-all duration-500 hover:scale-105 hover:bg-white/20">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Explore Posts
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
            {[
              { label: 'Active Writers', value: '2,847', icon: Users },
              { label: 'Posts Published', value: posts.length.toString(), icon: BookOpen },
              { label: 'Comments', value: posts.reduce((acc, post) => acc + post.comments, 0).toString(), icon: MessageCircle }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 transform-gpu hover:scale-105 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-900/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-2xl animate-float" />
      </section>

      {/* Latest Posts Section with Supabase data */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <BookOpen className="w-8 h-8 text-cyan-500" />
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Latest Posts
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Posts Section */}
      {trendingPosts.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-br from-blue-600/5 to-cyan-500/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-12 justify-center">
              <TrendingUp className="w-8 h-8 text-cyan-500" />
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Trending Now
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingPosts.map((post, index) => (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl overflow-hidden transform-gpu hover:scale-110 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.3)]"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-cyan-500/20 relative overflow-hidden">
                    {post.image && (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                        <TrendingUp className="w-4 h-4" />
                        {post.views.toLocaleString()} views
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-cyan-500 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-900/70 text-sm">by {post.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600/5 to-cyan-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">
            Built for Modern Creators
          </h2>
          <p className="text-xl text-slate-900/80 mb-12 leading-relaxed">
            Powered by Next.js, Supabase, and Tailwind CSS. Experience lightning-fast performance, 
            real-time collaboration, and stunning visual design.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tech: 'Next.js', desc: 'React Framework', color: 'from-blue-600 to-blue-500' },
              { tech: 'Supabase', desc: 'Backend as a Service', color: 'from-cyan-500 to-cyan-400' },
              { tech: 'Tailwind', desc: 'Utility-First CSS', color: 'from-blue-600 to-cyan-500' }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-8 transform-gpu hover:scale-105 transition-all duration-300 animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl`}>
                  {item.tech[0]}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.tech}</h3>
                <p className="text-slate-900/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-900/80 mb-8">
            Join thousands of creators already sharing their stories
          </p>
          
          <button className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl transform-gpu transition-all duration-500 hover:scale-110 hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] ring-4 ring-blue-600/20">
            <span className="flex items-center gap-2">
              Get Started Today
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
