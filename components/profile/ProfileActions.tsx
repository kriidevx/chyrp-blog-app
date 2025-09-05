import React, { useState } from 'react';
import { UserPlus, UserMinus, MessageCircle, Share2, MoreVertical, Bell, BellOff } from 'lucide-react';

interface ProfileActionProps {
  userId: string;
  isFollowing?: boolean;
  isCurrentUser?: boolean;
  isNotifying?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  onNotificationToggle?: () => void;
}

export default function ProfileAction({
  userId,
  isFollowing = false,
  isCurrentUser = false,
  isNotifying = false,
  onFollow,
  onUnfollow,
  onMessage,
  onShare,
  onNotificationToggle
}: ProfileActionProps) {
  const [isActioning, setIsActioning] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFollowAction = async () => {
    setIsActioning(true);
    try {
      if (isFollowing) {
        await onUnfollow?.();
      } else {
        await onFollow?.();
      }
    } finally {
      setTimeout(() => setIsActioning(false), 300);
    }
  };

  if (isCurrentUser) {
    return (
      <div className="flex items-center gap-2">
        {/* Edit Profile Button */}
        <button className="
          px-6 py-2.5 rounded-xl font-medium text-sm
          bg-gradient-to-r from-blue-600 to-cyan-500
          hover:from-blue-700 hover:to-cyan-600
          text-white shadow-lg shadow-blue-500/25
          hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]
          hover:scale-105 transition-all duration-300
          transform-gpu ring-2 ring-blue-400/20 hover:ring-blue-400/40
        ">
          Edit Profile
        </button>
        
        {/* Settings */}
        <button className="
          p-2.5 rounded-xl
          bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30
          backdrop-blur-xl shadow-lg hover:shadow-xl
          hover:scale-105 transition-all duration-300
          text-slate-600 hover:text-blue-600
        ">
          <MoreVertical size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Follow/Unfollow Button */}
      <button
        onClick={handleFollowAction}
        disabled={isActioning}
        className={`
          px-6 py-2.5 rounded-xl font-medium text-sm
          transition-all duration-300 transform-gpu
          hover:scale-105 relative overflow-hidden group
          ${isFollowing
            ? 'bg-white/10 hover:bg-red-500/10 border border-white/20 hover:border-red-400/30 text-slate-700 hover:text-red-500'
            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
          }
          backdrop-blur-xl ring-2 ${isFollowing ? 'ring-red-400/10 hover:ring-red-400/30' : 'ring-blue-400/20 hover:ring-blue-400/40'}
          ${isActioning ? 'animate-pulse scale-95' : ''}
        `}
      >
        <div className="flex items-center gap-2 relative z-10">
          {isActioning ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isFollowing ? (
            <UserMinus size={16} />
          ) : (
            <UserPlus size={16} />
          )}
          <span className="hidden group-hover:inline sm:inline">
            {isFollowing ? 'Unfollow' : 'Follow'}
          </span>
        </div>
        
        {/* Ripple effect */}
        <div className={`
          absolute inset-0 rounded-xl bg-gradient-to-r 
          ${isFollowing ? 'from-red-400/20 to-red-500/20' : 'from-blue-400/20 to-cyan-400/20'}
          scale-0 group-active:scale-150 transition-transform duration-300
        `} />
      </button>

      {/* Notification Bell (only when following) */}
      {isFollowing && (
        <button
          onClick={onNotificationToggle}
          className={`
            p-2.5 rounded-xl transition-all duration-300
            hover:scale-105 transform-gpu
            ${isNotifying
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600 ring-2 ring-cyan-400/30'
              : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-slate-600 hover:text-cyan-600'
            }
            backdrop-blur-xl shadow-lg hover:shadow-xl
          `}
          title={isNotifying ? 'Turn off notifications' : 'Turn on notifications'}
        >
          {isNotifying ? <Bell size={18} /> : <BellOff size={18} />}
        </button>
      )}

      {/* Message Button */}
      <button
        onClick={onMessage}
        className="
          p-2.5 rounded-xl
          bg-white/10 hover:bg-blue-500/10 border border-white/20 hover:border-blue-400/30
          backdrop-blur-xl shadow-lg hover:shadow-xl
          text-slate-600 hover:text-blue-600
          hover:scale-105 transition-all duration-300 transform-gpu
          group
        "
        title="Send message"
      >
        <MessageCircle size={18} className="group-hover:animate-pulse" />
      </button>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="
          p-2.5 rounded-xl
          bg-white/10 hover:bg-cyan-500/10 border border-white/20 hover:border-cyan-400/30
          backdrop-blur-xl shadow-lg hover:shadow-xl
          text-slate-600 hover:text-cyan-600
          hover:scale-105 transition-all duration-300 transform-gpu
          group
        "
        title="Share profile"
      >
        <Share2 size={18} className="group-hover:rotate-12 transition-transform duration-200" />
      </button>

      {/* More Actions */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="
            p-2.5 rounded-xl
            bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30
            backdrop-blur-xl shadow-lg hover:shadow-xl
            text-slate-600 hover:text-slate-800
            hover:scale-105 transition-all duration-300 transform-gpu
          "
        >
          <MoreVertical size={18} />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="
            absolute right-0 top-full mt-2 w-48
            bg-white/95 backdrop-blur-xl border border-white/30
            rounded-xl shadow-2xl shadow-black/10
            py-2 z-50
            animate-in slide-in-from-top-2 duration-200
          ">
            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50/50 transition-colors">
              Block User
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50/50 transition-colors">
              Report Profile
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50/50 transition-colors">
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
