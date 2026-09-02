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
  // 로그인 여부는 마운트 시점에 한 번만 읽으면 되는 값이라 effect가 아니라
  // 렌더에서 바로 구한다 — 로딩 상태도 그 값에 맞춰 초기화한다.
  const [isLoggedIn] = useState(hasAccessToken);
  const [isLoading, setIsLoading] = useState(isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    let isStale = false;

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

    return () => {
      isStale = true;
    };
  }, [isLoggedIn]);

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
