'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { toast } from 'sonner';

import { loginWithKakao } from '@/lib/api/auth';
import { describeApiError } from '@/lib/api/error';
import { HOME_PATH } from '@/lib/auth/constants';
import { ensureKakaoSdk, kakaoLogin } from '@/lib/auth/kakao-sdk';
import { setTokens } from '@/lib/auth/token';

export function KakaoLoginButton() {
  const [isReady, setIsReady] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    ensureKakaoSdk()
      .then(() => setIsReady(true))
      .catch((error) => {
        console.error('[kakao-sdk]', error);
        toast('카카오 로그인을 준비하지 못했어요', {
          description: describeApiError(error),
        });
      });
  }, []);

  // async 함수지만 kakaoLogin() 호출 전까지 await이 없어야 팝업이 차단되지 않는다.
  async function handleLogin() {
    if (isPending) return;
    setIsPending(true);

    try {
      const kakaoAccessToken = await kakaoLogin();

      // 카카오 토큰은 신원 확인용으로 한 번만 쓰고, 서버 JWT로 교환한 뒤 버린다
      const { accessToken, refreshToken } =
        await loginWithKakao(kakaoAccessToken);
      setTokens(accessToken, refreshToken);

      // 쿠키를 심은 뒤 전체 페이지 이동으로 middleware를 다시 태운다.
      // (클라이언트 네비게이션은 라우터 캐시에 걸릴 수 있어 확실한 쪽을 택함)
      window.location.replace(HOME_PATH);
    } catch (error) {
      console.error('[kakao-login]', error);
      toast('카카오 로그인에 실패했어요', {
        description: describeApiError(error),
      });
      // 성공 시에는 페이지가 곧 바뀌므로 버튼을 계속 비활성 상태로 둔다
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleLogin}
        disabled={!isReady || isPending}
        className="w-full cursor-pointer transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Image
          src="/kakao_login_medium_narrow.png"
          alt="카카오 계정으로 계속하기"
          width={183}
          height={45}
          className="mx-auto"
        />
      </button>
      <p className="text-muted-foreground text-center text-xs">
        계속하면{' '}
        <span className="hover:text-foreground cursor-pointer underline underline-offset-2">
          이용약관
        </span>{' '}
        및{' '}
        <span className="hover:text-foreground cursor-pointer underline underline-offset-2">
          개인정보처리방침
        </span>
        에 동의하게 됩니다.
      </p>
    </div>
  );
}
