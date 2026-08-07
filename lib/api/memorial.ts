import type { ApiResponse } from '@/types/api';
import type { PetMemorialSummary } from '@/types/memorial';

import { apiClient } from '@/lib/api/client';

interface PetPrivateMemorialListResponse {
  memorials: PetMemorialSummary[];
}

/** 내 추모 공간 목록. 아직 만든 공간이 없으면 빈 배열이다. */
export async function getMyMemorials(): Promise<PetMemorialSummary[]> {
  const response =
    await apiClient.get<ApiResponse<PetPrivateMemorialListResponse>>(
      '/memorials/me',
    );

  return response.data.data?.memorials ?? [];
}
