import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Post - Chyrp Blog',
  description: 'Read this amazing blog post'
};

export default function PostPage({ params }: { params: { slug: string } }) {
  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Post Title</h1>
        <div className="mt-4 flex items-center space-x-4 text-gray-600">
          <time>January 1, 2024</time>
          <span>·</span>
          <span>5 min read</span>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        {/* Post content will go here */}
        <p>Post content...</p>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {/* Comments section will go here */}
      </div>
    </article>
  );
}
