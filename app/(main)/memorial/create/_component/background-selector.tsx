'use client';

import { cn } from '@/lib/utils';

import { BACKGROUNDS } from '@/app/(main)/memorial/create/_component/schema';

interface BackgroundSelectorProps {
  value: string | undefined;
  onChange: (background: string) => void;
}

export function BackgroundSelector({
  value,
  onChange,
}: BackgroundSelectorProps) {
  function handleSelect(background: string) {
    onChange(value === background ? '' : background);
  }

  return (
    <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1">
      {BACKGROUNDS.map((bg) => {
        const isSelected = value === bg.id;
        return (
          <button
            key={bg.id}
            type="button"
            onClick={() => handleSelect(bg.id)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                'h-20 w-16 overflow-hidden rounded-xl border-2 transition-all',
                isSelected
                  ? 'border-gr-primary shadow-gr-primary/20 shadow-sm'
                  : 'border-transparent',
              )}
            >
              <div className="bg-gr-secondary/60 flex size-full items-center justify-center text-2xl">
                {BG_EMOJI[bg.id]}
              </div>
            </div>
            <span
              className={cn(
                'text-xs',
                isSelected
                  ? 'text-gr-primary font-medium'
                  : 'text-muted-foreground',
              )}
            >
              {bg.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const BG_EMOJI: Record<string, string> = {
  sky: '☁️',
  'flower-field': '🌸',
  'living-room': '🛋️',
  park: '🌳',
  beach: '🏖️',
  'sunny-window': '☀️',
  'snow-field': '❄️',
};
