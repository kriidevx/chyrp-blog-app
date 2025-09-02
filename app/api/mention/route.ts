import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { post_id, url, author_name } = await req.json();
  if (!post_id || !url || !author_name)
    return NextResponse.json({ error: "post_id, url and author_name are required" }, { status: 400 });

  const { data, error } = await supabase.from("mentions").insert({ post_id, url, author_name }).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
