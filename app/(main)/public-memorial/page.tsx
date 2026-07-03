import { MOCK_PUBLIC_MEMORIALS } from '@/lib/mock-data';

import { MemorialGrid } from '@/app/(main)/public-memorial/_component/memorial-grid';

export default function PublicMemorialPage() {
  return (
    <div>
      <div className="border-b px-4 py-4">
        <h1 className="font-semibold">공개 추모 공간</h1>
      </div>
      <MemorialGrid memorials={MOCK_PUBLIC_MEMORIALS} />
    </div>
  );
}
