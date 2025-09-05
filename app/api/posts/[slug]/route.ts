import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .eq('slug', params.slug)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const json = await request.json();
    
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select()
      .eq('slug', params.slug)
      .single();
      
    if (fetchError) throw fetchError;
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.author_id !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { data, error } = await supabase
      .from('posts')
      .update(json)
      .eq('slug', params.slug)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select()
      .eq('slug', params.slug)
      .single();
      
    if (fetchError) throw fetchError;
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.author_id !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', params.slug);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
