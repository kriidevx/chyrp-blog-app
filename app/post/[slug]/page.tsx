"use client";

import { use, useEffect, useState } from "react";
import LikeButton from "@/components/LikeButton";
import CommentForm from "@/components/CommentForm";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type Comment = {
  id: string;
  author: string;
  content: string;
  created_at: string;
};

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // unwrap the Promise

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostAndComments() {
      try {
        let { data: posts, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug);
        if (error) throw error;
        if (!posts || posts.length === 0) {
          setPost(null);
          return;
        }
        setPost(posts[0]);

        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", posts[0].id)
          .order("created_at", { ascending: true });
        if (commentsError) throw commentsError;
        setComments(commentsData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPostAndComments();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <article className="max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <time dateTime={post.created_at} className="block text-gray-500 dark:text-gray-400">
        {new Date(post.created_at).toLocaleDateString()}
      </time>
      <section
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <LikeButton postId={post.id} userId={"replace-with-user-id"} />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentForm postId={post.id} onNewComment={(comment) => setComments([...comments, comment])} />

        <div className="space-y-4 mt-6">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">{comment.author}</p>
                <p>{comment.content}</p>
                <time dateTime={comment.created_at} className="text-xs text-gray-500 dark:text-gray-600">
                  {new Date(comment.created_at).toLocaleString()}
                </time>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}
