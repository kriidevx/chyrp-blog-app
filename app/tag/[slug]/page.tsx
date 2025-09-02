import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default async function TagPage({ params }: { params: { slug: string } }) {
  // Assume you have a post_tags table (post_id/tag_id) and tags table (slug)
  const { data: tagPosts } = await supabase
    .from("posts")
    .select("*")
    .contains("tags", [params.slug]) // If tags stored as an array in posts
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Posts tagged: {params.slug}</h1>
      {tagPosts?.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
