'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import type { UserPage } from '@/types/memorial';

import { describeApiError } from '@/lib/api/error';
import { getMyPage } from '@/lib/api/user';
import { hasAccessToken } from '@/lib/auth/token';

import { LoginRequiredState } from '@/components/login-required-state';

import { LogoutSection } from '@/app/(main)/settings/_component/logout-section';
import { ProfileSection } from '@/app/(main)/settings/_component/profile-section';
import { SentMessageList } from '@/app/(main)/settings/_component/sent-message-list';

export function SettingsView() {
  const [user, setUser] = useState<UserPage | null>(null);
  // 서버는 쿠키를 못 읽어 항상 false를 렌더한다 — 클라이언트도 첫 렌더는
  // 반드시 같은 값(false/true=로딩 중)으로 맞춰야 하이드레이션이 안 깨진다.
  // 실제 값은 마운트 이후 effect에서 채운다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isStale = false;

    // 마이크로태스크로 한 텀 미뤄서 effect 본문에서 곧바로 setState하지
    // 않게 한다 — 하이드레이션 커밋 이후에 실행되는 게 보장된다.
    void Promise.resolve().then(() => {
      if (isStale) return;

      const loggedIn = hasAccessToken();
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        setIsLoading(false);
        return;
      }

      getMyPage()
        .then((next) => {
          if (!isStale) setUser(next);
        })
        .catch((error) => {
          if (isStale) return;
          // 401은 인터셉터가 로그인으로 보내므로 여기서는 그 외 실패만 알린다
          console.error('[user-page]', error);
          toast('내 정보를 불러오지 못했어요', {
            description: describeApiError(error),
          });
        })
        .finally(() => {
          if (!isStale) setIsLoading(false);
        });
    });

    return () => {
      isStale = true;
    };
  }, []);

  function handleDeleted(letterId: number) {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            letters: prev.letters.filter((l) => l.letterId !== letterId),
          }
        : prev,
    );
  }

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <LoginRequiredState
        title="로그인하고 내 정보를 확인해보세요"
        description="보낸 쪽지와 프로필을 한눈에 볼 수 있어요"
      />
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {/* 조회에 실패해도 로그아웃은 할 수 있어야 한다 */}
      <ProfileSection
        name={user?.name ?? '사용자'}
        imageUrl={user?.profileImageUrl}
      >
        <LogoutSection />
      </ProfileSection>
      <SentMessageList
        letters={user?.letters ?? []}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
