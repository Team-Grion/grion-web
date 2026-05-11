import type { MemorialProfile, Message } from '@/types/memorial';

import { MemorialView } from '@/components/memorial/memorial-view';

type MockMemorial = MemorialProfile & { messages: Message[] };

const MOCK_DATA: MockMemorial[] = [
  {
    id: '1',
    petName: '코코',
    birthDate: '2018-03-12',
    deathDate: '2024-11-05',
    userImageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
    aiImageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
    isPublic: true,
    messages: [
      {
        id: 'm1',
        senderName: '김민지',
        content:
          '코코야, 네가 곁에 있어서 정말 행복했어. 지금도 많이 보고 싶어.',
        sentAt: '2025-03-12T14:23:00Z',
      },
      {
        id: 'm2',
        senderName: '이준호',
        content:
          '무지개 다리 너머에서도 행복하게 지내길 바랄게. 항상 기억할게.',
        sentAt: '2025-02-28T09:05:00Z',
      },
      {
        id: 'm3',
        senderName: '박소연',
        content: '같이 산책하던 기억이 아직도 생생해. 많이 그리울거야.',
        sentAt: '2025-01-15T18:40:00Z',
      },
    ],
  },
  {
    id: '2',
    petName: '몽이',
    birthDate: '2015-09-01',
    deathDate: '2023-06-20',
    userImageUrl:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
    aiImageUrl:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
    isPublic: false,
    messages: [],
  },
];

const memorials = MOCK_DATA.map(({ messages: _, ...profile }) => profile);
const messages = Object.fromEntries(MOCK_DATA.map((d) => [d.id, d.messages]));

export default function MemorialPage() {
  return <MemorialView memorials={memorials} messages={messages} />;
}
