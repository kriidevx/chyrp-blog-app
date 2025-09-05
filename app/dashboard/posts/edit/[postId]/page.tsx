'use client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Post - Chyrp Blog',
  description: 'Edit your blog post with a modern, clean interface'
};

export default function EditPostPage({ params }: { params: { postId: string } }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden">
      {/* Soft Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/15 rounded-full blur-2xl" />
      <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-cyan-300/15 rounded-full blur-2xl" />

      {/* Main Container */}
      <div className="relative w-full max-w-3xl p-8 mx-4 rounded-2xl 
        bg-white/80 backdrop-blur-sm border border-white/40 
        shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] 
        transition-all duration-300">

        {/* Title */}
        <h1 className="text-4xl font-bold text-slate-900 text-center mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Edit Post
          </span>
        </h1>

        {/* Edit Form */}
        <form className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter your post title"
              className="w-full px-4 py-3 rounded-lg 
                bg-white/60 backdrop-blur-sm border border-slate-200 
                text-slate-900 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                transition-all duration-200
                hover:bg-white/80"
            />
          </div>

          {/* Content Input */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              placeholder="Write your post content here..."
              className="w-full px-4 py-3 rounded-lg 
                bg-white/60 backdrop-blur-sm border border-slate-200 
                text-slate-900 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                transition-all duration-200
                hover:bg-white/80 resize-none"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="Add tags separated by commas"
              className="w-full px-4 py-3 rounded-lg 
                bg-white/60 backdrop-blur-sm border border-slate-200 
                text-slate-900 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                transition-all duration-200
                hover:bg-white/80"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <button
              type="button"
              className="px-6 py-3 rounded-lg font-medium text-slate-600 
                bg-white/70 border border-slate-200
                hover:bg-white hover:text-slate-700
                transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-medium text-white 
                bg-gradient-to-r from-blue-600 to-cyan-500 
                hover:from-blue-700 hover:to-cyan-600
                shadow-lg hover:shadow-xl 
                transform hover:scale-[1.02]
                transition-all duration-200"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


