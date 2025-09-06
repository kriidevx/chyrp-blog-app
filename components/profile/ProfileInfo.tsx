import React from "react";
import { MapPin, Calendar, Link2, Verified } from "lucide-react";

interface ProfileInfoProps {
  user: {
    avatar?: string;
    displayName: string;
    username: string;
    bio?: string;
    location?: string;
    website?: string;
    joinedDate: string;
    isVerified?: boolean;
  };
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
      <div className="flex flex-wrap items-center gap-6">
        {/* Avatar with gradient background or letter */}
        <div className="relative inline-block w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-cyan-500/30 select-none">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-full h-full rounded-full object-cover bg-white"
            />
          ) : (
            <div
              className="flex items-center justify-center w-full h-full rounded-full text-7xl font-extrabold text-white"
              aria-label={`Avatar placeholder for ${user.displayName}`}
            >
              {user.displayName?.[0].toUpperCase() || "U"}
            </div>
          )}

          {/* Online Indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 border-2 border-white shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
          </div>

          {/* Verified badge */}
          {user.isVerified && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Verified size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Name, username, bio */}
        <div className="flex-1 min-w-0">
          <h1 className="flex flex-wrap items-center gap-2 text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {user.displayName}
            {user.isVerified && <Verified size={24} className="flex-shrink-0 text-blue-500" />}
          </h1>
          <p className="text-lg text-slate-500">@{user.username}</p>
          {user.bio && (
            <p className="mt-3 max-w-xl text-gray-700 dark:text-gray-300">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Additional info: location, website, join date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto text-slate-600">
        {user.location && (
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-cyan-500" />
            <span>{user.location}</span>
          </div>
        )}
        {user.website && (
          <div className="flex items-center gap-2 overflow-hidden">
            <Link2 size={18} className="text-blue-500 shrink-0" />
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-blue-600 hover:underline"
            >
              {user.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2 w-full">
          <Calendar size={18} className="text-slate-500" />
          <span>Joined {formatDate(user.joinedDate)}</span>
        </div>
      </div>
    </div>
  );
}
