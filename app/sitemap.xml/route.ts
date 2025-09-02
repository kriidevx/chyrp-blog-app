import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: posts } = await supabase.from("posts").select("slug");
  const urls = posts?.map(post => `<url><loc>https://yourdomain.com/post/${post.slug}</loc></url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
