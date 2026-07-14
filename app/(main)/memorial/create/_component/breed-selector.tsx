'use client';

import { useEffect, useState } from 'react';

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
  const [selectValue, setSelectValue] = useState('');
  const [customBreed, setCustomBreed] = useState('');

  const breeds =
    species === 'dog' ? DOG_BREEDS : species === 'cat' ? CAT_BREEDS : [];

  useEffect(() => {
    setSelectValue('');
    setCustomBreed('');
    onChange('');
  }, [species]);

  function handleSelectChange(selected: string) {
    setSelectValue(selected);
    if (selected !== '기타') {
      onChange(selected);
      setCustomBreed('');
    } else {
      onChange('');
    }
  }

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomBreed(e.target.value);
    onChange(e.target.value);
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
        <SelectTrigger
          className={error && !selectValue ? 'border-destructive' : ''}
        >
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

      {selectValue === '기타' && (
        <Input
          placeholder="품종을 직접 입력해주세요"
          value={customBreed}
          onChange={handleCustomChange}
          maxLength={30}
          className={error && !customBreed ? 'border-destructive' : ''}
          autoFocus
        />
      )}

      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
