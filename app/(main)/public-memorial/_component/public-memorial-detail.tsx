'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { ImageOff } from 'lucide-react';

import type { PetMemorialPublicDetail } from '@/types/memorial';

import { getPublicMemorialDetail } from '@/lib/api/memorial';
import { getMyPage } from '@/lib/api/user';
import { formatDateRange } from '@/lib/utils';

import { SendMessageForm } from '@/app/(main)/public-memorial/_component/send-message-form';

interface PublicMemorialDetailProps {
  petId: number;
}

export function PublicMemorialDetail({ petId }: PublicMemorialDetailProps) {
  const [memorial, setMemorial] = useState<PetMemorialPublicDetail | null>(
    null,
  );
  const [userName, setUserName] = useState('사용자');
  const [hasError, setHasError] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    let isStale = false;

    getPublicMemorialDetail(petId)
      .then((next) => {
        if (!isStale) setMemorial(next);
      })
      .catch((error) => {
        if (isStale) return;
        console.error('[public-memorial-detail]', error);
        setHasError(true);
      })
      .finally(() => {
        if (!isStale) setHasLoadedOnce(true);
      });

    return () => {
      isStale = true;
    };
  }, [petId]);

  useEffect(() => {
    let isStale = false;

    // 실패해도 쪽지는 보낼 수 있어야 하니 기본값('사용자')으로 계속 진행한다
    getMyPage()
      .then((user) => {
        if (!isStale) setUserName(user.name);
      })
      .catch((error) => {
        console.error('[my-page]', error);
      });

    return () => {
      isStale = true;
    };
  }, []);

  if (!hasLoadedOnce) return null;

  if (hasError || !memorial) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <p className="text-muted-foreground text-sm">
          존재하지 않거나 비공개로 전환된 추모 공간이에요
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <div className="flex flex-col items-center gap-3">
        <div className="bg-gr-secondary relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl">
          {memorial.aiImageUrl ? (
            <Image
              src={memorial.aiImageUrl}
              alt={memorial.petName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <ImageOff className="size-5" />
            </div>
          )}
          {/* 상세 응답엔 쪽지 수가 아직 안 내려와 국화꽃 오버레이는 생략한다 — 백엔드 확인 필요 */}
        </div>
        <h1 className="text-xl font-semibold">{memorial.petName}</h1>
        {memorial.birthDate && memorial.deathDate && (
          <p className="text-muted-foreground text-sm">
            {formatDateRange(memorial.birthDate, memorial.deathDate)}
          </p>
        )}
        {/* 상세 응답엔 한 줄 소개(introduction)가 아직 안 내려온다 — 백엔드 확인 필요 */}
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-4 font-medium">쪽지 보내기</h2>
        <SendMessageForm petId={petId} userName={userName} />
      </div>
    </div>
  );
}
