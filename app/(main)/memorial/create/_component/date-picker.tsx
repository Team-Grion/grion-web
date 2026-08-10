'use client';

import { CalendarIcon } from 'lucide-react';
import { type Matcher } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/**
 * 기록상 가장 오래 산 반려동물이 38년이라 그보다 이전은 고를 이유가 없다.
 * 연도 드롭다운 길이도 이 범위가 결정한다.
 */
const EARLIEST_MONTH = new Date(1980, 0);

interface DatePickerProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: Matcher | Matcher[];
  ariaInvalid?: boolean;
}

function toArray(matcher: Matcher | Matcher[] | undefined): Matcher[] {
  if (!matcher) return [];
  return Array.isArray(matcher) ? matcher : [matcher];
}

export function DatePicker({
  value,
  onChange,
  placeholder = '날짜 선택',
  disabled,
  ariaInvalid,
}: DatePickerProps) {
  const selected = value ? new Date(value) : undefined;

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-invalid={ariaInvalid}
          className={cn(
            'w-full justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {selected
            ? selected.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/*
          disabled만 걸면 날짜는 못 고르지만 달력은 계속 넘어간다.
          이동 범위와 연도 드롭다운은 startMonth/endMonth가 정한다.
        */}
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={[
            { before: EARLIEST_MONTH },
            // 태어난 날도 보낸 날도 미래일 수 없다
            { after: new Date() },
            ...toArray(disabled),
          ]}
          startMonth={EARLIEST_MONTH}
          endMonth={new Date()}
          defaultMonth={selected}
          captionLayout="dropdown"
          locale={ko}
        />
      </PopoverContent>
    </Popover>
  );
}
