import PostsFilterBar from './PostsFilterBar';
import PostsBulkActions from './PostsBulkActions';
import PostList from './PostList';

type PostsManagerProps = {
  posts: any[];
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPosts: Set<number>;
  setSelectedPosts: (val: Set<number>) => void;
  showBulkActions: boolean;
  setShowBulkActions: (val: boolean) => void;
  draggedPost: number | null;
  setDraggedPost: (id: number | null) => void;
  accessToken: string | null; // Add prop here
};

export default function PostsManager(props: PostsManagerProps) {
  const {
    posts, selectedFilter, setSelectedFilter,
    searchQuery, setSearchQuery,
    selectedPosts, setSelectedPosts,
    showBulkActions, setShowBulkActions,
    draggedPost, setDraggedPost,
    accessToken, // Receive token
  } = props;

  const filteredPosts = posts.filter(post => {
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'published' && post.published === true) ||
      (selectedFilter === 'draft' && !post.published);

    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8">
      <PostsFilterBar
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {showBulkActions && (
        <PostsBulkActions
          selectedCount={selectedPosts.size}
          onCancel={() => {
            setSelectedPosts(new Set());
            setShowBulkActions(false);
          }}
        />
      )}

      <PostList
        posts={filteredPosts}
        selectedPosts={selectedPosts}
        togglePostSelection={(id) => {
          const newSelected = new Set(selectedPosts);
          if (newSelected.has(id)) newSelected.delete(id);
          else newSelected.add(id);
          setSelectedPosts(newSelected);
          setShowBulkActions(newSelected.size > 0);
        }}
        setDraggedPost={setDraggedPost}
        draggedPost={draggedPost}
        accessToken={accessToken} // Forward token to PostList
      />

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-slate-900/30 mx-auto mb-4" viewBox="0 0 24 24"><path d="M2 6h20M2 12h20M2 18h20" /></svg>
          <h3 className="text-xl font-bold text-slate-900/60 mb-2">No posts found</h3>
          <p className="text-slate-900/50">
            {searchQuery ? 'Try adjusting your search terms' : 'Start creating your first post!'}
          </p>
        </div>
      )}
    </div>
  );
}
