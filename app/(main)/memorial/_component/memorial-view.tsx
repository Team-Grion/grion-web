'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import type { PetMemorialDetail, PetMemorialSummary } from '@/types/memorial';

import {
  getMemorialDetail,
  getMemorialStatus,
  getMyMemorials,
} from '@/lib/api/memorial';
import {
  readStoredMemorialSelection,
  storeMemorialSelection,
} from '@/lib/memorial-selection';

import { MemorialSpace } from '@/app/(main)/memorial/_component/memorial-space';
import { PetProfileBar } from '@/app/(main)/memorial/_component/pet-profile-bar';

const POLL_INTERVAL = 2000;
const POLL_TIMEOUT = 30000;

export type GenerationIssue = 'failed' | 'timeout';

export function MemorialView() {
  const [memorials, setMemorials] = useState<PetMemorialSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<PetMemorialDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [issue, setIssue] = useState<{
    petId: number;
    kind: GenerationIssue;
  } | null>(null);

  useEffect(() => {
    let isStale = false;

    getMyMemorials()
      .then((list) => {
        if (isStale) return;
        setMemorials(list);

        const stored = readStoredMemorialSelection();
        const next = list.some((m) => m.petId === stored)
          ? stored
          : (list[0]?.petId ?? null);
        setSelectedId(next);
        storeMemorialSelection(next);
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

  // 선택을 바꾼 직후에는 이전 펫의 상세가 남아 있으므로 petId로 걸러낸다
  const selectedDetail = detail?.petId === selectedId ? detail : null;

  // AI 이미지가 아직 없으면 완성될 때까지 짧게 되묻는다. 생성 중에
  // 이탈했다가 돌아온 경우도 여기로 흡수된다 — 상태는 서버가 갖고 있다.
  const pendingPetId =
    selectedDetail && !selectedDetail.aiImageUrl ? selectedDetail.petId : null;

  useEffect(() => {
    if (pendingPetId === null) return;

    let isStale = false;
    let timer: ReturnType<typeof setTimeout>;
    const deadline = Date.now() + POLL_TIMEOUT;

    async function poll(petId: number) {
      try {
        const status = await getMemorialStatus(petId);
        if (isStale) return;

        if (status === 'SUCCESS') {
          setDetail(await getMemorialDetail(petId));
          return;
        }
        if (status === 'FAIL') {
          setIssue({ petId, kind: 'failed' });
          return;
        }
        if (Date.now() > deadline) {
          setIssue({ petId, kind: 'timeout' });
          return;
        }
        timer = setTimeout(() => poll(petId), POLL_INTERVAL);
      } catch (error) {
        // 진행 중인 작업이 없으면 404가 아니라 400이 온다. 재시도할 일이 아니다.
        console.error('[memorial-status]', error);
        if (!isStale) setIssue({ petId, kind: 'timeout' });
      }
    }

    void poll(pendingPetId);

    return () => {
      isStale = true;
      clearTimeout(timer);
    };
  }, [pendingPetId]);

  function handleSelect(petId: number) {
    setSelectedId(petId);
    storeMemorialSelection(petId);
  }

  function handleImageRegenerating() {
    // aiImageUrl을 비우면 pendingPetId가 다시 이 petId를 가리켜서,
    // 생성 때 쓰던 폴링 로직을 그대로 재사용하게 된다.
    setDetail((prev) => (prev ? { ...prev, aiImageUrl: null } : prev));
    setIssue(null);
  }

  function handleDeleted(deletedId: number) {
    const remaining = memorials.filter((m) => m.petId !== deletedId);
    const next = remaining[0]?.petId ?? null;
    setMemorials(remaining);
    setSelectedId(next);
    storeMemorialSelection(next);
    setDetail(null);
    toast('추모 공간을 삭제했어요');
  }

  if (isLoading) return null;

  const hasMemorials = memorials.length > 0;
  const selectedIssue = issue?.petId === selectedId ? issue.kind : null;

  return (
    <div>
      {hasMemorials && (
        <PetProfileBar
          memorials={memorials}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      )}
      {hasMemorials && !selectedDetail ? null : (
        <MemorialSpace
          key={selectedId}
          memorial={selectedDetail}
          generationIssue={selectedIssue}
          onDeleted={handleDeleted}
          onRegenerating={handleImageRegenerating}
        />
      )}
    </div>
  );
}
