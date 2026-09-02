'use client';

import { useRouter } from 'next/navigation';

import { LogOut } from 'lucide-react';

import { LOGIN_PATH } from '@/lib/auth/constants';
import { clearTokens } from '@/lib/auth/token';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function LogoutSection() {
  const router = useRouter();

  function handleSignOut() {
    clearTokens();
    router.replace(LOGIN_PATH);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          aria-label="로그아웃"
          className="text-muted-foreground hover:bg-muted hover:text-destructive shrink-0 cursor-pointer rounded-full p-2 transition-colors"
        >
          <LogOut className="size-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>로그아웃 하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>
            다시 로그인하면 언제든 돌아올 수 있어요
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut}>
            로그아웃
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
