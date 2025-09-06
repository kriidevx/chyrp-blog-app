'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface MentionedUser {
  id: string;
  username: string;
  name: string;
  avatar_url?: string;
}

interface MentionedPeopleProps {
  postId: string;
  mentioned: MentionedUser[];
}

const MentionedPeople: React.FC<MentionedPeopleProps> = ({ postId, mentioned }) => {
  // Use the mentioned prop directly instead of fetching from database
  const mentionedUsers = mentioned || [];

  if (mentionedUsers.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-gradient-to-r from-blue-50/60 to-cyan-50/60 backdrop-blur-md border border-blue-200/30 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-2 mb-1 sm:mb-0">
        <Users className="w-5 h-5 text-blue-600" />
        <span className="text-sm font-semibold text-blue-700">Mentioned:</span>
      </div>

      <div className="flex items-center space-x-3 flex-wrap">
        {mentionedUsers.slice(0, 3).map((user) => (
          <button
            key={user.id}
            className="group flex items-center space-x-2 px-2 py-1 rounded-xl hover:bg-white/40 transition-all duration-200 transform hover:scale-105"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center ring-1 ring-blue-400/30 text-white font-semibold text-sm overflow-hidden">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
              @{user.username}
            </span>
          </button>
        ))}

        {mentionedUsers.length > 3 && (
          <button className="text-sm text-blue-600 font-medium px-2 py-1 rounded-xl hover:bg-white/40 transition-all duration-200">
            +{mentionedUsers.length - 3} more
          </button>
        )}
      </div>
    </div>
  );
};

export default MentionedPeople;