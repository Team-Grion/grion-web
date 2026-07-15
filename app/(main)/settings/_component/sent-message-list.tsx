'use client';

import { ChevronRight, MailOpen } from 'lucide-react';

import type { SentMessage } from '@/types/memorial';

import { formatSentAt } from '@/lib/utils';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SentMessageListProps {
  messages: SentMessage[];
}

export function SentMessageList({ messages }: SentMessageListProps) {
  return (
    <div className="flex flex-col">
      <h2 className="px-6 pt-6 pb-2 text-sm font-medium">
        보낸 쪽지 {messages.length}개
      </h2>

      {messages.length === 0 ? (
        <div className="text-muted-foreground flex items-center gap-2 px-6 py-3">
          <MailOpen className="size-4" />
          <span className="text-sm">아직 보낸 쪽지가 없어요</span>
        </div>
      ) : (
        <ul className="divide-y">
          {messages.map((msg) => (
            <li key={msg.id}>
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="hover:bg-muted/50 flex w-full items-center gap-3 px-6 py-3 text-left transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">
                          {msg.toPetName}에게
                        </span>
                        {msg.anonymous && (
                          <span className="text-muted-foreground text-xs">
                            (익명)
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground truncate text-sm">
                        {msg.preview}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="text-muted-foreground text-xs">
                        {formatSentAt(msg.sentAt)}
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
                    <SheetTitle>{msg.toPetName}에게 보낸 쪽지</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-8">
                    <p className="text-muted-foreground mb-2 text-xs">
                      {formatSentAt(msg.sentAt)} ·{' '}
                      {msg.anonymous ? '익명으로 전송' : '이름 공개로 전송'}
                    </p>
                    <p className="text-sm leading-relaxed">{msg.preview}</p>
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
