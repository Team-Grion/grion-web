import Image from 'next/image';
import Link from 'next/link';

import { ChevronLeft } from 'lucide-react';

interface TopAppBarProps {
  mode?: 'brand' | 'back';
  title?: string;
  backHref?: string;
  onBackClick?: () => void;
  right?: React.ReactNode;
}

export function TopAppBar({
  mode = 'brand',
  title,
  backHref,
  onBackClick,
  right,
}: TopAppBarProps) {
  return (
    <header className="bg-background/85 sticky top-0 z-20 flex h-13 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-sm">
      {mode === 'brand' ? (
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <Image
            src="/logo.png"
            alt="그리온"
            width={214}
            height={174}
            className="h-6.5 w-auto"
          />
          <span className="text-gr-primary text-base font-bold tracking-tight">
            그리온
          </span>
        </div>
      ) : (
        <>
          {onBackClick ? (
            <button
              type="button"
              onClick={onBackClick}
              aria-label="뒤로"
              className="text-foreground -ml-1 flex items-center p-1"
            >
              <ChevronLeft className="size-5.5" strokeWidth={2} />
            </button>
          ) : (
            backHref && (
              <Link
                href={backHref}
                aria-label="뒤로"
                className="text-foreground -ml-1 flex items-center p-1"
              >
                <ChevronLeft className="size-5.5" strokeWidth={2} />
              </Link>
            )
          )}
          <span className="min-w-0 flex-1 truncate text-[15.5px] font-semibold tracking-tight">
            {title}
          </span>
        </>
      )}
      {right && <div className="flex shrink-0 items-center">{right}</div>}
    </header>
  );
}
