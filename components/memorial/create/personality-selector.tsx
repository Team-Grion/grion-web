'use client';

import { Toggle } from '@/components/ui/toggle';

const PERSONALITY_OPTIONS = [
  '활발해요',
  '조용해요',
  '애교쟁이',
  '먹보',
  '호기심쟁이',
  '겁쟁이',
  '겁이 없어요',
  '장난꾸러기',
  '순해요',
  '고집쟁이',
];

interface PersonalitySelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function PersonalitySelector({
  selected,
  onChange,
}: PersonalitySelectorProps) {
  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((p) => p !== option)
        : [...selected, option],
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {PERSONALITY_OPTIONS.map((option) => (
        <Toggle
          key={option}
          variant="outline"
          size="sm"
          pressed={selected.includes(option)}
          onPressedChange={() => toggle(option)}
          className="aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground rounded-full px-3"
        >
          {option}
        </Toggle>
      ))}
    </div>
  );
}
