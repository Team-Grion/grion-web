import Image from 'next/image';
import Link from 'next/link';

import type { PublicMemorial } from '@/types/memorial';

import { formatDate } from '@/lib/utils';

interface MemorialGridCardProps {
  memorial: PublicMemorial;
}

export function MemorialGridCard({ memorial }: MemorialGridCardProps) {
  return (
    <Link
      href={`/public-memorial/${memorial.id}`}
      className="flex flex-col gap-1"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={memorial.aiImageUrl}
          alt={memorial.petName}
          fill
          className="object-cover transition-opacity hover:opacity-90"
        />
      </div>
      <div className="px-0.5">
        <p className="truncate text-xs font-medium">{memorial.petName}</p>
        <p className="text-muted-foreground text-xs">
          {formatDate(memorial.deathDate)}
        </p>
      </div>
    </Link>
  );
}
