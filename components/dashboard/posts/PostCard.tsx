"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Eye,
  Edit3,
  Heart,
  MessageCircle,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import getFeatherIcon from '@/lib/dashboard/getFeatherIcon';
import getStatusBadge from '@/lib/dashboard/getStatusBadge';

type Props = {
  post: any;
  selected: boolean;
  togglePostSelection: (id: number) => void;
  setDraggedPost: (id: number | null) => void;
  draggedPost: number | null;
  accessToken: string | null;  // New prop to receive token
};

export default function PostCard({
  post,
  selected,
  togglePostSelection,
  setDraggedPost,
  draggedPost,
  accessToken,
}: Props) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Stats state
  const [stats, setStats] = useState({ views: 0, likes: 0, comments: 0 });

  useEffect(() => {
    async function fetchStats() {
      if (!accessToken) return; // wait for token
      try {
        const res = await fetch('/api/dashboard/analytics', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ postIds: [post.id] }),
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        if (data.stats && data.stats.length > 0) {
          setStats(data.stats[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchStats();
  }, [post.id, accessToken]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handlePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    // TODO: Implement publish API call or logic here
    alert(`Publish post "${post.title}"`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    // TODO: Confirm and delete logic or modal
    alert(`Delete post "${post.title}"`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: open edit modal or navigate
    alert(`Edit post "${post.title}"`);
  };

  const onCardClick = () => {
    router.push(`/posts/${post.slug}`);
  };

  return (
    <>
      <div
        className={`group bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:bg-white/30 transform-gpu hover:scale-[1.02] transition-all duration-300 ${
          selected ? 'ring-2 ring-blue-600/50 bg-blue-600/10' : ''
        }`}
        draggable
        onDragStart={() => setDraggedPost(post.id)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDraggedPost(null);
        }}
        onClick={onCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onCardClick();
        }}
      >
        <div className="flex items-center gap-4">
          {/* Selection Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePostSelection(post.id);
            }}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
              selected ? 'bg-blue-600 border-blue-600' : 'border-white/30 hover:border-blue-600/50'
            }`}
          >
            {selected && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Feather Type Icon */}
          <div className="text-2xl">{getFeatherIcon(post.featherType)}</div>

          {/* Post Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              {post.published ? getStatusBadge('published') : getStatusBadge('draft')}
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-900/60">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {(() => {
                  const d = new Date(post.created_at);
                  return isNaN(d.getTime()) ? 'Unknown date' : d.toLocaleDateString();
                })()}
              </span>

              {post.published && (
                <>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {stats.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {stats.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {stats.comments}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions - menu */}
          <div
            className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Edit Button */}
            {!post.published && (
              <button
                onClick={handleEditClick}
                className="p-2 bg-green-600/20 text-green-600 rounded-xl hover:bg-green-600/30 transition-colors"
                type="button"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {/* More dots menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 bg-white/20 text-slate-900 rounded-xl hover:bg-white/30 transition-colors"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                aria-label="Post options"
                type="button"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 mb-2 w-36 bg-white rounded-xl shadow-lg p-3 z-50"
                  style={{ bottom: '100%' }}
                >
                  {!post.published && (
                    <button
                      onClick={handlePublish}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-1 mb-2"
                      type="button"
                    >
                      Publish
                    </button>
                  )}

                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-2 rounded w-full text-red-600 hover:bg-red-100"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
