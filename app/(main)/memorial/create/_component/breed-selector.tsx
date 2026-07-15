'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  CAT_BREEDS,
  DOG_BREEDS,
} from '@/app/(main)/memorial/create/_component/schema';

const CUSTOM_OPTION = '기타';

interface BreedSelectorProps {
  species: 'dog' | 'cat' | undefined;
  value: string;
  onChange: (breed: string) => void;
  error?: string;
}

export function BreedSelector({
  species,
  value,
  onChange,
  error,
}: BreedSelectorProps) {
  const breeds =
    species === 'dog' ? DOG_BREEDS : species === 'cat' ? CAT_BREEDS : [];
  const isPredefined = breeds.includes(value);
  const [isCustom, setIsCustom] = useState(() => value !== '' && !isPredefined);

  const selectValue = isCustom ? CUSTOM_OPTION : isPredefined ? value : '';

  function handleSelectChange(selected: string) {
    if (selected === CUSTOM_OPTION) {
      setIsCustom(true);
      onChange('');
    } else {
      setIsCustom(false);
      onChange(selected);
    }
  }

  if (!species) {
    return (
      <div className="border-border bg-muted/50 flex h-10 items-center rounded-md border px-3">
        <span className="text-muted-foreground text-sm">
          종을 먼저 선택해주세요
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Select value={selectValue} onValueChange={handleSelectChange}>
        <SelectTrigger aria-invalid={!!error && !selectValue}>
          <SelectValue placeholder="품종을 선택해주세요" />
        </SelectTrigger>
        <SelectContent>
          {breeds.map((breed) => (
            <SelectItem key={breed} value={breed}>
              {breed}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isCustom && (
        <Input
          placeholder="품종을 직접 입력해주세요"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={30}
          aria-invalid={!!error && !value}
          autoFocus
        />
      )}

      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
