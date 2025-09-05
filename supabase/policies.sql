-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  USING (published = true);

CREATE POLICY "Users can view their own unpublished posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only administrators can manage categories"
  ON categories FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

-- Tags policies
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Users can create tags"
  ON tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Posts_Categories policies
CREATE POLICY "Posts_Categories relations are viewable by everyone"
  ON posts_categories FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own posts' categories"
  ON posts_categories FOR ALL
  USING (
    auth.uid() IN (
      SELECT author_id FROM posts WHERE id = post_id
    )
  );

-- Posts_Tags policies
CREATE POLICY "Posts_Tags relations are viewable by everyone"
  ON posts_tags FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own posts' tags"
  ON posts_tags FOR ALL
  USING (
    auth.uid() IN (
      SELECT author_id FROM posts WHERE id = post_id
    )
  );

-- Followers policies
CREATE POLICY "Followers are viewable by everyone"
  ON followers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can follow others"
  ON followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON followers FOR DELETE
  USING (auth.uid() = follower_id);
