'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  Calendar,
  Bot,
  Settings,
  List,
  LogOut,
  Navigation,
  UserCircle2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigationGroups = [
    {
      label: 'Workspace',
      items: [
        { name: 'Inbox', href: '/inbox', icon: Inbox },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
        { name: 'Daily digest', href: '/digest', icon: List },
        { name: 'AI assistant', href: '/agent', icon: Bot },
      ],
    },
    {
      label: 'Account',
      items: [
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Profile', href: '/profile', icon: UserCircle2 },
      ],
    },
  ];

  // Extract user initials
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <aside className="relative flex h-full w-[220px] shrink-0 flex-col border-r border-nav-line bg-nav-canvas text-nav-ink">
      {/* Brand */}
      <div className="flex h-[76px] shrink-0 items-center gap-3 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nav-ink text-white shadow-[0_1px_2px_rgba(24,24,23,0.16)]">
          <Navigation className="h-[17px] w-[17px]" strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <span className="block truncate text-[16px] font-semibold leading-tight tracking-[-0.025em] text-nav-ink">
            Meridian
          </span>
          <span className="mt-0.5 block text-[10px] font-medium tracking-[0.01em] text-nav-muted">
            Mail workspace
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-1">
        <nav aria-label="Primary navigation" className="space-y-6">
          {navigationGroups.map((group) => (
            <section key={group.label} aria-labelledby={`nav-${group.label.toLowerCase()}`}>
              <h2
                id={`nav-${group.label.toLowerCase()}`}
                className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-nav-muted"
              >
                {group.label}
              </h2>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative flex min-h-11 items-center rounded-xl px-3 pl-3.5 text-[13px] font-medium tracking-[-0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nav-ink focus-visible:ring-offset-2 focus-visible:ring-offset-nav-canvas ${
                        isActive
                          ? 'bg-nav-active text-nav-ink shadow-[inset_0_0_0_1px_rgba(24,24,23,0.025)]'
                          : 'text-nav-secondary hover:bg-nav-hover hover:text-nav-ink'
                      }`}
                    >
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute left-1.5 h-5 w-0.5 rounded-full bg-nav-ink"
                        />
                      )}
                      <Icon
                        aria-hidden="true"
                        className={`mr-3 h-[18px] w-[18px] shrink-0 transition-colors ${
                          isActive
                            ? 'text-nav-ink'
                            : 'text-nav-muted group-hover:text-nav-secondary'
                        }`}
                        strokeWidth={1.65}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
      </div>

      {/* User */}
      <div className="border-t border-nav-line p-3">
        <div className="flex min-h-14 items-center gap-3 rounded-xl px-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nav-avatar text-[11px] font-semibold text-nav-ink ring-1 ring-inset ring-nav-line">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[12px] font-semibold text-nav-ink">
              {user?.name || 'User'}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-nav-muted">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-nav-muted transition-colors hover:bg-nav-hover hover:text-nav-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nav-ink focus-visible:ring-offset-2 focus-visible:ring-offset-nav-canvas"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </aside>
  );
}
