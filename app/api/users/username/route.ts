// app/api/users/username/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client with service role key
const supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET() {
  try {
    // For demo, we can pick the first user or filter by some known criteria
    const { data: user, error } = await supabaseServer
      .from("users")
      .select("username")
      .limit(1)
      .maybeSingle();

    if (error || !user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(user.username, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
