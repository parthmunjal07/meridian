'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, Calendar, Bot, Settings, List, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Inbox', href: '/inbox', icon: Inbox },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Digest', href: '/digest', icon: List },
    { name: 'Agent', href: '/agent', icon: Bot },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white tracking-wider">CORSAIR</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3 truncate">
              <p className="truncate text-sm font-medium text-white">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="ml-2 flex-shrink-0 rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">
          <Link
            href="/settings"
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith('/settings')
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-zinc-500 group-hover:text-zinc-300" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
