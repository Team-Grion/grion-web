'use client';

import { useEffect, useRef, useState } from 'react';

import { MEMORY_PROMPTS } from '@/app/(main)/memorial/create/_component/schema';

interface MemoryPromptCarouselProps {
  onSelect: (prompt: string) => void;
}

export function MemoryPromptCarousel({ onSelect }: MemoryPromptCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % MEMORY_PROMPTS.length;
        const container = scrollRef.current;
        if (container) {
          const card = container.children[next] as HTMLElement;
          if (card) {
            card.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center',
            });
          }
        }
        return next;
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
          className="border-border/60 bg-peach/40 hover:bg-peach/70 flex w-44 shrink-0 items-start rounded-xl border p-3 text-left text-sm leading-snug transition-colors"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
