import React, { useState } from 'react';
import { Filter, TrendingUp, Clock, Heart, MessageCircle, Share, Search, X } from 'lucide-react';

interface PostFiltersProps {
  onFilterChange: (filters: any) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState('recent');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  const [postType, setPostType] = useState('all');

  const filters = [
    { id: 'recent', label: 'Recent', icon: Clock, active: true },
    { id: 'trending', label: 'Trending', icon: TrendingUp, active: false },
    { id: 'popular', label: 'Popular', icon: Heart, active: false },
    { id: 'discussed', label: 'Most Discussed', icon: MessageCircle, active: false }
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange({ filter: filterId, timeRange, postType });
  };

  return (
    <div className="space-y-4">
      {/* Main filter buttons */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform-gpu hover:scale-105 group ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_8px_32px_rgba(37,99,235,0.3)]'
                : 'bg-white/80 backdrop-blur-xl border border-slate-200/50 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <filter.icon className={`w-5 h-5 transition-transform duration-300 ${
              activeFilter === filter.id ? 'scale-110' : 'group-hover:scale-110'
            }`} />
            <span>{filter.label}</span>
            {activeFilter === filter.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-xl opacity-30 -z-10"></div>
            )}
          </button>
        ))}
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold bg-white/80 backdrop-blur-xl border border-slate-200/50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform-gpu hover:scale-105"
        >
          <Filter className="w-5 h-5" />
          <span>Advanced</span>
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="bg-white/90 backdrop-blur-3xl border border-cyan-500/20 rounded-3xl p-6 shadow-[0_25px_50px_rgba(37,99,235,0.1)] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Advanced Filters</h3>
            <button
              onClick={() => setShowAdvanced(false)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Time range */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Time Range</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeRange(option.value)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      timeRange === option.value
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Post type */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Post Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'all', label: 'All Posts' },
                  { value: 'text', label: 'Text Only' },
                  { value: 'media', label: 'With Media' },
                  { value: 'polls', label: 'Polls' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPostType(option.value)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      postType === option.value
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={() => onFilterChange({ filter: activeFilter, timeRange, postType })}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-[0_8px_32px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_48px_rgba(37,99,235,0.4)] transition-all duration-300 transform-gpu hover:scale-[1.02]"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Quick stats */}
      <div className="flex items-center justify-between text-sm text-slate-600 px-2">
        <span>Showing posts from {timeRange === 'all' ? 'all time' : timeRange}</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFilters;