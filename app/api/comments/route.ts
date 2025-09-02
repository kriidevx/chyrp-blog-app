import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET comments for a post
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("post_id");
  if (!postId) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST a comment
export async function POST(req: NextRequest) {
  const { post_id, user_id, content } = await req.json();
  if (!post_id || !user_id || !content)
    return NextResponse.json({ error: "post_id, user_id and content are required" }, { status: 400 });

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id, author_id: user_id, content })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE a comment
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
