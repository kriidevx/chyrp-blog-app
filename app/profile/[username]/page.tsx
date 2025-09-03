import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: { username: string };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = params;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, username, bio, avatar_url")
    .eq("username", username)
    .single();

  if (userError || !user) {
    notFound();
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, created_at")
    .eq("user_id", user.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.username}
            width={80}
            height={80}
            className="rounded-full"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            @{user.username}
          </h1>
          {user.bio && (
            <p className="text-gray-600 dark:text-gray-300">{user.bio}</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      {posts && posts.length > 0 ? (
        <ul className="space-y-3">
          {posts.map((post: any) => (
            <li
              key={post.id}
              className="p-4 border rounded-lg hover:shadow dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <Link
                href={`/posts/${post.slug}`}
                className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          This user hasn’t published any posts yet.
        </p>
      )}
    </div>
  );
}
