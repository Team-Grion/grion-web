'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { MemorialProfile, Message } from '@/types/memorial';

import { formatDateRange } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import { FlowerOverlay } from '@/app/(main)/memorial/_component/flower-overlay';
import { MessageInbox } from '@/app/(main)/memorial/_component/message-inbox';

interface MemorialSpaceProps {
  memorial: MemorialProfile | null;
  messages: Message[];
}

export function MemorialSpace({ memorial, messages }: MemorialSpaceProps) {
  const [isPublic, setIsPublic] = useState(memorial?.isPublic ?? false);

  if (!memorial) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <Image src="/logo.png" alt="" width={96} height={78} />
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold">첫 추모 공간을 만들어보세요</h2>
          <p className="text-muted-foreground text-sm">
            사진 한 장으로 소중한 아이를 위한 공간을 남길 수 있어요
          </p>
        </div>
        <Button asChild variant="brown">
          <Link href="/memorial/create">추모 공간 만들기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 px-6 py-6">
      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl">
        <Image
          src={memorial.aiImageUrl}
          alt={memorial.petName}
          fill
          className="object-cover"
        />
        <FlowerOverlay count={messages.length} />
      </div>
      <h2 className="text-xl font-semibold">{memorial.petName}</h2>
      <p className="text-muted-foreground text-sm">
        {formatDateRange(memorial.birthDate, memorial.deathDate)}
      </p>

      <div className="mt-2 flex w-full max-w-sm flex-col divide-y overflow-hidden rounded-xl border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium">공개 추모 공간</p>
            <p className="text-muted-foreground text-xs">
              {isPublic
                ? '모두에게 공개된 상태예요'
                : '나만 볼 수 있는 상태예요'}
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>

        <MessageInbox messages={messages} />
      </div>
    </div>
  );
}
