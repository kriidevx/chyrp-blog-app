import React from 'react';
import { MapPin, Calendar, Link2, Users, BookOpen, Award, Verified } from 'lucide-react';

interface ProfileInfoProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    bio?: string;
    avatar?: string;
    location?: string;
    website?: string;
    joinedDate: string;
    isVerified?: boolean;
    followerCount: number;
    followingCount: number;
    postCount: number;
    badges?: string[];
  };
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <div className="relative">
        {/* Avatar */}
        <div className="relative inline-block">
          <div className="
            w-24 h-24 sm:w-32 sm:h-32 rounded-full
            bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600
            p-0.5 shadow-2xl shadow-blue-500/25
          ">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=2563eb&color=ffffff&size=128`}
              alt={user.displayName}
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>
          
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full border-2 border-white shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
          </div>

          {/* Verification badge */}
          {user.isVerified && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Verified size={14} className="text-white fill-current" />
            </div>
          )}
        </div>
      </div>

      {/* Name and Username */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {user.displayName}
          </h1>
          {user.isVerified && (
            <Verified size={20} className="text-blue-500 fill-current" />
          )}
        </div>
        
        <p className="text-slate-500 text-sm sm:text-base">@{user.username}</p>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="
          p-4 rounded-xl
          bg-white/10 backdrop-blur-xl border border-white/20
          shadow-lg
        ">
          <p className="text-slate-700 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="
          text-center p-3 rounded-xl
          bg-white/10 backdrop-blur-xl border border-white/20
          shadow-lg hover:shadow-xl hover:bg-white/15
          transition-all duration-300 group
        ">
          <div className="flex items-center justify-center mb-1">
            <BookOpen size={16} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="text-lg font-bold text-slate-800">
            {formatCount(user.postCount)}
          </div>
          <div className="text-xs text-slate-500">Posts</div>
        </div>

        <div className="
          text-center p-3 rounded-xl
          bg-white/10 backdrop-blur-xl border border-white/20
          shadow-lg hover:shadow-xl hover:bg-white/15
          transition-all duration-300 group cursor-pointer
        ">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="text-cyan-500 group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="text-lg font-bold text-slate-800">
            {formatCount(user.followerCount)}
          </div>
          <div className="text-xs text-slate-500">Followers</div>
        </div>

        <div className="
          text-center p-3 rounded-xl
          bg-white/10 backdrop-blur-xl border border-white/20
          shadow-lg hover:shadow-xl hover:bg-white/15
          transition-all duration-300 group cursor-pointer
        ">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="text-lg font-bold text-slate-800">
            {formatCount(user.followingCount)}
          </div>
          <div className="text-xs text-slate-500">Following</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3">
        {/* Location */}
        {user.location && (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin size={16} className="text-cyan-500" />
            <span className="text-sm">{user.location}</span>
          </div>
        )}

        {/* Website */}
        {user.website && (
          <div className="flex items-center gap-2 text-slate-600">
            <Link2 size={16} className="text-blue-500" />
            <a 
              href={user.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              {user.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}

        {/* Join date */}
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar size={16} className="text-slate-500" />
          <span className="text-sm">Joined {formatDate(user.joinedDate)}</span>
        </div>
      </div>

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Award size={16} className="text-cyan-500" />
            Achievements
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, index) => (
              <span
                key={index}
                className="
                  px-3 py-1 rounded-full text-xs font-medium
                  bg-gradient-to-r from-blue-500/10 to-cyan-500/10
                  border border-blue-400/20 text-blue-700
                  hover:from-blue-500/20 hover:to-cyan-500/20
                  hover:border-blue-400/30 hover:scale-105
                  transition-all duration-200
                "
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}