'use client';

import { useState } from 'react';

import { CircleHelp } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

/**
 * 도움말 아이콘. 데스크톱에서는 hover, 모바일에서는 탭으로 열고 닫는다.
 * Radix 기본 동작은 눌리는 순간 닫혀버려서 열림 상태를 직접 들고 있어야 한다.
 */
export function InfoTooltip({
  children,
  label = '도움말 보기',
  className,
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger
          // form 안에서도 쓰이므로 제출되지 않도록 타입을 못박는다
          type="button"
          aria-label={label}
          // Radix가 눌림과 동시에 닫는 것을 막아야 탭으로 토글할 수 있다
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'text-muted-foreground hover:text-foreground transition-colors',
            className,
          )}
        >
          <CircleHelp className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent className="max-w-56 leading-relaxed break-keep">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
