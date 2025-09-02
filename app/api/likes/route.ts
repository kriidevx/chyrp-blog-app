import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET likes for a post
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("post_id");
  if (!postId) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const { data, error } = await supabase.from("likes").select("*").eq("post_id", postId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST like
export async function POST(req: NextRequest) {
  const { post_id, user_id } = await req.json();
  if (!post_id || !user_id) return NextResponse.json({ error: "post_id and user_id are required" }, { status: 400 });

  const { data, error } = await supabase.from("likes").insert({ post_id, user_id }).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE unlike
export async function DELETE(req: NextRequest) {
  const { post_id, user_id } = await req.json();
  if (!post_id || !user_id) return NextResponse.json({ error: "post_id and user_id are required" }, { status: 400 });

  const { data, error } = await supabase.from("likes").delete().match({ post_id, user_id }).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
