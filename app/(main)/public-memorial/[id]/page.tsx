import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import { PublicMemorialDetail } from '@/app/(main)/public-memorial/_component/public-memorial-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PublicMemorialDetailPage({ params }: Props) {
  const { id } = await params;
  const petId = Number(id);
  if (!Number.isInteger(petId)) notFound();

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
      {/* TODO: 백엔드 연동 시 사용자 정보 API에서 이름 가져오기 */}
      <PublicMemorialDetail petId={petId} userName="사용자" />
    </div>
  );
}
