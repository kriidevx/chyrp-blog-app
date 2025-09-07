import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth-helpers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Total posts count
    const { count: totalPosts, error: postCountError } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (postCountError) throw postCountError;

    // Sum views from all user's posts
    const { data: viewSumResult, error: viewsError } = await supabase
      .from('posts')
      .select('view_count')
      .eq('user_id', user.id);

    if (viewsError) throw viewsError;

    const totalViews = viewSumResult?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;

    // User's post IDs
    const { data: userPosts, error: postsFetchError } = await supabase
      .from('posts')
      .select('id')
      .eq('user_id', user.id);

    if (postsFetchError) throw postsFetchError;

    const postIds = userPosts?.map(p => p.id) || [];

    // Total likes on user's posts
    const { count: totalLikes, error: likesError } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .in('post_id', postIds);

    if (likesError) throw likesError;

    // Total comments on user's posts
    const { count: totalComments, error: commentsError } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .in('post_id', postIds);

    if (commentsError) throw commentsError;

    return NextResponse.json({
      totalPosts,
      totalViews,
      totalLikes,
      totalComments,
    });
  } catch (error: any) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { postIds } = await request.json();
    if (!Array.isArray(postIds)) return NextResponse.json({ error: 'Invalid postIds' }, { status: 400 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch posts with view_count for given IDs (user's posts only)
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, view_count')
      .in('id', postIds)
      .eq('user_id', user.id);

    if (postsError) throw postsError;

    // Fetch likes with post_id only for counting grouped by post_id
    const { data: likesData, error: likesError } = await supabase
      .from('likes')
      .select('post_id')
      .in('post_id', postIds);

    if (likesError) throw likesError;

    // Fetch comments similarly
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('post_id')
      .in('post_id', postIds);

    if (commentsError) throw commentsError;

    const countMap = (arr: Array<{ post_id: string }>) =>
      arr.reduce((acc, cur) => {
        acc[cur.post_id] = (acc[cur.post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const likesCount = countMap(likesData ?? []);
    const commentsCount = countMap(commentsData ?? []);
    const postsMap = new Map(posts?.map(p => [p.id, p]) ?? []);

    const stats = postIds.map(id => ({
      id,
      views: postsMap.get(id)?.view_count ?? 0,
      likes: likesCount[id] ?? 0,
      comments: commentsCount[id] ?? 0,
    }));

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Error fetching per-post stats:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
