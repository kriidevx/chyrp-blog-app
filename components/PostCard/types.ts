// PostCard Types
export interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified?: boolean;
  followerCount?: number;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  video?: string;
  timestamp: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isArchived?: boolean;
  tags?: string[];
  mentions?: string[];
  location?: string;
  type: 'text' | 'image' | 'video' | 'poll' | 'link';
}

export interface Reaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
  isActive: boolean;
  users?: Author[];
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
  isLiked: boolean;
  parentId?: string;
}

export interface MentionedUser {
  id: string;
  username: string;
  name: string;
  avatar?: string;
}

export interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface PostStats {
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  engagementRate: number;
}