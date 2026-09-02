'use client';

import { useState } from 'react';

import { ChevronRight, Mail, MailOpen } from 'lucide-react';
import { toast } from 'sonner';

import type { PetLetter } from '@/types/memorial';

import { describeApiError } from '@/lib/api/error';
import { getMemorialLetters } from '@/lib/api/memorial';
import { hasUnreadLetters, markLettersSeen } from '@/lib/unread-letters';
import { formatSentAt } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';

/** 안 읽은 쪽지가 있을 때 닫힌 봉투/열린 봉투를 번갈아 보여준다 */
function BlinkingEnvelope() {
  return (
    <span className="relative inline-block size-4">
      <Mail className="text-destructive absolute inset-0 size-4 animate-[envelope-blink_1.6s_ease-in-out_infinite]" />
      <MailOpen className="text-destructive absolute inset-0 size-4 animate-[envelope-blink_1.6s_ease-in-out_infinite] [animation-delay:-0.8s]" />
    </span>
  );
}

interface MessageInboxProps {
  petId: number;
  count: number;
}

export function MessageInbox({ petId, count }: MessageInboxProps) {
  const [letters, setLetters] = useState<PetLetter[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // 마운트 시점에 한 번만 읽으면 되는 값이라 effect가 아니라 렌더에서 바로
  // 구한다 — 이 컴포넌트는 데이터가 이미 로드된 뒤에만 마운트되므로
  // 하이드레이션 불일치가 날 여지가 없다.
  const [hasUnread, setHasUnread] = useState(() =>
    hasUnreadLetters(petId, count),
  );

  // 목록은 쪽지함을 처음 열 때 한 번만 불러온다
  async function handleOpenChange(isOpen: boolean) {
    // 열 때마다 "지금까지의 쪽지는 확인했다"로 취급해 깜빡임을 멈춘다
    if (isOpen) {
      markLettersSeen(petId, count);
      setHasUnread(false);
    }
    if (!isOpen || letters || isLoading) return;

    setIsLoading(true);
    try {
      setLetters(await getMemorialLetters(petId));
    } catch (error) {
      console.error('[memorial-letters]', error);
      toast('쪽지를 불러오지 못했어요', {
        description: describeApiError(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (count === 0) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 px-4 py-3">
        <MailOpen className="size-4" />
        <span className="text-sm">아직 받은 쪽지가 없어요</span>
      </div>
    );
  }

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            {hasUnread ? (
              <BlinkingEnvelope />
            ) : (
              <MailOpen className="text-muted-foreground size-4" />
            )}
            <span className="text-sm font-medium">받은 쪽지 {count}개</span>
          </div>
          <ChevronRight className="text-muted-foreground size-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-0 pb-0 data-[side=bottom]:right-auto data-[side=bottom]:left-1/2 data-[side=bottom]:h-[50dvh]! data-[side=bottom]:w-full data-[side=bottom]:max-w-150 data-[side=bottom]:-translate-x-1/2"
      >
        <SheetHeader className="px-5 pb-2">
          <SheetTitle>받은 쪽지함 ({count})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1 px-5 pb-8">
          {letters ? (
            <ul className="flex flex-col divide-y">
              {letters.map((letter) => (
                <li key={letter.letterId} className="flex gap-3 py-4">
                  <Avatar className="bg-gr-secondary shrink-0">
                    <AvatarImage
                      src="/logo.png"
                      alt=""
                      className="object-contain p-1.5"
                    />
                    <AvatarFallback className="bg-gr-secondary text-gr-primary font-medium">
                      {letter.senderName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {letter.senderName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatSentAt(letter.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {letter.content}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground flex justify-center py-10">
              {isLoading ? <Spinner /> : null}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
