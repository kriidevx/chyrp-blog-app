-- PROFILES

CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Admin full access profiles"
ON profiles
FOR ALL
USING (exists (
  select 1 from profiles where id = auth.uid() and role = 'admin'
));

-- POSTS

CREATE POLICY "Public can read published posts"
ON posts
FOR SELECT
USING (status = 'published');

CREATE POLICY "Authors insert posts"
ON posts
FOR INSERT
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors update own posts"
ON posts
FOR UPDATE
USING (author_id = auth.uid());

CREATE POLICY "Admin full access posts"
ON posts
FOR ALL
USING (exists (
  select 1 from profiles where id = auth.uid() and role = 'admin'
));

-- COMMENTS

CREATE POLICY "Read comments for published posts"
ON comments
FOR SELECT
USING (exists (
  SELECT 1 FROM posts p WHERE p.id = comments.post_id AND p.status = 'published'
));

CREATE POLICY "Users insert comments"
ON comments
FOR INSERT
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users update own comments"
ON comments
FOR UPDATE
USING (author_id = auth.uid());

CREATE POLICY "Admin delete comments"
ON comments
FOR DELETE
USING (exists (
  select 1 from profiles where id = auth.uid() and role = 'admin'
));

-- LIKES

CREATE POLICY "Users insert own likes"
ON likes
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own likes"
ON likes
FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Admin full access likes"
ON likes
FOR ALL
USING (exists (
  select 1 from profiles where id = auth.uid() and role = 'admin'
));

-- TAGS

CREATE POLICY "Public read tags"
ON tags
FOR SELECT
USING (true);

CREATE POLICY "Admin full access tags"
ON tags
FOR ALL
USING (exists (
  select 1 from profiles where id = auth.uid() and role = 'admin'
));

-- POST_TAGS

CREATE POLICY "Manage post tags (authors and admins)"
ON post_tags
FOR ALL
USING (
  exists (
    select 1 from posts where posts.id = post_tags.post_id and posts.author_id = auth.uid()
  )
  or
  exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  )
);

-- VIEWS

CREATE POLICY "Public can increment views"
ON views
FOR UPDATE
USING (true);

CREATE POLICY "Admin full access views"
ON views
FOR ALL
USING (exists (
  select 1 from profiles where id = auth.uid() and role = 'admin'
));
