import React from 'react';
import { Users } from 'lucide-react';

interface MentionedUser {
  id: string;
  username: string;
  name: string;
}

const mentionedUsers: MentionedUser[] = [
  { id: '1', username: 'johnsmith', name: 'John Smith' },
  { id: '2', username: 'sarahjones', name: 'Sarah Jones' },
  { id: '3', username: 'mikebrown', name: 'Mike Brown' },
];

const MentionedPpl: React.FC = () => {
  if (mentionedUsers.length === 0) return null;

  return (
    <div className="flex items-center space-x-3 py-3 px-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 backdrop-blur-sm border border-blue-200/30 rounded-xl mb-4">
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700">Mentioned:</span>
      </div>
      
      <div className="flex items-center space-x-2 flex-1">
        {mentionedUsers.slice(0, 3).map((user, index) => (
          <div key={user.id} className="flex items-center">
            <button className="group flex items-center space-x-1 hover:bg-white/60 px-2 py-1 rounded-lg transition-all duration-200">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center ring-1 ring-blue-400/20">
                <span className="text-white font-bold text-xs">
                  {user.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                @{user.username}
              </span>
            </button>
            {index < Math.min(mentionedUsers.length, 3) - 1 && (
              <span className="text-slate-400 mx-1">•</span>
            )}
          </div>
        ))}
        
        {mentionedUsers.length > 3 && (
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-white/60 transition-all duration-200">
            +{mentionedUsers.length - 3} more
          </button>
        )}
      </div>
    </div>
  );
};

export default MentionedPpl;