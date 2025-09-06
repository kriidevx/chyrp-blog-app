import React, { useState } from "react";
import {
  UserPlus,
  UserMinus,
  MessageCircle,
  Share2,
  MoreVertical,
  Bell,
  BellOff,
} from "lucide-react";

interface ProfileActionProps {
  userId: string;
  isFollowing?: boolean;
  isOwner?: boolean;
  isNotifying?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  onNotificationToggle?: () => void;
  onEditProfile?: () => void;
}

export default function ProfileAction({
  userId,
  isFollowing = false,
  isOwner = false,
  isNotifying = false,
  //onFollow,
  //onUnfollow,
  //onMessage,
  //onShare,
  //onNotificationToggle,
  onEditProfile,
}: ProfileActionProps) {
  const [isActioning, setIsActioning] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Disabled to prevent action for now.
  /*
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
  */

  if (isOwner) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onEditProfile}
          className="
            px-6 py-2.5 rounded-xl font-medium text-sm
            bg-gradient-to-r from-blue-600 to-cyan-500
            hover:from-blue-700 hover:to-cyan-600
            text-white shadow-lg shadow-blue-500/25
            hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]
            hover:scale-105 transition-all duration-300
            transform-gpu ring-2 ring-blue-400
            focus:outline-none focus:ring-blue-400
          "
        >
          Edit Profile
        </button>

        <button
          disabled
          className="
            p-2.5 rounded-xl bg-white/10 cursor-not-allowed border border-white/20
            backdrop-blur-xl shadow-lg text-slate-600 opacity-50
          "
          title="Settings (disabled)"
        >
          <MoreVertical />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        /*onClick={handleFollowAction}*/
        disabled
        className={`
          px-6 py-2.5 rounded-xl font-medium text-sm
          bg-white/10 cursor-not-allowed border border-white/20
          transition-all duration-300 transform
          relative overflow-hidden group
          text-slate-700
          backdrop-blur-xl ring-2 ring-red-400
          focus:outline-none
        `}
        aria-label={isFollowing ? "Unfollow user" : "Follow user"}
      >
        <div className="flex items-center gap-2 relative z-10 justify-center">
          {/* Uncomment for active spinner or icon */}
          {/*isActioning ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : isFollowing ? (
            <UserMinus />
          ) : (
            <UserPlus />
          )*/}
          <UserPlus />
          <span className="hidden sm:inline">Follow</span>
        </div>
        <span
          className={`
            absolute inset-0 rounded-xl
            bg-gradient-to-r from-blue-600 to-cyan-500
            opacity-20
          `}
        />
      </button>

      {/* Notification bell disabled */}
      {/*
      {isFollowing && (
        <button
          onClick={onNotificationToggle}
          disabled
          className="p-2.5 rounded-xl bg-white/10 cursor-not-allowed border border-white/20 text-slate-600 backdrop-blur-xl shadow-lg"
          title="Notifications (disabled)"
        >
          <Bell />
        </button>
      )}
      */}

      {/* Message disabled */}
      <button
        disabled
        className="
          p-2.5 rounded-xl bg-white/10 cursor-not-allowed border border-white/20
          backdrop-blur-xl shadow-lg text-slate-600 opacity-50
          flex items-center justify-center
        "
        aria-label="Send message (disabled)"
      >
        <MessageCircle />
      </button>

      {/* Share disabled */}
      <button
        disabled
        className="
          p-2.5 rounded-xl bg-white/10 cursor-not-allowed border border-white/20
          backdrop-blur-xl shadow-lg text-slate-600 opacity-50
          flex items-center justify-center
        "
        aria-label="Share profile (disabled)"
      >
        <Share2 />
      </button>

      {/* More actions disabled */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown((v) => !v)}
          disabled
          className="
            p-2.5 rounded-xl bg-white/10 cursor-not-allowed border border-white/20
            backdrop-blur-xl shadow-lg text-slate-600 opacity-50
            flex items-center justify-center
          "
          aria-haspopup="true"
          aria-expanded={showDropdown}
          aria-label="More options (disabled)"
        >
          <MoreVertical />
        </button>
      </div>
    </div>
  );
}
