// app/api/posts/new/route.ts
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Utility: generate safe slug
function generateSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // --- 1️⃣ Extract fields ---
    const title = (formData.get("title") as string) || "";
    const content = (formData.get("content") as string) || "";
    const rawSlug = (formData.get("slug") as string) || title;
    const slug = generateSlug(rawSlug);
    const categorySlug = (formData.get("category") as string) || null;
    const feather_type = (formData.get("feather_type") as string) || "text";
    const published = formData.get("published") === "true";
    const user_id = (formData.get("user_id") as string) || null;
    const rights = (formData.get("rights") as string) || null;

    const quote_author = (formData.get("author") as string) || null;
    const quote_source = (formData.get("source") as string) || null;
    const external_url = (formData.get("link") as string) || null;
    const link_description =
      (formData.get("linkDescription") as string) || null;

    const tagsStr = (formData.get("tags") as string) || "[]";
    const tagsParsed: string[] = JSON.parse(tagsStr);

    // --- 2️⃣ Resolve or create category ---
    let resolvedCategoryId: string | null = null;

    if (categorySlug && categorySlug !== "none") {
      try {
        const { data: categoryData, error: categoryErr } = await supabaseAdmin
          .from("categories")
          .select("id")
          .eq("slug", generateSlug(categorySlug))
          .maybeSingle();

        if (categoryErr) throw categoryErr;

        if (!categoryData) {
          // Category does not exist → create it
          const { data: newCategory, error: createErr } = await supabaseAdmin
            .from("categories")
            .insert([{ name: categorySlug, slug: generateSlug(categorySlug) }])
            .select()
            .single();

          if (createErr) throw createErr;

          resolvedCategoryId = newCategory.id;
        } else {
          resolvedCategoryId = categoryData.id;
        }
      } catch (catErr) {
        console.error("Error resolving/creating category:", catErr, {
          categorySlug,
        });
        return NextResponse.json(
          { message: "Failed to resolve or create category", error: catErr },
          { status: 500 }
        );
      }
    }

    // --- 3️⃣ Insert post ---
    let post;
    try {
      const { data, error: postErr } = await supabaseAdmin
        .from("posts")
        .insert([
          {
            user_id,
            title,
            content,
            slug,
            rights,
            category_id: resolvedCategoryId,
            feather_type,
            published,
            quote_author,
            quote_source,
            external_url,
            link_description,
            created_at: new Date(),
          },
        ])
        .select()
        .single();

      if (postErr || !data) throw postErr || new Error("No post returned");

      post = data;
    } catch (postInsertErr) {
      console.error("Error inserting post:", postInsertErr, { title, slug });
      return NextResponse.json(
        { message: "Failed to insert post", error: postInsertErr },
        { status: 500 }
      );
    }

    // --- 4️⃣ Handle tags ---
    for (const tagName of tagsParsed) {
      try {
        const { data: existingTag } = await supabaseAdmin
          .from("tags")
          .select("id")
          .eq("name", tagName)
          .maybeSingle();

        let tagId = existingTag?.id;
        if (!tagId) {
          const { data: newTag, error: newTagErr } = await supabaseAdmin
            .from("tags")
            .insert([{ name: tagName, slug: generateSlug(tagName) }])
            .select()
            .single();

          if (newTagErr) throw newTagErr;
          tagId = newTag?.id;
        }

        if (tagId) {
          const { error: postTagErr } = await supabaseAdmin
            .from("post_tags")
            .insert([{ post_id: post.id, tag_id: tagId }]);
          if (postTagErr) throw postTagErr;
        }
      } catch (tagErr) {
        console.error("Error handling tag:", tagErr, { tagName, postId: post.id });
      }
    }

    // --- 5️⃣ Handle media file ---
    const mediaFile = formData.get("mediaFile") as File | null;
    if (mediaFile) {
      try {
        const bytes = await mediaFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const extension = mediaFile.name.split(".").pop() || "dat";
        const uniqueFileName = `${post.slug}-${uuidv4()}.${extension}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from("post-media")
          .upload(uniqueFileName, buffer, {
            contentType: mediaFile.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseAdmin.storage
          .from("post-media")
          .getPublicUrl(uniqueFileName);

        const { error: mediaInsertErr } = await supabaseAdmin.from("post_media").insert([
          {
            post_id: post.id,
            media_type: feather_type,
            url: publicUrlData.publicUrl,
            alt_text: "",
            order: 0,
            file_size: mediaFile.size,
            mime_type: mediaFile.type,
          },
        ]);

        if (mediaInsertErr) throw mediaInsertErr;
      } catch (mediaErr) {
        console.error("Error uploading media file:", mediaErr, {
          fileName: mediaFile.name,
          postId: post.id,
        });
      }
    }

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
