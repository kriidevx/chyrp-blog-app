import { Post } from '@/typings';
import PostCard from '@/components/PostCard';

export default function Trending({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-b border-blue-100">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-8 h-8 bg-cyan-200 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-blue-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-10 left-1/3 w-4 h-4 bg-cyan-300 rounded-full opacity-50"></div>
        <div className="absolute top-10 right-1/4 w-3 h-3 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-cyan-200 rounded-full opacity-40"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-black mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500">
              Welcome to Chyrp
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
              Blog
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Share your thoughts, connect with readers, and build your
            digital presence with our modern blogging platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Start Writing
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-full font-semibold text-lg hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Explore Posts
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">2,847</h3>
              <p className="text-slate-600 font-medium">Active Writers</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">15,692</h3>
              <p className="text-slate-600 font-medium">Posts Published</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Posts Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Trending Now</h2>
          <p className="text-xl text-slate-600">Discover the most popular posts from our community</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}