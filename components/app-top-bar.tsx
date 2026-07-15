'use client';

import { usePathname } from 'next/navigation';

import { TopAppBar } from '@/components/top-app-bar';

const BACK_ROUTES: Record<string, { backHref: string; title: string }> = {
  '/memorial/create': { backHref: '/memorial', title: '추모 공간 만들기' },
};

export function AppTopBar() {
  const pathname = usePathname();
  const backRoute = BACK_ROUTES[pathname];

  if (backRoute) {
    return (
      <TopAppBar
        mode="back"
        backHref={backRoute.backHref}
        title={backRoute.title}
      />
    );
  }

  return <TopAppBar mode="brand" />;
}
