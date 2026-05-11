'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { MemorialProfile, Message } from '@/types/memorial';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FlowerOverlay } from '@/components/memorial/flower-overlay';
import { MessageInbox } from '@/components/memorial/message-inbox';

interface MemorialSpaceProps {
  memorial: MemorialProfile | null;
  messages: Message[];
}

function formatDateRange(birthDate: string, deathDate: string) {
  const fmt = (d: string) => d.replace(/-/g, '.');
  return `${fmt(birthDate)} ~ ${fmt(deathDate)}`;
}

export function MemorialSpace({ memorial, messages }: MemorialSpaceProps) {
  const [isPublic, setIsPublic] = useState(memorial?.isPublic ?? false);

  if (!memorial) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <p className="text-muted-foreground">아직 추모 공간이 없어요</p>
        <Button asChild variant="outline">
          <Link href="/memorial/create">만들러 가기</Link>
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

      <div className="mt-2 flex w-full max-w-sm items-center justify-between rounded-xl border px-4 py-3">
        <div>
          <p className="text-sm font-medium">공개 추모 공간</p>
          <p className="text-muted-foreground text-xs">
            {isPublic ? '모두에게 공개된 상태예요' : '나만 볼 수 있는 상태예요'}
          </p>
        </div>
        <Switch checked={isPublic} onCheckedChange={setIsPublic} />
      </div>

      <MessageInbox messages={messages} />
    </div>
  );
}
