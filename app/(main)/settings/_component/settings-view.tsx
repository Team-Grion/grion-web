'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import type { UserPage } from '@/types/memorial';

import { describeApiError } from '@/lib/api/error';
import { getMyPage } from '@/lib/api/user';

import { LogoutSection } from '@/app/(main)/settings/_component/logout-section';
import { ProfileSection } from '@/app/(main)/settings/_component/profile-section';
import { SentMessageList } from '@/app/(main)/settings/_component/sent-message-list';

export function SettingsView() {
  const [user, setUser] = useState<UserPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (isLoading) return null;

  return (
    <div className="flex flex-col divide-y">
      {/* 조회에 실패해도 로그아웃은 할 수 있어야 한다 */}
      <ProfileSection
        name={user?.name ?? '사용자'}
        imageUrl={user?.profileImageUrl}
      >
        <LogoutSection />
      </ProfileSection>
      <SentMessageList letters={user?.letters ?? []} />
    </div>
  );
}
