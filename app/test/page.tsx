'use client';
import React, { useState } from 'react';
import { 
  Edit3, 
  Eye, 
  FileText, 
  Image, 
  Quote, 
  ExternalLink, 
  Video, 
  Music, 
  Upload, 
  Calendar, 
  MessageCircle,
  Tag,
  Globe,
  Save,
  Send,
  ArrowLeft,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

const EditPostPage = () => {
  const [selectedFeather, setSelectedFeather] = useState('text');
  const [postData, setPostData] = useState({
    title: 'Getting Started with Modern Web Development',
    content: 'Welcome to the exciting world of modern web development! In this comprehensive guide, we\'ll explore the latest trends, tools, and techniques that are shaping the future of web development.\n\nFrom responsive design principles to cutting-edge JavaScript frameworks, we\'ll cover everything you need to know to build amazing web experiences that users love.\n\nWhether you\'re a beginner looking to get started or an experienced developer wanting to stay current with the latest technologies, this post has something valuable for everyone.',
    status: 'published',
    slug: 'getting-started-modern-web-development',
    tags: 'web development, javascript, html, css, react',
    category: 'tech',
    comments: 'open',
    createdDate: '2025-09-05',
    views: 1240,
    commentCount: 8
  });

  const feathers = [
    { id: 'text', name: 'Text', icon: FileText, description: 'Publish textual blog entries' },
    { id: 'photo', name: 'Photo', icon: Image, description: 'Upload and display an image' },
    { id: 'quote', name: 'Quote', icon: Quote, description: 'Post a quotation' },
    { id: 'link', name: 'Link', icon: ExternalLink, description: 'Link out to another website' },
    { id: 'video', name: 'Video', icon: Video, description: 'Upload and display a video file' },
    { id: 'audio', name: 'Audio', icon: Music, description: 'Upload and play an audio file' },
    { id: 'uploader', name: 'Uploader', icon: Upload, description: 'Upload and manage multiple files' }
  ];

  const handleSavePost = (publish = false) => {
    console.log('Updating post:', { ...postData, status: publish ? 'published' : 'draft' });
  };

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      console.log('Deleting post...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight">
                  Edit Post
                </h1>
                <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created {postData.createdDate}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {postData.views} views
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {postData.commentCount} comments
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDeletePost}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-200">
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-blue-500/20 overflow-hidden">
          <div className="flex h-[80vh]">
            {/* Feathers Sidebar */}
            <div className="w-64 p-6 border-r border-blue-100/50 bg-gradient-to-b from-blue-50/30 to-cyan-50/30 overflow-y-auto">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Feathers</h3>
              <div className="space-y-2">
                {feathers.map((feather) => (
                  <button
                    key={feather.id}
                    onClick={() => setSelectedFeather(feather.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                      selectedFeather === feather.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105'
                        : 'bg-white/60 text-slate-700 hover:bg-blue-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <feather.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{feather.name}</div>
                        <div className={`text-xs ${selectedFeather === feather.id ? 'text-blue-100' : 'text-slate-500'}`}>
                          {feather.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Post Status Info */}
              <div className="mt-8 p-4 bg-white/60 rounded-xl border border-white/40">
                <h4 className="font-semibold text-slate-700 mb-3">Post Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      postData.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {postData.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Views:</span>
                    <span className="font-medium">{postData.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Comments:</span>
                    <span className="font-medium">{postData.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={postData.title}
                    onChange={(e) => setPostData({...postData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your post title..."
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
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
                        <div className="ml-auto text-xs text-slate-500">
                          {postData.content.length} characters
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={postData.content}
                      onChange={(e) => setPostData({...postData, content: e.target.value})}
                      className="w-full h-80 p-4 bg-transparent resize-none focus:outline-none"
                      placeholder="Start writing your amazing content..."
                    />
                  </div>
                </div>

                {/* Post Settings */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={postData.status}
                      onChange={(e) => setPostData({...postData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Comments</label>
                    <select
                      value={postData.comments}
                      onChange={(e) => setPostData({...postData, comments: e.target.value})}
                      className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                    <input
                      type="text"
                      value={postData.slug}
                      onChange={(e) => setPostData({...postData, slug: e.target.value})}
                      className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="post-slug"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={postData.category}
                      onChange={(e) => setPostData({...postData, category: e.target.value})}
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={postData.tags}
                    onChange={(e) => setPostData({...postData, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-blue-100/50 bg-gradient-to-r from-blue-50/30 to-cyan-50/30">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                Last saved: Just now
              </div>
              <div className="flex space-x-4">
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
                  {postData.status === 'published' ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;