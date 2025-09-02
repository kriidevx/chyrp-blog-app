import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: posts } = await supabase.from("posts").select("slug").eq("published", true);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      ?.map(
        (post) => `
      <url>
        <loc>${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}</loc>
        <changefreq>weekly</changefreq>
      </url>
    `
      )
      .join("")}
  </urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
