'use client';

import { Toggle } from '@/components/ui/toggle';

export type SpeciesFilterValue = 'all' | 'dog' | 'cat';

interface SpeciesFilterProps {
  value: SpeciesFilterValue;
  onChange: (value: SpeciesFilterValue) => void;
}

const OPTIONS: { value: SpeciesFilterValue; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'dog', label: '강아지' },
  { value: 'cat', label: '고양이' },
];

export function SpeciesFilter({ value, onChange }: SpeciesFilterProps) {
  return (
    <div className="flex gap-2 px-4 py-3">
      {OPTIONS.map((option) => (
        <Toggle
          key={option.value}
          variant="outline"
          size="sm"
          pressed={value === option.value}
          onPressedChange={() => onChange(option.value)}
          className="aria-pressed:border-gr-primary aria-pressed:bg-gr-primary/8 aria-pressed:text-gr-primary rounded-full px-3"
        >
          {option.label}
        </Toggle>
      ))}
    </div>
  );
}
