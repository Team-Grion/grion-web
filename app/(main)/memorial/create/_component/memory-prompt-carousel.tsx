'use client';

import { useEffect, useRef } from 'react';

import { MEMORY_PROMPTS } from '@/app/(main)/memorial/create/_component/schema';

interface MemoryPromptCarouselProps {
  onSelect: (prompt: string) => void;
}

export function MemoryPromptCarousel({ onSelect }: MemoryPromptCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // 화면에 쓰이지 않고 다음 카드를 고르는 데만 필요하다.
  // state로 두면 3초마다 의미 없는 리렌더가 돈다.
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeIndexRef.current + 1) % MEMORY_PROMPTS.length;
      activeIndexRef.current = next;

      const card = scrollRef.current?.children[next] as HTMLElement | undefined;
      card?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none]"
    >
      {MEMORY_PROMPTS.map((prompt, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(prompt)}
          className="border-border/60 bg-gr-secondary/40 hover:bg-gr-secondary/70 flex w-44 shrink-0 cursor-pointer items-start rounded-xl border p-3 text-left text-sm leading-snug transition-colors"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
