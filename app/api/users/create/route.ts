import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, email, username } = body;
  // Get access token from Authorization header
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!id || !email || !token) {
    return NextResponse.json({ error: 'Missing required fields or token' }, { status: 400 });
  }

  // Create a Supabase client authorized as the user
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  // Insert user profile row
  const { error } = await supabase
    .from('users')
    .insert([{ id, email, username: username || null }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
