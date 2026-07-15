import { headers } from 'next/headers';

import type { SentMessage } from '@/types/memorial';

import { auth } from '@/lib/auth/auth';

import { LogoutSection } from '@/app/(main)/settings/_component/logout-section';
import { ProfileSection } from '@/app/(main)/settings/_component/profile-section';
import { SentMessageList } from '@/app/(main)/settings/_component/sent-message-list';

const MOCK_SENT_MESSAGES: SentMessage[] = [
  {
    id: 's1',
    toPetName: '코코',
    anonymous: false,
    preview: '코코야, 네가 곁에 있어서 정말 행복했어. 지금도 많이 보고 싶어.',
    sentAt: '2025-03-12T14:23:00Z',
  },
  {
    id: 's2',
    toPetName: '몽이',
    anonymous: true,
    preview: '무지개 다리 너머에서도 행복하게 지내길 바랄게.',
    sentAt: '2025-02-28T09:05:00Z',
  },
];

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex flex-col divide-y">
      <ProfileSection
        name={session?.user.name ?? '사용자'}
        imageUrl={session?.user.image}
      />
      <SentMessageList messages={MOCK_SENT_MESSAGES} />
      <LogoutSection />
    </div>
  );
}
