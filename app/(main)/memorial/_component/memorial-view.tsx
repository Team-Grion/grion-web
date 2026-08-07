'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import type { PetMemorialDetail, PetMemorialSummary } from '@/types/memorial';

import { getMemorialDetail, getMyMemorials } from '@/lib/api/memorial';

import { MemorialSpace } from '@/app/(main)/memorial/_component/memorial-space';
import { PetProfileBar } from '@/app/(main)/memorial/_component/pet-profile-bar';

export function MemorialView() {
  const [memorials, setMemorials] = useState<PetMemorialSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<PetMemorialDetail | null>(null);
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

  useEffect(() => {
    if (selectedId === null) return;

    let isStale = false;

    getMemorialDetail(selectedId)
      .then((next) => {
        if (!isStale) setDetail(next);
      })
      .catch((error) => {
        if (isStale) return;
        console.error('[memorial-detail]', error);
        toast('추모 공간 정보를 불러오지 못했어요', {
          description: '잠시 후 다시 시도해주세요',
        });
      });

    return () => {
      isStale = true;
    };
  }, [selectedId]);

  if (isLoading) return null;

  // 선택을 바꾼 직후에는 이전 펫의 상세가 남아 있으므로 petId로 걸러낸다
  const selectedDetail = detail?.petId === selectedId ? detail : null;
  const hasMemorials = memorials.length > 0;

  return (
    <div>
      {hasMemorials && (
        <PetProfileBar
          memorials={memorials}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}
      {hasMemorials && !selectedDetail ? null : (
        <MemorialSpace key={selectedId} memorial={selectedDetail} />
      )}
    </div>
  );
}
