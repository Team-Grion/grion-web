import { Suspense } from 'react';

import { CreateMemorialForm } from '@/app/(main)/memorial/create/_component/create-memorial-form';

export default function CreateMemorialPage() {
  // 폼이 useSearchParams로 이어서 작성할 petId를 읽는다
  return (
    <Suspense>
      <CreateMemorialForm />
    </Suspense>
  );
}
