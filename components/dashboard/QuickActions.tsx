import { PenTool, BarChart3, User } from "lucide-react";
import Link from "next/link";
import NewPostManager from "@/components/newPost/NewPostManager";

interface QuickActionsProps {
  username: string;
  onOpenNewPost: () => void;
  loading: boolean;
  currentUserName: string;
  onPostSaved: (newPost: any) => void;
}

export default function QuickActions({
  username,
  onOpenNewPost,
  loading,
  currentUserName,
  onPostSaved,
}: QuickActionsProps) {
  const scrollToAnalytics = () => {
    const element = document.getElementById("analytics-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* New Post button */}
      <div>
        <NewPostManager
          currentUserName={currentUserName}
          onPostSaved={onPostSaved}
        />
      </div>

      {/* View Analytics button */}
      <button
        onClick={scrollToAnalytics}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] ring-4 ring-blue-600/20"
      >
        <span className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          View Analytics
        </span>
      </button>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* View Profile button with animated blue-cyan gradient border */}
      <Link href={`/profile/${username}`} passHref>
        <div className="relative flex items-center justify-center">
          {/* Animated gradient ring */}
          <span className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-gradient-xy p-[2px]">
            <span className="block w-full h-full rounded-full bg-slate-50"></span>
          </span>
          <button
            className="relative p-3 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center cursor-pointer"
            aria-label={`View profile of ${username}`}
          >
            <User className="w-6 h-6 text-slate-900 transition-colors duration-300 hover:text-cyan-500" />
          </button>
        </div>
      </Link>
    </div>
  );
}
