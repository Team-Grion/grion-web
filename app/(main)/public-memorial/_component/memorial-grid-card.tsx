import Image from 'next/image';
import Link from 'next/link';

import { ImageOff } from 'lucide-react';

import type { PetMemorialPublicSummary } from '@/types/memorial';

import { formatDate } from '@/lib/utils';

interface MemorialGridCardProps {
  memorial: PetMemorialPublicSummary;
}

export function MemorialGridCard({ memorial }: MemorialGridCardProps) {
  return (
    <Link
      href={`/public-memorial/${memorial.petId}`}
      className="flex flex-col gap-1"
    >
      <div className="bg-gr-secondary relative aspect-square w-full overflow-hidden rounded-lg">
        {memorial.aiImageUrl ? (
          <Image
            src={memorial.aiImageUrl}
            alt={memorial.petName}
            fill
            className="object-cover transition-opacity hover:opacity-90"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <ImageOff className="size-5" />
          </div>
        )}
      </div>
      <div className="px-0.5">
        <p className="truncate text-xs font-medium">{memorial.petName}</p>
        <p className="text-muted-foreground text-xs">
          {memorial.deathDate ? formatDate(memorial.deathDate) : ''}
        </p>
      </div>
    </Link>
  );
}
