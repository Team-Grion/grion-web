import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import { auth } from '@/lib/auth/auth';
import { MOCK_PUBLIC_MEMORIALS } from '@/lib/mock-data';

import { PublicMemorialDetail } from '@/app/(main)/public-memorial/_component/public-memorial-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PublicMemorialDetailPage({ params }: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const memorial = MOCK_PUBLIC_MEMORIALS.find((m) => m.id === id);
  if (!memorial) notFound();

  return (
    <div>
      <div className="flex items-center gap-1 border-b px-2 py-3">
        <Link
          href="/public-memorial"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="size-4" />
          공개 추모 공간
        </Link>
      </div>
      <PublicMemorialDetail memorial={memorial} userName={session.user.name} />
    </div>
  );
}
