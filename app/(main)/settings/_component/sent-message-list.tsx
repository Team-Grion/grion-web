'use client';

import Link from 'next/link';

import { ArrowRight, ChevronRight, Lock, MailOpen } from 'lucide-react';

import type { UserLetterSummary } from '@/types/memorial';

import { formatSentAt } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SentMessageListProps {
  letters: UserLetterSummary[];
}

export function SentMessageList({ letters }: SentMessageListProps) {
  return (
    <div className="flex flex-col">
      <h2 className="px-6 pt-6 pb-2 text-sm font-medium">
        보낸 쪽지 {letters.length}개
      </h2>

      {letters.length === 0 ? (
        <div className="text-muted-foreground flex items-center gap-2 px-6 py-3">
          <MailOpen className="size-4" />
          <span className="text-sm">아직 보낸 쪽지가 없어요</span>
        </div>
      ) : (
        <ul className="divide-y">
          {letters.map((letter) => (
            <li key={letter.letterId}>
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="hover:bg-muted/50 flex w-full items-center gap-3 px-6 py-3 text-left transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">
                          {letter.petName}에게
                        </span>
                        {letter.isAnonymous && (
                          <span className="text-muted-foreground text-xs">
                            (익명)
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground truncate text-sm">
                        {letter.content}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="text-muted-foreground text-xs">
                        {formatSentAt(letter.createdAt)}
                      </span>
                      <ChevronRight className="text-muted-foreground size-4" />
                    </div>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="max-h-[70dvh] rounded-t-2xl data-[side=bottom]:right-auto data-[side=bottom]:left-1/2 data-[side=bottom]:w-full data-[side=bottom]:max-w-150 data-[side=bottom]:-translate-x-1/2"
                >
                  <SheetHeader className="pb-2">
                    <SheetTitle>{letter.petName}에게 보낸 쪽지</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-8">
                    <p className="text-muted-foreground mb-2 text-xs">
                      {formatSentAt(letter.createdAt)} ·{' '}
                      {letter.isAnonymous
                        ? '익명으로 전송'
                        : '이름 공개로 전송'}
                    </p>
                    <p className="text-sm leading-relaxed">{letter.content}</p>

                    {letter.isPetPublic === false ? (
                      // 눌러본 뒤에 막히는 것보다 미리 알려주는 편이 낫다
                      <p className="text-muted-foreground mt-6 flex items-center gap-1.5 text-xs">
                        <Lock className="size-3.5 shrink-0" />
                        지금은 비공개 상태라 추모공간을 볼 수 없어요
                      </p>
                    ) : (
                      <Button asChild variant="outline" className="mt-6 w-full">
                        <Link href={`/public-memorial/${letter.petId}`}>
                          {letter.petName}의 추모공간 가기
                          <ArrowRight />
                        </Link>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
