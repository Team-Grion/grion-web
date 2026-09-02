'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Flower2, Globe, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useLeaveConfirm } from '@/components/leave-confirm-provider';

const navItems = [
  // { href: '/dashboard', label: '홈', icon: Home },
  { href: '/memorial', label: '내 추모공간', icon: Flower2 },
  { href: '/public-memorial', label: '공개 추모공간', icon: Globe },
  { href: '/settings', label: '설정', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { createGuardedClickHandler } = useLeaveConfirm();

  return (
    <nav className="bg-background fixed bottom-0 left-1/2 w-full max-w-150 -translate-x-1/2 border-t">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={createGuardedClickHandler(href)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors',
                isActive
                  ? 'text-gr-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground font-medium',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.3 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
