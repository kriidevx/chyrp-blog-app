-- USERS (extend Supabase Auth users)
create table if not exists users (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique not null,
    email text not null,
    avatar_url text,
    bio text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- CATEGORIES
create table if not exists categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null
);

-- TAGS
create table if not exists tags (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null
);

-- POSTS
create table if not exists posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    title text not null,
    slug text unique not null,
    content text not null,
    excerpt text,
    category_id uuid references categories(id) on delete set null,
    published boolean default false,
    view_count integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- POST MEDIA
create table if not exists post_media (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references posts(id) on delete cascade,
    media_type text not null,
    url text not null,
    alt_text text,
    "order" integer default 0
);

-- POST_TAGS (many-to-many)
create table if not exists post_tags (
    post_id uuid references posts(id) on delete cascade,
    tag_id uuid references tags(id) on delete cascade,
    primary key (post_id, tag_id)
);

-- COMMENTS
create table if not exists comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references posts(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    content text not null,
    created_at timestamptz default now(),
    deleted_at timestamptz
);

-- LIKES
create table if not exists likes (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references posts(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    created_at timestamptz default now(),
    unique (post_id, user_id)
);

-- REACTIONS
create table if not exists reactions (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references posts(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    reaction_type text not null,
    created_at timestamptz default now(),
    unique (post_id, user_id, reaction_type)
);

-- WEBMENTIONS (optional)
create table if not exists webmentions (
    id uuid primary key default gen_random_uuid(),
    source_url text not null,
    target_post_id uuid not null references posts(id) on delete cascade,
    content text,
    created_at timestamptz default now()
);
