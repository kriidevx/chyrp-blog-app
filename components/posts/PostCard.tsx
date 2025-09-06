// components/posts/PostCard.tsx
interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt?: string;
    slug: string;
    users: { username: string; avatar_url?: string; };
    created_at: string;
  };
  showAuthor?: boolean;
  compact?: boolean;
}

export default function PostCard({ post, showAuthor = true, compact = false }: PostCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h4 className="font-semibold mb-2">
        <a href={`/posts/${post.slug}`} className="hover:text-blue-600">
          {post.title}
        </a>
      </h4>
      {post.excerpt && (
        <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
      )}
      {showAuthor && (
        <div className="text-xs text-gray-500">
          <span>by {post.users.username}</span>
          <span className="ml-2">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}