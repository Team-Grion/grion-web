'use client';

import Image from 'next/image';

import { authClient } from '@/lib/auth/auth-client';

export function KakaoLoginButton() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: 'kakao',
      callbackURL: '/memorial',
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleLogin}
        className="w-full cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
      >
        <Image
          src="/kakao_login_medium_narrow.png"
          alt="카카오 계정으로 계속하기"
          width={183}
          height={45}
          className="mx-auto"
        />
      </button>
      <p className="text-center text-xs text-muted-foreground">
        계속하면{' '}
        <span className="cursor-pointer underline underline-offset-2 hover:text-foreground">
          이용약관
        </span>{' '}
        및{' '}
        <span className="cursor-pointer underline underline-offset-2 hover:text-foreground">
          개인정보처리방침
        </span>
        에 동의하게 됩니다.
      </p>
    </div>
  );
}
