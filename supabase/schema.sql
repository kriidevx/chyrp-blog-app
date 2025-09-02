-- ===============================
-- PROFILES TABLE
-- ===============================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  role text check (role in ('user','admin')) default 'user',
  created_at timestamp default now()
);

-- ===============================
-- POSTS TABLE
-- ===============================
CREATE TABLE posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content jsonb NOT NULL,
    content_type text,
    author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    status text DEFAULT 'draft',  -- values e.g. 'published', 'draft'
    media_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

-- ===============================
-- COMMENTS TABLE
-- ===============================
CREATE TABLE comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
    author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- ===============================
-- LIKES TABLE
-- ===============================
CREATE TABLE likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now()
);

-- ===============================
-- TAGS TABLE
-- ===============================
CREATE TABLE tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL
);

-- ===============================
-- POST_TAGS TABLE
-- ===============================
CREATE TABLE post_tags (
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- ===============================
-- VIEWS TABLE
-- ===============================
CREATE TABLE views (
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
    count int4 DEFAULT 0,
    PRIMARY KEY (post_id)
);

-- Enable RLS on all tables as before
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;
