"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User, MapPin, Globe, Calendar, Heart, MessageCircle } from 'lucide-react';

// Simple Post Card
const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Media */}
      {post.media?.[0] && (
        <img
          src={post.media[0].url}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        {/* Post Type Badge */}
        {post.feather_type !== 'text' && (
          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded mb-2 capitalize">
            {post.feather_type}
          </span>
        )}
        
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        {/* Content Preview */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {post.excerpt || post.content}
        </p>
        
        {/* Stats & Date */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.comments_count || 0}
            </span>
          </div>
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

// Simple Profile Header
const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-lg text-gray-600 mb-3">@{user.username}</p>
          
          {user.bio && (
            <p className="text-gray-700 mb-3">{user.bio}</p>
          )}
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </span>
            )}
            {user.website && (
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline"
              >
                <Globe className="w-4 h-4" />
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Profile Page
export default function SimpleProfilePage() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const username = Array.isArray(params.username) ? params.username[0] : params.username;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function fetchData() {
      try {
        setLoading(true);

        // Fetch user
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (userError) {
          throw userError;
        }

        setUser(userData);

        // Fetch published posts with basic data
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(`
            id,
            title,
            content,
            excerpt,
            feather_type,
            created_at,
            post_media!inner(url, alt_text, order),
            likes:likes(count),
            comments:comments(count)
          `)
          .eq("user_id", userData.id)
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(20);

        if (postsError) {
          console.error('Posts error:', postsError);
          setPosts([]);
        } else {
          // Process posts data
          const processedPosts = postsData?.map(post => ({
            ...post,
            media: post.post_media?.sort((a, b) => a.order - b.order) || [],
            likes_count: post.likes?.[0]?.count || 0,
            comments_count: post.comments?.[0]?.count || 0
          })) || [];
          
          setPosts(processedPosts);
        }

      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">{error || "User doesn't exist"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader user={user} />
        
        {/* Posts Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Posts ({posts.length})
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No published posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}