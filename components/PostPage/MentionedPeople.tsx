import { useEffect, useState } from 'react';
import { MentionedUser as ExistingMentionedUser } from '@/components/PostCard/types';
import { Post } from '@/typings';
import { Users as UsersIcon, Plus as PlusIcon, X as XIcon } from 'lucide-react';
import { Users, Plus, X } from 'lucide-react';

export default function MentionedPeople({ post }: { post: Post }) {
  const [mentionedUsers, setMentionedUsers] = useState<MentionedUser[]>([]);

  useEffect(() => {
    const fetchMentionedUsers = async () => {
      try {
        const response = await fetch(`/api/mention?postId=${post.id}`);
        const data = await response.json();
        setMentionedUsers(data);
      } catch (error) {
        console.error('Error fetching mentioned users:', error);
      }
    };

    if (post.id) {
      fetchMentionedUsers();
    }
  }, [post.id]);

  if (!mentionedUsers.length) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Mentioned:</span>
      <div className="flex -space-x-2">
        {mentionedUsers.map((user) => (
          <img
            key={user.id}
            src={user.avatar}
            alt={user.name}
            className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
            title={user.name}
          />
        ))}
      </div>
    </div>
  );
}

// New MentionedPpl Component
interface MentionedUser {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  isFollowing: boolean;
}

interface MentionedPplProps {
  postId: string;
}

const MentionedPpl: React.FC<MentionedPplProps> = ({ postId }) => {
  const [mentionedUsers, setMentionedUsers] = useState<MentionedUser[]>([
    { id: '1', username: 'sarah_design', name: 'Sarah Miller', isFollowing: false },
    { id: '2', username: 'mike_codes', name: 'Mike Thompson', isFollowing: true },
    { id: '3', username: 'anna_ux', name: 'Anna Rodriguez', isFollowing: false },
    { id: '4', username: 'tom_dev', name: 'Tom Wilson', isFollowing: true },
    { id: '5', username: 'lisa_pm', name: 'Lisa Chen', isFollowing: false },
  ]);

  const [showAll, setShowAll] = useState(false);

  const toggleFollow = (userId: string) => {
    setMentionedUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  const displayedUsers = showAll ? mentionedUsers : mentionedUsers.slice(0, 3);

  if (mentionedUsers.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full">
            <UsersIcon className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Mentioned People
          </h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {mentionedUsers.length}
          </span>
        </div>
        
        {mentionedUsers.length > 3 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200"
          >
            {showAll ? 'Show Less' : `+${mentionedUsers.length - 3} More`}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
                <span className="text-white font-bold text-lg">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{user.name}</h4>
                <p className="text-sm text-slate-600">@{user.username}</p>
              </div>
            </div>
            
            <button
              onClick={() => toggleFollow(user.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                user.isFollowing
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
              }`}
            >
              {user.isFollowing ? (
                <span className="flex items-center space-x-1">
                  <XIcon className="w-4 h-4" />
                  <span>Unfollow</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1">
                  <PlusIcon className="w-4 h-4" />
                  <span>Follow</span>
                </span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export { MentionedPpl };
