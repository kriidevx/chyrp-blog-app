import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

interface ButtonsProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onSort: (sortBy: string) => void;
}

export default function Buttons({ hasMore, isLoading, onLoadMore, onSort }: ButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 p-4 
      rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      
      {/* Sort Dropdown */}
      <div className="relative">
        <select
          className="appearance-none px-4 py-3 pr-10 rounded-lg border border-slate-200 
            bg-white/80 backdrop-blur-sm text-slate-900 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            hover:bg-white hover:border-slate-300 transition-all duration-200
            cursor-pointer min-w-[140px]"
          onChange={(e) => onSort(e.target.value)}
        >
          <option value="latest">Latest Posts</option>
          <option value="popular">Most Popular</option>
          <option value="trending">Trending Now</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 
          w-4 h-4 text-slate-500 pointer-events-none" />
      </div>

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white 
            bg-gradient-to-r from-blue-600 to-cyan-500 
            hover:from-blue-700 hover:to-cyan-600 hover:scale-105
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            shadow-lg hover:shadow-xl transition-all duration-200
            min-w-[120px] justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Load More'
          )}
        </button>
      )}
    </div>
  );
}