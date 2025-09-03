import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { post_id } = await req.json();

    if (!post_id) {
      return NextResponse.json({ error: "post_id is required" }, { status: 400 });
    }

    // Step 1: Get current views
    const { data: post, error: getError } = await supabase
      .from("posts")
      .select("views")
      .eq("id", post_id)
      .single();

    if (getError) {
      return NextResponse.json({ error: getError.message }, { status: 500 });
    }

    // Step 2: Increment views
    const { data, error } = await supabase
      .from("posts")
      .update({ views: (post.views || 0) + 1 })
      .eq("id", post_id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
