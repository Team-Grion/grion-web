import type { ApiResponse } from '@/types/api';
import type { PetMemorialDetail, PetMemorialSummary } from '@/types/memorial';

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

/** 추모 공간 상세. 목록에 없는 날짜/소개/공개 여부가 여기에만 있다. */
export async function getMemorialDetail(
  petId: number,
): Promise<PetMemorialDetail> {
  const response = await apiClient.get<ApiResponse<PetMemorialDetail>>(
    `/memorials/me/${petId}`,
  );

  const { data, message } = response.data;
  if (!data) {
    throw new Error(message ?? '추모 공간을 찾을 수 없어요');
  }
  return data;
}

export interface UpdateMemorialPayload {
  content: string;
  isPublic: boolean;
}

/** 한 줄 소개와 공개 여부를 함께 수정한다. 둘 중 하나만 바꿔도 전체를 보낸다. */
export async function updateMemorial(
  petId: number,
  payload: UpdateMemorialPayload,
): Promise<void> {
  await apiClient.patch<ApiResponse<unknown>>(
    `/memorials/me/${petId}`,
    payload,
  );
}
