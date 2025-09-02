import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// POST increment or create view count for a post
export async function POST(req: NextRequest) {
  try {
    const { post_id } = await req.json();

    if (!post_id) {
      return NextResponse.json({ error: "post_id is required" }, { status: 400 });
    }

    // Get current count
    const { data: currentView, error: getError } = await supabase
      .from("views")
      .select("count")
      .eq("post_id", post_id)
      .single();

    // Handle error other than "no row"
    if (getError && getError.code !== "PGRST116") {
      return NextResponse.json({ error: getError.message }, { status: 500 });
    }

    const newCount = (currentView?.count || 0) + 1;

    // Upsert (insert or update)
    const { data, error } = await supabase
      .from("views")
      .upsert({ post_id, count: newCount }, { onConflict: "post_id" })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

// GET all views (optional)
export async function GET() {
  const { data, error } = await supabase.from("views").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
