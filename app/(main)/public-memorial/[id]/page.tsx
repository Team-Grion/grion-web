import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import { MOCK_PUBLIC_MEMORIALS } from '@/lib/mock-data';

import { PublicMemorialDetail } from '@/app/(main)/public-memorial/_component/public-memorial-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PublicMemorialDetailPage({ params }: Props) {
  const { id } = await params;

  // 로그인 여부는 middleware가 판단하므로 여기선 확인하지 않는다
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
      {/* TODO: 백엔드 연동 시 사용자 정보 API에서 이름 가져오기 */}
      <PublicMemorialDetail memorial={memorial} userName="사용자" />
    </div>
  );
}
