'use client';

import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Toggle } from '@/components/ui/toggle';

import { PERSONALITY_OPTIONS } from '@/app/(main)/memorial/create/_component/schema';

const CUSTOM_TAG = '직접 입력하기';

interface PersonalitySelectorProps {
  value: string[];
  onChange: (selected: string[]) => void;
}

export function PersonalitySelector({
  value,
  onChange,
}: PersonalitySelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function toggle(option: string) {
    onChange(
      value.includes(option)
        ? value.filter((p) => p !== option)
        : [...value, option],
    );
  }

  function handleCustomToggle() {
    if (showCustomInput) {
      setShowCustomInput(false);
      setCustomText('');
    } else {
      setShowCustomInput(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleCustomKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  }

  function addCustomTag() {
    const trimmed = customText.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setCustomText('');
    setShowCustomInput(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {PERSONALITY_OPTIONS.map((option) => (
          <Toggle
            key={option}
            variant="outline"
            size="sm"
            pressed={value.includes(option)}
            onPressedChange={() => toggle(option)}
            className="aria-pressed:border-brown aria-pressed:bg-brown/8 aria-pressed:text-brown rounded-full px-3"
          >
            {option}
          </Toggle>
        ))}

        {value
          .filter((v) => !PERSONALITY_OPTIONS.includes(v))
          .map((custom) => (
            <Toggle
              key={custom}
              variant="outline"
              size="sm"
              pressed
              onPressedChange={() => toggle(custom)}
              className="aria-pressed:border-brown aria-pressed:bg-brown/8 aria-pressed:text-brown rounded-full px-3"
            >
              {custom}
            </Toggle>
          ))}

        <button
          type="button"
          onClick={handleCustomToggle}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            showCustomInput
              ? 'border-brown bg-brown/8 text-brown'
              : 'border-border text-muted-foreground hover:border-tan/60',
          )}
        >
          {CUSTOM_TAG}
        </button>
      </div>

      {showCustomInput && (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="성격을 입력하세요 (최대 20자)"
            maxLength={20}
            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex-1 rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none focus-visible:ring-1"
          />
          <button
            type="button"
            onClick={addCustomTag}
            disabled={!customText.trim()}
            className="bg-brown text-warm-white rounded-md px-3 py-1.5 text-sm disabled:opacity-40"
          >
            추가
          </button>
        </div>
      )}
    </div>
  );
}
