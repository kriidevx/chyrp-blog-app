// app/posts/layout.tsx
import PostFilters from "@/components/PostFilters";

export const metadata = {
  title: "Feed · Chyrp",
};

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feed</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Latest posts from the community — use the search and filters to find what you want.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main feed area */}
        <main className="lg:col-span-3">{children}</main>

       
          </div>
      </div>

  );
}
