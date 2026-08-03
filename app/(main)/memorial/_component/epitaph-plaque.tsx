'use client';

import { useState } from 'react';

import { Check, Pencil, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';

interface EpitaphPlaqueProps {
  value: string;
  onChange: (value: string) => void;
  isPublic: boolean;
}

const MAX_LENGTH = 40;

export function EpitaphPlaque({
  value,
  onChange,
  isPublic,
}: EpitaphPlaqueProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function startEdit() {
    setDraft(value);
    setIsEditing(true);
  }

  function save() {
    onChange(draft.trim());
    setIsEditing(false);
  }

  function cancel() {
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex w-full max-w-sm items-center gap-1.5">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="한 줄 소개를 남겨보세요"
          className="h-8 flex-1 text-center text-xs"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancel();
          }}
        />
        <button
          type="button"
          onClick={save}
          aria-label="저장"
          className="text-gr-primary hover:bg-gr-secondary/60 shrink-0 rounded-full p-1.5"
        >
          <Check className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={cancel}
          aria-label="취소"
          className="text-muted-foreground hover:bg-muted shrink-0 rounded-full p-1.5"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  if (value) {
    return (
      <button
        type="button"
        onClick={startEdit}
        className={cn(
          'text-gr-primary/80 flex max-w-full items-center gap-2',
          !isPublic && 'opacity-50',
        )}
      >
        <span className="bg-gr-accent/50 h-px w-4 shrink-0" />
        <span className="truncate text-xs">&ldquo;{value}&rdquo;</span>
        <span className="bg-gr-accent/50 h-px w-4 shrink-0" />
        <Pencil className="text-muted-foreground size-3 shrink-0 opacity-60" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className={cn(
        'text-muted-foreground flex items-center gap-1 text-xs',
        !isPublic && 'opacity-60',
      )}
    >
      <span>한 줄 소개를 남겨보세요</span>
      <Pencil className="size-3" />
    </button>
  );
}
