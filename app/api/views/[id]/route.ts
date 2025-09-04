// app/api/views/[id]/route.ts
/*3️⃣ Using it in frontend

In your Post page (app/posts/[slug]/page.tsx or similar), you can call:

useEffect(() => {
  async function incrementView() {
    await fetch(`/api/views/${post.id}`, {
      method: "POST",
    });
  }
  incrementView();
}, [post.id]);


And if you want to display view count:

const [views, setViews] = useState<number | null>(null);

useEffect(() => {
  async function fetchViews() {
    const res = await fetch(`/api/views/${post.id}`);
    const data = await res.json();
    setViews(data.view_count);
  }
  fetchViews();
}, [post.id]);

return (
  <p>{views !== null ? `${views} views` : "Loading views..."}</p>
); */


import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET: fetch view count for a post
 * POST: increment view count for a post
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("posts")
    .select("view_count")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ view_count: data.view_count });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { error } = await supabase.rpc("increment_view_count", {
    post_id: params.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // fetch updated count after increment
  const { data, error: fetchError } = await supabase
    .from("posts")
    .select("view_count")
    .eq("id", params.id)
    .single();

  if (fetchError || !data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ view_count: data.view_count });
}
