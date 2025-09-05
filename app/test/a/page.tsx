"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Eye,
  MoreHorizontal,
  FileText,
  Image,
  Quote,
  ExternalLink,
  Video,
  Music,
  Upload,
  Hash,
  Calendar,
  MessageCircle,
  Tag,
  Globe,
  Save,
  Send,
  X,
  ChevronDown,
} from "lucide-react";

const ChyrpBlogPlatform = () => {
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedFeather, setSelectedFeather] = useState("text");
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    status: "draft",
    slug: "",
    tags: "",
    category: "none",
    comments: "open",
  });

  const mockPosts = [
    {
      id: 1,
      title: "Getting Started with Modern Web Development",
      status: "published",
      date: "2025-09-05",
      views: 1240,
      comments: 8,
      type: "text",
    },
    {
      id: 2,
      title: "Beautiful Sunset Photography",
      status: "draft",
      date: "2025-09-04",
      views: 0,
      comments: 0,
      type: "photo",
    },
    {
      id: 3,
      title: "Inspiration Quote of the Day",
      status: "published",
      date: "2025-09-03",
      views: 892,
      comments: 12,
      type: "quote",
    },
  ];

  const feathers = [
    {
      id: "text",
      name: "Text",
      icon: FileText,
      description: "Publish textual blog entries",
    },
    {
      id: "photo",
      name: "Photo",
      icon: Image,
      description: "Upload and display an image",
    },
    {
      id: "quote",
      name: "Quote",
      icon: Quote,
      description: "Post a quotation",
    },
    {
      id: "link",
      name: "Link",
      icon: ExternalLink,
      description: "Link out to another website",
    },
    {
      id: "video",
      name: "Video",
      icon: Video,
      description: "Upload and display a video file",
    },
    {
      id: "audio",
      name: "Audio",
      icon: Music,
      description: "Upload and play an audio file",
    },
    {
      id: "uploader",
      name: "Uploader",
      icon: Upload,
      description: "Upload and manage multiple files",
    },
  ];

  const handleNewPost = () => {
    setShowNewPostModal(true);
  };

  const handleSavePost = (publish = false) => {
    console.log("Saving post:", {
      ...postData,
      status: publish ? "published" : "draft",
    });
    setShowNewPostModal(false);
    setPostData({
      title: "",
      content: "",
      status: "draft",
      slug: "",
      tags: "",
      category: "none",
      comments: "open",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight">
                Chyrp Blog
              </h1>
              <nav className="hidden md:flex space-x-8">
                <button className="px-6 py-2 text-slate-700 hover:text-blue-600 font-medium transition-all duration-300 border-b-2 border-blue-600 text-blue-600">
                  Write
                </button>
                <button className="px-6 py-2 text-slate-600 hover:text-blue-600 font-medium transition-all duration-300">
                  Manage
                </button>
                <button className="px-6 py-2 text-slate-600 hover:text-blue-600 font-medium transition-all duration-300">
                  Settings
                </button>
                <button className="px-6 py-2 text-slate-600 hover:text-blue-600 font-medium transition-all duration-300">
                  Extend
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">📝</span>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-2">2,847</div>
            <div className="text-slate-600 font-medium">Active Writers</div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">📚</span>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-2">
              15,692
            </div>
            <div className="text-slate-600 font-medium">Posts Published</div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-2">
              84,321
            </div>
            <div className="text-slate-600 font-medium">Total Views</div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl shadow-blue-500/10 overflow-hidden">
          <div className="p-6 border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">My Posts</h2>
              <button
                onClick={handleNewPost}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Post
              </button>
            </div>
          </div>

          <div className="divide-y divide-blue-100/30">
            {mockPosts.map((post) => (
              <div
                key={post.id}
                className="p-6 hover:bg-blue-50/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors">
                        {post.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                            : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-slate-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views} views
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments} comments
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-blue-500/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                  Create New Post
                </h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex h-[70vh]">
              {/* Feathers Sidebar */}
              <div className="w-64 p-6 border-r border-blue-100/50 bg-gradient-to-b from-blue-50/30 to-cyan-50/30 overflow-y-auto">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Feathers
                </h3>
                <div className="space-y-2">
                  {feathers.map((feather) => (
                    <button
                      key={feather.id}
                      onClick={() => setSelectedFeather(feather.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                        selectedFeather === feather.id
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105"
                          : "bg-white/60 text-slate-700 hover:bg-blue-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <feather.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{feather.name}</div>
                          <div
                            className={`text-xs ${
                              selectedFeather === feather.id
                                ? "text-blue-100"
                                : "text-slate-500"
                            }`}
                          >
                            {feather.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={postData.title}
                      onChange={(e) =>
                        setPostData({ ...postData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your post title..."
                    />
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Content
                    </label>
                    <div className="bg-white/60 border border-blue-200 rounded-xl overflow-hidden">
                      {/* Toolbar */}
                      <div className="p-3 border-b border-blue-100 bg-slate-50/50">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all">
                            <strong className="text-sm">B</strong>
                          </button>
                          <button className="p-2 text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all">
                            <em className="text-sm">I</em>
                          </button>
                          <button className="p-2 text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all">
                            <u className="text-sm">U</u>
                          </button>
                          <div className="w-px h-6 bg-slate-300 mx-2"></div>
                          <button className="p-2 text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all">
                            <Image className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={postData.content}
                        onChange={(e) =>
                          setPostData({ ...postData, content: e.target.value })
                        }
                        className="w-full h-64 p-4 bg-transparent resize-none focus:outline-none"
                        placeholder="Start writing your amazing content..."
                      />
                    </div>
                  </div>

                  {/* Post Settings */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        value={postData.status}
                        onChange={(e) =>
                          setPostData({ ...postData, status: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Comments
                      </label>
                      <select
                        value={postData.comments}
                        onChange={(e) =>
                          setPostData({ ...postData, comments: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={postData.slug}
                        onChange={(e) =>
                          setPostData({ ...postData, slug: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="post-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category
                      </label>
                      <select
                        value={postData.category}
                        onChange={(e) =>
                          setPostData({ ...postData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="none">[None]</option>
                        <option value="tech">Technology</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="business">Business</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={postData.tags}
                      onChange={(e) =>
                        setPostData({ ...postData, tags: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-blue-100/50 bg-gradient-to-r from-blue-50/30 to-cyan-50/30">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleSavePost(false)}
                  className="inline-flex items-center px-6 py-3 bg-white/80 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Draft
                </button>
                <button
                  onClick={() => handleSavePost(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChyrpBlogPlatform;
