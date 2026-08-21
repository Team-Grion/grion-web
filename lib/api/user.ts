import type { ApiResponse } from '@/types/api';
import type { UserPage } from '@/types/memorial';

import { apiClient } from '@/lib/api/client';

/** 마이페이지. 프로필과 내가 보낸 쪽지를 한 번에 내려준다. */
export async function getMyPage(): Promise<UserPage> {
  const response = await apiClient.get<ApiResponse<UserPage>>('/users/me');

  const { data, message } = response.data;
  if (!data) {
    throw new Error(message ?? '내 정보를 불러오지 못했어요');
  }
  // letters는 비어 있을 수 있고, 아예 오지 않을 수도 있다
  return { ...data, letters: data.letters ?? [] };
}

/** 내가 쓴 쪽지를 삭제한다. */
export async function deleteSentLetter(letterId: number): Promise<void> {
  await apiClient.delete<ApiResponse<unknown>>(
    `/users/me/letters/${letterId}/delete`,
  );
}
