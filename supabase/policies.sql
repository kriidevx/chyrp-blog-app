-- =========================================================
-- ENABLE RLS
-- =========================================================
alter table users enable row level security;
alter table posts enable row level security;
alter table post_media enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table post_tags enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
alter table reactions enable row level security;
alter table webmentions enable row level security;

-- =========================================================
-- POSTS
-- =========================================================
create policy "Public can view published posts"
    on posts for select
    using (published = true);

create policy "Users can view their own posts"
    on posts for select
    using (auth.uid() = user_id);

create policy "Users can insert their own posts"
    on posts for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own posts"
    on posts for update
    using (auth.uid() = user_id);

create policy "Users can delete their own posts"
    on posts for delete
    using (auth.uid() = user_id);

-- =========================================================
-- COMMENTS
-- =========================================================
create policy "Public can view comments on published posts"
    on comments for select
    using (
        exists (
            select 1 from posts
            where posts.id = comments.post_id
              and posts.published = true
        )
    );

create policy "Users can insert comments on published posts"
    on comments for insert
    with check (
        auth.uid() = user_id
        and exists (
            select 1 from posts
            where id = post_id and published = true
        )
    );

create policy "Users can update their own comments"
    on comments for update
    using (auth.uid() = user_id);

create policy "Users can delete their own comments"
    on comments for delete
    using (auth.uid() = user_id);

create policy "Post owners can delete comments on their posts"
    on comments for delete
    using (
        exists (
            select 1 from posts
            where posts.id = comments.post_id
              and posts.user_id = auth.uid()
        )
    );

-- =========================================================
-- LIKES
-- =========================================================
create policy "Public can view likes on published posts"
    on likes for select
    using (
        exists (
            select 1 from posts
            where posts.id = likes.post_id
              and posts.published = true
        )
    );

create policy "Users can insert likes on published posts"
    on likes for insert
    with check (
        auth.uid() = user_id
        and exists (
            select 1 from posts
            where id = post_id and published = true
        )
    );

create policy "Users can delete their own likes"
    on likes for delete
    using (auth.uid() = user_id);

create policy "Disallow likes update"
    on likes for update
    with check (false);

-- =========================================================
-- REACTIONS
-- =========================================================
create policy "Public can view reactions on published posts"
    on reactions for select
    using (
        exists (
            select 1 from posts
            where posts.id = reactions.post_id
              and posts.published = true
        )
    );

create policy "Users can insert reactions on published posts"
    on reactions for insert
    with check (
        auth.uid() = user_id
        and exists (
            select 1 from posts
            where id = post_id and published = true
        )
    );

create policy "Users can delete their own reactions"
    on reactions for delete
    using (auth.uid() = user_id);

create policy "Disallow reactions update"
    on reactions for update
    with check (false);

-- =========================================================
-- USERS (profiles)
-- =========================================================
create policy "Users can view their own profile"
    on users for select
    using (auth.uid() = id);

create policy "Public can view basic user profiles"
    on users for select
    using (true);

create policy "Users can insert their own profile"
    on users for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on users for update
    using (auth.uid() = id);

create policy "Disallow user delete"
    on users for delete
    using (false);

-- =========================================================
-- POST_MEDIA
-- =========================================================
create policy "Public can view media of published posts"
    on post_media for select
    using (
        exists (
            select 1 from posts
            where posts.id = post_media.post_id
              and posts.published = true
        )
    );

create policy "Post owners can insert media"
    on post_media for insert
    with check (
        exists (
            select 1 from posts
            where posts.id = post_id
              and posts.user_id = auth.uid()
        )
    );

create policy "Post owners can update media"
    on post_media for update
    using (
        exists (
            select 1 from posts
            where posts.id = post_id
              and posts.user_id = auth.uid()
        )
    );

create policy "Post owners can delete media"
    on post_media for delete
    using (
        exists (
            select 1 from posts
            where posts.id = post_id
              and posts.user_id = auth.uid()
        )
    );

-- =========================================================
-- CATEGORIES & TAGS
-- =========================================================
create policy "Public can view categories"
    on categories for select
    using (true);

create policy "Public can view tags"
    on tags for select
    using (true);

-- (Insert/Update/Delete for categories & tags left to service role/admin)

-- =========================================================
-- POST_TAGS
-- =========================================================
create policy "Public can view tags of published posts"
    on post_tags for select
    using (
        exists (
            select 1 from posts
            where posts.id = post_tags.post_id
              and posts.published = true
        )
    );

create policy "Post owners manage post_tags"
    on post_tags for all
    using (
        exists (
            select 1 from posts
            where posts.id = post_id
              and posts.user_id = auth.uid()
        )
    );

-- =========================================================
-- WEBMENTIONS (optional)
-- =========================================================
create policy "Public can view webmentions on published posts"
    on webmentions for select
    using (
        exists (
            select 1 from posts
            where posts.id = webmentions.target_post_id
              and posts.published = true
        )
    );

create policy "Allow authenticated users to insert webmentions"
    on webmentions for insert
    with check (auth.role() = 'authenticated');

-- =========================================================
-- STORAGE (Supabase Buckets)
-- =========================================================
create policy "Allow public read"
    on storage.objects for select
    using (bucket_id = 'post-media');

create policy "Allow logged-in users to upload"
    on storage.objects for insert
    with check (bucket_id = 'post-media' and auth.role() = 'authenticated');
