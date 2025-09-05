import { Post } from '@/typings';
import MentionedPeople from './MentionedPeople';
import { usePosts } from '@/hooks/usePosts';
import { useComments } from '@/hooks/useComments';
import CommentForm from '@/components/CommentForm';
import Reactions from '@/components/PostCard/Reactions';
import React, { useState } from 'react';
import { Eye, Clock, User } from 'lucide-react';

interface Author {
  name: string;
  avatar: string;
}

interface ExtendedPost extends Omit<Post, 'author'> {
  author: Author;
  id: string;
  publishedAt: string;
  readTime: number;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

interface CommentFormProps {
  postId: string;
  onCommentAdded?: (comment: Comment) => void;
}

interface ReactionsProps {
  postId: string;
}

function PostPage({ post }: { post: ExtendedPost }) {
  const { posts, loading, error } = usePosts();
  const { comments, addComment } = useComments(post.id);

  const handleCommentAdded = (comment: Comment) => {
    // Handle the new comment - it's already been added to the database by the CommentForm
    console.log('New comment added:', comment);
    // The comments list will be automatically updated by the useComments hook
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-6">{post.title}</h1>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString()} · {post.readTime} min read
              </div>
            </div>
          </div>

          <MentionedPeople post={{ ...post, author: post.author.name }} />
        </div>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-2xl"
          />
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none mb-12">
        {/* Post content rendered here */}
      </div>

      <footer>
        <Reactions postId={post.id} />
        
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Comments</h3>
          <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          
          <div className="mt-8 space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="glass p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{comment.author.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
}
function PostPageIndex() {
  const [readingTime] = useState(5);
  const [viewCount] = useState(1247);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <article className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute bottom-6 left-6">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                Web Development
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Post Meta */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Alex Johnson</p>
                  <p className="text-sm text-slate-600">Published 3 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{viewCount.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Building Modern React Applications with Next.js
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Discover how to create scalable, performant web applications using the latest features of React and Next.js. 
              This comprehensive guide covers everything from setup to deployment.
            </p>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <section id="intro">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  React and Next.js have revolutionized how we build web applications. In this comprehensive guide, 
                  we'll explore the latest features and best practices for creating modern, scalable applications.
                </p>
              </section>

              <section id="setup">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Getting Started</h2>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  Let's begin by setting up our development environment. We'll use the latest version of Next.js 
                  with TypeScript support for better developer experience.
                </p>
                
                <div className="bg-slate-900 rounded-xl p-4 mb-6 overflow-x-auto">
                  <code className="text-cyan-400 text-sm">
                    npx create-next-app@latest my-app --typescript --tailwind --app
                  </code>
                </div>
              </section>

              <section id="components">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Building Components</h2>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  Components are the building blocks of React applications. Let's create some reusable components 
                  that follow modern best practices.
                </p>
              </section>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Comments (24)</h3>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">U{i}</span>
                </div>
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-slate-900">User {i}</span>
                      <span className="text-sm text-slate-500">2 hours ago</span>
                    </div>
                    <p className="text-slate-700">
                      This is an excellent guide! The examples are clear and easy to follow. 
                      Thanks for sharing this valuable content.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
