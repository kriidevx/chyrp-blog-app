import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile - Chyrp Blog',
  description: 'View user profile and posts'
};

export default function UserProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200">
            {/* Avatar will go here */}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{params.username}</h1>
            <p className="text-gray-600">Member since January 2024</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        <div className="grid gap-6">
          {/* Posts grid will go here */}
        </div>
      </div>
    </div>
  );
}
