import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import MentionedPpl from './MentionedPeople';
import Reactions from './Reactions';

interface PostCardProps {
  post: {
    id: string;
    author: {
      name: string;
      username: string;
      avatar: string;
    };
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
            <span className="text-white font-bold text-lg">
              {post.author.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{post.author.name}</h3>
            <p className="text-sm text-slate-600">@{post.author.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500">{post.timestamp}</span>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-slate-800 leading-relaxed">{post.content}</p>
        {post.image && (
          <div className="mt-4 rounded-xl overflow-hidden">
            <img 
              src={post.image} 
              alt="Post content"
              className="w-full h-64 object-cover"
            />
          </div>
        )}
      </div>

      {/* Mentioned People */}
      <MentionedPpl />

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
              isLiked 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">{post.shares}</span>
          </button>
        </div>
        
        <button 
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked 
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Reactions */}
      <Reactions postId={post.id} />
    </div>
  );
};

export default PostCard;