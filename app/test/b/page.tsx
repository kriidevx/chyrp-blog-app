'use client';

import { useState, useEffect } from 'react';
import { PenTool, FileText, Eye, Heart, MessageCircle, TrendingUp, Calendar, Settings, BarChart3, Plus, Filter, Search, Edit3, Trash2, MoreHorizontal } from 'lucide-react';

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [draggedPost, setDraggedPost] = useState(null);

  const user = {
    name: 'Sarah Chen',
    avatar: '/api/placeholder/60/60',
    totalPosts: 24,
    totalViews: 48592,
    totalLikes: 1247,
    totalComments: 892
  };

  const stats = [
    { label: 'Total Posts', value: user.totalPosts, icon: FileText, color: 'from-blue-600 to-blue-500', growth: '+12%' },
    { label: 'Total Views', value: user.totalViews.toLocaleString(), icon: Eye, color: 'from-cyan-500 to-cyan-400', growth: '+24%' },
    { label: 'Total Likes', value: user.totalLikes.toLocaleString(), icon: Heart, color: 'from-blue-600 to-cyan-500', growth: '+18%' },
    { label: 'Comments', value: user.totalComments, icon: MessageCircle, color: 'from-cyan-500 to-blue-600', growth: '+31%' }
  ];

  const posts = [
    {
      id: 1,
      title: 'Advanced React Patterns: Building Scalable Components',
      status: 'published',
      views: 15420,
      likes: 324,
      comments: 89,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16',
      category: 'Development',
      featherType: 'text'
    },
    {
      id: 2,
      title: 'My Photography Journey in Iceland',
      status: 'published',
      views: 8932,
      likes: 567,
      comments: 124,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
      category: 'Photography',
      featherType: 'photo'
    },
    {
      id: 3,
      title: 'The Future of Web Development',
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-18',
      category: 'Technology',
      featherType: 'text'
    },
    {
      id: 4,
      title: '"Code is poetry" - Donald Knuth',
      status: 'published',
      views: 3245,
      likes: 89,
      comments: 23,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
      category: 'Quotes',
      featherType: 'quote'
    },
    {
      id: 5,
      title: 'React 18 New Features Deep Dive',
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: '2024-01-19',
      updatedAt: '2024-01-19',
      category: 'Development',
      featherType: 'text'
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesFilter = selectedFilter === 'all' || post.status === selectedFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const togglePostSelection = (postId) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const getFeatherIcon = (type) => {
    switch (type) {
      case 'photo': return '📸';
      case 'quote': return '💭';
      case 'link': return '🔗';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '📝';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-xs font-semibold">Published</span>;
    }
    return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs font-semibold">Draft</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Welcome back, {user.name.split(' ')[0]}!
              </span>
            </h1>
            <p className="text-xl text-slate-900/70">
              Ready to create something amazing today?
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] ring-4 ring-blue-600/20">
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Post
              </span>
            </button>
            <button className="p-3 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300">
              <Settings className="w-5 h-5 text-slate-900" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 transform-gpu hover:scale-105 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.3)] animate-float group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-green-600 text-sm font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.growth}
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-900/70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: PenTool, label: 'New Post', color: 'from-blue-600 to-blue-500' },
              { icon: BarChart3, label: 'Analytics', color: 'from-cyan-500 to-cyan-400' },
              { icon: Eye, label: 'View Profile', color: 'from-blue-600 to-cyan-500' },
              { icon: Settings, label: 'Settings', color: 'from-cyan-500 to-blue-600' }
            ].map((action, index) => (
              <button
                key={index}
                className="group flex flex-col items-center gap-3 p-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl hover:bg-white/30 transform-gpu hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts Management */}
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900">My Posts</h2>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-900/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-12 pr-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-slate-900 placeholder-slate-900/50 focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600/50 transition-all duration-300"
                />
              </div>
              
              {/* Filter */}
              <div className="flex items-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-1">
                {['all', 'published', 'draft'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedFilter === filter
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                        : 'text-slate-900/70 hover:text-slate-900'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="bg-blue-600/20 backdrop-blur-xl border border-blue-600/30 rounded-2xl p-4 mb-6 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-semibold">
                  {selectedPosts.size} post{selectedPosts.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                    Publish Selected
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
                    Delete Selected
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedPosts(new Set());
                      setShowBulkActions(false);
                    }}
                    className="px-4 py-2 bg-white/20 backdrop-blur-xl text-slate-900 rounded-xl hover:bg-white/30 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts Table/Grid */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`group bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:bg-white/30 transform-gpu hover:scale-[1.02] transition-all duration-300 ${
                  selectedPosts.has(post.id) ? 'ring-2 ring-blue-600/50 bg-blue-600/10' : ''
                }`}
                draggable
                onDragStart={() => setDraggedPost(post.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  // Handle reordering logic here
                  setDraggedPost(null);
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => togglePostSelection(post.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedPosts.has(post.id) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-white/30 hover:border-blue-600/50'
                    }`}
                  >
                    {selectedPosts.has(post.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Feather Type Icon */}
                  <div className="text-2xl">{getFeatherIcon(post.featherType)}</div>

                  {/* Post Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      {getStatusBadge(post.status)}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-900/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.status === 'published' && (
                        <>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-blue-600/20 text-blue-600 rounded-xl hover:bg-blue-600/30 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-600/20 text-red-600 rounded-xl hover:bg-red-600/30 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/20 text-slate-900 rounded-xl hover:bg-white/30 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-900/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900/60 mb-2">No posts found</h3>
              <p className="text-slate-900/50">
                {searchQuery ? 'Try adjusting your search terms' : 'Start creating your first post!'}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes slide-in-from-top-2 {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
          animation: slide-in-from-top-2 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}