import React, { useState } from 'react';

interface Reaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
  isActive: boolean;
}

interface ReactionsProps {
  postId: string;
}

const Reactions: React.FC<ReactionsProps> = ({ postId }) => {
  const [reactions, setReactions] = useState<Reaction[]>([
    { id: '1', emoji: '❤️', label: 'Love', count: 12, isActive: false },
    { id: '2', emoji: '🔥', label: 'Fire', count: 8, isActive: true },
    { id: '3', emoji: '💯', label: 'Perfect', count: 5, isActive: false },
    { id: '4', emoji: '😍', label: 'Amazing', count: 3, isActive: false },
    { id: '5', emoji: '🚀', label: 'Rocket', count: 7, isActive: false },
  ]);

  const toggleReaction = (reactionId: string) => {
    setReactions(prev => prev.map(reaction => {
      if (reaction.id === reactionId) {
        return {
          ...reaction,
          isActive: !reaction.isActive,
          count: reaction.isActive ? reaction.count - 1 : reaction.count + 1
        };
      }
      return reaction;
    }));
  };

  const activeReactions = reactions.filter(r => r.count > 0);

  if (activeReactions.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-200/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-wrap">
          {activeReactions.map((reaction) => (
            <button
              key={reaction.id}
              onClick={() => toggleReaction(reaction.id)}
              className={`group relative flex items-center space-x-1 px-3 py-2 rounded-full transition-all duration-300 hover:scale-110 ${
                reaction.isActive
                  ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span className="text-lg group-hover:animate-bounce">
                {reaction.emoji}
              </span>
              <span className={`text-sm font-medium ${
                reaction.isActive ? 'text-blue-700' : 'text-slate-600'
              }`}>
                {reaction.count}
              </span>
              
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                  {reaction.label}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-sm text-slate-500">
          {activeReactions.reduce((sum, r) => sum + r.count, 0)} reactions
        </div>
      </div>
    </div>
  );
};

export default Reactions;