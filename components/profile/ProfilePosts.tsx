"use client";

import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
};

type ProfilePostsProps = {
  posts: Post[];
};

export default function ProfilePosts({ posts }: ProfilePostsProps) {
  // Show only published posts
  const publishedPosts = posts.filter(post => post.published);

  if (publishedPosts.length === 0) {
    return (
      <p className="text-gray-600 italic text-center dark:text-gray-400">
        This user hasn’t published any posts yet.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {publishedPosts.map((post) => (
        <li
          key={post.id}
          className="p-5 border rounded-lg shadow-sm hover:shadow-md dark:border-gray-700 bg-white dark:bg-gray-900 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex-1 min-w-0">
              <Link
                href={`/posts/${post.slug}`}
                className="text-2xl font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {new Date(post.created_at).toLocaleDateString()}{" "}
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 select-none">
                  {post.published ? "Published" : "Draft"}
                </span>
              </p>
            </div>
            <Link
              href={`/posts/${post.slug}`}
              className="mt-2 sm:mt-0 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline px-3 py-1 border border-blue-600 rounded-md whitespace-nowrap flex-shrink-0"
              aria-label={`View full post: ${post.title}`}
            >
              View Post
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
