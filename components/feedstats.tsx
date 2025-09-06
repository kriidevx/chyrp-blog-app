// FeedStats.tsx
'use client';
import React from 'react';
import { FileText, Globe, Eye } from 'lucide-react';

const FeedStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl">📝</span>
      </div>
      <div className="text-3xl font-black text-slate-800 mb-2">2,847</div>
      <div className="text-slate-600 font-medium">Active Writers</div>
    </div>

    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl">📚</span>
      </div>
      <div className="text-3xl font-black text-slate-800 mb-2">15,692</div>
      <div className="text-slate-600 font-medium">Posts Published</div>
    </div>

    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl">👥</span>
      </div>
      <div className="text-3xl font-black text-slate-800 mb-2">84,321</div>
      <div className="text-slate-600 font-medium">Total Views</div>
    </div>
  </div>
);

export default FeedStats;
