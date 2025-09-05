import { PenTool, BarChart3, User } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions({ username }: { username: string }) {
  const scrollToAnalytics = () => {
    const element = document.getElementById('analytics-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* New Post button */}
      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] ring-4 ring-blue-600/20">
        <span className="flex items-center gap-2">
          <PenTool className="w-5 h-5" />
          New Post
        </span>
      </button>

      {/* View Analytics button — same style as New Post */}
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

      {/* View Profile button */}
      <Link href={`/profile/${username}`} passHref>
        <button className="p-3 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300">
          <User className="w-5 h-5 text-slate-900" />
        </button>
      </Link>
    </div>
  );
}
