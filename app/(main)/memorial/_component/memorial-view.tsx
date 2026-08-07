'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import type { PetMemorialSummary } from '@/types/memorial';

import { getMyMemorials } from '@/lib/api/memorial';

import { MemorialSpace } from '@/app/(main)/memorial/_component/memorial-space';
import { PetProfileBar } from '@/app/(main)/memorial/_component/pet-profile-bar';

export function MemorialView() {
  const [memorials, setMemorials] = useState<PetMemorialSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isStale = false;

    getMyMemorials()
      .then((list) => {
        if (isStale) return;
        setMemorials(list);
        setSelectedId(list[0]?.petId ?? null);
      })
      .catch((error) => {
        if (isStale) return;
        // 401은 인터셉터가 로그인으로 보내므로 여기서는 그 외 실패만 알린다
        console.error('[memorials]', error);
        toast('추모 공간을 불러오지 못했어요', {
          description: '잠시 후 다시 시도해주세요',
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
    <div>
      {memorials.length > 0 && (
        <PetProfileBar
          memorials={memorials}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}
      {/* 상세 조회(GET /memorials/me/{petId}) 연동 전이라 아직 빈 상태로 둔다 */}
      <MemorialSpace key={selectedId} memorial={null} messages={[]} />
    </div>
  );
}
