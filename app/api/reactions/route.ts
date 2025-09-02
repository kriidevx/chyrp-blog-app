import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET reactions for a post
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("post_id");
  if (!postId) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const { data, error } = await supabase.from("reactions").select("*").eq("post_id", postId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST add a reaction
export async function POST(req: NextRequest) {
  const { post_id, user_id, type } = await req.json();
  if (!post_id || !user_id || !type)
    return NextResponse.json({ error: "post_id, user_id, and type are required" }, { status: 400 });

  const { data, error } = await supabase.from("reactions").insert({ post_id, user_id, type }).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
