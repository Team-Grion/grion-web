import { Flower2 } from 'lucide-react';

import type { PetMemorialPublicTodaySummary } from '@/types/memorial';

interface PublicMemorialHeaderProps {
  summary: PetMemorialPublicTodaySummary | null;
}

export function PublicMemorialHeader({ summary }: PublicMemorialHeaderProps) {
  if (!summary) return null;

  return (
    <div className="flex items-center gap-1.5 border-b px-4 py-3">
      <Flower2 className="text-gr-primary size-4 shrink-0" />
      <p className="text-sm">
        오늘{' '}
        <span className="text-gr-primary font-semibold">
          {summary.memorialCount}개
        </span>
        의 공간에{' '}
        <span className="text-gr-primary font-semibold">
          {summary.messageCount}송이
        </span>
        의 꽃이 놓였어요
      </p>
    </div>
  );
}
