import PostCard from './PostCard';

type Props = {
  posts: any[];
  selectedPosts: Set<number>;
  togglePostSelection: (id: number) => void;
  setDraggedPost: (id: number | null) => void;
  draggedPost: number | null;
  accessToken: string | null; // Add prop here
};

export default function PostList({
  posts, selectedPosts, togglePostSelection, setDraggedPost, draggedPost, accessToken
}: Props) {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          selected={selectedPosts.has(post.id)}
          togglePostSelection={togglePostSelection}
          setDraggedPost={setDraggedPost}
          draggedPost={draggedPost}
          accessToken={accessToken} // Pass token to PostCard
        />
      ))}
    </div>
  );
}
