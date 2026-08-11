import Image from 'next/image';
import Link from 'next/link';

import { Flower2, ImageOff } from 'lucide-react';

import type { PetMemorialPublicSummary } from '@/types/memorial';

import { formatDateRange } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

interface MemorialGridCardProps {
  memorial: PetMemorialPublicSummary;
}

export function MemorialGridCard({ memorial }: MemorialGridCardProps) {
  return (
    <Link
      href={`/public-memorial/${memorial.petId}`}
      className="hover:bg-muted/40 flex gap-3 px-4 py-4 transition-colors"
    >
      <div className="bg-gr-secondary relative size-24 shrink-0 overflow-hidden rounded-xl">
        {memorial.aiImageUrl ? (
          <Image
            src={memorial.aiImageUrl}
            alt={memorial.petName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <ImageOff className="size-5" />
          </div>
        )}
        {memorial.todayMessageCount > 0 && (
          <span className="bg-gr-primary/80 text-gr-primary-foreground absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
            <span className="bg-gr-primary-foreground size-1 rounded-full" />
            오늘 {memorial.todayMessageCount}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <h3 className="truncate font-semibold">{memorial.petName}</h3>
          <span className="text-muted-foreground shrink-0 text-xs">
            {formatDateRange(memorial.birthDate, memorial.deathDate)}
          </span>
        </div>

        {memorial.introduction && (
          <p className="line-clamp-2 text-sm">
            &ldquo;{memorial.introduction}&rdquo;
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          {memorial.personalities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {memorial.personalities.map((personality) => (
                <Badge
                  key={personality}
                  variant="outline"
                  className="bg-gr-secondary text-gr-primary border-none"
                >
                  {personality}
                </Badge>
              ))}
            </div>
          )}
          <span className="text-muted-foreground ml-auto flex shrink-0 items-center gap-1 text-xs">
            <Flower2 className="size-3.5" />
            {memorial.totalMessageCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
