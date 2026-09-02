'use client';

import { cn } from '@/lib/utils';

type Species = 'dog' | 'cat';

interface SpeciesSelectorProps {
  value: Species | undefined;
  onChange: (species: Species) => void;
  error?: string;
}

const OPTIONS: { value: Species; label: string; emoji: string }[] = [
  { value: 'dog', label: '강아지', emoji: '🐶' },
  { value: 'cat', label: '고양이', emoji: '🐱' },
];

export function SpeciesSelector({
  value,
  onChange,
  error,
}: SpeciesSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-colors',
              value === option.value
                ? 'border-gr-primary bg-gr-primary/8 text-gr-primary'
                : 'border-border text-muted-foreground hover:border-gr-accent/60',
            )}
          >
            <span>{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
