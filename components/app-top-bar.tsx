'use client';

import { usePathname } from 'next/navigation';

import { useLeaveConfirm } from '@/components/leave-confirm-provider';
import { TopAppBar } from '@/components/top-app-bar';

const BACK_ROUTES: Record<string, { backHref: string; title: string }> = {
  '/memorial/create': { backHref: '/memorial', title: '추모 공간 만들기' },
};

export function AppTopBar() {
  const pathname = usePathname();
  const { createGuardedClickHandler } = useLeaveConfirm();
  const backRoute = BACK_ROUTES[pathname];

  if (backRoute) {
    return (
      <TopAppBar
        mode="back"
        title={backRoute.title}
        backHref={backRoute.backHref}
        onBackClick={createGuardedClickHandler(backRoute.backHref)}
      />
    );
  }

  return <TopAppBar mode="brand" />;
}
