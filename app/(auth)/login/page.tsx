'use client';

import { authClient } from '@/lib/auth/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: 'kakao',
      callbackURL: '/dashboard',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">시작하기</CardTitle>
          <CardDescription>
            소셜 계정으로 간편하게 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">소셜 로그인</span>
            <Separator className="flex-1" />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
            >
              <img
                src="/kakao_login_medium_narrow.png"
                alt="카카오 로그인"
              />
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            로그인 시{' '}
            <span className="cursor-pointer underline underline-offset-2 hover:text-foreground">
              이용약관
            </span>{' '}
            및{' '}
            <span className="cursor-pointer underline underline-offset-2 hover:text-foreground">
              개인정보처리방침
            </span>
            에 동의하게 됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
