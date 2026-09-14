'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
            variant="pill"
            size="sm"
            pressed={value.includes(option)}
            onPressedChange={() => toggle(option)}
          >
            {option}
          </Toggle>
        ))}

        {value
          .filter((v) => !PERSONALITY_OPTIONS.includes(v))
          .map((custom) => (
            <Toggle
              key={custom}
              variant="pill"
              size="sm"
              pressed
              onPressedChange={() => toggle(custom)}
            >
              {custom}
            </Toggle>
          ))}

        <Toggle
          variant="pill"
          size="sm"
          pressed={showCustomInput}
          onPressedChange={handleCustomToggle}
          className="text-muted-foreground"
        >
          {CUSTOM_TAG}
        </Toggle>
      </div>

      {showCustomInput && (
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="성격을 입력하세요 (최대 20자)"
            maxLength={20}
          />
          <Button
            type="button"
            variant="brown"
            onClick={addCustomTag}
            disabled={!customText.trim()}
          >
            추가
          </Button>
        </div>
      )}
    </div>
  );
}
