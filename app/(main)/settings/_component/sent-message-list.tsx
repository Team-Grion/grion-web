'use client';

import { MailOpen } from 'lucide-react';

import type { UserLetterSummary } from '@/types/memorial';

import { SentMessageItem } from '@/app/(main)/settings/_component/sent-message-item';

interface SentMessageListProps {
  letters: UserLetterSummary[];
  onDeleted: (letterId: number) => void;
}

export function SentMessageList({ letters, onDeleted }: SentMessageListProps) {
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
              <SentMessageItem letter={letter} onDeleted={onDeleted} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
