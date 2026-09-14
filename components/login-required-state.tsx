import Link from 'next/link';

import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface LoginRequiredStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function LoginRequiredState({
  icon: Icon,
  title,
  description,
}: LoginRequiredStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <Icon className="text-muted-foreground size-6" />
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Button asChild variant="brown">
        <Link href="/login">로그인하러 가기</Link>
      </Button>
    </div>
  );
}
