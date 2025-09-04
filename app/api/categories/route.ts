// app/api/categories/route.ts
// Purpose: API route for managing categories (used in new-post form, filters, etc.)
// Methods:
//   - GET: Returns all categories from the "categories" table
//   - POST: Creates a new category (requires authentication, can later restrict to admins)
//
// Implementation Guidelines:
//   • Categories table in Supabase should have: id (uuid), name (text), slug (text, unique)
//   • Slug is auto-generated from the category name
//   • Only authenticated users may create categories (can refine to admin later)
//
// TODO (future): Add PATCH/DELETE if full category management is needed

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils"; // ✅ now imported


export async function GET() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug");

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: data });
  } catch (err) {
    console.error("Unexpected error in categories GET:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Authenticate user via Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, slug }])
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return NextResponse.json(
        { error: "Failed to create category" },
        { status: 500 }
      );
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in categories POST:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
