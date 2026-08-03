import { MOCK_PUBLIC_MEMORIALS } from '@/lib/mock-data';

import { PublicMemorialView } from '@/app/(main)/public-memorial/_component/public-memorial-view';

export default function PublicMemorialPage() {
  return <PublicMemorialView memorials={MOCK_PUBLIC_MEMORIALS} />;
}
