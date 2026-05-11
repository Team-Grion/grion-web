import type { MemorialProfile } from "@/types/memorial"

import { MemorialGrid } from "@/components/public-memorial/memorial-grid"

const MOCK_PUBLIC_MEMORIALS: MemorialProfile[] = [
  {
    id: "1",
    petName: "코코",
    birthDate: "2018-03-12",
    deathDate: "2024-11-05",
    userImageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    aiImageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    isPublic: true,
  },
  {
    id: "3",
    petName: "봄이",
    birthDate: "2016-04-05",
    deathDate: "2025-01-18",
    userImageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    aiImageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    isPublic: true,
  },
  {
    id: "4",
    petName: "하루",
    birthDate: "2013-07-20",
    deathDate: "2024-07-01",
    userImageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop",
    aiImageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop",
    isPublic: true,
  },
  {
    id: "5",
    petName: "솜이",
    birthDate: "2017-11-30",
    deathDate: "2024-09-14",
    userImageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop",
    aiImageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop",
    isPublic: true,
  },
  {
    id: "6",
    petName: "콩이",
    birthDate: "2019-02-14",
    deathDate: "2025-03-02",
    userImageUrl: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=400&fit=crop",
    aiImageUrl: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=400&fit=crop",
    isPublic: true,
  },
]

export default function PublicMemorialPage() {
  return (
    <div>
      <div className="border-b px-4 py-4">
        <h1 className="font-semibold">공개 추모 공간</h1>
      </div>
      <MemorialGrid memorials={MOCK_PUBLIC_MEMORIALS} />
    </div>
  )
}
