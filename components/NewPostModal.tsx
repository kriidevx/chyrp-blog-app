import React, { useState } from 'react';
import { X, Image, Video, Smile, MapPin, Users, Globe, Lock, AtSign, Hash, Bold, Italic, Link } from 'lucide-react';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const postData = {
      content,
      privacy,
      location,
      tags,
      attachments
    };
    onSubmit(postData);
    setContent('');
    setLocation('');
    setTags([]);
    setCurrentTag('');
    setAttachments([]);
    onClose();
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-3xl"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-blue-600/10 bg-[length:400%_400%] animate-gradient"></div>
      </div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-50/95 backdrop-blur-3xl border border-cyan-500/20 rounded-3xl shadow-[0_35px_80px_rgba(37,99,235,0.2)] overflow-hidden">
        
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative flex justify-between items-center">
            <h2 className="text-xl font-black text-white">Create New Post</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 transform-gpu hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">JD</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">John Doe</h3>
              <p className="text-sm text-slate-600">@johndoe</p>
            </div>
          </div>

          {/* Text editor with formatting */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-3 p-2 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-xl">
              {[Bold, Italic, Link, AtSign, Hash].map((Icon, index) => (
                <button
                  key={index}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 transform-gpu hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="relative w-full h-32 p-4 bg-white/60 backdrop-blur-xl border-2 border-slate-200/50 focus:border-blue-600/50 rounded-2xl text-slate-900 placeholder-slate-500 resize-none focus:outline-none transition-all duration-300 transform-gpu focus:scale-[1.01]"
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${content.length > 250 ? 'text-red-500' : 'text-slate-500'}`}>
                {content.length}/280
              </span>
              <div className={`w-16 h-1 rounded-full bg-gradient-to-r from-slate-200 via-blue-500 to-cyan-500 overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                  style={{ width: `${Math.min((content.length / 280) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm rounded-full shadow-lg"
                >
                  <Hash className="w-3 h-3" />
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 bg-white/60 backdrop-blur-xl border border-slate-200/50 focus:border-blue-600/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none transition-all duration-300"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform-gpu hover:scale-105"
              >
                Add
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location..."
                className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-xl border border-slate-200/50 focus:border-blue-600/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Privacy settings */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Privacy</label>
            <div className="flex space-x-3">
              {[
                { value: 'public', icon: Globe, label: 'Public', desc: 'Everyone can see' },
                { value: 'friends', icon: Users, label: 'Friends', desc: 'Friends only' },
                { value: 'private', icon: Lock, label: 'Private', desc: 'Only you' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPrivacy(option.value)}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 transform-gpu hover:scale-105 ${
                    privacy === option.value
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 shadow-lg shadow-blue-500/20'
                      : 'border-slate-200/50 bg-white/60 text-slate-600 hover:border-blue-600/30 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <option.icon className="w-6 h-6" />
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-slate-500">{option.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Media attachments */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Media</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="flex items-center justify-center space-x-2 p-4 bg-white/60 backdrop-blur-xl border-2 border-dashed border-slate-200/50 rounded-2xl text-slate-600 hover:border-blue-600/30 hover:bg-blue-50/50 hover:text-blue-600 transition-all duration-300 transform-gpu hover:scale-105"
              >
                <Image className="w-5 h-5" />
                <span>Add Image</span>
              </button>
              <button
                className="flex items-center justify-center space-x-2 p-4 bg-white/60 backdrop-blur-xl border-2 border-dashed border-slate-200/50 rounded-2xl text-slate-600 hover:border-blue-600/30 hover:bg-blue-50/50 hover:text-blue-600 transition-all duration-300 transform-gpu hover:scale-105"
              >
                <Video className="w-5 h-5" />
                <span>Add Video</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 bg-white/60 backdrop-blur-3xl border-t border-slate-200/50">
          <div className="flex space-x-2">
            <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform-gpu hover:scale-110">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={`px-6 py-2 rounded-xl text-white shadow-lg transition-all duration-300 transform-gpu ${
                content.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-cyan-500/25 hover:scale-105'
                  : 'bg-slate-200 cursor-not-allowed'
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};