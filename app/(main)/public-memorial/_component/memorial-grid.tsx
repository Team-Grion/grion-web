import type { PetMemorialPublicSummary } from '@/types/memorial';

import { MemorialGridCard } from '@/app/(main)/public-memorial/_component/memorial-grid-card';

interface MemorialGridProps {
  memorials: PetMemorialPublicSummary[];
  /** 종류 필터가 걸려있는지 — 전체 목록이 비었는지 필터 결과가 없는지에 따라 문구를 다르게 보여준다 */
  hasActiveFilter: boolean;
}

export function MemorialGrid({
  memorials,
  hasActiveFilter,
}: MemorialGridProps) {
  if (memorials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-sm">
          {hasActiveFilter
            ? '해당하는 공개 추모 공간이 없어요'
            : '아직 공개된 추모 공간이 없어요'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {memorials.map((memorial) => (
        <MemorialGridCard key={memorial.petId} memorial={memorial} />
      ))}
    </div>
  );
}
