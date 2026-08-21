'use client';

import { createContext, useContext, useState } from 'react';
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

const GUARDED_ROUTES: Record<string, { title: string; description: string }> = {
  '/memorial/create': {
    title: '추모 공간 만들기를 그만두시겠어요?',
    description: '지금까지 작성한 내용은 저장되지 않아요',
  },
};

interface LeaveConfirmContextValue {
  createGuardedClickHandler: (href: string) => (e: React.MouseEvent) => void;
}

const LeaveConfirmContext = createContext<LeaveConfirmContextValue | null>(
  null,
);

export function LeaveConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // Any actual route change (including browser back/forward, which bypasses
  // our click handlers entirely) makes a stale pending confirmation moot.
  // Deriving it during render beats resetting from an effect: the stale value
  // never reaches the screen, and there is no extra render pass.
  const [pending, setPending] = useState<{
    href: string;
    pathname: string;
  } | null>(null);
  const pendingHref = pending?.pathname === pathname ? pending.href : null;

  const guardedRoute = GUARDED_ROUTES[pathname];

  function createGuardedClickHandler(href: string) {
    return (e: React.MouseEvent) => {
      if (guardedRoute && href !== pathname) {
        e.preventDefault();
        setPending({ href, pathname });
      }
    };
  }

  return (
    <LeaveConfirmContext.Provider value={{ createGuardedClickHandler }}>
      {children}
      <AlertDialog
        open={!!pendingHref}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <AlertDialogContent size="sm" className="gap-8">
          <AlertDialogHeader>
            <AlertDialogTitle>{guardedRoute?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {guardedRoute?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>계속 작성</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => pendingHref && router.push(pendingHref)}
            >
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LeaveConfirmContext.Provider>
  );
}

export function useLeaveConfirm() {
  const ctx = useContext(LeaveConfirmContext);
  if (!ctx) {
    throw new Error('useLeaveConfirm must be used within LeaveConfirmProvider');
  }
  return ctx;
}
