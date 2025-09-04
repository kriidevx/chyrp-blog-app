import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }  // params is now a Promise
) {
  const params = await context.params;  // await params here
  const username = params.username;
  console.log("API username param:", username);

  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, username, bio, avatar_url")
      .ilike("username", username)
      .maybeSingle();

    console.log("User query result:", user, userError);

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, title, slug, created_at, published")
      .eq("user_id", user.id)
      .eq("published", true)
      .order("created_at", { ascending: false });

    console.log("Posts query result:", posts, postsError);

    if (postsError) {
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }

    return NextResponse.json({ user, posts });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
