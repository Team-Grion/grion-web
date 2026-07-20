'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TopAppBar } from '@/components/top-app-bar';

const BACK_ROUTES: Record<
  string,
  { backHref: string; title: string; confirmLeave?: boolean }
> = {
  '/memorial/create': {
    backHref: '/memorial',
    title: '추모 공간 만들기',
    confirmLeave: true,
  },
};

export function AppTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const backRoute = BACK_ROUTES[pathname];

  if (backRoute) {
    return (
      <>
        <TopAppBar
          mode="back"
          title={backRoute.title}
          backHref={backRoute.confirmLeave ? undefined : backRoute.backHref}
          onBackClick={
            backRoute.confirmLeave ? () => setConfirmOpen(true) : undefined
          }
        />
        {backRoute.confirmLeave && (
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent size="sm" className="gap-8">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  추모 공간 만들기를 그만두시겠어요?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  지금까지 작성한 내용은 저장되지 않아요
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>계속 작성</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => router.push(backRoute.backHref)}
                >
                  나가기
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }

  return <TopAppBar mode="brand" />;
}
