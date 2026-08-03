'use client';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import type { MemorialProfile } from '@/types/memorial';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PetProfileBarProps {
  memorials: MemorialProfile[] | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PetProfileBar({
  memorials,
  selectedId,
  onSelect,
}: PetProfileBarProps) {
  return (
    <div className="bg-background flex items-center gap-4 overflow-x-auto border-b px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {memorials?.map((memorial) => {
        const isSelected = memorial.id === selectedId;
        return (
          <button
            key={memorial.id}
            onClick={() => onSelect(memorial.id)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <Avatar
              className={cn(
                'size-16 transition-all',
                isSelected && 'ring-gr-primary ring-2 ring-offset-2',
              )}
            >
              <AvatarImage src={memorial.userImageUrl} alt={memorial.petName} />
              <AvatarFallback className="text-base">
                {memorial.petName[0]}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'text-xs transition-colors',
                isSelected
                  ? 'text-gr-primary font-medium'
                  : 'text-muted-foreground',
              )}
            >
              {memorial.petName}
            </span>
          </button>
        );
      })}

      <Link
        href="/memorial/create"
        className="flex shrink-0 flex-col items-center gap-1.5"
      >
        <div className="border-muted-foreground/40 flex size-16 items-center justify-center rounded-full border-2 border-dashed">
          <Plus className="text-muted-foreground/60 size-5" />
        </div>
        <span className="text-muted-foreground text-xs">추가</span>
      </Link>
    </div>
  );
}
