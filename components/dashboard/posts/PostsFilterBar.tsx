import { Search } from 'lucide-react';

type Props = {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
};

export default function PostsFilterBar({ selectedFilter, setSelectedFilter, searchQuery, setSearchQuery }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-black text-slate-900">My Posts</h2>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-900/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="pl-12 pr-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-slate-900 placeholder-slate-900/50 focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600/50 transition-all duration-300"
          />
        </div>
        {/* Filter */}
        <div className="flex items-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-1">
          {['all', 'published', 'draft'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'text-slate-900/70 hover:text-slate-900'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
