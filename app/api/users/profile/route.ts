import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET user profile by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    if (!userId) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

    const { data, error } = await supabase
      .from("users")
      .select("id, username, bio, avatar_url, email, created_at, updated_at")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT update profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const { error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Profile updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
