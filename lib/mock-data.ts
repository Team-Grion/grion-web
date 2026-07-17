import type { PublicMemorial } from '@/types/memorial';

export const MOCK_PUBLIC_MEMORIALS: PublicMemorial[] = [
  {
    id: '1',
    petName: '코코',
    species: 'dog',
    birthDate: '2018-03-12',
    deathDate: '2024-11-05',
    epitaph: '언제나 꼬리 흔들며 반겨주던 아이',
    userImageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    aiImageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    isPublic: true,
    flowers: 18,
    recentFlowers: 3,
  },
  {
    id: '3',
    petName: '봄이',
    species: 'cat',
    birthDate: '2016-04-05',
    deathDate: '2025-01-18',
    epitaph: '햇살 아래 낮잠 자던 순간이 그리워요',
    userImageUrl:
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop',
    aiImageUrl:
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop',
    isPublic: true,
    flowers: 7,
    recentFlowers: 1,
  },
  {
    id: '4',
    petName: '하루',
    species: 'dog',
    birthDate: '2013-07-20',
    deathDate: '2024-07-01',
    epitaph: '함께 걸었던 산책길을 잊지 못해요',
    userImageUrl:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop',
    aiImageUrl:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop',
    isPublic: true,
    flowers: 24,
    recentFlowers: 5,
  },
  {
    id: '5',
    petName: '솜이',
    species: 'cat',
    birthDate: '2017-11-30',
    deathDate: '2024-09-14',
    epitaph: '작은 발걸음 소리가 아직도 들리는 것 같아요',
    userImageUrl:
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
    aiImageUrl:
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
    isPublic: true,
    flowers: 12,
    recentFlowers: 0,
  },
  {
    id: '6',
    petName: '콩이',
    species: 'dog',
    birthDate: '2019-02-14',
    deathDate: '2025-03-02',
    epitaph: '어디서든 씩씩하게 뛰어놀던 아이',
    userImageUrl:
      'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=400&fit=crop',
    aiImageUrl:
      'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=400&fit=crop',
    isPublic: true,
    flowers: 4,
    recentFlowers: 2,
  },
];
