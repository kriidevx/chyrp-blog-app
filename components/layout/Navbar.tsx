'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthButtons from './AuthButtons';
import UserMenu from './UserMenu';

export default function NavBar() {
  const auth = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow">
      <div className="font-bold text-xl tracking-tight">
        <Link href="/">FeatherBlog</Link>
      </div>
      <ul className="flex gap-6 text-sm font-semibold">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/posts">Feed</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
      <div>
        {auth.loading ? null : auth.user ? <UserMenu /> : <AuthButtons />}
      </div>
    </nav>
  );
}
