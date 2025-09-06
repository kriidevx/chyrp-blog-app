export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  image?: string;
  featured?: boolean;
  trending?: boolean;
  slug: string;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  published?: boolean;
  authorDetails?: User;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  created_at: string;
  author?: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}