'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

import { OnboardingSlide } from '@/app/(auth)/login/_component/onboarding-slide';

const SLIDES = [
  {
    title: '다시 만나는 작은 공간',
    body: '떠나보낸 우리 아이를 마음속에 오래 간직할 수 있도록, 그리온이 함께할게요.',
    image: '/onboarding/intro.png',
  },
  {
    title: '사진으로 다시 그려요',
    body: '함께한 사진을 올리면 AI가 우리 아이를 원하는 모습으로 다시 그려드려요.',
    image: '/onboarding/ai.png',
  },
  {
    title: '기억을 오래 간직해요',
    body: '우리 아이만을 위한 추모 공간을 만들어, 소중한 기억을 오래 간직할 수 있어요.',
    image: '/onboarding/memorial.png',
  },
  {
    title: '마음을 나눠요',
    body: '혼자 간직하던 그리움, 이곳에서 같은 마음을 가진 분들과 따뜻하게 공유해보세요.',
    image: '/onboarding/share.png',
  },
];

export function OnboardingCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-end px-4 pt-4">
        <Link
          href="/public-memorial"
          className="text-muted-foreground px-2 py-1.5 text-sm"
        >
          건너뛰기
        </Link>
      </div>

      <Carousel setApi={setApi} className="flex-1">
        <CarouselContent className="ml-0">
          {SLIDES.map((slide, i) => (
            <CarouselItem
              key={i}
              className="flex items-center justify-center pl-0"
            >
              <OnboardingSlide
                title={slide.title}
                body={slide.body}
                image={slide.image}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="ghost"
          className="text-foreground/25 hover:text-foreground/40 left-2 border-0 hover:bg-transparent"
        />
        <CarouselNext
          variant="ghost"
          className="text-foreground/25 hover:text-foreground/40 right-2 border-0 hover:bg-transparent"
        />
      </Carousel>

      <div className="flex justify-center gap-2 py-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            aria-label={`${i + 1}번째 슬라이드`}
            className={cn(
              'h-1.5 cursor-pointer rounded-full transition-all duration-300',
              i === current ? 'bg-gr-primary w-5' : 'bg-gr-accent/40 w-1.5',
            )}
          />
        ))}
      </div>
    </div>
  );
}
