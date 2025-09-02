import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// Track active visitors - upsert user presence
export async function POST(req: NextRequest) {
  const { user_id, page } = await req.json();
  if (!user_id || !page) return NextResponse.json({ error: "user_id and page are required" }, { status: 400 });

  const { data, error } = await supabase
    .from("presence")
    .upsert({ user_id, page, last_seen: new Date() })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Get active visitors
export async function GET() {
  const { data, error } = await supabase.from("presence").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
