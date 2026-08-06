'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
    <ToggleGroup
      type="single"
      variant="pill"
      size="sm"
      spacing={2}
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as SpeciesFilterValue);
      }}
      className="px-4 py-3"
    >
      {OPTIONS.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
