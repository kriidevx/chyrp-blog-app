// app/api/tags/route.ts
// Purpose: Manage tags (used for categorizing/filtering posts)
// - GET: return all tags
// - POST: create a new tag (requires admin or authenticated user, can be restricted later)
// Implementation Notes:
//   • Uses slugify() to generate clean URL slugs
//   • Currently no authentication check – you can add one if tags should only be created by admins

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

// GET all tags
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("id, name, slug, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tags: data });
  } catch (err) {
    console.error("Error fetching tags:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST create a new tag
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    const slug = slugify(name);

    // Insert new tag
    const { data, error } = await supabase
      .from("tags")
      .insert([{ name, slug }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tag: data });
  } catch (err) {
    console.error("Error creating tag:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
