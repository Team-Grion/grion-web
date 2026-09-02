'use client';

import Link from 'next/link';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import type { PetMemorialSummary } from '@/types/memorial';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PetProfileBarProps {
  memorials: PetMemorialSummary[];
  selectedId: number | null;
  onSelect: (petId: number) => void;
  canCreateMore: boolean;
  maxMemorials: number;
}

export function PetProfileBar({
  memorials,
  selectedId,
  onSelect,
  canCreateMore,
  maxMemorials,
}: PetProfileBarProps) {
  return (
    <div className="bg-background flex items-center gap-4 overflow-x-auto border-b px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {memorials.map((memorial) => {
        const isSelected = memorial.petId === selectedId;
        // Step 2를 마치지 못하면 이름이 비어 있다
        const isDraft = !memorial.petName;
        const label = memorial.petName || '작성 중';
        return (
          <button
            key={memorial.petId}
            onClick={() => onSelect(memorial.petId)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <Avatar
              className={cn(
                'size-16 transition-all',
                isSelected && 'ring-gr-primary ring-2 ring-offset-2',
              )}
            >
              <AvatarImage src={memorial.aiImageUrl} alt={label} />
              <AvatarFallback className="text-base">{label[0]}</AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'text-xs transition-colors',
                isSelected
                  ? 'text-gr-primary font-medium'
                  : 'text-muted-foreground',
              )}
            >
              {isDraft ? (
                <>
                  {/* 점만 보이면 화면 낭독기에는 아무 의미가 없다 */}
                  <span className="sr-only">작성 중</span>
                  <span aria-hidden className="inline-flex">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce [animation-delay:150ms]">
                      .
                    </span>
                    <span className="animate-bounce [animation-delay:300ms]">
                      .
                    </span>
                  </span>
                </>
              ) : (
                label
              )}
            </span>
          </button>
        );
      })}

      {canCreateMore ? (
        <Link
          href="/memorial/create"
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <div className="border-muted-foreground/40 flex size-16 items-center justify-center rounded-full border-2 border-dashed">
            <Plus className="text-muted-foreground/60 size-5" />
          </div>
          <span className="text-muted-foreground text-xs">추가</span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={() =>
            toast(`추모 공간은 최대 ${maxMemorials}개까지 만들 수 있어요`, {
              description: '기존 공간을 정리하고 다시 시도해주세요',
            })
          }
          className="flex shrink-0 cursor-not-allowed flex-col items-center gap-1.5"
        >
          <div className="border-muted-foreground/20 flex size-16 items-center justify-center rounded-full border-2 border-dashed">
            <Plus className="text-muted-foreground/30 size-5" />
          </div>
          <span className="text-muted-foreground/50 text-xs">
            {memorials.length}/{maxMemorials}
          </span>
        </button>
      )}
    </div>
  );
}
