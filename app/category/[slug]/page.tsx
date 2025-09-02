import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // Assume you have a post_categories table linking post_id/category_id
  const { data: categoryPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("category_slug", params.slug)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Posts in category: {params.slug}</h1>
      {categoryPosts?.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
