import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { slugify } from '@/utils/slugify';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const json = await request.json();
    
    // Generate a slug from the title
    const { data: existingSlugs } = await supabase
      .from('posts')
      .select('slug');
      
    const slugs = existingSlugs?.map(post => post.slug) || [];
    const slug = generateUniqueSlug(json.title, slugs);

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        ...json,
        slug,
        author_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateUniqueSlug(title: string, existingSlugs: string[]): string {
  let slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
