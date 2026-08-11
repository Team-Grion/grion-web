import type { PetMemorialPublicSummary } from '@/types/memorial';

import { MemorialGridCard } from '@/app/(main)/public-memorial/_component/memorial-grid-card';

interface MemorialGridProps {
  memorials: PetMemorialPublicSummary[];
}

export function MemorialGrid({ memorials }: MemorialGridProps) {
  if (memorials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-sm">
          해당하는 공개 추모 공간이 없어요
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      {memorials.map((memorial) => (
        <MemorialGridCard key={memorial.petId} memorial={memorial} />
      ))}
    </div>
  );
}
