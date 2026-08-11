import type { PetMemorialPublicTodaySummary } from '@/types/memorial';

interface PublicMemorialHeaderProps {
  summary: PetMemorialPublicTodaySummary | null;
}

export function PublicMemorialHeader({ summary }: PublicMemorialHeaderProps) {
  if (!summary) return null;

  return (
    <div className="bg-gr-secondary/60 px-4 py-4">
      <p className="text-gr-primary text-sm font-medium">
        오늘 {summary.memorialCount}개 공간에 {summary.messageCount}송이 꽃이
        놓였어요
      </p>
    </div>
  );
}
