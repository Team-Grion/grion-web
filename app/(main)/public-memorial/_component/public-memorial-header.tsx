import type { PublicMemorial } from '@/types/memorial';

interface PublicMemorialHeaderProps {
  memorials: PublicMemorial[];
}

export function PublicMemorialHeader({ memorials }: PublicMemorialHeaderProps) {
  const spacesWithFlowers = memorials.filter((m) => m.recentFlowers > 0);
  const totalRecentFlowers = spacesWithFlowers.reduce(
    (sum, m) => sum + m.recentFlowers,
    0,
  );

  return (
    <div className="bg-gr-secondary/60 px-4 py-4">
      <p className="text-gr-primary text-sm font-medium">
        오늘 {spacesWithFlowers.length}개 공간에 {totalRecentFlowers}송이 꽃이
        놓였어요
      </p>
    </div>
  );
}
