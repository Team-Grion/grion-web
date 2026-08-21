'use client';

import { useRef, useState } from 'react';

import { Pencil } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';

import { BACKGROUNDS } from '@/app/(main)/memorial/create/_component/schema';

// 서버 제약과 동일
const MAX_LENGTH = 255;

interface BackgroundSelectorProps {
  value: string | undefined;
  onChange: (background: string) => void;
}

function isPreset(background: string | undefined) {
  return BACKGROUNDS.some((bg) => bg.id === background);
}

export function BackgroundSelector({
  value,
  onChange,
}: BackgroundSelectorProps) {
  // 값이 있는데 목록에 없으면 직접 입력한 것이다 (이어서 작성하기 등)
  const [isCustom, setIsCustom] = useState(!!value && !isPreset(value));
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(background: string) {
    setIsCustom(false);
    onChange(value === background ? '' : background);
  }

  function handleCustomSelect() {
    if (isCustom) {
      setIsCustom(false);
      onChange('');
      return;
    }
    setIsCustom(true);
    // 프리셋을 골라둔 상태였다면 비워서 직접 입력을 기다린다
    if (isPreset(value)) onChange('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1">
        <button
          type="button"
          onClick={handleCustomSelect}
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <div
            className={cn(
              'flex h-20 w-16 items-center justify-center rounded-xl border-2 transition-all',
              isCustom
                ? 'border-gr-primary bg-gr-primary/5 shadow-gr-primary/20 shadow-sm'
                : 'border-muted-foreground/30 border-dashed',
            )}
          >
            <Pencil
              className={cn(
                'size-5',
                isCustom ? 'text-gr-primary' : 'text-muted-foreground/60',
              )}
            />
          </div>
          <span
            className={cn(
              'text-xs',
              isCustom
                ? 'text-gr-primary font-medium'
                : 'text-muted-foreground',
            )}
          >
            직접 입력
          </span>
        </button>

        {BACKGROUNDS.map((bg) => {
          const isSelected = !isCustom && value === bg.id;
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

      {isCustom && (
        <Input
          ref={inputRef}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="text-foreground"
          placeholder="어떤 배경이면 좋을까요? (예: 벚꽃 흩날리는 길)"
          maxLength={MAX_LENGTH}
        />
      )}
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
