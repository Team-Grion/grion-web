'use client';

import { ChevronRight, MailOpen } from 'lucide-react';

import type { Message } from '@/types/memorial';

import { formatSentAt } from '@/lib/utils';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MessageInboxProps {
  messages: Message[];
}

export function MessageInbox({ messages }: MessageInboxProps) {
  if (messages.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 px-4 py-3">
        <MailOpen className="size-4" />
        <span className="text-sm">아직 받은 쪽지가 없어요</span>
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="hover:bg-muted/50 flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <MailOpen className="text-muted-foreground size-4" />
            <span className="text-sm font-medium">
              받은 쪽지 {messages.length}개
            </span>
          </div>
          <ChevronRight className="text-muted-foreground size-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[70dvh] rounded-t-2xl px-0 pb-0 data-[side=bottom]:right-auto data-[side=bottom]:left-1/2 data-[side=bottom]:w-full data-[side=bottom]:max-w-150 data-[side=bottom]:-translate-x-1/2"
      >
        <SheetHeader className="px-5 pb-2">
          <SheetTitle>받은 쪽지함 ({messages.length})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full px-5 pb-8">
          <ul className="flex flex-col divide-y">
            {messages.map((msg) => (
              <li key={msg.id} className="py-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{msg.senderName}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatSentAt(msg.sentAt)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {msg.content}
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
