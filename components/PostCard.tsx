import Link from "next/link";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between">
      <div>
        <Link href={`/post/${post.slug}`}>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
            {post.title}
          </h2>
        </Link>
        <time dateTime={post.created_at} className="block mt-1 text-gray-600 dark:text-gray-400 text-sm font-mono">
          {new Date(post.created_at).toLocaleDateString()}
        </time>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">{post.excerpt}</p>
      </div>
    </article>
  );
}
